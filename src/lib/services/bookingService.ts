
import axios from '@/lib/axios';
import type { Booking, BookingFilters, CreateBookingRequest, UpdateBookingRequest } from '@/lib/types/booking';
import type { Room } from '@/lib/types/room';
import { format } from 'date-fns';

export const bookingService = {
  getBookings: async (filters?: Partial<BookingFilters>): Promise<Booking[]> => {
    
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
  
  getBooking: async (id: string): Promise<Booking> => {
    const response = await axios.get(`/api/bookings/${id}`);
    return response.data;
  },

  getRecentBookings: async (limit: number = 5): Promise<Booking[]> => {
    const allBookings = await bookingService.getBookings({ guest: '', status: 'all', dateRange: {} });
    return allBookings
      .sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  checkAvailability: async (checkIn: Date, checkOut: Date): Promise<Room[]> => {
    const response = await axios.get('/api/rooms/available', {
        params: {
            checkIn: format(checkIn, 'yyyy-MM-dd'),
            checkOut: format(checkOut, 'yyyy-MM-dd'),
        }
    });
    return response.data;
  },

  createBooking: async (data: any): Promise<Booking> => {
    const response = await axios.post('/api/bookings', data);
    return response.data;
  },

  updateBooking: async (id: string, data: UpdateBookingRequest): Promise<Booking> => {
    const response = await axios.put(`/api/bookings/${id}`, data);
    return response.data;
  },
};
