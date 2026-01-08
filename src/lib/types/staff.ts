
import type { UserRole } from './auth';

export interface Staff {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  position: UserRole;
  salary?: number;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // For convenience, might be populated from user entity
  email?: string;
}

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: UserRole;
  password?: string;
  address?: string;
  salary?: number;
  hireDate?: string;
}

export interface UpdateStaffRequest extends Partial<Omit<CreateStaffRequest, 'password' | 'email'>> {
    isActive?: boolean;
}

export interface StaffFilters {
    role?: 'all' | UserRole;
    status?: 'all' | 'Active' | 'Inactive';
}

    