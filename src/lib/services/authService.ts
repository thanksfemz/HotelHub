import axios from '@/lib/axios';

export const authService = {
  login: async (data: any) => {
    const response = await axios.post('/api/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  },

  register: async (data: any) => {
    const response = await axios.post('/api/auth/register', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post('/api/auth/forgot-password', { email });
    return response.data;
  },
};
