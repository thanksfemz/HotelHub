
import axios from '@/lib/axios';
import type { Payment, PaymentFilters, CreatePaymentRequest, RefundRequest, PaymentSummary } from '@/lib/types/payment';
import { format } from 'date-fns';

export const paymentService = {
  getPayments: async (filters?: Partial<PaymentFilters>): Promise<Payment[]> => {
    let params: Record<string, any> = {};

    if (filters?.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    if (filters?.method && filters.method !== 'all') {
      params.method = filters.method;
    }
    if (filters?.dateRange?.from) {
      params.from = format(filters.dateRange.from, 'yyyy-MM-dd');
    }
    if (filters?.dateRange?.to) {
      params.to = format(filters.dateRange.to, 'yyyy-MM-dd');
    }

    const response = await axios.get('/payments', { params });
    return response.data;
  },

  getPayment: async (id: string): Promise<Payment> => {
    const response = await axios.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await axios.post('/payments', data);
    return response.data;
  },

  getBookingPayments: async (bookingId: string): Promise<Payment[]> => {
    const response = await axios.get(`/payments/booking/${bookingId}`);
    return response.data;
  },

  refundPayment: async (id: string, refundData: RefundRequest): Promise<{ message: string }> => {
    const response = await axios.post(`/payments/${id}/refund`, refundData);
    return response.data;
  },

  getSummary: async (): Promise<PaymentSummary> => {
    const response = await axios.get('/payments/summary');
    return response.data;
  },
};
