
export type StaffRole = 'Admin' | 'Manager' | 'Receptionist' | 'Housekeeping';
export type StaffStatus = 'Active' | 'Inactive';

export interface Staff {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  position: StaffRole;
  salary: number;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  position: StaffRole;
  salary: number;
  hireDate: string;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
    isActive?: boolean;
}

export interface StaffFilters {
    role?: 'all' | StaffRole;
    status?: 'all' | StaffStatus;
}
