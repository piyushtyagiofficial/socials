import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { text, image } = req.body;

  if (!text && !image) {
    res.status(400);
    throw new Error('Post must have text or image');
  }

  const post = await Post.create({
    user: req.user._id,
    text,
    image,
  });

  const populatedPost = await Post.findById(post._id).populate('user', 'name profilePicture');

  res.status(201).json(populatedPost);
});

// @desc    Get all posts from followed users
// @route   GET /api/posts/feed
// @access  Private
const getFeedPosts = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  
  if (!currentUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const { following } = currentUser;
  following.push(req.user._id); // Include own posts in feed

  const posts = await Post.find({ user: { $in: following } })
    .populate('user', 'name profilePicture')
    .populate({
      path: 'comments.user',
      select: 'name profilePicture',
    })
    .sort({ createdAt: -1 });

  res.json(posts);
});

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const userExists = await User.findById(userId);

  if (!userExists) {
    res.status(404);
    throw new Error('User not found');
  }

  const posts = await Post.find({ user: userId })
    .populate('user', 'name profilePicture')
    .populate({
      path: 'comments.user',
      select: 'name profilePicture',
    })
    .sort({ createdAt: -1 });

  res.json(posts);
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'name profilePicture')
    .populate({
      path: 'comments.user',
      select: 'name profilePicture',
    });

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is authorized to delete
  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await Post.deleteOne({ _id: post._id });
  res.json({ message: 'Post removed' });
});

// @desc    Like/unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const isLiked = post.likes.includes(req.user._id);

  if (isLiked) {
    // Unlike
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user._id },
    });
    res.status(200).json({ message: 'Post unliked' });
  } else {
    // Like
    await Post.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.user._id },
    });
    res.status(200).json({ message: 'Post liked' });
  }
});

// @desc    Comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
const commentOnPost = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = {
    user: req.user._id,
    text,
  };

  post.comments.push(comment);
  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate('user', 'name profilePicture')
    .populate({
      path: 'comments.user',
      select: 'name profilePicture',
    });

  res.status(201).json(updatedPost);
});

export {
  createPost,
  getFeedPosts,
  getUserPosts,
  getPostById,
  deletePost,
  likePost,
  commentOnPost,
};