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
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded';

export type Booking = {
  id: string;
  guestName: string;
  guestId: string;
  roomNumber: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
};

export type Guest = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    idProofType?: 'Passport' | 'DriversLicense' | 'NationalID';
    idProofNumber?: string;
    totalBookings?: number;
    totalSpent?: number;
    lastVisit?: string;
};


export type RoomFilters = {
    search: string;
    type: 'all' | RoomType;
    status: 'all' | RoomStatus;
    minPrice: string;
    maxPrice: string;
};

export type BookingFilters = {
  status: 'all' | BookingStatus;
  dateRange: { from?: Date; to?: Date };
  guest: string;
};

export type GuestFilters = {
    search: string;
};

export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
export type PaymentStatusAPI = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export type Payment = {
  id: string;
  bookingId: string;
  guestName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatusAPI;
  date: string;
  transactionId?: string;
};

export type PaymentFilters = {
  method: 'all' | PaymentMethod;
  status: 'all' | PaymentStatusAPI;
  dateRange: { from?: Date; to?: Date };
};
