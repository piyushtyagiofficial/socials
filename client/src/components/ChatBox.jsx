import React, { useEffect, useState, useRef } from 'react';
import { getUser } from '../api/UserRequest';
import { addMessage, getMessages } from '../api/MessageRequest';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';

const ChatBox = ({ chat, currentUser, setSendMessage, receiverMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  const imageRef = useRef();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    if (receiverMessage !== null && receiverMessage.chatId === chat._id) {
      setMessages([...messages, receiverMessage]);
    }
  }, [receiverMessage]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl grid" style={{ gridTemplateRows: '14vh 60vh 13vh' }}>
      {chat ? (
        <>
          <div className="flex flex-col p-4 border-b border-gray-300">
            <div className="flex items-center gap-4">
              <img
                src={
                  userData?.profilePicture
                    ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                    : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-sm font-medium">
                {userData?.firstname} {userData?.lastname}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-6 overflow-y-auto">
            {messages.map((message, i) => (
              <div
                key={i}
                ref={scroll}
                className={`flex flex-col gap-1 p-3 rounded-xl max-w-md w-fit text-white text-sm ${
                  message.senderId === currentUser
                    ? 'self-end bg-gradient-to-r from-cyan-400 to-blue-500 rounded-br-xl'
                    : 'self-start bg-orange-500 rounded-bl-xl'
                }`}
              >
                <span>{message.text}</span>
                <span className="text-xs text-gray-200 self-end">{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-2 bg-gray-100 rounded-b-xl">
            <div
              className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer font-bold"
              onClick={() => imageRef.current.click()}
            >
              +
            </div>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <div
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
              onClick={handleSend}
            >
              Send
            </div>
            <input type="file" ref={imageRef} style={{ display: 'none' }} />
          </div>
        </>
      ) : (
        <span className="text-center text-gray-500 p-4">
          Tap on a chat to start conversation...
        </span>
      )}
    </div>
  );
};

export default ChatBox;