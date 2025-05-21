import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
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

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/users', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
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

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post('/users/logout');
    localStorage.removeItem('userInfo');
  } catch (error) {
    return rejectWithValue(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
});

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/users/profile');
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

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/users/profile', userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        toast.success('Logged in successfully');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        toast.success('Account created successfully');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        toast.success('Logged out successfully');
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = { ...state.userInfo, ...action.payload };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        toast.success('Profile updated successfully');
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;