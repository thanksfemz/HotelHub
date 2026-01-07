
import type { ImagePlaceholder } from './util';

export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Cleaning';
export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
  capacity: number;
  amenities: string[];
  image: ImagePlaceholder;
  description?: string;
  floor?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomRequest {
  roomNumber: string;
  type: Room['type'];
  status: Room['status'];
  price: number;
  capacity: number;
  amenities: string[];
  image?: string;
  description?: string;
  floor?: number;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

export interface RoomFilters {
  type?: 'all' | Room['type'];
  status?: 'all' | Room['status'];
  minPrice?: number | string;
  maxPrice?: number | string;
  capacity?: number;
  search?: string;
}
