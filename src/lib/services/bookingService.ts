import axios from '@/lib/axios';
import type { Booking, BookingFilters } from '../types';
import { format } from 'date-fns';

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
    // Corrected this to use totalAmount from the main booking data
    const allBookings = await bookingService.getBookings({ guest: '', status: 'all', dateRange: {} });
    return allBookings
      .sort((a: Booking, b: Booking) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
      .slice(0, limit)
      .map((b: any) => ({ ...b, amount: b.totalAmount })); // Ensure 'amount' field exists for RecentBookings component
  },

  checkAvailability: async (checkIn: Date, checkOut: Date) => {
    const response = await axios.get('/api/rooms/available', {
        params: {
            checkIn: format(checkIn, 'yyyy-MM-dd'),
            checkOut: format(checkOut, 'yyyy-MM-dd'),
        }
    });
    return response.data;
  },

  createBooking: async (data: any) => {
    const response = await axios.post('/api/bookings', data);
    return response.data;
  }
};
