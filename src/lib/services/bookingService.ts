import axios from '@/lib/axios';

export const bookingService = {
  getBookings: async (params?: any) => {
    const response = await axios.get('/api/bookings', { params });
    return response.data;
  },

  getRecentBookings: async (limit: number = 5) => {
    const response = await axios.get(`/api/bookings?_limit=${limit}&_sort=checkIn&_order=desc`);
    return response.data;
  },
};
