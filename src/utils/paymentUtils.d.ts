import { Player } from '../types';
export declare const calculatePaymentInfo: (player: Player) => {
    lastPaymentDate?: string;
    isPaidUpToDate: boolean;
    totalPaid: number;
    totalDue: number;
};
export declare const formatPaymentStatus: (player: Player) => string;
