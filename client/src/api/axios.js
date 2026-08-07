import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fixmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      const currentToken = localStorage.getItem('fixmate_token');
      if (currentToken) {
        localStorage.removeItem('fixmate_token');
        localStorage.removeItem('fixmate_user');
        // Do not hard reload if already on auth page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login/customer';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
