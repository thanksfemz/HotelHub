
export type StaffRole = 'Admin' | 'Manager' | 'Receptionist' | 'Housekeeping';
export type StaffStatus = 'Active' | 'Inactive';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  avatar?: string;
  address?: string;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Staff['role'];
  address?: string;
}

export interface UpdateStaffRequest {
  name?: string;
  phone?: string;
  role?: Staff['role'];
  status?: Staff['status'];
  address?: string;
}

export interface StaffFilters {
    role?: 'all' | StaffRole;
    status?: 'all' | StaffStatus;
}
