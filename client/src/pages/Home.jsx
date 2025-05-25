import { useState, useEffect } from "react"
import { postsAPI } from "../services/api"
import PostCard from "../components/Posts/PostCard"
import CreatePost from "../components/Posts/CreatePost"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import toast from "react-hot-toast"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const response = await postsAPI.getFeed(pageNum, 10)
      const newPosts = response.data.posts

      if (reset || pageNum === 1) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }

      setHasMore(response.data.hasMore)
      setPage(pageNum)
    } catch (error) {
      toast.error("Failed to load posts")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1)
    }
  }

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((post) => (post._id === updatedPost._id ? updatedPost : post)))
  }

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">Follow some users to see their posts in your feed!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} onDelete={handlePostDelete} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && posts.length > 0 && (
        <div className="flex justify-center py-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <LoadingSpinner size="sm" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
