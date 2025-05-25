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
        <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4 sm:mb-0">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture || "/placeholder.svg"}
                  alt={profileData.username}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-purple-600 rounded-full border-4 border-white flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h1>
                  <p className="text-gray-600">@{profileData.username}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        isFollowing
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profileData.bio && <p className="text-gray-700 mt-3">{profileData.bio}</p>}

              {/* Stats */}
              <div className="flex space-x-6 mt-4">
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

      {/* Posts Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">
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
