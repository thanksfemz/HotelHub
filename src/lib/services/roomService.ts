import axios from '@/lib/axios';
import type { Room, RoomFilters } from '@/lib/types';

export const roomService = {
  getRooms: async (filters?: Partial<RoomFilters>) => {
    const response = await axios.get('/api/rooms', { params: filters });
    return response.data;
  },
  
  getRoom: async (id: string) => {
    const response = await axios.get(`/api/rooms/${id}`);
    return response.data;
  },

  createRoom: async (data: Omit<Room, 'id' | 'image'>) => {
    const response = await axios.post('/api/rooms', data);
    return response.data;
  },

  updateRoom: async (id: string, data: Partial<Omit<Room, 'id' | 'image'>>) => {
    const response = await axios.put(`/api/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: string) => {
    const response = await axios.delete(`/api/rooms/${id}`);
    return response.data;
  },
};
