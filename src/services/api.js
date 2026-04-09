"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsAPI = exports.playersAPI = exports.usersAPI = exports.authAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = 'http://localhost:3001';
const api = axios_1.default.create({
    baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
exports.authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.post('/auth/profile');
        return response.data;
    },
};
exports.usersAPI = {
    create: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },
    createParent: async (parentData) => {
        const response = await api.post('/users/parent', parentData);
        return response.data;
    },
    findAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    findOne: async (id) => {
        const response = await api.get(`/users/profile/${id}`);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await api.patch(`/users/${id}`, userData);
        return response.data;
    },
    remove: async (id) => {
        await api.delete(`/users/${id}`);
    },
};
exports.playersAPI = {
    create: async (playerData) => {
        const response = await api.post('/players/my-player', playerData);
        return response.data;
    },
    createAdmin: async (playerData) => {
        const response = await api.post('/players', playerData);
        return response.data;
    },
    findAll: async () => {
        const response = await api.get('/players');
        return response.data;
    },
    findMyPlayers: async () => {
        const response = await api.get('/players/my-players');
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/players/stats');
        return response.data;
    },
    findOne: async (id) => {
        const response = await api.get(`/players/${id}`);
        return response.data;
    },
    update: async (id, playerData) => {
        const response = await api.patch(`/players/${id}`, playerData);
        return response.data;
    },
    remove: async (id) => {
        await api.delete(`/players/${id}`);
    },
};
exports.paymentsAPI = {
    create: async (paymentData) => {
        const response = await api.post('/payments', paymentData);
        return response.data;
    },
    findAll: async () => {
        const response = await api.get('/payments');
        return response.data;
    },
    findMyPayments: async () => {
        const response = await api.get('/payments/my-payments');
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/payments/stats');
        return response.data;
    },
    findByPlayer: async (playerId) => {
        const response = await api.get(`/payments/player/${playerId}`);
        return response.data;
    },
    findOne: async (id) => {
        const response = await api.get(`/payments/${id}`);
        return response.data;
    },
    update: async (id, paymentData) => {
        const response = await api.patch(`/payments/${id}`, paymentData);
        return response.data;
    },
    markAsPaid: async (id) => {
        const response = await api.patch(`/payments/${id}/mark-paid`);
        return response.data;
    },
    remove: async (id) => {
        await api.delete(`/payments/${id}`);
    },
};
exports.default = api;
//# sourceMappingURL=api.js.map