
export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Refunded';


export interface Booking {
  id: string;
  bookingNumber: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: BookingStatus;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  specialRequests?: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
    status?: Booking['status'];
}


export interface BookingFilters {
  status?: 'all' | Booking['status'];
  paymentStatus?: 'all' | Booking['paymentStatus'];
  dateRange?: { from?: Date; to?: Date };
  guest?: string;
  roomId?: string;
  search?: string;
}
