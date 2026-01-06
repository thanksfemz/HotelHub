import type { LucideIcon } from 'lucide-react';
import type { ImagePlaceholder } from './placeholder-images';

export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Cleaning';
export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe';

export type Room = {
  id: string;
  roomNumber: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
  capacity: number;
  amenities: string[];
  image: ImagePlaceholder;
};

export type Amenity = {
  icon: LucideIcon;
  name: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  rating: number;
  image: ImagePlaceholder;
};

export type OccupancyData = {
  date: string;
  occupancy: number;
};

export type RevenueData = {
  date: string;
  revenue: number;
};

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';

export type Booking = {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  amount: number;
};

export type RoomFilters = {
    search: string;
    type: 'all' | RoomType;
    status: 'all' | RoomStatus;
    minPrice: string;
    maxPrice: string;
};
