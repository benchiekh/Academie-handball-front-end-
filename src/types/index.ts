export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'parent';
  createdAt: string;
  updatedAt: string;
  players?: Player[]; // Ajout de la propriété players
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  position: string;
  isActive: boolean;
  parent: User;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
  // Informations de paiement calculées
  lastPaymentDate?: string;
  isPaidUpToDate?: boolean;
  totalPaid?: number;
  totalDue?: number;
}

export interface Payment {
  id: number;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'monthly' | 'competition' | 'equipment';
  description?: string;
  player: Player;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreatePlayerDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  position: string;
  isActive?: boolean;
  parentId?: number;
  paymentDate?: string;
}

export interface CreatePaymentDto {
  amount: number;
  dueDate: string;
  status?: 'pending' | 'paid' | 'overdue';
  type: 'monthly' | 'competition' | 'equipment';
  description?: string;
  playerId: number;
  paymentDate?: string;
}

export interface Stats {
  total: number;
  active: number;
  inactive: number;
  totalRevenue?: number;
  paid?: number;
  pending?: number;
  overdue?: number;
}
