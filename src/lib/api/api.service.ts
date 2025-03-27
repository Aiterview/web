import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '../../store/authStore';
import { 
  CreditBalance, 
  CreditTransaction, 
  TransactionsResponse, 
  ICreditPackage, 
  PackagesResponse, 
  CheckoutResponse 
} from '../../types/credits';

// Usage statistics interface
export interface UsageStats {
  current: number;
  limit: number;
  isPremium: boolean;
  remaining: number;
}

interface ApiResponse<T> {
  success: boolean;
  status: number;
  data?: T;
  error?: string;
}

// Request registry to prevent duplicates
const requestRegistry = {
  activeRequests: new Map<string, boolean>(),
  
  // Register an active request
  registerRequest(endpoint: string, params: string): string {
    const requestKey = `${endpoint}:${params}`;
    console.log(`Registering API request: ${requestKey}`);
    this.activeRequests.set(requestKey, true);
    return requestKey;
  },
  
  // Check if a request is already active
  isRequestActive(endpoint: string, params: string): boolean {
    const requestKey = `${endpoint}:${params}`;
    return this.activeRequests.has(requestKey);
  },
  
  // Clear a completed request
  clearRequest(requestKey: string): void {
    console.log(`Clearing API request: ${requestKey}`);
    this.activeRequests.delete(requestKey);
  }
};

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
    generate: async (jobType: string, requirements: string, numberOfQuestions: number = 5): Promise<ApiResponse<any>> => {
      try {
        // Create a unique identifier for this request
        const paramsDigest = JSON.stringify({ jobType, requirements, numberOfQuestions });
        
        // Check if a duplicate request is already in progress
        if (requestRegistry.isRequestActive('/api/questions/generate', paramsDigest)) {
          console.warn('Duplicate question generation request detected and blocked');
          return {
            success: false,
            status: 429, // Too Many Requests
            error: 'A duplicate request is already in progress. Please wait.',
          };
        }
        
        // Register this request
        const requestKey = requestRegistry.registerRequest('/api/questions/generate', paramsDigest);
        
        try {
          const response = await api.post('/api/questions/generate', {
            jobType,
            requirements,
            numberOfQuestions,
            // Add a nonce to ensure uniqueness of request on the backend
            nonce: Date.now().toString() + Math.random().toString(36).substring(2, 15)
          });
          
          console.log('Raw API response:', response.data);
          
          return {
            success: true,
            status: response.status,
            data: response.data,
          };
        } finally {
          // Clear the request registration when completed
          requestRegistry.clearRequest(requestKey);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        
        return {
          success: false,
          status: axiosError.response?.status || 500,
          error: axiosError.message,
        };
      }
    }
  },
  
  // Usage API
  usage: {
    /**
     * Get usage statistics for the current user
     */
    getStats: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await api.get('/api/usage/stats');
        
        return {
          success: true,
          status: response.status,
          data: response.data,
        };
      } catch (error) {
        const axiosError = error as AxiosError;
        
        return {
          success: false,
          status: axiosError.response?.status || 500,
          error: axiosError.message,
        };
      }
    }
  },
  
  // Credits module
  credits: {
    /**
     * Search for the user's credit balance
     */
    getBalance: async (userId: string): Promise<CreditBalance> => {
      try {
        const response = await api.get(`/api/credits/balance/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching credit balance:', error);
        // Return a default object with zero balance
        return { balance: 0, userId };
      }
    },

    /**
     * Search for the user's transaction history
     */
    getTransactions: async (userId: string, limit: number = 10, page: number = 1): Promise<CreditTransaction[]> => {
      try {
        console.log(`Searching for transactions for: /api/credits/transactions/${userId} with params: limit=${limit}, page=${page}`);
        const response = await api.get(`/api/credits/transactions/${userId}`, {
          params: { limit, page }
        });
        
        // If the response is an array, return directly
        if (Array.isArray(response.data)) {
          return response.data;
        }
        
        // If the response is an object with a 'data' field, return that field
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        
        // If no recognized format is found, return an empty array
        console.error('Unrecognized response format:', response.data);
        return [];
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        return [];
      }
    },

    /**
     * Search for available packages for purchase
     */
    getPackages: async (): Promise<PackagesResponse> => {
      try {
        const response = await api.get('/api/credits/packages');
        return response.data;
      } catch (error) {
        console.error('Error fetching available packages:', error);
        // Return default packages in case of failure
        const defaultPackages = [
          { size: 1, unitPrice: 1.00 },
          { size: 5, unitPrice: 4.50},
          { size: 10, unitPrice: 8.00 },
          { size: 20, unitPrice: 14.00 }
        ];
        return { availablePackages: [1, 5, 10, 20], prices: defaultPackages };
      }
    },

    /**
     * Create a checkout session for credit purchase
     */
    createCheckoutSession: async (userId: string, customerEmail: string, packageSize: number): Promise<CheckoutResponse> => {
      try {
        const response = await api.post('/api/credits/checkout-session', {
          userId,
          customerEmail,
          packageSize
        });
        return response.data;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error; // Reject the promise so the component can handle the error
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
  },
  
  // Feedback API
  feedback: {
    /**
     * Analyze interview responses and provide feedback
     */
    analyze: async (interviewData: { questions: string[], answers: string[] }): Promise<ApiResponse<any>> => {
      try {
        // Create a unique identifier for this request
        const paramsDigest = JSON.stringify(interviewData);
        
        // Check if a duplicate request is already in progress
        if (requestRegistry.isRequestActive('/api/feedback/analyze', paramsDigest)) {
          console.warn('Duplicate feedback analysis request detected and blocked');
          return {
            success: false,
            status: 429, // Too Many Requests
            error: 'A duplicate request is already in progress. Please wait.',
          };
        }
        
        // Register this request
        const requestKey = requestRegistry.registerRequest('/api/feedback/analyze', paramsDigest);
        
        try {
          console.log('Sending feedback analysis request:', interviewData);
          
          const response = await api.post('/api/feedback/analyze', {
            ...interviewData,
            // Add a nonce to ensure uniqueness of request on the backend
            nonce: Date.now().toString() + Math.random().toString(36).substring(2, 15)
          });
          
          console.log('Raw feedback response:', response.data);
          
          // Validate the response format
          if (!response.data || !response.data.success || !response.data.data) {
            console.error('Invalid response format from feedback API:', response.data);
            return {
              success: false,
              status: response.status,
              error: 'Invalid response format from server',
            };
          }
          
          return {
            success: true,
            status: response.status,
            data: response.data.data,
          };
        } finally {
          // Clear the request registration when completed
          requestRegistry.clearRequest(requestKey);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error in feedback analysis:', axiosError);
        
        return {
          success: false,
          status: axiosError.response?.status || 500,
          error: axiosError.message,
        };
      }
    },
  },
};

export default apiService; 