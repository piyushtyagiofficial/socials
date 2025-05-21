import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, User, MessageSquare, Search, PlusSquare } from 'lucide-react';

const MobileMenu = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const menuItems = [
    {
      name: 'Feed',
      path: '/feed',
      icon: <Home size={24} />,
    },
    {
      name: 'Create',
      path: '/create',
      icon: <PlusSquare size={24} />,
      className: 'text-primary-600',
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
    {
      name: 'Profile',
      path: `/profile/${userInfo?._id}`,
      icon: <User size={24} />,
    },
  ];

  const isActive = (path) => {
    if (path === '/create' && location.pathname === '/feed') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-14">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path === '/create' ? '/feed' : item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              item.className || ''
            } ${isActive(item.path) ? 'text-primary-600' : 'text-gray-500'}`}
          >
            <span>{item.icon}</span>
            <span className="text-xs mt-1">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;