import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, resetAuthState } from '../slices/authSlice';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/feed');
    }

    return () => {
      dispatch(resetAuthState());
    };
  }, [userInfo, navigate, dispatch]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validatePasswords()) {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center">
        <div className="max-w-md p-8">
          <h1 className="text-4xl font-bold text-white mb-6">Join Socials Today</h1>
          <p className="text-white/80 text-lg mb-8">
            Create an account to connect with friends, share moments, and discover interesting content.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center text-white">
              <User size={28} className="mb-2" />
              <p className="text-sm font-medium">Create Profile</p>
            </div>
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center text-white">
              <UserPlus size={28} className="mb-2" />
              <p className="text-sm font-medium">Follow Friends</p>
            </div>
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center text-white">
              <Mail size={28} className="mb-2" />
              <p className="text-sm font-medium">Message</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">S</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Socials</h1>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 text-error-500 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="Your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePasswords}
                  className="input pl-10"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={validatePasswords}
                  className="input pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-error-500">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <UserPlus size={18} className="mr-2" />
                  Create Account
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;