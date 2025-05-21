// Chat.js
import React, { useEffect, useRef, useState } from 'react';
import LogoSearch from '../components/LogoSearch';
import { useSelector } from 'react-redux';
import { userChats } from '../api/ChatRequest';
import Conversation from '../components/Conversation';
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
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-[22%_auto] gap-4">
      <div className={`flex flex-col gap-4 ${showChatBox ? 'hidden md:flex' : ''}`}>
        <LogoSearch />
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 min-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold">Chats</h2>
          <div className="flex flex-col gap-4">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md p-2 cursor-pointer"
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

      <div className={`${showChatBox ? 'flex' : 'hidden md:flex'} flex-col gap-4`}>
        <div className="w-80 self-end hidden md:block">
          <div className="flex gap-4 items-center">
            <Link to="../home">
              <img src={Home} alt="Home" className="w-6 h-6" />
            </Link>
            <UilSetting className="text-gray-600 dark:text-white" />
            <img src={Noti} alt="Notifications" className="w-6 h-6" />
            <Link to="../chat">
              <img src={Comment} alt="Chat" className="w-6 h-6" />
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