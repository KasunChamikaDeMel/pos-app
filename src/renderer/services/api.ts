import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    console.log('authAPI.login called with:', username, password);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: { search?: string; category?: string }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (product: any) => {
    const response = await api.post('/products', product);
    return response.data;
  },
  update: async (id: number, product: any) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Sales API
export const salesAPI = {
  getAll: async (params?: { start_date?: string; end_date?: string; limit?: number }) => {
    const response = await api.get('/sales', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },
  create: async (sale: any) => {
    const response = await api.post('/sales', sale);
    return response.data;
  },
};

// Customers API
export const customersAPI = {
  getAll: async (params?: { search?: string }) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },
  create: async (customer: any) => {
    const response = await api.post('/customers', customer);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default api;
