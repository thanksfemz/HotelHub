
import axios from '@/lib/axios';
import type { DashboardStats, OccupancyReport, RevenueReport } from '@/lib/types/report';

export const reportService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/api/reports/dashboard-stats');
    return response.data;
  },

  getOccupancyReport: async (startDate: Date, endDate: Date): Promise<OccupancyReport> => {
    const response = await axios.get(`/api/reports/occupancy`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }
    });
    return response.data;
  },

  getRevenueReport: async (startDate: Date, endDate: Date): Promise<RevenueReport> => {
    const response = await axios.get(`/api/reports/revenue`, {
       params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }
    });
    return response.data;
  },
};
