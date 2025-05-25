const express = require("express")
const User = require("../models/userModel")
const Post = require("../models/postModel")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Get user profile
router.get("/profile/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("followers", "username fullName profilePicture")
      .populate("following", "username fullName profilePicture")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get user's posts
    const posts = await Post.find({ author: user._id })
      .populate("author", "username fullName profilePicture")
      .sort({ createdAt: -1 })

    // Check if current user follows this user
    const isFollowing = user.followers.some((follower) => follower._id.toString() === req.user._id.toString())

    res.json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        stats: user.stats,
        isFollowing,
        isOwnProfile: user._id.toString() === req.user._id.toString(),
      },
      posts,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update profile
router.put("/profile", auth, upload.single("profilePicture"), async (req, res) => {
  try {
    const { fullName, bio, username } = req.body
    const updateData = {}

    if (fullName) updateData.fullName = fullName
    if (bio !== undefined) updateData.bio = bio
    if (username) {
      // Check if username is already taken
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      })
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" })
      }
      updateData.username = username
    }

    if (req.file) {
      updateData.profilePicture = `/uploads/profiles/${req.file.filename}`
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password")

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Follow/Unfollow user
router.post("/follow/:userId", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId)
    const currentUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" })
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const isFollowing = currentUser.following.includes(userToFollow._id)

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(userToFollow._id)
      userToFollow.followers.pull(currentUser._id)
    } else {
      // Follow
      currentUser.following.push(userToFollow._id)
      userToFollow.followers.push(currentUser._id)
    }

    await currentUser.save()
    await userToFollow.save()

    res.json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      isFollowing: !isFollowing,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Search users
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length === 0) {
      return res.json({ users: [] })
    }

    const users = await User.find({
      $or: [{ username: { $regex: q, $options: "i" } }, { fullName: { $regex: q, $options: "i" } }],
      _id: { $ne: req.user._id },
    })
      .select("username fullName profilePicture")
      .limit(20)

    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
