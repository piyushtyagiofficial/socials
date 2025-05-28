import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Home, Search, MessageCircle, Heart, User, Compass, Bookmark } from "lucide-react"

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Messages", href: "/chat", icon: MessageCircle },
    { name: "Notifications", href: "/notifications", icon: Heart },
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Profile", href: `/profile/${user?.username}`, icon: User },
  ]

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex-1 flex flex-col min-h-0 pt-6">
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-600 border-r-2 border-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 ${isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"}`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture || "/placeholder.svg"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
