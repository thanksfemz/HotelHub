
import axios from '@/lib/axios';
import type { AppSettings, UpdateSettingsRequest } from '@/lib/types/settings';

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    const response = await axios.get('/settings');
    return response.data;
  },

  updateSettings: async (data: UpdateSettingsRequest): Promise<AppSettings> => {
    const response = await axios.put('/settings', data);
    return response.data;
  },
};
