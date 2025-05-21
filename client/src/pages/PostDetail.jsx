import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPostById, deletePost } from '../slices/postSlice';
import Post from '../components/Post';
import { ArrowLeft, Trash2 } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { post, loading, error } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);
  
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id)).then(() => {
        navigate('/feed');
      });
    }
  };
  
  if (loading && !post) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card p-6 text-error-500">
        <p>{error}</p>
        <Link to="/feed" className="text-primary-600 mt-4 inline-block">
          Back to feed
        </Link>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-800">Post not found</h2>
        <Link to="/feed" className="text-primary-600 mt-2 inline-block">
          Back to feed
        </Link>
      </div>
    );
  }
  
  const isOwnPost = userInfo._id === post.user._id;
  
  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>
        
        {isOwnPost && (
          <button
            onClick={handleDeletePost}
            className="flex items-center text-error-500 hover:text-error-700"
          >
            <Trash2 size={18} className="mr-2" />
            <span>Delete</span>
          </button>
        )}
      </div>
      
      {post && <Post post={post} isDetailView={true} />}
    </div>
  );
};

export default PostDetail;