"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useSocket } from "../../contexts/SocketContext"
import { chatAPI, usersAPI } from "../../services/api"
import { Search, Plus, User } from "lucide-react"
import toast from "react-hot-toast"

const ChatList = ({ chats, selectedChat, onChatSelect, onNewChat }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const { user } = useAuth()
  const { isUserOnline } = useSocket()

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await usersAPI.searchUsers(query)
      setSearchResults(response.data.users)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleStartChat = async (userId) => {
    try {
      const response = await chatAPI.createChat(userId)
      onNewChat(response.data.chat)
      setShowSearch(false)
      setSearchQuery("")
      setSearchResults([])
      toast.success("Chat created!")
    } catch (error) {
      toast.error("Failed to create chat")
    }
  }

  const formatLastMessage = (message) => {
    if (!message) return "No messages yet"
    return message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content
  }

  const formatTime = (date) => {
    if (!date) return ""
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
    return messageDate.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users to chat with..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                {searchLoading ? (
                  <div className="p-3 text-center text-gray-500">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">No users found</div>
                ) : (
                  searchResults.map((searchUser) => (
                    <button
                      key={searchUser._id}
                      onClick={() => handleStartChat(searchUser._id)}
                      className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors"
                    >
                      {searchUser.profilePicture ? (
                        <img
                          src={searchUser.profilePicture || "/placeholder.svg"}
                          alt={searchUser.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="ml-3 text-left">
                        <p className="font-medium text-gray-900 text-sm">{searchUser.fullName}</p>
                        <p className="text-gray-500 text-xs">@{searchUser.username}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat to begin messaging</p>
          </div>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.participant
            const isSelected = selectedChat?._id === chat._id
            const isOnline = isUserOnline(otherUser._id)

            return (
              <button
                key={chat._id}
                onClick={() => onChatSelect(chat)}
                className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-purple-50 border-r-2 border-purple-600" : ""
                }`}
              >
                <div className="relative">
                  {otherUser.profilePicture ? (
                    <img
                      src={otherUser.profilePicture || "/placeholder.svg"}
                      alt={otherUser.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="ml-3 flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{otherUser.fullName}</p>
                    <span className="text-xs text-gray-500">{formatTime(chat.lastMessage?.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{formatLastMessage(chat.lastMessage)}</p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChatList
