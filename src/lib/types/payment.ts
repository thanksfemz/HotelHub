
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
export type PaymentStatusAPI = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface Payment {
  id: string;
  paymentNumber: string;
  bookingId: string;
  bookingNumber: string;
  guestId: string;
  guestName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatusAPI;
  transactionId?: string;
  date: string;
  notes?: string;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  method: Payment['method'];
  transactionId?: string;
  notes?: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
}

export interface PaymentFilters {
  method?: 'all' | Payment['method'];
  status?: 'all' | Payment['status'];
  dateRange?: { from?: Date; to?: Date };
  bookingId?: string;
}
