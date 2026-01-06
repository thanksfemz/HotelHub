import axios from '@/lib/axios';
import type { BookingFilters } from '../types';

export const bookingService = {
  getBookings: async (filters?: Partial<BookingFilters>) => {
    
    let params: Record<string, any> = {};

    if (filters?.status && filters.status !== 'all') {
        params.status = filters.status;
    }
    if (filters?.guest) {
        params.guest = filters.guest;
    }
    if (filters?.dateRange?.from) {
        params.from = filters.dateRange.from.toISOString();
    }
    if (filters?.dateRange?.to) {
        params.to = filters.dateRange.to.toISOString();
    }

    const response = await axios.get('/api/bookings', { params });
    return response.data;
  },
  
  getBooking: async (id: string) => {
    const response = await axios.get(`/api/bookings/${id}`);
    return response.data;
  },

  getRecentBookings: async (limit: number = 5) => {
    const response = await axios.get(`/api/bookings?_limit=${limit}&sort=checkIn&order=desc`);
    return response.data;
  },
};
