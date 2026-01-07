
import axios from '@/lib/axios';
import type { DashboardStats, OccupancyData, RevenueData } from '@/lib/types/report';

export const reportService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/api/reports/dashboard-stats');
    return response.data;
  },

  getOccupancyData: async (days: string): Promise<OccupancyData[]> => {
    const response = await axios.get(`/api/reports/occupancy?days=${days}`);
    return response.data;
  },

  getRevenueData: async (days: string): Promise<RevenueData[]> => {
    const response = await axios.get(`/api/reports/revenue?days=${days}`);
    return response.data;
  },
};
