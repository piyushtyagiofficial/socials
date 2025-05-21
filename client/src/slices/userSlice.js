import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const initialState = {
  userProfile: null,
  users: [],
  loading: false,
  error: null,
};

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/users/${userId}`);
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

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/users/${userId}/follow`);
      return { userId, message: data.message };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/users/${userId}/unfollow`);
      return { userId, message: data.message };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/users/search?query=${query}`);
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.userProfile && state.userProfile._id === action.payload.userId) {
          state.userProfile = {
            ...state.userProfile,
            isFollowing: true,
            followers: state.userProfile.followers + 1,
          };
        }
        toast.success('User followed successfully');
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.userProfile && state.userProfile._id === action.payload.userId) {
          state.userProfile = {
            ...state.userProfile,
            isFollowing: false,
            followers: state.userProfile.followers - 1,
          };
        }
        toast.success('User unfollowed successfully');
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState, clearUsers } = userSlice.actions;

export default userSlice.reducer;