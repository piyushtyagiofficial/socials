import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import {
  getUserChats,
  getChatById,
  createOrGetChat,
  sendMessage,
  setCurrentChat,
  addMessageToChat,
} from '../slices/chatSlice';
import { Send, User, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  const { userInfo } = useSelector(state => state.auth);
  const { chats, currentChat, loading } = useSelector(state => state.chat);
  
  // Initialize Socket.IO
  useEffect(() => {
    const socketUrl = import.meta.env.PROD
      ? window.location.origin
      : 'http://localhost:5000';
    
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Login with user ID when socket and userInfo are available
  useEffect(() => {
    if (socket && userInfo) {
      socket.emit('login', userInfo._id);
      
      socket.on('receiveMessage', ({ chatId, message }) => {
        dispatch(addMessageToChat({ chatId, message }));
      });
      
      socket.on('userTyping', ({ chatId, user }) => {
        if (currentChat && currentChat._id === chatId && user !== userInfo._id) {
          setIsTyping(true);
        }
      });
      
      socket.on('userStoppedTyping', ({ chatId }) => {
        if (currentChat && currentChat._id === chatId) {
          setIsTyping(false);
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off('receiveMessage');
        socket.off('userTyping');
        socket.off('userStoppedTyping');
      }
    };
  }, [socket, userInfo, currentChat, dispatch]);
  
  // Load chats and current chat
  useEffect(() => {
    dispatch(getUserChats());
    
    if (id) {
      dispatch(getChatById(id));
    }
  }, [dispatch, id]);
  
  // Reset current chat when navigating away
  useEffect(() => {
    return () => {
      dispatch(setCurrentChat(null));
    };
  }, [dispatch]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat]);
  
  const handleSelectChat = (chat) => {
    dispatch(getChatById(chat._id));
    navigate(`/chat/${chat._id}`);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentChat) return;
    
    dispatch(sendMessage({ chatId: currentChat._id, content: message }));
    
    // Emit socket event for real-time messaging
    if (socket) {
      const receiverId = currentChat.participants.find(
        p => p._id !== userInfo._id
      )._id;
      
      socket.emit('sendMessage', {
        chatId: currentChat._id,
        message: {
          sender: userInfo._id,
          content: message,
          createdAt: new Date().toISOString(),
        },
        receiver: receiverId,
      });
    }
    
    setMessage('');
  };
  
  const handleTyping = () => {
    if (socket && currentChat) {
      const receiverId = currentChat.participants.find(
        p => p._id !== userInfo._id
      )._id;
      
      socket.emit('typing', {
        chatId: currentChat._id,
        user: userInfo._id,
        receiver: receiverId,
      });
      
      if (typingTimeout) clearTimeout(typingTimeout);
      
      const timeout = setTimeout(() => {
        socket.emit('stopTyping', {
          chatId: currentChat._id,
          receiver: receiverId,
        });
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };
  
  // Get recipient from current chat
  const getRecipient = (chat) => {
    if (!chat) return null;
    return chat.participants.find(p => p._id !== userInfo._id);
  };
  
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="md:col-span-1">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto">
              {loading && chats.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : chats.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start a chat with someone to begin messaging</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {chats.map(chat => {
                    const recipient = getRecipient(chat);
                    if (!recipient) return null;
                    
                    return (
                      <div
                        key={chat._id}
                        className={`p-3 flex items-center cursor-pointer transition-colors ${
                          currentChat && currentChat._id === chat._id
                            ? 'bg-primary-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectChat(chat)}
                      >
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {recipient.profilePicture ? (
                            <img
                              src={recipient.profilePicture}
                              alt={recipient.name}
                              className="h-12 w-12 object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {recipient.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900 truncate">{recipient.name}</p>
                            {chat.lastMessage && (
                              <p className="text-xs text-gray-500">
                                {format(new Date(chat.lastMessage), 'MMM d')}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {chat.messages && chat.messages.length > 0
                              ? chat.messages[chat.messages.length - 1].content
                              : 'Start a conversation'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-2">
          {currentChat ? (
            <div className="card flex flex-col h-[80vh]">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center">
                <button
                  onClick={() => navigate('/chat')}
                  className="md:hidden mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {getRecipient(currentChat)?.profilePicture ? (
                    <img
                      src={getRecipient(currentChat).profilePicture}
                      alt={getRecipient(currentChat).name}
                      className="h-10 w-10 object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {getRecipient(currentChat)?.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{getRecipient(currentChat)?.name}</p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {currentChat.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Send size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-500 mt-1">Send a message to start the conversation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentChat.messages.map((msg, index) => {
                      const isSentByMe = msg.sender._id === userInfo._id;
                      const messageDate = new Date(msg.createdAt);
                      const time = format(messageDate, 'h:mm a');
                      
                      return (
                        <div
                          key={index}
                          className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isSentByMe && (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
                              {msg.sender.profilePicture ? (
                                <img
                                  src={msg.sender.profilePicture}
                                  alt={msg.sender.name}
                                  className="h-8 w-8 object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium text-xs">
                                  {msg.sender.name.charAt(0)}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="max-w-[70%]">
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isSentByMe
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <div
                              className={`text-xs text-gray-500 mt-1 ${
                                isSentByMe ? 'text-right' : 'text-left'
                              }`}
                            >
                              {time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`ml-2 p-2 rounded-full ${
                      message.trim()
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center h-[80vh] text-center p-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <User size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Messages</h2>
              <p className="text-gray-600 mb-6">
                Select a conversation from the list or start a new one by searching for a user.
              </p>
              <button
                onClick={() => navigate('/search')}
                className="btn-primary"
              >
                Find People
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;