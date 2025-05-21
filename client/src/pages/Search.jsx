import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, clearUsers } from '../slices/userSlice';
import { Search as SearchIcon, UserPlus, UserCheck, User as UserIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { users, loading, error } = useSelector(state => state.user);
  
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      dispatch(searchUsers(initialQuery));
    }
    
    return () => {
      dispatch(clearUsers());
    };
  }, [dispatch, searchParams]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchUsers(query));
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>
      
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="p-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for users..."
              className="input pl-10 pr-4 py-3"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="btn-primary py-1 px-4">Search</span>
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="card p-6 text-error-500">
          <p>{error}</p>
        </div>
      ) : users.length > 0 ? (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">
            Users
          </h2>
          <div className="divide-y divide-gray-100">
            {users.map(user => (
              <div key={user._id} className="p-4 flex items-center justify-between">
                <Link to={`/profile/${user._id}`} className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-12 w-12 object-cover"
                      />
                    ) : (
                      <UserIcon size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </Link>
                
                {user._id !== userInfo._id && (
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <span>View Profile</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon size={28} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
          <p className="text-gray-600">
            We couldn't find any users matching "{query}"
          </p>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon size={28} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Search for users</h3>
          <p className="text-gray-600">
            Enter a name or email to find users to follow
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;