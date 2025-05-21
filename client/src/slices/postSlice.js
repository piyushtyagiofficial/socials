import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const initialState = {
  posts: [],
  post: null,
  userPosts: [],
  loading: false,
  error: null,
};

export const getFeedPosts = createAsyncThunk(
  'post/getFeedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/posts/feed');
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

export const getUserPosts = createAsyncThunk(
  'post/getUserPosts',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/posts/user/${userId}`);
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

export const createPost = createAsyncThunk(
  'post/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/posts', postData);
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

export const getPostById = createAsyncThunk(
  'post/getPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/posts/${postId}`);
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

export const likePost = createAsyncThunk(
  'post/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/posts/${postId}/like`);
      return { postId, message: data.message };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const commentOnPost = createAsyncThunk(
  'post/commentOnPost',
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/posts/${postId}/comments`, { text });
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

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await axios.delete(`/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [action.payload, ...state.posts];
        toast.success('Post created successfully');
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        
        // Update post in feed
        if (state.posts.length > 0) {
          state.posts = state.posts.map((post) => {
            if (post._id === postId) {
              const isLiked = post.likes.includes(action.meta.arg);
              if (isLiked) {
                return {
                  ...post,
                  likes: post.likes.filter((id) => id !== action.meta.arg),
                };
              } else {
                return {
                  ...post,
                  likes: [...post.likes, action.meta.arg],
                };
              }
            }
            return post;
          });
        }
        
        // Update post in user posts
        if (state.userPosts.length > 0) {
          state.userPosts = state.userPosts.map((post) => {
            if (post._id === postId) {
              const isLiked = post.likes.includes(action.meta.arg);
              if (isLiked) {
                return {
                  ...post,
                  likes: post.likes.filter((id) => id !== action.meta.arg),
                };
              } else {
                return {
                  ...post,
                  likes: [...post.likes, action.meta.arg],
                };
              }
            }
            return post;
          });
        }
        
        // Update single post view
        if (state.post && state.post._id === postId) {
          const isLiked = state.post.likes.includes(action.meta.arg);
          if (isLiked) {
            state.post = {
              ...state.post,
              likes: state.post.likes.filter((id) => id !== action.meta.arg),
            };
          } else {
            state.post = {
              ...state.post,
              likes: [...state.post.likes, action.meta.arg],
            };
          }
        }
      })
      .addCase(commentOnPost.fulfilled, (state, action) => {
        if (state.post && state.post._id === action.payload._id) {
          state.post = action.payload;
        }
        
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
        
        toast.success('Comment added');
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.userPosts = state.userPosts.filter((post) => post._id !== action.payload);
        toast.success('Post deleted');
      });
  },
});

export const { resetPostState } = postSlice.actions;

export default postSlice.reducer;