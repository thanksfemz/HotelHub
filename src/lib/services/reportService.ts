import axios from '@/lib/axios';

export const reportService = {
  getDashboardStats: async () => {
    // This is a mock implementation. In a real application, this would fetch data from a backend API.
    // I will create a mock API route for this.
    const response = await axios.get('/api/reports/dashboard-stats');
    return response.data;
  },

  getOccupancyData: async (days: string) => {
    const response = await axios.get(`/api/reports/occupancy?days=${days}`);
    return response.data;
  },

  getRevenueData: async (days: string) => {
    const response = await axios.get(`/api/reports/revenue?days=${days}`);
    return response.data;
  },
};
