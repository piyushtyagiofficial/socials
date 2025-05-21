import React from 'react';
import LogoSearch from '../components/LogoSearch';
import ProfileCard from '../ProfileCard/ProfileCard';
import FollowersCard from '../FollowersCard/FollowersCard';

const ProfileSide = () => {
  return (
    <div className="left">
      <div className="flex flex-col gap-4 items-center overflow-auto">
        <LogoSearch />
        <ProfileCard location="homepage" />
        <FollowersCard />
      </div>
    </div>
  );
};

export default ProfileSide;
