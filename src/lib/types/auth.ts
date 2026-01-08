
export type UserRole = 'ADMIN' | 'MANAGER' | 'RECEPTIONIST';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  name?: string; // For display purposes, might come from staff/guest profile
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileRequest {
    name: string;
    phone?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
