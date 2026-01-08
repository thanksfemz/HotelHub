
import axios from '@/lib/axios';
import type { Guest, CreateGuestRequest, UpdateGuestRequest, GuestFilters } from '@/lib/types/guest';
import type { Booking } from '@/lib/types/booking';

export const guestService = {
  getGuests: async (filters?: GuestFilters): Promise<Guest[]> => {
    const response = await axios.get('/guests', {
        params: filters
    });
    return response.data;
  },

  getGuest: async (id: string): Promise<Guest> => {
    const response = await axios.get(`/guests/${id}`);
    return response.data;
  },

  createGuest: async (data: CreateGuestRequest): Promise<Guest> => {
    const response = await axios.post('/guests', data);
    return response.data;
  },

  updateGuest: async (id: string, data: UpdateGuestRequest): Promise<Guest> => {
    const response = await axios.put(`/guests/${id}`, data);
    return response.data;
  },

  deleteGuest: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/guests/${id}`);
    return response.data;
  },

  getGuestBookings: async (id: string): Promise<Booking[]> => {
    const response = await axios.get(`/guests/${id}/bookings`);
    return response.data;
  }
};
