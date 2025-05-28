import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { postsAPI } from "../services/api"
import PostCard from "../components/Posts/PostCard"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

const PostDetail = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await postsAPI.getPost(postId)
      setPost(response.data.post)
    } catch (error) {
      toast.error("Failed to load post")
      navigate("/home")
    } finally {
      setLoading(false)
    }
  }

  const handlePostUpdate = (updatedPost) => {
    setPost(updatedPost)
  }

  const handlePostDelete = () => {
    navigate("/home")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Post not found</h3>
        <p className="text-gray-500">The post you're looking for doesn't exist or has been deleted.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Post */}
      <PostCard post={post} onUpdate={handlePostUpdate} onDelete={handlePostDelete} />
    </div>
  )
}

export default PostDetail
