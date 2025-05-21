import React, { useEffect, useState } from 'react';
import { createComment, getComments } from '../api/CommentRequest';
import { format } from 'timeago.js';
import { useSelector } from 'react-redux';
import { getUser } from '../api/UserRequest';

const CommentBox = ({ postId, userId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const { user } = useSelector((state) => state.authReducer.authData);

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = () => {
    createComment({ postId, userId, text: commentText })
      .then((response) => {
        const newComment = response.data;
        setComments([newComment, ...comments]);
        setCommentText('');
      })
      .catch((error) => {
        console.error('Error creating comment:', error);
      });
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(postId);
        const fetchedComments = response.data;

        const commentUsersData = {};

        const userPromises = fetchedComments.map((comment) =>
          getUser(comment.userId)
            .then((userResponse) => {
              const commentUser = userResponse.data;
              commentUsersData[comment.userId] = commentUser;
              return commentUser;
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
            })
        );

        const userResponses = await Promise.all(userPromises);

        userResponses.forEach((user, index) => {
          commentUsersData[fetchedComments[index].userId] = user;
        });

        const commentsWithUserData = fetchedComments.map((comment) => ({
          ...comment,
          user: commentUsersData[comment.userId],
        }));

        setComments(commentsWithUserData.reverse());
        setCommentUsers(commentUsersData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="w-full flex flex-col">
      {/* Input Comment */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={
            user.profilePicture
              ? serverPublic + user.profilePicture
              : serverPublic + 'defaultProfile.png'
          }
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={handleCommentChange}
          className="flex-1 py-2 px-4 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>

      {/* Display Comments */}
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start gap-3">
            {commentUsers[comment.userId] && (
              <img
                src={
                  commentUsers[comment.userId].profilePicture
                    ? serverPublic + commentUsers[comment.userId].profilePicture
                    : serverPublic + 'defaultProfile.png'
                }
                alt="comment-user"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl shadow text-sm">
              <span className="font-semibold block mb-1">
                {commentUsers[comment.userId]?.firstname}
              </span>
              <span>{comment.text}</span>
              <div className="text-xs text-gray-500 mt-1">{format(comment.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentBox;