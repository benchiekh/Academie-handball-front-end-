import { LoginCredentials, LoginResponse, User, Player, Payment, CreatePlayerDto, CreatePaymentDto, Stats } from '../types';
declare const api: any;
export declare const authAPI: {
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    getProfile: () => Promise<User>;
};
export declare const usersAPI: {
    create: (userData: any) => Promise<User>;
    createParent: (parentData: any) => Promise<User>;
    findAll: () => Promise<User[]>;
    findOne: (id: number) => Promise<User>;
    update: (id: number, userData: any) => Promise<User>;
    remove: (id: number) => Promise<void>;
};
export declare const playersAPI: {
    create: (playerData: CreatePlayerDto) => Promise<Player>;
    createAdmin: (playerData: CreatePlayerDto) => Promise<Player>;
    findAll: () => Promise<Player[]>;
    findMyPlayers: () => Promise<Player[]>;
    getStats: () => Promise<Stats>;
    findOne: (id: number) => Promise<Player>;
    update: (id: number, playerData: any) => Promise<Player>;
    remove: (id: number) => Promise<void>;
};
export declare const paymentsAPI: {
    create: (paymentData: CreatePaymentDto) => Promise<Payment>;
    findAll: () => Promise<Payment[]>;
    findMyPayments: () => Promise<Payment[]>;
    getStats: () => Promise<Stats>;
    findByPlayer: (playerId: number) => Promise<Payment[]>;
    findOne: (id: number) => Promise<Payment>;
    update: (id: number, paymentData: any) => Promise<Payment>;
    markAsPaid: (id: number) => Promise<Payment>;
    remove: (id: number) => Promise<void>;
};
export default api;
