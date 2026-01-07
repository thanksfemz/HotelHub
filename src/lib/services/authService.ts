
import axios from '@/lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/lib/types/auth';
import type { ApiResponse } from '@/lib/types/api';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // In a real app, you would post to a login endpoint.
    // Here we simulate a login and return a mock user and token.
    console.log('Simulating login for:', data.email);
    const mockUser: User = {
        id: 'user-1',
        name: 'Admin User',
        email: data.email,
        role: 'Admin',
        createdAt: new Date().toISOString(),
    };
    const mockToken = 'mock-jwt-token';

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { user: mockUser, token: mockToken };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    // In a real app, you might invalidate the token on the server.
    console.log('Simulating logout');
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: null, message: 'Logout successful' };
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    console.log('Simulating registration for:', data.email);
    const newUser: User = {
        id: `user-${Math.random().toString(36).substring(2,9)}`,
        name: data.name,
        email: data.email,
        role: 'Receptionist', // Default role for new signups
        phone: data.phone,
        createdAt: new Date().toISOString(),
    };
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: newUser, message: 'Registration successful' };
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    console.log('Simulating forgot password for:', email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: null, message: 'Password reset link sent' };
  },
};
