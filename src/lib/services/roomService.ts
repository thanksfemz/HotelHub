
import axios from '@/lib/axios';
import type { Room, RoomFilters, CreateRoomRequest, UpdateRoomRequest } from '@/lib/types/room';

export const roomService = {
  getRooms: async (filters?: Partial<RoomFilters>): Promise<Room[]> => {
    const response = await axios.get('/rooms', { params: filters });
    return response.data;
  },
  
  getRoom: async (id: string): Promise<Room> => {
    const response = await axios.get(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (data: CreateRoomRequest): Promise<Room> => {
    const response = await axios.post('/rooms', data);
    return response.data;
  },

  updateRoom: async (id: string, data: UpdateRoomRequest): Promise<Room> => {
    const response = await axios.put(`/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/rooms/${id}`);
    return response.data;
  },
};
