import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../slices/authSlice';
import { ArrowLeft, User, Mail, AtSign, Info, Lock } from 'lucide-react';

const EditProfile = () => {
  const { userInfo, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setProfilePicture(userInfo.profilePicture || '');
      setBio(userInfo.bio || '');
    }
  }, [userInfo]);

  const validatePasswords = () => {
    if (password && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password && !validatePasswords()) {
      return;
    }
    
    const userData = {
      name,
      email,
      profilePicture,
      bio,
    };
    
    if (password) {
      userData.password = password;
    }
    
    dispatch(updateUserProfile(userData));
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-24 w-24 object-cover"
                />
              ) : (
                <User size={40} className="text-gray-500" />
              )}
            </div>
            <div>
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL
              </label>
              <input
                type="text"
                id="profilePicture"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                className="input"
                placeholder="Enter image URL"
              />
            </div>
          </div>
          
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input pl-10"
                placeholder="Your full name"
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="Your email address"
                required
              />
            </div>
          </div>
          
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <Info size={18} className="text-gray-400" />
              </div>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input pl-10 h-24 resize-none"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePasswords}
                className="input pl-10"
                placeholder="New password"
              />
            </div>
          </div>
          
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validatePasswords}
                className="input pl-10"
                placeholder="Confirm new password"
                disabled={!password}
              />
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-error-500">{passwordError}</p>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;