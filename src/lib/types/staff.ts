

export type StaffRole = 'Admin' | 'Manager' | 'Receptionist' | 'Housekeeping';
export type StaffStatus = 'Active' | 'Inactive';

export interface Staff {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: StaffRole;
  position: StaffRole;
  salary?: number;
  hireDate: string;
  joinedDate: string;
  status: StaffStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  role: StaffRole;
  salary?: number;
  hireDate?: string;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
    isActive?: boolean;
    status?: StaffStatus;
}

export interface StaffFilters {
    role?: 'all' | StaffRole;
    status?: 'all' | StaffStatus;
}
