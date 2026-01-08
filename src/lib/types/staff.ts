
import type { UserRole } from './auth';

export type StaffStatus = 'Active' | 'Inactive';

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
  name?: string; 
  email?: string;
  role?: UserRole;
  joinedDate?: string; // for compatibility
}

export interface CreateStaffRequest {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  role: UserRole;
  salary?: number;
  hireDate?: string;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
    isActive?: boolean;
    status?: StaffStatus;
}

export interface StaffFilters {
    role?: 'all' | UserRole;
    status?: 'all' | StaffStatus;
}
