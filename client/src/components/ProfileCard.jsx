import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProfileCard = ({ location }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const posts = useSelector((state) => state.postReducer.posts);

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="rounded-3xl flex flex-col relative gap-4 mt-4 overflow-x-clip bg-white">
      {/* Profile Images */}
      <div className="relative flex flex-col items-center justify-center">
        <img
          src={
            user.coverPicture
              ? serverPublic + user.coverPicture
              : serverPublic + 'defaultCover.jpg'
          }
          alt="Cover"
          className="w-full"
        />
        <img
          src={
            user.profilePicture
              ? serverPublic + user.profilePicture
              : serverPublic + 'defaultProfile.png'
          }
          alt="Profile"
          className="w-24 h-24 object-contain rounded-full absolute -bottom-12 shadow-md"
        />
      </div>

      {/* Profile Name */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <span className="font-bold">
          {user.firstname} {user.lastname}
        </span>
        <span className="text-gray-500 text-sm">
          {user.worksAt ? user.worksAt : 'write about yourself'}
        </span>
      </div>

      {/* Follow Status */}
      <div className="flex flex-col items-center justify-center gap-3">
        <hr className="w-[85%] border border-gray-200" />
        <div className="flex justify-around items-center w-[80%] gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="font-bold">{user.following.length}</span>
            <span className="text-sm text-gray-500">Following</span>
          </div>
          <div className="h-10 border-l-2 border-gray-200" />
          <div className="flex flex-col items-center gap-1">
            <span className="font-bold">{user.followers.length}</span>
            <span className="text-sm text-gray-500">Followers</span>
          </div>
          {location === 'ProfilePage' && (
            <>
              <div className="h-10 border-l-2 border-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold">
                  {posts.filter((post) => post.userId === user._id).length}
                </span>
                <span className="text-sm text-gray-500">Posts</span>
              </div>
            </>
          )}
        </div>
        <hr className="w-[85%] border border-gray-200" />
      </div>

      {/* Profile Link */}
      {location !== 'ProfilePage' && (
        <span className="font-bold text-orange-500 self-center mb-4 cursor-pointer">
          <Link to={`/profile/${user._id}`} className="no-underline text-inherit">
            My Profile
          </Link>
        </span>
      )}
    </div>
  );
};

export default ProfileCard;
