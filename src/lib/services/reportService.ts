import axios from '@/lib/axios';

export const reportService = {
  getDashboardStats: async () => {
    // This is a mock implementation. In a real application, this would fetch data from a backend API.
    // I will create a mock API route for this.
    const response = await axios.get('/api/reports/dashboard-stats');
    return response.data;
  },
};
