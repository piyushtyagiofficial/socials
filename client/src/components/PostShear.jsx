import React, { useState, useRef } from 'react';
import { UilScenery, UilPlayCircle, UilLocationPoint, UilSchedule, UilTimes } from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadPost } from '../actions/UploadAction';
import { Link } from 'react-router-dom';

const PostShear = () => {
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const desc = useRef();
  const dispatch = useDispatch();

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useSelector((state) => state.authReducer.authData);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const reset = () => {
    setImage(null);
    desc.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if (image) {
      const data = new FormData();
      const filename = Date.now() + image.name;
      data.append('name', filename);
      data.append('file', image);
      newPost.image = filename;
      try {
        dispatch(uploadImage(data));
      } catch (error) {
        console.log(error);
      }
    }

    dispatch(uploadPost(newPost));
    reset();
  };

  return (
    <div className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
      <Link to={`/UserProfile/${user._id}`}>
        <img
          src={
            user.coverPicture
              ? serverPublic + user.profilePicture
              : serverPublic + 'defaultProfile.png'
          }
          alt="Profile"
          className="rounded-full w-12 h-12 object-cover"
        />
      </Link>

      <div className="flex flex-col gap-4 w-full">
        <input
          ref={desc}
          required
          type="text"
          placeholder="What's happening"
          className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-base outline-none w-full sm:text-sm"
        />

        <div className="flex justify-around w-full flex-wrap gap-2 sm:gap-1">
          <div
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg hover:cursor-pointer text-green-600"
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            <span>Photo</span>
          </div>

          <div className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg text-pink-500">
            <UilPlayCircle />
            <span>Video</span>
          </div>

          <div className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg text-red-500">
            <UilLocationPoint />
            <span>Location</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-sm px-2 py-1 rounded-lg text-yellow-500">
            <UilSchedule />
            <span>Schedule</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? 'Uploading' : 'Share'}
          </button>

          <input
            type="file"
            name="myImage"
            ref={imageRef}
            onChange={onImageChange}
            className="hidden"
          />
        </div>

        {image && (
          <div className="relative mt-2">
            <UilTimes
              className="absolute top-2 right-4 text-gray-600 cursor-pointer"
              onClick={() => setImage(null)}
            />
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full max-h-80 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShear;
