import { create } from 'zustand';
import apiService, { UsageStats } from '../lib/api/api.service';

interface UsageState {
  usage: UsageStats | null;
  isLoading: boolean;
  error: string | null;
  hasLimitReached: boolean;
  fetchUsage: () => Promise<void>;
  setUsage: (usage: UsageStats) => void;
  resetUsage: () => void;
}

const DEFAULT_USAGE: UsageStats = {
  current: 0,
  limit: 7,
  isPremium: false,
  remaining: 7
};

export const useUsageStore = create<UsageState>((set, get) => ({
  usage: null,
  isLoading: false,
  error: null,
  hasLimitReached: false,
  
  fetchUsage: async () => {
    try {
      set({ isLoading: true, error: null });
      const usage = await apiService.usage.getStats();
      set({ 
        usage, 
        isLoading: false,
        hasLimitReached: !usage.isPremium && usage.remaining <= 0
      });
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      set({ 
        error: 'Failed to fetch usage statistics', 
        isLoading: false,
        // Fallback to default usage if can't fetch
        usage: DEFAULT_USAGE
      });
    }
  },
  
  setUsage: (usage: UsageStats) => {
    set({ 
      usage,
      hasLimitReached: !usage.isPremium && usage.remaining <= 0
    });
  },
  
  resetUsage: () => {
    set({ 
      usage: null,
      isLoading: false,
      error: null,
      hasLimitReached: false
    });
  }
}));

export default useUsageStore; 