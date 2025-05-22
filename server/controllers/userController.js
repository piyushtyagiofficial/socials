import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers.length,
      following: user.following.length,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.bio = req.body.bio || user.bio;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      followers: updatedUser.followers.length,
      following: updatedUser.following.length,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers.length,
      following: user.following.length,
      isFollowing: user.followers.includes(req.user._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Follow a user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot follow yourself');
  }

  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!userToFollow || !currentUser) {
    res.status(404);
    throw new Error('User not found');
  }

  if (currentUser.following.includes(req.params.id)) {
    res.status(400);
    throw new Error('You are already following this user');
  }

  await User.findByIdAndUpdate(req.params.id, {
    $push: { followers: req.user._id },
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { following: req.params.id },
  });

  res.status(200).json({ message: 'User followed successfully' });
});

// @desc    Unfollow a user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot unfollow yourself');
  }

  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!userToUnfollow || !currentUser) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!currentUser.following.includes(req.params.id)) {
    res.status(400);
    throw new Error('You are not following this user');
  }

  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.user._id },
  });

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: req.params.id },
  });

  res.status(200).json({ message: 'User unfollowed successfully' });
});

// @desc    Search for users
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(400);
    throw new Error('Please provide a search query');
  }

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  }).select('_id name email profilePicture');

  res.json(users);
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  followUser,
  unfollowUser,
  searchUsers,
};