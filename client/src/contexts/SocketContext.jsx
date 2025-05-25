"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuth } from "./AuthContext"

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const { user, token } = useAuth()

  useEffect(() => {
    if (user && token) {
      const newSocket = io(import.meta.env.REACT_APP_SERVER_URL || "http://localhost:5000", {
        auth: {
          token,
        },
      })

      newSocket.on("connect", () => {
        console.log("Connected to server")
        setSocket(newSocket)
      })

      newSocket.on("user-online", (data) => {
        setOnlineUsers((prev) => new Set([...prev, data.userId]))
      })

      newSocket.on("user-offline", (data) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      })

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error)
      })

      return () => {
        newSocket.close()
        setSocket(null)
      }
    }
  }, [user, token])

  const value = {
    socket,
    onlineUsers,
    isUserOnline: (userId) => onlineUsers.has(userId),
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
