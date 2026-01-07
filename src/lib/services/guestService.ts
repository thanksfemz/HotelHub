
import axios from '@/lib/axios';
import type { Guest, GuestFilters, CreateGuestRequest, UpdateGuestRequest } from '@/lib/types/guest';
import type { Booking } from '@/lib/types/booking';

export const guestService = {
  getGuests: async (filters?: Partial<GuestFilters>): Promise<Guest[]> => {
    const response = await axios.get('/api/guests', {
        params: filters
    });
    return response.data;
  },

  getGuest: async (id: string): Promise<Guest> => {
    const response = await axios.get(`/api/guests/${id}`);
    return response.data;
  },

  createGuest: async (data: CreateGuestRequest): Promise<Guest> => {
    const response = await axios.post('/api/guests', data);
    return response.data;
  },

  updateGuest: async (id: string, data: UpdateGuestRequest): Promise<Guest> => {
    const response = await axios.put(`/api/guests/${id}`, data);
    return response.data;
  },

  deleteGuest: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/guests/${id}`);
    return response.data;
  },

  getGuestBookings: async (id: string): Promise<Booking[]> => {
    const response = await axios.get(`/api/guests/${id}/bookings`);
    return response.data;
  }
};
