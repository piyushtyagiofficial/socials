import React, { useState } from 'react';
import Home from '../images/home.png';
import Noti from '../images/noti.png';
import Comment from '../images/comment.png';
import { UilSetting } from '@iconscout/react-unicons';
import TrendCard from '../components/TrendCard/';
import ShareModal from '../components/ShareModal';
import { Link } from 'react-router-dom';

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div className="flex flex-col gap-8 md:gap-8 md:static fixed bottom-0 w-full md:w-auto">
      <div className="flex justify-between items-center mt-4 px-4 pr-12 md:pr-4">
        <Link to="../home">
          <img src={Home} alt="Home" className="w-6 h-6" />
        </Link>
        <UilSetting className="w-6 h-6" />
        <img src={Noti} alt="Notifications" className="w-6 h-6" />
        <Link to="../chat">
          <img src={Comment} alt="Chat" className="w-6 h-6" />
        </Link>
      </div>

      {/* Hidden on small screens */}
      <div className="hidden md:block">
        <TrendCard />
      </div>

      {/* Hidden on small screens */}
      <button
        className="hidden md:block bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg w-4/5 self-center"
        onClick={() => setModalOpened(true)}
      >
        Share
      </button>

      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
    </div>
  );
};

export default RightSide