"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Home, Search, Compass, MessageCircle, User } from "lucide-react"

const BottomBar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Messages", href: "/chat", icon: MessageCircle },
    { name: "Profile", href: `/profile/${user?.username}`, icon: User },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50 safe-bottom">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive ? "text-primary-600 bg-primary-50" : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              {item.name === "Profile" && user?.profilePicture ? (
                <img
                  src={user.profilePicture ? `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}` : "/placeholder.svg"}
                  alt={user.username}
                  className={`w-6 h-6 rounded-full object-cover border-2 transition-all duration-200 ${
                    isActive ? "border-primary-600" : "border-transparent"
                  }`}
                />
              ) : (
                <item.icon
                  className={`w-6 h-6 transition-all duration-200 ${
                    isActive ? "text-primary-600 scale-110" : "text-gray-600"
                  }`}
                />
              )}
              <span
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive ? "text-primary-600" : "text-gray-600"
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomBar
