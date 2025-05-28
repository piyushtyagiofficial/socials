import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { usersAPI } from "../services/api"
import { Camera, Edit, Settings, User } from "lucide-react"
import PostCard from "../components/Posts/PostCard"
import EditProfileModal from "../components/Profile/EditProfileModal"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import toast from "react-hot-toast"

const Profile = () => {
  const { username } = useParams()
  const { user: currentUser, updateUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getProfile(username)
      setProfileData(response.data.user)
      setPosts(response.data.posts)
      setIsFollowing(response.data.user.isFollowing)
    } catch (error) {
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (followLoading) return

    setFollowLoading(true)
    try {
      const response = await usersAPI.followUser(profileData.id)
      setIsFollowing(response.data.isFollowing)

      // Update follower count
      setProfileData((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          followersCount: response.data.isFollowing ? prev.stats.followersCount + 1 : prev.stats.followersCount - 1,
        },
      }))

      toast.success(response.data.message)
    } catch (error) {
      toast.error("Failed to update follow status")
    } finally {
      setFollowLoading(false)
    }
  }

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((post) => (post._id === updatedPost._id ? updatedPost : post)))
  }

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId))
  }

  const handleProfileUpdate = (updatedData) => {
    setProfileData((prev) => ({ ...prev, ...updatedData }))
    if (isOwnProfile) {
      updateUser(updatedData)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
        <p className="text-gray-500">The user you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
          {isOwnProfile && (
            <button className="absolute top-4 right-4 bg-black/20 text-white rounded-full p-2 hover:bg-black/30 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Main Profile Layout - Responsive flex */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Profile Picture - Overlapping design */}
            <div className="relative -mt-16 mb-4 sm:mb-0 flex-shrink-0">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture ? `${import.meta.env.VITE_API_BASE_URL}${profileData.profilePicture}` : "/placeholder.svg"}
                  alt={profileData.username}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-primary-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* User Info and Actions Container */}
            <div className="flex-1">
              {/* User Info and Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                {/* User Info */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h1>
                  <p className="text-gray-600">@{profileData.username}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isOwnProfile ? (
                    <>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                      <button className="btn-ghost p-2">
                        <Settings className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        isFollowing ? "btn-secondary" : "btn-primary"
                      }`}
                    >
                      {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio - Fixed height container to prevent layout shift */}
              <div className="mb-2 mt-2">
                {profileData.bio && <p className="text-gray-700 text-balance leading-relaxed">{profileData.bio}</p>}
              </div>

              {/* Stats */}
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{profileData.stats.postsCount}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{profileData.stats.followersCount}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{profileData.stats.followingCount}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
          <div className="text-sm text-gray-500">{posts.length} posts</div>
        </div>

        {posts.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 text-balance">
              {isOwnProfile ? "Share your first post!" : `${profileData.fullName} hasn't posted anything yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} onDelete={handlePostDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal user={profileData} onClose={() => setShowEditModal(false)} onUpdate={handleProfileUpdate} />
      )}
    </div>
  )
}

export default Profile
