
import type { ImagePlaceholder } from './util';

export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE' | 'PRESIDENTIAL';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';

export interface Room {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  status: RoomStatus;
  price: number;
  capacity: number;
  floorNumber: number;
  description: string;
  amenities: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  image: ImagePlaceholder;
}

export interface CreateRoomRequest {
  roomNumber: string;
  roomType: RoomType;
  status: RoomStatus;
  price: number;
  capacity: number;
  floorNumber: number;
  description: string;
  amenities: string[];
  imageUrl: string;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

export interface RoomFilters {
  type?: 'all' | RoomType;
  status?: 'all' | RoomStatus;
  minPrice?: number | string;
  maxPrice?: number | string;
  capacity?: number;
  search?: string;
}
