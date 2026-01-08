import axios from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // Default to localhost:8080
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Only add the token if it exists and we're not making a request that doesn't need auth
    // (like login or register). A more robust solution might check the URL path.
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired. Clear auth state.
      useAuthStore.getState().clearAuth();
      // Redirect to login page, but only on the client-side.
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Return the error so it can be handled by the calling code (e.g., in a catch block)
    return Promise.reject(error);
  }
);

export default axiosInstance;
