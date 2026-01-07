

import type { Guest } from './guest';
import type { Room } from './room';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED';


export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  numberOfGuests: number;
  status: BookingStatus;
  totalAmount: number;
  specialRequests?: string;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;

  // Denormalized data for easier display
  guestName: string;
  roomNumber: string;
  paymentStatus?: PaymentStatus;
}

export interface CreateBookingRequest {
  guest: Guest;
  dates: { from: Date, to: Date };
  room: Room;
  notes?: string;
  total: number;
}

export interface UpdateBookingRequest extends Partial<Omit<CreateBookingRequest, 'guest' | 'room' | 'dates'>> {
    status?: BookingStatus;
    actualCheckIn?: string;
    actualCheckOut?: string;
    guest?: Guest;
    room?: Room;
    dates?: { from: Date; to: Date };
}


export interface BookingFilters {
  status: 'all' | BookingStatus;
  dateRange: { from?: Date; to?: Date };
  guest: string;
  limit?: number;
}
