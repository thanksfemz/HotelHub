import axios from '@/lib/axios';
import type { Guest, GuestFilters } from '../types';

export const guestService = {
  getGuests: async (filters?: Partial<GuestFilters>) => {
    const response = await axios.get('/api/guests', {
        params: filters
    });
    return response.data;
  },

  getGuest: async (id: string) => {
    const response = await axios.get(`/api/guests/${id}`);
    return response.data;
  },

  createGuest: async (data: Omit<Guest, 'id'>) => {
    const response = await axios.post('/api/guests', data);
    return response.data;
  },

  updateGuest: async (id: string, data: Partial<Omit<Guest, 'id'>>) => {
    const response = await axios.put(`/api/guests/${id}`, data);
    return response.data;
  },

  deleteGuest: async (id: string) => {
    const response = await axios.delete(`/api/guests/${id}`);
    return response.data;
  },

  getGuestBookings: async (id: string) => {
    const response = await axios.get(`/api/guests/${id}/bookings`);
    return response.data;
  }
};
