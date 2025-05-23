import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedPosts } from '../slices/postSlice';
import PostForm from '../components/PostForm';
import Post from '../components/Post';
import { Bookmark, TrendingUp } from 'lucide-react';

const Feed = () => {
  const { posts, profileLoading, error } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      dispatch(getFeedPosts());
    }
  }, [dispatch, userInfo]);

  if (!userInfo) {
    return null;
  }


  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Home Feed</h1>
      
      <PostForm />
      
      {profileLoading && posts.length === 0 ? (
        <div className="card p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="card p-6 text-error-500">
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark size={28} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">
            Follow more users to see their posts in your feed or create your first post!
          </p>
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="btn-primary"
          >
            Create a Post
          </button>
        </div>
      ) : (
        <div>
          {posts.map(post => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
      
      <div className="hidden lg:block fixed right-6 top-24 w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-900 flex items-center mb-4">
          <TrendingUp size={18} className="mr-2 text-primary-600" />
          Trending Topics
        </h3>
        <div className="space-y-3">
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <p className="text-sm font-medium text-gray-900">#photography</p>
            <p className="text-xs text-gray-500">1.2K posts</p>
          </div>
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <p className="text-sm font-medium text-gray-900">#technology</p>
            <p className="text-xs text-gray-500">943 posts</p>
          </div>
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <p className="text-sm font-medium text-gray-900">#travel</p>
            <p className="text-xs text-gray-500">827 posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;