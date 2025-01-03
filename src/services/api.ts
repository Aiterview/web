import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Funções para rotas públicas
export const register = (data: { email: string, password: string }) => {
  return api.post('/api/auth/register', data);
};

export const login = (data: { email: string, password: string }) => {
  return api.post('/api/auth/login', data);
};

export const forgotPassword = (email: string) => {
  return api.post('/api/auth/forgot-password', { email });
};

export const oAuthCallback = async (code: string) => {  
    const response = await api.get(`/api/auth/oauth/callback?code=${code}`);
    return response.data;
};

// Funções para rotas protegidas
export const logout = () => {
  return api.post('/api/auth/logout');
};

export const getCurrentUser = () => {
  return api.get('/api/auth/me');
};

export const updatePassword = (data: string) => {
  return api.put('/api/auth/password', data);
};

export const refreshSession = (data: string) => {
  return api.post('/api/auth/refresh-session', data);
};

// Interceptor para adicionar token em requisições protegidas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;