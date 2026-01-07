

export type PaymentMethod = 'Card' | 'Cash' | 'Bank Transfer' | 'UPI';
export type PaymentStatusAPI = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatusAPI;
  transactionId?: string;
  date: string;
  notes?: string;
  createdBy?: string; // User ID
  createdAt?: string;
  guestName?: string; // Denormalized
}

export interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
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
  status?: 'all' | PaymentStatusAPI;
  dateRange?: { from?: Date; to?: Date };
  bookingId?: string;
}

export interface PaymentSummary {
    totalRevenue: number;
    pendingPayments: number;
    totalRefunds: number;
}
