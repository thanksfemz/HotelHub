
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

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
  guestName?: string;
  roomNumber?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Refunded';
}

export interface CreateBookingRequest {
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  specialRequests?: string;
  createdBy: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
    status?: BookingStatus;
    actualCheckIn?: string;
    actualCheckOut?: string;
}


export interface BookingFilters {
  status?: 'all' | BookingStatus;
  dateRange?: { from?: Date; to?: Date };
  guest?: string;
}
