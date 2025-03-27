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
  updateAfterGeneration: () => void;
}

const DEFAULT_USAGE: UsageStats = {
  current: 0,
  limit: 0,
  remaining: 0
};

export const useUsageStore = create<UsageState>((set, get) => ({
  usage: null,
  isLoading: false,
  error: null,
  hasLimitReached: false,
  
  fetchUsage: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await apiService.usage.getStats();
      
      if (result.success && result.data) {
        const usage = result.data;
        
        // Ensure the values are valid numbers
        const validatedUsage = {
          current: typeof usage.current === 'number' ? usage.current : 0,
          limit: typeof usage.limit === 'number' ? usage.limit : 0,
          remaining: typeof usage.remaining === 'number' ? usage.remaining : 0
        };
        
        set({ 
          usage: validatedUsage, 
          isLoading: false,
          hasLimitReached: validatedUsage.remaining <= 0
        });
      } else {
        console.error('Failed to fetch usage stats:', result.error);
        set({ 
          error: result.error || 'Failed to fetch usage statistics', 
          isLoading: false,
          usage: DEFAULT_USAGE
        });
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      set({ 
        error: 'Failed to fetch usage statistics', 
        isLoading: false,
        usage: DEFAULT_USAGE
      });
    }
  },
  
  setUsage: (usage: UsageStats) => {
    // Validate and correct usage data
    const validatedUsage = {
      current: typeof usage.current === 'number' ? usage.current : 0,
      limit: typeof usage.limit === 'number' ? usage.limit : 0,
      remaining: typeof usage.remaining === 'number' ? usage.remaining : 0
    };
    
    set({ 
      usage: validatedUsage,
      hasLimitReached: validatedUsage.remaining <= 0
    });
  },
  
  resetUsage: () => {
    set({ 
      usage: null,
      isLoading: false,
      error: null,
      hasLimitReached: false
    });
  },
  
  updateAfterGeneration: () => {
    const { usage } = get();
    
    if (!usage) return;
    
    const updatedUsage: UsageStats = {
      ...usage,
      current: usage.current + 1,
      remaining: Math.max(0, usage.remaining - 1)
    };
    
    set({
      usage: updatedUsage,
      hasLimitReached: updatedUsage.remaining <= 0
    });
    
    console.log('Usage updated after generation:', updatedUsage);
  }
}));

export default useUsageStore; 