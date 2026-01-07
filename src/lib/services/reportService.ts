import axios from '@/lib/axios';
import type { DashboardStats, OccupancyReport, RevenueReport } from '@/lib/types/report';
import { format } from 'date-fns';

export const reportService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/api/reports/dashboard-stats');
    return response.data;
  },

  getOccupancyData: async (period: string): Promise<any> => {
    // This is a placeholder. A real implementation would fetch data based on the period.
    const response = await reportService.getOccupancyReport(new Date(), new Date());
    return response.data;
  },

  getRevenueData: async (period: string): Promise<any> => {
    // This is a placeholder. A real implementation would fetch data based on the period.
    const response = await reportService.getRevenueReport(new Date(), new Date());
    return response.data;
  },

  getOccupancyReport: async (startDate: Date, endDate: Date): Promise<OccupancyReport> => {
    const response = await axios.get(`/api/reports/occupancy`, {
      params: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      }
    });
    return response.data;
  },

  getRevenueReport: async (startDate: Date, endDate: Date): Promise<RevenueReport> => {
    const response = await axios.get(`/api/reports/revenue`, {
       params: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      }
    });
    return response.data;
  },
};
