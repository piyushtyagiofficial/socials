const express = require("express")
const Post = require("../models/Post")
const User = require("../models/User")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")

const router = express.Router()

// Configure multer for post images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith("video/")

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image and video files are allowed"))
    }
  },
})

// Create post
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { content, location } = req.body

    if (!content && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: "Post must have content or images" })
    }

    const images = req.files ? req.files.map((file) => `/uploads/posts/${file.filename}`) : []

    const post = new Post({
      author: req.user._id,
      content,
      images,
      location,
    })

    await post.save()

    // Add post to user's posts array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id },
    })

    // Populate author info
    await post.populate("author", "username fullName profilePicture")

    res.status(201).json({
      message: "Post created successfully",
      post,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get feed posts
router.get("/feed", auth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const user = await User.findById(req.user._id)
    const followingIds = [...user.following, user._id] // Include own posts

    const posts = await Post.find({ author: { $in: followingIds } })
      .populate("author", "username fullName profilePicture")
      .populate("comments.user", "username fullName profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Add isLiked field for each post
    const postsWithLikeStatus = posts.map((post) => ({
      ...post.toObject(),
      isLiked: post.likes.some((like) => like.user.toString() === req.user._id.toString()),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }))

    res.json({
      posts: postsWithLikeStatus,
      hasMore: posts.length === limit,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get single post
router.get("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "username fullName profilePicture")
      .populate("comments.user", "username fullName profilePicture")
      .populate("likes.user", "username fullName profilePicture")

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const postWithLikeStatus = {
      ...post.toObject(),
      isLiked: post.likes.some((like) => like.user._id.toString() === req.user._id.toString()),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }

    res.json({ post: postWithLikeStatus })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Like/Unlike post
router.post("/:postId/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const likeIndex = post.likes.findIndex((like) => like.user.toString() === req.user._id.toString())

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1)
    } else {
      // Like
      post.likes.push({ user: req.user._id })
    }

    await post.save()

    res.json({
      message: likeIndex > -1 ? "Post unliked" : "Post liked",
      isLiked: likeIndex === -1,
      likesCount: post.likes.length,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add comment
router.post("/:postId/comment", auth, async (req, res) => {
  try {
    const { text } = req.body

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required" })
    }

    const post = await Post.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
    }

    post.comments.push(comment)
    await post.save()

    // Populate the new comment
    await post.populate("comments.user", "username fullName profilePicture")

    const newComment = post.comments[post.comments.length - 1]

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
      commentsCount: post.comments.length,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete post
router.delete("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" })
    }

    await Post.findByIdAndDelete(req.params.postId)

    // Remove post from user's posts array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: req.params.postId },
    })

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
