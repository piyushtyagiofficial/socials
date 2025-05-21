import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { likePost, commentOnPost } from '../slices/postSlice';

const Post = ({ post, isDetailView = false }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(isDetailView);
  
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const isLiked = post.likes.includes(userInfo?._id);
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  const handleLike = () => {
    dispatch(likePost(post._id));
  };
  
  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    dispatch(commentOnPost({ postId: post._id, text: comment }));
    setComment('');
  };
  
  return (
    <div className="card mb-6 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <Link to={`/profile/${post.user._id}`}>
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {post.user.profilePicture ? (
                <img
                  src={post.user.profilePicture}
                  alt="Profile"
                  className="h-10 w-10 object-cover"
                />
              ) : (
                <span className="text-gray-600 font-medium">
                  {post.user.name.charAt(0)}
                </span>
              )}
            </div>
          </Link>
          <div className="ml-3">
            <Link to={`/profile/${post.user._id}`}>
              <p className="font-medium text-gray-900 hover:underline">{post.user.name}</p>
            </Link>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        
        {post.text && (
          <p className="mt-3 text-gray-800">{post.text}</p>
        )}
        
        {post.image && (
          <div className="mt-3">
            <img 
              src={post.image} 
              alt="Post" 
              className="w-full h-auto rounded-lg object-cover max-h-96"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex space-x-6">
            <button 
              className={`flex items-center ${isLiked ? 'text-accent-500' : 'text-gray-500'} hover:text-accent-500 transition-colors`}
              onClick={handleLike}
            >
              <Heart size={20} className={isLiked ? 'fill-current' : ''} />
              <span className="ml-2 text-sm">{post.likes.length}</span>
            </button>
            
            <button 
              className="flex items-center text-gray-500 hover:text-primary-500 transition-colors"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle size={20} />
              <span className="ml-2 text-sm">{post.comments.length}</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-primary-500 transition-colors">
              <Share size={20} />
            </button>
          </div>
          
          {!isDetailView && (
            <Link 
              to={`/post/${post._id}`}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
      
      {showComments && (
        <div className="bg-gray-50 p-4">
          <form onSubmit={handleComment} className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
              {userInfo?.profilePicture ? (
                <img
                  src={userInfo.profilePicture}
                  alt="Profile"
                  className="h-8 w-8 object-cover"
                />
              ) : (
                <span className="text-gray-600 font-medium text-xs">
                  {userInfo?.name?.charAt(0)}
                </span>
              )}
            </div>
            <input
              type="text"
              className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="ml-2 text-sm text-primary-600 font-medium disabled:opacity-50"
            >
              Post
            </button>
          </form>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="flex">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {comment.user.profilePicture ? (
                      <img
                        src={comment.user.profilePicture}
                        alt="Profile"
                        className="h-8 w-8 object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium text-xs">
                        {comment.user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="ml-2 bg-white p-3 rounded-lg flex-1">
                    <Link to={`/profile/${comment.user._id}`}>
                      <p className="font-medium text-gray-900 text-sm">{comment.user.name}</p>
                    </Link>
                    <p className="text-gray-800 text-sm">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;