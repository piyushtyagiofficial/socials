import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
}

// Users API
export const usersAPI = {
  getProfile: (username) => api.get(`/users/profile/${username}`),
  updateProfile: (formData) => api.put("/users/profile", formData),
  followUser: (userId) => api.post(`/users/follow/${userId}`),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
}

// Posts API
export const postsAPI = {
  createPost: (formData) => api.post("/posts", formData),
  getFeed: (page = 1, limit = 10) => api.get(`/posts/feed?page=${page}&limit=${limit}`),
  getPost: (postId) => api.get(`/posts/${postId}`),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  addComment: (postId, text) => api.post(`/posts/${postId}/comment`, { text }),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
}

// Chat API
export const chatAPI = {
  getChats: () => api.get("/chat"),
  createChat: (userId) => api.post(`/chat/create/${userId}`),
  getChatMessages: (chatId, page = 1, limit = 50) => api.get(`/chat/${chatId}/messages?page=${page}&limit=${limit}`),
  sendMessage: (chatId, content, messageType = "text") =>
    api.post(`/chat/${chatId}/messages`, { content, messageType }),
}

export default api
