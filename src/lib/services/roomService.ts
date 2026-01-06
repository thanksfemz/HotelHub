import axios from '@/lib/axios';
import type { RoomFilters } from '@/lib/types';

export const roomService = {
  getRooms: async (filters?: Partial<RoomFilters>) => {
    const response = await axios.get('/api/rooms', { params: filters });
    return response.data;
  },
  
  getRoom: async (id: string) => {
    const response = await axios.get(`/api/rooms/${id}`);
    return response.data;
  }
};
