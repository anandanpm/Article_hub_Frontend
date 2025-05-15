import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default axiosInstance;