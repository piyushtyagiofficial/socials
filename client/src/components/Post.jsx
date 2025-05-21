import React, { useState } from 'react';
import Comment from '../images/comment.png';
import Shear from '../images/share.png';
import Heart from '../images/like.png';
import NotLike from '../images/notlike.png';
import { useSelector } from 'react-redux';
import { likePost } from '../api/PostRequest';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import CommentBox from '../pages/CommentBox';

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(data.likes);

  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleComment = () => {
    setShowCommentBox((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={`/UserProfile/${data.userId}`}>
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={
                  data.profilePicture
                    ? `${serverPublic}/${data.profilePicture}`
                    : 'http://localhost:5000/images/defaultProfile.png'
                }
                alt="profile"
                className="object-cover w-full h-full"
              />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-semibold">{data.firstname} {data.lastname}</span>
            <span className="text-sm text-gray-500">{format(data.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Post Description and Image */}
      <div>
        <p className="text-sm mb-2">{data.desc}</p>
        {data.image && (
          <img
            src={`${process.env.REACT_APP_PUBLIC_FOLDER}${data.image}`}
            alt="post"
            className="w-full max-h-[500px] object-cover rounded-md"
          />
        )}
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-5 mt-2">
        <img
          src={liked ? Heart : NotLike}
          alt="like"
          className="w-6 h-6 cursor-pointer"
          onClick={handleLike}
        />
        <img
          src={Comment}
          alt="comment"
          className="w-6 h-6 cursor-pointer"
          onClick={handleComment}
        />
        <img src={Shear} alt="share" className="w-6 h-6 cursor-pointer" />
      </div>

      {/* Likes Count */}
      <span className="text-sm text-gray-600">{likes.length} Likes</span>

      {/* Post Footer */}
      <div className="text-sm text-gray-700">
        <span className="font-semibold">{data.name}</span>
      </div>

      {/* Comment Box */}
      {showCommentBox && (
        <div className="mt-3">
          <CommentBox postId={data._id} userId={user._id} />
        </div>
      )}
    </div>
  );
};

export default Post