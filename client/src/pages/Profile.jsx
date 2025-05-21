import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById, followUser, unfollowUser } from '../slices/userSlice';
import { getUserPosts } from '../slices/postSlice';
import { createOrGetChat } from '../slices/chatSlice';
import Post from '../components/Post';
import { Grid, Calendar, MapPin, Camera, Settings, Users, MessageSquare } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('posts');
  
  const { userInfo } = useSelector(state => state.auth);
  const { userProfile, loading: userLoading } = useSelector(state => state.user);
  const { userPosts, loading: postsLoading } = useSelector(state => state.post);
  
  const isOwnProfile = userInfo?._id === id;
  
  useEffect(() => {
    dispatch(getUserById(id));
    dispatch(getUserPosts(id));
  }, [dispatch, id]);
  
  const handleFollowToggle = () => {
    if (userProfile.isFollowing) {
      dispatch(unfollowUser(id));
    } else {
      dispatch(followUser(id));
    }
  };
  
  const handleMessageUser = () => {
    dispatch(createOrGetChat(id));
  };
  
  if (userLoading && !userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!userProfile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-800">User not found</h2>
        <Link to="/feed" className="text-primary-600 mt-2 inline-block">Back to feed</Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="card mb-6 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 relative">
          <div className="absolute -bottom-16 left-6">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              {userProfile.profilePicture ? (
                <img
                  src={userProfile.profilePicture}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-3xl font-semibold text-gray-600">
                    {userProfile.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="absolute bottom-4 right-4">
              <Link
                to="/profile/edit"
                className="flex items-center bg-white text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} className="mr-2" />
                <span>Edit Profile</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="pt-20 px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
              {userProfile.bio && (
                <p className="text-gray-600 mt-1">{userProfile.bio}</p>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              {!isOwnProfile && (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                      userProfile.isFollowing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    } transition-colors`}
                  >
                    <Users size={16} className="mr-2" />
                    <span>{userProfile.isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                  
                  <button
                    onClick={handleMessageUser}
                    className="flex items-center px-4 py-2 rounded-lg font-medium bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    <span>Message</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex space-x-8 mt-6">
            <div className="text-center">
              <span className="block font-semibold text-gray-900">{userPosts.length}</span>
              <span className="text-sm text-gray-600">Posts</span>
            </div>
            <div className="text-center">
              <span className="block font-semibold text-gray-900">{userProfile.followers}</span>
              <span className="text-sm text-gray-600">Followers</span>
            </div>
            <div className="text-center">
              <span className="block font-semibold text-gray-900">{userProfile.following}</span>
              <span className="text-sm text-gray-600">Following</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            className={`pb-4 pt-2 px-1 font-medium border-b-2 ${
              activeTab === 'posts'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } transition-colors`}
            onClick={() => setActiveTab('posts')}
          >
            <Grid size={20} className="inline-block mr-2" />
            <span>Posts</span>
          </button>
          <button
            className={`pb-4 pt-2 px-1 font-medium border-b-2 ${
              activeTab === 'photos'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } transition-colors`}
            onClick={() => setActiveTab('photos')}
          >
            <Camera size={20} className="inline-block mr-2" />
            <span>Photos</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      {activeTab === 'posts' ? (
        <div>
          {postsLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="card p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {isOwnProfile
                  ? "You haven't created any posts yet."
                  : `${userProfile.name} hasn't created any posts yet.`}
              </p>
            </div>
          ) : (
            <div>
              {userPosts.map(post => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {userPosts.filter(post => post.image).length === 0 ? (
            <div className="card p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No photos yet</h3>
              <p className="text-gray-600">
                {isOwnProfile
                  ? "You haven't posted any photos yet."
                  : `${userProfile.name} hasn't posted any photos yet.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts
                .filter(post => post.image)
                .map(post => (
                  <Link key={post._id} to={`/post/${post._id}`} className="block relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ))
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;