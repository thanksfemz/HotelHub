
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string | null;
  actualCheckOut?: string | null;
  numberOfGuests: number;
  status: BookingStatus;
  totalAmount: number;
  specialRequests?: string;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;

  // Denormalized data for easier display - can be added by frontend if needed
  guestName?: string;
  roomNumber?: string;
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED';
}

export interface CreateBookingRequest {
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  specialRequests?: string;
}

export interface UpdateBookingRequest extends Partial<Omit<CreateBookingRequest, 'guestId' | 'roomId'>> {
  status?: BookingStatus;
  actualCheckIn?: string;
  actualCheckOut?: string;
}

export interface BookingFilters {
  status: 'all' | BookingStatus;
  dateRange: { from?: Date; to?: Date };
  guest: string;
  limit?: number;
}
