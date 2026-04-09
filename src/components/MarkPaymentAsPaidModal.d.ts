import React from 'react';
import { Payment } from '../types';
interface MarkPaymentAsPaidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentUpdated: () => void;
    payment: Payment | null;
}
declare const MarkPaymentAsPaidModal: React.FC<MarkPaymentAsPaidModalProps>;
export default MarkPaymentAsPaidModal;
