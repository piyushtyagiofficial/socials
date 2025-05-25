const Chat = require("../models/Chat")
const User = require("../models/User")
const jwt = require("jsonwebtoken")

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      const user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        return next(new Error("Authentication error"))
      }

      socket.userId = user._id.toString()
      socket.user = user
      next()
    } catch (error) {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", async (socket) => {
    console.log(`User ${socket.user.username} connected`)

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, { isOnline: true })

    // Join user to their personal room
    socket.join(socket.userId)

    // Join user to their chat rooms
    const userChats = await Chat.find({ participants: socket.userId })
    userChats.forEach((chat) => {
      socket.join(chat._id.toString())
    })

    // Handle joining a chat room
    socket.on("join-chat", (chatId) => {
      socket.join(chatId)
      console.log(`User ${socket.user.username} joined chat ${chatId}`)
    })

    // Handle leaving a chat room
    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId)
      console.log(`User ${socket.user.username} left chat ${chatId}`)
    })

    // Handle sending messages
    socket.on("send-message", async (data) => {
      try {
        const { chatId, content, messageType = "text" } = data

        const chat = await Chat.findById(chatId)
        if (!chat || !chat.participants.includes(socket.userId)) {
          return socket.emit("error", { message: "Chat not found or unauthorized" })
        }

        const message = {
          sender: socket.userId,
          content,
          messageType,
          readBy: [{ user: socket.userId }],
        }

        chat.messages.push(message)
        chat.lastMessage = new Date()
        await chat.save()

        // Populate sender info
        await chat.populate("messages.sender", "username fullName profilePicture")
        const newMessage = chat.messages[chat.messages.length - 1]

        // Emit to all participants in the chat
        io.to(chatId).emit("new-message", {
          chatId,
          message: newMessage,
        })

        // Emit chat update to participants
        const otherParticipants = chat.participants.filter((p) => p.toString() !== socket.userId)
        otherParticipants.forEach((participantId) => {
          io.to(participantId.toString()).emit("chat-updated", {
            chatId,
            lastMessage: newMessage,
          })
        })
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" })
      }
    })

    // Handle typing indicators
    socket.on("typing-start", (data) => {
      socket.to(data.chatId).emit("user-typing", {
        userId: socket.userId,
        username: socket.user.username,
      })
    })

    socket.on("typing-stop", (data) => {
      socket.to(data.chatId).emit("user-stopped-typing", {
        userId: socket.userId,
      })
    })

    // Handle message read status
    socket.on("mark-messages-read", async (data) => {
      try {
        const { chatId } = data

        const chat = await Chat.findById(chatId)
        if (!chat || !chat.participants.includes(socket.userId)) {
          return
        }

        // Mark unread messages as read
        let hasUpdates = false
        chat.messages.forEach((message) => {
          if (
            message.sender.toString() !== socket.userId &&
            !message.readBy.some((read) => read.user.toString() === socket.userId)
          ) {
            message.readBy.push({ user: socket.userId })
            hasUpdates = true
          }
        })

        if (hasUpdates) {
          await chat.save()

          // Notify other participants about read status
          socket.to(chatId).emit("messages-read", {
            chatId,
            readBy: socket.userId,
          })
        }
      } catch (error) {
        console.error("Error marking messages as read:", error)
      }
    })

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`User ${socket.user.username} disconnected`)

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
      })

      // Notify other users about offline status
      socket.broadcast.emit("user-offline", {
        userId: socket.userId,
      })
    })
  })
}

module.exports = socketHandler
