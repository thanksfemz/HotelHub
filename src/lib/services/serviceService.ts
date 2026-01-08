
import axios from '@/lib/axios';
import type { Service, ServiceFilters, CreateServiceRequest, UpdateServiceRequest } from '@/lib/types/service';

export const serviceService = {
  getServices: async (filters?: ServiceFilters): Promise<Service[]> => {
    const response = await axios.get('/services', { params: filters });
    return response.data;
  },

  getService: async (id: string): Promise<Service> => {
    const response = await axios.get(`/services/${id}`);
    return response.data;
  },

  createService: async (data: CreateServiceRequest): Promise<Service> => {
    const response = await axios.post('/services', data);
    return response.data;
  },

  updateService: async (id: string, data: UpdateServiceRequest): Promise<Service> => {
    const response = await axios.put(`/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/services/${id}`);
    return response.data;
  },
};

    