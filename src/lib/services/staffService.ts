import axios from '@/lib/axios';
import type { Staff } from '../types';

export const staffService = {
  getStaff: async (filters?: { role?: string; status?: string }): Promise<Staff[]> => {
    const response = await axios.get('/api/staff', { params: filters });
    return response.data;
  },

  getStaffMember: async (id: string): Promise<Staff> => {
    const response = await axios.get(`/api/staff/${id}`);
    return response.data;
  },

  createStaff: async (data: Omit<Staff, 'id'>) => {
    const response = await axios.post('/api/staff', data);
    return response.data;
  },

  updateStaff: async (id: string, data: Partial<Omit<Staff, 'id'>>) => {
    const response = await axios.put(`/api/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id: string) => {
    const response = await axios.delete(`/api/staff/${id}`);
    return response.data;
  },
};
