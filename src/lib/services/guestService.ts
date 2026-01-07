import axios from '@/lib/axios';

export const guestService = {
  getGuests: async (search: string) => {
    const response = await axios.get('/api/guests', {
        params: { search }
    });
    return response.data;
  },

  createGuest: async (data: any) => {
    const response = await axios.post('/api/guests', data);
    return response.data;
  }
};
