import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for refresh tokens
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) and 403 (Forbidden) errors - token expired
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get the expired access token to send in the refresh request header
        const expiredToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        
        // Attempt to refresh token using POST /api/auth/refresh
        // IMPORTANT: Send the expired access token in the Authorization header
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {}, {
          withCredentials: true, // Include cookies for refresh token
          headers: {
            'Content-Type': 'application/json',
            'Authorization': expiredToken ? `Bearer ${expiredToken}` : undefined
          }
        });

        if (response.data.success) {
          const { accessToken, username } = response.data.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.USERNAME, username);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          // Refresh response indicates failure
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Refresh token expired or failed, force logout
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USERNAME);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
