import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import apiService from '../lib/api/api.service';
import { useAuthStore } from '../store/authStore';

// Interface for user credits
interface CreditsState {
  balance: number;
  isLoading: boolean;
  error: string | null;
  hasCredits: boolean;
  lastUpdated: number | null;
}

// Interface for the context
interface CreditsContextType {
  credits: CreditsState;
  fetchCredits: (forceUpdate?: boolean) => Promise<void>;
  updateCreditsAfterUse: () => void;
  resetCredits: () => void;
}

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;

// Default values
const defaultCreditsState: CreditsState = {
  balance: 0,
  isLoading: false,
  error: null,
  hasCredits: false,
  lastUpdated: null
};

// Creating the context
const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

// Provider component
export const CreditsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<CreditsState>(defaultCreditsState);
  const { user, isAuthenticated } = useAuthStore();

  // Function to fetch user credits
  const fetchCredits = useCallback(async (forceUpdate = false) => {
    // Check if the cached data is still valid
    const cacheIsValid = credits.lastUpdated && 
                        (Date.now() - credits.lastUpdated < CACHE_EXPIRATION_TIME);
    
    // If the cache is valid and we're not forcing an update, use the cached data
    if (cacheIsValid && !forceUpdate) {
      console.log('Using cached credits data, last updated:', new Date(credits.lastUpdated as number).toLocaleTimeString());
      return;
    }
    
    // Avoid multiple simultaneous calls
    if (credits.isLoading) {
      console.log('Credits fetch already in progress, skipping...');
      return;
    }
    
    try {
      setCredits(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (!isAuthenticated || !user?.id) {
        setCredits({
          balance: 0,
          isLoading: false,
          error: 'User not authenticated',
          hasCredits: false,
          lastUpdated: Date.now()
        });
        return;
      }
      
      // Add timeout to avoid infinite calls
      const creditBalance = await Promise.race([
        apiService.credits.getBalance(user.id),
        new Promise<{ balance: 0, userId: string }>((_, reject) => 
          setTimeout(() => reject(new Error('Credits fetch timeout')), 5000)
        )
      ]);
      
      setCredits({
        balance: creditBalance.balance || 0,
        isLoading: false,
        error: null,
        hasCredits: (creditBalance.balance || 0) > 0,
        lastUpdated: Date.now()
      });
      
      console.log('Updated credits:', creditBalance.balance, 'at', new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      setCredits(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch credit information',
        balance: prev.balance // Keep the previous balance in case of error
      }));
    }
  }, [isAuthenticated, user?.id, credits.isLoading, credits.lastUpdated]);

  // Function to update credits after use
  const updateCreditsAfterUse = useCallback(() => {
    setCredits(prev => {
      const newBalance = Math.max(0, prev.balance - 1);
      return {
        ...prev,
        balance: newBalance,
        hasCredits: newBalance > 0,
        lastUpdated: Date.now() // Update the timestamp when credits are used
      };
    });
  }, []);

  // Function to reset credits
  const resetCredits = useCallback(() => {
    setCredits(defaultCreditsState);
  }, []);

  // Fetch credits only when needed
  useEffect(() => {
    if (isAuthenticated && (!credits.lastUpdated || credits.balance === 0)) {
      fetchCredits();
    } else if (!isAuthenticated) {
      resetCredits();
    }
  }, [isAuthenticated, user?.id, fetchCredits, resetCredits, credits.lastUpdated, credits.balance]);

  // Context value
  const contextValue: CreditsContextType = {
    credits,
    fetchCredits,
    updateCreditsAfterUse,
    resetCredits
  };

  return (
    <CreditsContext.Provider value={contextValue}>
      {children}
    </CreditsContext.Provider>
  );
};

// Hook to use the context
export const useCredits = (): CreditsContextType => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}; 