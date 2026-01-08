
import axios from '@/lib/axios';
import type { DashboardStats, OccupancyData, OccupancyReport, RevenueData, RevenueReport } from '@/lib/types/report';
import { format } from 'date-fns';

export const reportService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/reports/dashboard-stats');
    return response.data;
  },

  getOccupancyData: async (period: string): Promise<OccupancyData[]> => {
    const response = await axios.get('/reports/occupancy-data', { params: { period } });
    return response.data;
  },

  getRevenueData: async (period: string): Promise<RevenueData[]> => {
    const response = await axios.get('/reports/revenue-data', { params: { period } });
    return response.data;
  },

  getOccupancyReport: async (startDate: Date, endDate: Date): Promise<OccupancyReport> => {
    const response = await axios.get(`/reports/occupancy`, {
      params: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      }
    });
    return response.data;
  },

  getRevenueReport: async (startDate: Date, endDate: Date): Promise<RevenueReport> => {
    const response = await axios.get(`/reports/revenue`, {
       params: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      }
    });
    return response.data;
  },
};
