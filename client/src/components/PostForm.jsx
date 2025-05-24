import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, X } from 'lucide-react';
import { createPost } from '../slices/postSlice';

const PostForm = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text && !image) return;
    
    dispatch(createPost({ text, image }));
    setText('');
    setImage('');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className="card mb-6 p-4">
        <div 
          className="flex items-center p-2 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowForm(true)}
        >
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {userInfo?.profilePicture ? (
              <img
                src={userInfo.profilePicture}
                alt="Profile"
                className="h-10 w-10 object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {userInfo?.name?.charAt(0)}
              </span>
            )}
          </div>
          <div className="ml-3 text-gray-500 flex-1">What's on your mind?</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-6 overflow-visible">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Create Post</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowForm(false)}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {userInfo?.profilePicture ? (
              <img
                src={userInfo.profilePicture}
                alt="Profile"
                className="h-10 w-10 object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {userInfo?.name?.charAt(0)}
              </span>
            )}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900">{userInfo?.name}</p>
          </div>
        </div>
        
        <textarea
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-32"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        
        {image && (
          <div className="relative mt-3">
            <img 
              src={image} 
              alt="Post preview" 
              className="max-h-60 rounded-lg object-cover"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
              onClick={() => setImage('')}
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            className="flex items-center text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => document.getElementById('image-url-input').focus()}
          >
            <Image size={20} className="mr-2 text-primary-600" />
            <span>Add Image</span>
          </button>
          
          <input
            id="image-url-input"
            name="image-url-input"
            type="text"
            className="hidden"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          
          <button
            type="submit"
            disabled={loading || (!text && !image)}
            className={`btn-primary px-6 ${loading || (!text && !image) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;