import React from 'react';
// import ProfileSide from '../../components/profileSide/ProfileSide';
// import PostSide from '../../components/profileSide/PostSide/PostSide';
// import RightSide from '../../components/RightSide/RightSide';

const Home = () => {
  return (
    <div className='Home'>
      {/* ProfileSide is hidden on screens with a width of 767 pixels or less */}
      <div className='profile-side-container'>
        <ProfileSide />
      </div>
      <PostSide />
      <RightSide />
    </div>
  );
};

export default Home;