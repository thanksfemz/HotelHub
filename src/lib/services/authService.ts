import axios from '@/lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest, User, UpdateProfileRequest, ChangePasswordRequest } from '@/lib/types/auth';
import type { ApiResponse } from '@/lib/types/api';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    // Client-side will handle token removal.
    // If your backend has a token blacklist, you can call a logout endpoint here.
    console.log('Logging out');
    return Promise.resolve({ success: true, data: null, message: 'Logout successful' });
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await axios.post('/auth/register', data);
    return response.data;
  },
  
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    // Assuming the user ID is implicitly handled by the backend via JWT
    const response = await axios.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{message: string}> => {
    const response = await axios.put('/users/change-password', data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  },
};
