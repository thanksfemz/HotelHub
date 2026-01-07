
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentDate: string;
  notes?: string;
  createdBy: string; // User ID
  createdAt: string;
  guestName?: string; // Denormalized
}

export interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
  createdBy: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
}

export interface PaymentFilters {
  method?: 'all' | PaymentMethod;
  status?: 'all' | PaymentStatus;
  dateRange?: { from?: Date; to?: Date };
  bookingId?: string;
}
