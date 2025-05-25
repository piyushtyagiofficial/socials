const express = require("express")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user's chats
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "username fullName profilePicture isOnline lastSeen")
      .sort({ lastMessage: -1 })

    // Format chats for frontend
    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find((p) => p._id.toString() !== req.user._id.toString())

      const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null

      return {
        _id: chat._id,
        participant: otherParticipant,
        lastMessage,
        unreadCount: chat.messages.filter(
          (msg) =>
            msg.sender.toString() !== req.user._id.toString() &&
            !msg.readBy.some((read) => read.user.toString() === req.user._id.toString()),
        ).length,
      }
    })

    res.json({ chats: formattedChats })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get or create chat with user
router.post("/create/:userId", auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId

    if (otherUserId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot create chat with yourself" })
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, otherUserId] },
    }).populate("participants", "username fullName profilePicture isOnline lastSeen")

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.user._id, otherUserId],
      })
      await chat.save()
      await chat.populate("participants", "username fullName profilePicture isOnline lastSeen")
    }

    res.json({ chat })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get chat messages
router.get("/:chatId/messages", auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const skip = (page - 1) * limit

    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "username fullName profilePicture")
      .populate("messages.sender", "username fullName profilePicture")

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Check if user is participant
    if (!chat.participants.some((p) => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Not authorized to view this chat" })
    }

    // Get paginated messages
    const messages = chat.messages
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + Number.parseInt(limit))
      .reverse()

    // Mark messages as read
    const unreadMessages = chat.messages.filter(
      (msg) =>
        msg.sender.toString() !== req.user._id.toString() &&
        !msg.readBy.some((read) => read.user.toString() === req.user._id.toString()),
    )

    if (unreadMessages.length > 0) {
      unreadMessages.forEach((msg) => {
        msg.readBy.push({ user: req.user._id })
      })
      await chat.save()
    }

    res.json({
      messages,
      hasMore: skip + Number.parseInt(limit) < chat.messages.length,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Send message
router.post("/:chatId/messages", auth, async (req, res) => {
  try {
    const { content, messageType = "text" } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" })
    }

    const chat = await Chat.findById(req.params.chatId)

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to send messages in this chat" })
    }

    const message = {
      sender: req.user._id,
      content: content.trim(),
      messageType,
      readBy: [{ user: req.user._id }],
    }

    chat.messages.push(message)
    chat.lastMessage = new Date()
    await chat.save()

    // Populate sender info for the new message
    await chat.populate("messages.sender", "username fullName profilePicture")

    const newMessage = chat.messages[chat.messages.length - 1]

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
