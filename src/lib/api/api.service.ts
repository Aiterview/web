import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../store/authStore';

// Interface de estatísticas de uso
export interface UsageStats {
  current: number;
  limit: number;
  isPremium: boolean;
  remaining: number;
}

// Create a base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle specific error status codes
    if (error.response) {
      const { status } = error.response;
      
      // Unauthorized - token issue
      if (status === 401) {
        console.error('Authentication error. Please login again.');
      }
      
      // Forbidden
      if (status === 403) {
        console.error('You do not have permission to perform this action.');
      }
      
      // Server error
      if (status >= 500) {
        console.error('Server error. Please try again later.');
      }
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Questions API
  questions: {
    /**
     * Generate interview questions based on job type and requirements
     */
    generate: async (jobType: string, requirements: string, numberOfQuestions: number = 5) => {
      try {
        const response = await api.post('/api/questions/generate', {
          jobType,
          requirements,
          numberOfQuestions
        });
        
        return response.data;
      } catch (error) {
        console.error('Failed to generate questions:', error);
        throw error;
      }
    }
  },
  
  // Usage API
  usage: {
    /**
     * Get usage statistics for the current user
     */
    getStats: async (): Promise<UsageStats> => {
      try {
        const response = await api.get('/api/usage/stats');
        return response.data.data;
      } catch (error) {
        console.error('Failed to get usage stats:', error);
        throw error;
      }
    }
  },
  
  // For future API endpoints
  practice: {
    // ...
  },
  
  // Generic request method
  request: async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

export default apiService; 