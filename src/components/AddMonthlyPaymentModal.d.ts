import React from 'react';
import { Player } from '../types';
interface AddMonthlyPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentAdded: () => void;
    month: string;
    existingPlayers: Player[];
}
declare const AddMonthlyPaymentModal: React.FC<AddMonthlyPaymentModalProps>;
export default AddMonthlyPaymentModal;
