import axios from 'axios';
import { LoginCredentials, LoginResponse, User, Player, Payment, CreatePlayerDto, CreatePaymentDto, Stats } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.post('/auth/profile');
    return response.data;
  },
};

export const usersAPI = {
  create: async (userData: any): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  createParent: async (parentData: any): Promise<User> => {
    const response = await api.post('/users/parent', parentData);
    return response.data;
  },
  
  findAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  
  findOne: async (id: number): Promise<User> => {
    const response = await api.get(`/users/profile/${id}`);
    return response.data;
  },
  
  update: async (id: number, userData: any): Promise<User> => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },
  
  remove: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export const playersAPI = {
  create: async (playerData: CreatePlayerDto): Promise<Player> => {
    const response = await api.post('/players/my-player', playerData);
    return response.data;
  },
  
  createAdmin: async (playerData: CreatePlayerDto): Promise<Player> => {
    const response = await api.post('/players', playerData);
    return response.data;
  },
  
  findAll: async (): Promise<Player[]> => {
    const response = await api.get('/players');
    return response.data;
  },
  
  findMyPlayers: async (): Promise<Player[]> => {
    const response = await api.get('/players/my-players');
    return response.data;
  },
  
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/players/stats');
    return response.data;
  },
  
  findOne: async (id: number): Promise<Player> => {
    const response = await api.get(`/players/${id}`);
    return response.data;
  },
  
  update: async (id: number, playerData: any): Promise<Player> => {
    const response = await api.patch(`/players/${id}`, playerData);
    return response.data;
  },
  
  remove: async (id: number): Promise<void> => {
    await api.delete(`/players/${id}`);
  },
};

export const paymentsAPI = {
  create: async (paymentData: CreatePaymentDto): Promise<Payment> => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  
  findAll: async (): Promise<Payment[]> => {
    const response = await api.get('/payments');
    return response.data;
  },
  
  findMyPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },
  
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/payments/stats');
    return response.data;
  },
  
  findByPlayer: async (playerId: number): Promise<Payment[]> => {
    const response = await api.get(`/payments/player/${playerId}`);
    return response.data;
  },
  
  findOne: async (id: number): Promise<Payment> => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  
  update: async (id: number, paymentData: any): Promise<Payment> => {
    const response = await api.patch(`/payments/${id}`, paymentData);
    return response.data;
  },
  
  markAsPaid: async (id: number): Promise<Payment> => {
    const response = await api.patch(`/payments/${id}/mark-paid`);
    return response.data;
  },
  
  remove: async (id: number): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },
};

export default api;
