import React, { useEffect, useRef, useState } from 'react';
import LogoSearch from '../components/LogoSearch';
import { useSelector } from 'react-redux';
import { userChats } from '../api/ChatRequest';
import Conversation from '../components//Conversation';
import { Link } from 'react-router-dom';
import { UilSetting } from '@iconscout/react-unicons';
import Noti from '../images/noti.png';
import Home from '../images/home.png';
import Comment from '../images/comment.png';
import ChatBox from '../components/ChatBox';
import { io } from 'socket.io-client';

const Chat = () => {
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiverMessage, setReceiverMessage] = useState(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  const socket = useRef();

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current = io('http://localhost:8800');
    socket.current.emit('new-user-add', user._id);
    socket.current.on('get-users', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    socket.current.on('receiver-message', (data) => {
      setReceiverMessage(data);
    });
  }, []);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);

  const checkOnline = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
    setShowChatBox(true);
    if (window.innerWidth <= 768) {
      setShowConversationList(false);
    }
  };

  return (
    <div className="relative grid grid-cols-[22%_auto] gap-4 max-[768px]:grid-cols-1">

      <div className={`${showConversationList ? 'flex' : 'hidden'} flex-col gap-4`}>
        <LogoSearch />
        <div className="flex flex-col gap-4 bg-white/70 rounded-xl p-4 min-h-[80vh] max-h-full overflow-y-scroll max-[768px]:min-h-screen">
          <h2 className="text-xl font-semibold">Chats</h2>
          <div className="flex flex-col gap-4">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className="rounded-lg p-2 hover:bg-gray-300/30 cursor-pointer"
              >
                <Conversation
                  data={chat}
                  currentUserId={user._id}
                  online={checkOnline(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${showChatBox ? 'flex' : 'hidden'} flex-col gap-4 max-[768px]:flex`}>
        <div className="w-80 self-end hidden max-[768px]:block">
          <div className="flex justify-between items-center gap-3">
            <Link to="../home">
              <img src={Home} alt="home" className="w-6 h-6" />
            </Link>
            <UilSetting className="w-6 h-6" />
            <img src={Noti} alt="notification" className="w-6 h-6" />
            <Link to="../chat">
              <img src={Comment} alt="comment" className="w-6 h-6" />
            </Link>
          </div>
        </div>

        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receiverMessage={receiverMessage}
          setShowChatBox={setShowChatBox}
        />
      </div>
    </div>
  );
};

export default Chat;
