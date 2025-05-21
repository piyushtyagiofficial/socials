import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const initialState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
};

export const getUserChats = createAsyncThunk(
  'chat/getUserChats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/chats');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getChatById = createAsyncThunk(
  'chat/getChatById',
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/chats/${chatId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createOrGetChat = createAsyncThunk(
  'chat/createOrGetChat',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/chats', { userId });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/chats/${chatId}/messages`, { content });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    resetChatState: (state) => {
      state.loading = false;
      state.error = null;
    },
    addMessageToChat: (state, action) => {
      const { chatId, message } = action.payload;
      
      if (state.currentChat && state.currentChat._id === chatId) {
        state.currentChat.messages.push(message);
      }
      
      state.chats = state.chats.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            lastMessage: new Date().toISOString(),
          };
        }
        return chat;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(getUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getChatById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(getChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrGetChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrGetChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        
        // Check if chat already exists in the list
        const chatExists = state.chats.some(chat => chat._id === action.payload._id);
        
        if (!chatExists) {
          state.chats.unshift(action.payload);
        }
      })
      .addCase(createOrGetChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        
        // Update the chat in the list
        state.chats = state.chats.map(chat => 
          chat._id === action.payload._id 
            ? { ...chat, lastMessage: action.payload.messages[action.payload.messages.length - 1].createdAt }
            : chat
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { setCurrentChat, resetChatState, addMessageToChat } = chatSlice.actions;

export default chatSlice.reducer;