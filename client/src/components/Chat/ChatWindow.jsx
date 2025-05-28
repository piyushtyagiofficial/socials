import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useSocket } from "../../contexts/SocketContext"
import { chatAPI } from "../../services/api"
import { ArrowLeft, Send, User } from "lucide-react"
import LoadingSpinner from "../UI/LoadingSpinner"
import toast from "react-hot-toast"

const ChatWindow = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())

  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const { user } = useAuth()
  const { socket, isUserOnline } = useSocket()

  const otherUser = chat.participant

  useEffect(() => {
    if (chat) {
      fetchMessages()
      if (socket) {
        socket.emit("join-chat", chat._id)
      }
    }

    return () => {
      if (socket && chat) {
        socket.emit("leave-chat", chat._id)
      }
    }
  }, [chat, socket])

  useEffect(() => {
    if (socket) {
      socket.on("new-message", handleNewMessage)
      socket.on("user-typing", handleUserTyping)
      socket.on("user-stopped-typing", handleUserStoppedTyping)

      return () => {
        socket.off("new-message")
        socket.off("user-typing")
        socket.off("user-stopped-typing")
      }
    }
  }, [socket, chat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await chatAPI.getChatMessages(chat._id)
      setMessages(response.data.messages)
    } catch (error) {
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleNewMessage = (data) => {
    if (data.chatId === chat._id) {
      setMessages((prev) => [...prev, data.message])
    }
  }

  const handleUserTyping = (data) => {
    if (data.userId !== user.id) {
      setTypingUsers((prev) => new Set([...prev, data.userId]))
    }
  }

  const handleUserStoppedTyping = (data) => {
    setTypingUsers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(data.userId)
      return newSet
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const messageContent = newMessage.trim()
    setNewMessage("")
    setSending(true)

    try {
      if (socket) {
        socket.emit("send-message", {
          chatId: chat._id,
          content: messageContent,
        })
      } else {
        // Fallback to API if socket is not available
        await chatAPI.sendMessage(chat._id, messageContent)
      }
    } catch (error) {
      toast.error("Failed to send message")
      setNewMessage(messageContent) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)

    if (socket && !typing) {
      setTyping(true)
      socket.emit("typing-start", { chatId: chat._id })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && typing) {
        setTyping(false)
        socket.emit("typing-stop", { chatId: chat._id })
      }
    }, 1000)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date) => {
    const messageDate = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return messageDate.toLocaleDateString()
    }
  }

  const groupMessagesByDate = (messages) => {
    const groups = []
    let currentDate = null
    let currentGroup = []

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString()
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup })
    }

    return groups
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={onBack} className="md:hidden mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative">
          {otherUser.profilePicture ? (
            <img
              src={otherUser.profilePicture || "/placeholder.svg"}
              alt={otherUser.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          {isUserOnline(otherUser._id) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">{otherUser.fullName}</h3>
          <p className="text-sm text-gray-500">
            {isUserOnline(otherUser._id) ? "Online" : `Last seen ${formatTime(otherUser.lastSeen)}`}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">{formatDate(group.date)}</div>
            </div>

            {/* Messages for this date */}
            {group.messages.map((message) => {
              const isOwn = message.sender._id === user.id
              return (
                <div key={message._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwn ? "bg-purple-600 text-white rounded-br-sm" : "bg-gray-200 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <LoadingSpinner size="sm" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
