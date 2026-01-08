
import axios from '@/lib/axios';
import type { Staff, StaffFilters, CreateStaffRequest, UpdateStaffRequest } from '@/lib/types/staff';

export const staffService = {
  getStaff: async (filters?: StaffFilters): Promise<Staff[]> => {
    const response = await axios.get('/staff', { params: filters });
    return response.data;
  },

  getStaffMember: async (id: string): Promise<Staff> => {
    const response = await axios.get(`/staff/${id}`);
    return response.data;
  },

  createStaff: async (data: CreateStaffRequest): Promise<Staff> => {
    const response = await axios.post('/staff', data);
    return response.data;
  },

  updateStaff: async (id: string, data: UpdateStaffRequest): Promise<Staff> => {
    const response = await axios.put(`/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/staff/${id}`);
    return response.data;
  },
};
