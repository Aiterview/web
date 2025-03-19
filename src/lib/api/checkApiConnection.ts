import axios from 'axios';

/**
 * Utility to check if the API is reachable and operational
 * @returns Promise resolving to connection status
 */
export const checkApiConnection = async (): Promise<{
  isConnected: boolean;
  message: string;
  details?: unknown;
}> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    console.log(`Checking API connection to: ${apiUrl}/health`);
    
    const response = await axios.get(`${apiUrl}/health`, { 
      timeout: 5000 // 5 second timeout
    });
    
    if (response.status === 200 && response.data.status === 'ok') {
      return {
        isConnected: true,
        message: 'API connection successful',
        details: response.data
      };
    } else {
      return {
        isConnected: false,
        message: 'API returned unexpected response',
        details: response.data
      };
    }
  } catch (error) {
    console.error('API connection check failed:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return {
          isConnected: false,
          message: 'API server is not running or unreachable',
          details: error.message
        };
      } else if (error.response) {
        return {
          isConnected: false,
          message: `API server responded with status ${error.response.status}`,
          details: error.response.data
        };
      } else if (error.request) {
        return {
          isConnected: false,
          message: 'Request was made but no response received',
          details: error.message
        };
      }
    }
    
    return {
      isConnected: false,
      message: 'Failed to connect to API',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default checkApiConnection; 