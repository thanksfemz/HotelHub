import axios from '@/lib/axios';
import type { Service } from '../types';

export const serviceService = {
  getServices: async (filters?: { category?: string }): Promise<Service[]> => {
    const response = await axios.get('/api/services', { params: filters });
    return response.data;
  },

  getService: async (id: string): Promise<Service> => {
    const response = await axios.get(`/api/services/${id}`);
    return response.data;
  },

  createService: async (data: Omit<Service, 'id' | 'image'>) => {
    const response = await axios.post('/api/services', data);
    return response.data;
  },

  updateService: async (id: string, data: Partial<Omit<Service, 'id' | 'image'>>) => {
    const response = await axios.put(`/api/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string) => {
    const response = await axios.delete(`/api/services/${id}`);
    return response.data;
  },
};
