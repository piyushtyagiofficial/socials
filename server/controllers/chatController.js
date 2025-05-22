import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const getUserChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    participants: { $in: [req.user._id] },
  })
    .populate('participants', 'name profilePicture')
    .sort({ lastMessage: -1 });

  res.json(chats);
});

// @desc    Get or create a chat with a user
// @route   POST /api/chats
// @access  Private
const createOrGetChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  if (userId === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot create chat with yourself');
  }

  const userExists = await User.findById(userId);

  if (!userExists) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if chat already exists
  let chat = await Chat.findOne({
    participants: { $all: [req.user._id, userId] },
  }).populate('participants', 'name profilePicture');

  if (chat) {
    return res.json(chat);
  }

  // Create new chat
  chat = await Chat.create({
    participants: [req.user._id, userId],
    messages: [],
  });

  chat = await Chat.findById(chat._id).populate(
    'participants',
    'name profilePicture'
  );

  res.status(201).json(chat);
});

// @desc    Get chat by ID
// @route   GET /api/chats/:id
// @access  Private
const getChatById = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id)
    .populate('participants', 'name profilePicture')
    .populate('messages.sender', 'name profilePicture');

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Make sure user is a participant
  if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to access this chat');
  }

  res.json(chat);
});

// @desc    Send a message
// @route   POST /api/chats/:id/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Message content is required');
  }

  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Make sure user is a participant
  if (!chat.participants.includes(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to send message to this chat');
  }

  const message = {
    sender: req.user._id,
    content,
    read: false,
  };

  chat.messages.push(message);
  chat.lastMessage = Date.now();
  await chat.save();

  const updatedChat = await Chat.findById(chat._id)
    .populate('participants', 'name profilePicture')
    .populate('messages.sender', 'name profilePicture');

  res.status(201).json(updatedChat);
});

export {
  getUserChats,
  createOrGetChat,
  getChatById,
  sendMessage,
};