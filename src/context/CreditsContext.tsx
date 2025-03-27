import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import apiService from '../lib/api/api.service';
import { useAuthStore } from '../store/authStore';

// Interface for user credits
interface CreditsState {
  balance: number;
  isLoading: boolean;
  error: string | null;
  hasCredits: boolean;
}

// Interface for the context
interface CreditsContextType {
  credits: CreditsState;
  fetchCredits: () => Promise<void>;
  updateCreditsAfterUse: () => void;
  resetCredits: () => void;
}

// Default values
const defaultCreditsState: CreditsState = {
  balance: 0,
  isLoading: false,
  error: null,
  hasCredits: false
};

// Creating the context
const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

// Provider component
export const CreditsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<CreditsState>(defaultCreditsState);
  const { user, isAuthenticated } = useAuthStore();

  // Function to fetch user credits
  const fetchCredits = useCallback(async () => {
    // Evitar múltiplas chamadas simultâneas
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
          hasCredits: false
        });
        return;
      }
      
      // Adicionar timeout para evitar chamadas infinitas
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
        hasCredits: (creditBalance.balance || 0) > 0
      });
      
      console.log('Updated credits:', creditBalance.balance);
      
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      setCredits(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch credit information',
        balance: prev.balance // Mantém o balanço anterior em caso de erro
      }));
    }
  }, [isAuthenticated, user?.id, credits.isLoading]);

  // Function to update credits after use
  const updateCreditsAfterUse = useCallback(() => {
    setCredits(prev => {
      const newBalance = Math.max(0, prev.balance - 1);
      return {
        ...prev,
        balance: newBalance,
        hasCredits: newBalance > 0
      };
    });
  }, []);

  // Function to reset credits
  const resetCredits = useCallback(() => {
    setCredits(defaultCreditsState);
  }, []);

  // Fetch credits when the component mounts or when the user changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCredits();
    } else {
      resetCredits();
    }
  }, [isAuthenticated, user?.id, fetchCredits, resetCredits]);

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