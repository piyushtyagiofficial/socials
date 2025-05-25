import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { chatAPI } from "../services/api"
import { useSocket } from "../contexts/SocketContext"
import ChatList from "../components/Chat/ChatList"
import ChatWindow from "../components/Chat/ChatWindow"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import { MessageCircle } from "lucide-react"

const ChatPage = () => {
  const { chatId } = useParams()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const { socket } = useSocket()

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find((c) => c._id === chatId)
      if (chat) {
        setSelectedChat(chat)
      }
    }
  }, [chatId, chats])

  useEffect(() => {
    if (socket) {
      socket.on("new-message", handleNewMessage)
      socket.on("chat-updated", handleChatUpdate)

      return () => {
        socket.off("new-message")
        socket.off("chat-updated")
      }
    }
  }, [socket])

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChats()
      setChats(response.data.chats)
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewMessage = (data) => {
    const { chatId: messageChatId, message } = data

    // Update chat list
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === messageChatId
          ? {
              ...chat,
              lastMessage: message,
              unreadCount: selectedChat?._id === messageChatId ? 0 : chat.unreadCount + 1,
            }
          : chat,
      ),
    )
  }

  const handleChatUpdate = (data) => {
    const { chatId: updatedChatId, lastMessage } = data

    setChats((prev) =>
      prev.map((chat) =>
        chat._id === updatedChatId
          ? {
              ...chat,
              lastMessage,
              unreadCount: selectedChat?._id === updatedChatId ? 0 : chat.unreadCount + 1,
            }
          : chat,
      ),
    )
  }

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    // Mark messages as read
    if (socket && chat.unreadCount > 0) {
      socket.emit("mark-messages-read", { chatId: chat._id })
      setChats((prev) => prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c)))
    }
  }

  const handleNewChat = (newChat) => {
    setChats((prev) => [newChat, ...prev])
    setSelectedChat(newChat)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 ${selectedChat ? "hidden md:block" : ""}`}>
        <ChatList chats={chats} selectedChat={selectedChat} onChatSelect={handleChatSelect} onNewChat={handleNewChat} />
      </div>

      {/* Chat Window */}
      <div className={`flex-1 ${!selectedChat ? "hidden md:flex" : "flex"}`}>
        {selectedChat ? (
          <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
