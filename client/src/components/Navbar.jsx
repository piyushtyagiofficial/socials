import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, X } from 'lucide-react';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/feed" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">S</span>
              </div>
              <h1 className="ml-2 text-2xl font-semibold text-gray-900 hidden sm:block">
                Socials
              </h1>
            </Link>
          </div>

          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative mr-2 sm:mr-4">
              <div className="relative">
                <input
                  id='search'
                  name='search'
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-40 sm:w-64 transition-all duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                )}
              </div>
            </form>

            {userInfo && (
              <Link to={`/profile/${userInfo._id}`} className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {userInfo.profilePicture ? (
                    <img
                      src={userInfo.profilePicture}
                      alt="Profile"
                      className="h-8 w-8 object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {userInfo.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                  {userInfo.name}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;