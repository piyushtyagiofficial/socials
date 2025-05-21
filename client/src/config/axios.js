import axios from 'axios';

const baseURL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;