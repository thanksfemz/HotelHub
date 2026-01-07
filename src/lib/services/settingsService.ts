
import axios from '@/lib/axios';
import type { AppSettings, UpdateSettingsRequest } from '@/lib/types/settings';

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    const response = await axios.get('/api/settings');
    return response.data;
  },

  updateSettings: async (data: UpdateSettingsRequest): Promise<AppSettings> => {
    const response = await axios.put('/api/settings', data);
    return response.data;
  },
};
