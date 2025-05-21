import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { userChats } from '../api/ChatRequest';
import Conversation from '../components/Conversation';
import ChatBox from '../components/ChatBox';

const UserProfile = () => {
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiverMessage, setReceiverMessage] = useState(null);

  const socket = useRef();

  useEffect(() => {
    socket.current = io('http://localhost:8800');
    socket.current.emit('new-user-add', user._id);
    socket.current.on('get-users', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage);
    }
  }, [sendMessage]);

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
      } catch (err) {
        console.error(err);
      }
    };

    getChats();
  }, [user._id]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    return onlineUsers.some((u) => u.userId === chatMember);
  };

  return (
    <div className="relative grid grid-cols-[18rem_auto_20rem] gap-4 max-[600px]:flex max-[600px]:flex-col">
      
      {/* Left Sidebar */}
      <div className="bg-white/70 rounded-xl p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Your Conversations</h2>
        <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setCurrentChat(chat)}
              className="p-2 rounded-lg hover:bg-gray-300/30 cursor-pointer"
            >
              <Conversation
                data={chat}
                currentUserId={user._id}
                online={checkOnlineStatus(chat)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Center Content */}
      <div className="flex flex-col gap-4">
        {currentChat ? (
          <ChatBox
            chat={currentChat}
            currentUser={user._id}
            setSendMessage={setSendMessage}
            receiverMessage={receiverMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-lg text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="flex flex-col gap-4 p-4 bg-white/70 rounded-xl">
        <h2 className="text-xl font-bold">Settings</h2>
        <button className="bg-blue-500 text-white py-2 px-4 rounded">Edit Profile</button>
        <button className="bg-red-500 text-white py-2 px-4 rounded">Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;
