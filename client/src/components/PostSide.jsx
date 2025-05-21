import React from 'react';
import PostShear from '../components/PostShear';
import Posts from '../components/Posts';

const PostSide = ({ location }) => {
  return (
    <div className="flex flex-col gap-4 h-screen overflow-auto">
      {location === 'UseProfile' ? (
        <Posts />
      ) : (
        <>
          <PostShear />
          <Posts />
        </>
      )}
    </div>
  );
};

export default PostSide;
