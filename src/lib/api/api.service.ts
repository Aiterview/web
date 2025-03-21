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
        const response = await api.post('/api/questions/generate', {
          jobType,
          requirements,
          numberOfQuestions
        });
        
        console.log('Raw API response:', response.data);
        
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
  
  // Módulo de Créditos
  credits: {
    /**
     * Busca o saldo de créditos do usuário
     */
    getBalance: async (userId: string): Promise<CreditBalance> => {
      try {
        const response = await api.get(`/api/credits/balance/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar saldo de créditos:', error);
        // Retorna um objeto padrão com saldo zero
        return { balance: 0, userId };
      }
    },

    /**
     * Busca o histórico de transações do usuário
     */
    getTransactions: async (userId: string, limit: number = 10, page: number = 1): Promise<TransactionsResponse> => {
      try {
        const response = await api.get(`/api/credits/transactions/${userId}`, {
          params: { limit, page }
        });
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar histórico de transações:', error);
        // Retorna um objeto padrão com array vazio de transações
        return { data: [], total: 0, page, limit };
      }
    },

    /**
     * Busca os pacotes disponíveis para compra
     */
    getPackages: async (): Promise<PackagesResponse> => {
      try {
        const response = await api.get('/api/credits/packages');
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar pacotes disponíveis:', error);
        // Retorna pacotes padrão em caso de falha
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
     * Cria uma sessão de checkout para compra de créditos
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
        console.error('Erro ao criar sessão de checkout:', error);
        throw error; // Rejeita a promessa para que o componente possa lidar com o erro
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
        console.log('Sending feedback analysis request:', interviewData);
        const response = await api.post('/api/feedback/analyze', interviewData);
        
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