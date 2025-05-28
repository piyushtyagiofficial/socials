import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Search, Plus, Heart, MessageCircle, User, LogOut, Settings } from "lucide-react"

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 fixed top-0 left-0 right-0 z-50 safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/home"
            className="text-2xl font-bold gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            Socials
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="input-primary pl-10"
                onClick={() => navigate("/search")}
                readOnly
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Link
              to="/search"
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200"
            >
              <Search className="w-6 h-6" />
            </Link>

            {/* Create Post */}
            <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200">
              <Plus className="w-6 h-6" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200 relative">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            {/* Messages */}
            <Link
              to="/chat"
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200 relative"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                2
              </span>
            </Link>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 ring-2 ring-transparent hover:ring-primary-200"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture ? `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}` : "/placeholder.svg"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft-lg border border-gray-200 py-2 z-50 animate-scale-in">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
