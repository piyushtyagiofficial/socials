import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home,
  User,
  MessageSquare,
  Search,
  PlusSquare,
  LogOut,
} from 'lucide-react';
import { logout } from '../slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      name: 'Feed',
      path: '/feed',
      icon: <Home size={24} />,
    },
    {
      name: 'Profile',
      path: `/profile/${userInfo?._id}`,
      icon: <User size={24} />,
    },
    {
      name: 'Messages',
      path: '/chat',
      icon: <MessageSquare size={24} />,
    },
    {
      name: 'Search',
      path: '/search',
      icon: <Search size={24} />,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 pt-6">
      <div className="flex flex-col h-full justify-between px-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          <Link
            to="/feed"
            className="flex items-center px-3 py-3 mt-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <PlusSquare size={24} className="mr-3" />
            <span className="font-medium">Create Post</span>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors my-6"
        >
          <LogOut size={24} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;