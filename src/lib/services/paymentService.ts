import axios from '@/lib/axios';
import type { Payment, PaymentFilters } from '../types';

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
      params.from = filters.dateRange.from.toISOString();
    }
    if (filters?.dateRange?.to) {
      params.to = filters.dateRange.to.toISOString();
    }

    const response = await axios.get('/api/payments', { params });
    return response.data;
  },

  getPayment: async (id: string): Promise<Payment> => {
    const response = await axios.get(`/api/payments/${id}`);
    return response.data;
  },

  createPayment: async (data: any) => {
    const response = await axios.post('/api/payments', data);
    return response.data;
  },

  getBookingPayments: async (bookingId: string): Promise<Payment[]> => {
    const response = await axios.get(`/api/payments/booking/${bookingId}`);
    return response.data;
  },

  refundPayment: async (id: string, refundData: { amount: number; reason: string }) => {
    const response = await axios.post(`/api/payments/${id}/refund`, refundData);
    return response.data;
  },

  getSummary: async () => {
    const response = await axios.get('/api/payments/summary');
    return response.data;
  },
};
