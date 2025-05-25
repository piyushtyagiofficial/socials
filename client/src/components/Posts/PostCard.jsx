"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { postsAPI } from "../../services/api"
import { Heart, MessageCircle, Share, MoreHorizontal, User, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { user } = useAuth()

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      const response = await postsAPI.likePost(post._id)
      onUpdate({
        ...post,
        isLiked: response.data.isLiked,
        likesCount: response.data.likesCount,
      })
    } catch (error) {
      toast.error("Failed to like post")
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isCommenting) return

    setIsCommenting(true)
    try {
      const response = await postsAPI.addComment(post._id, newComment.trim())
      onUpdate({
        ...post,
        comments: [...post.comments, response.data.comment],
        commentsCount: response.data.commentsCount,
      })
      setNewComment("")
      toast.success("Comment added!")
    } catch (error) {
      toast.error("Failed to add comment")
    } finally {
      setIsCommenting(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return

    if (!window.confirm("Are you sure you want to delete this post?")) return

    setIsDeleting(true)
    try {
      await postsAPI.deletePost(post._id)
      onDelete(post._id)
      toast.success("Post deleted successfully")
    } catch (error) {
      toast.error("Failed to delete post")
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  const formatDate = (date) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return postDate.toLocaleDateString()
  }

  return (
    <div className="card animate-fade-in">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author.username}`} className="group">
            {post.author.profilePicture ? (
              <img
                src={post.author.profilePicture || "/placeholder.svg"}
                alt={post.author.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary-200 transition-all duration-200"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary-200 transition-all duration-200">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.username}`}
              className="font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200"
            >
              {post.author.fullName}
            </Link>
            <p className="text-sm text-gray-500">@{post.author.username}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
          {post.author._id === user?.id && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-soft-lg border border-gray-200 py-2 z-10 animate-scale-in">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {post.content && <div className="px-4 pb-3 text-gray-900 text-balance">{post.content}</div>}

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-1 gap-1">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Post image ${index + 1}`}
              className="w-full h-auto object-cover max-h-96 hover:scale-[1.02] transition-transform duration-300"
            />
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 transition-all duration-200 hover:scale-110 ${
                post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart className={`w-6 h-6 ${post.isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-all duration-200 hover:scale-110"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </button>

            <button className="text-gray-500 hover:text-primary-600 transition-all duration-200 hover:scale-110">
              <Share className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3 animate-slide-down">
            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3 animate-fade-in">
                    <Link to={`/profile/${comment.user.username}`} className="group">
                      {comment.user.profilePicture ? (
                        <img
                          src={comment.user.profilePicture || "/placeholder.svg"}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary-200 transition-all duration-200"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary-200 transition-all duration-200">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </Link>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200 transition-colors duration-200">
                        <Link
                          to={`/profile/${comment.user.username}`}
                          className="font-semibold text-sm text-gray-900 hover:text-primary-600 transition-colors duration-200"
                        >
                          {comment.user.fullName}
                        </Link>
                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <form onSubmit={handleComment} className="flex space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input-primary"
                />
                <button type="submit" disabled={!newComment.trim() || isCommenting} className="btn-primary">
                  {isCommenting ? "..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard
