import React, { useState, useEffect } from 'react';
import { Payment } from '../types';
import { paymentsAPI } from '../services/api';

interface MarkPaymentAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentUpdated: () => void;
  payment: Payment | null;
}

const MarkPaymentAsPaidModal: React.FC<MarkPaymentAsPaidModalProps> = ({
  isOpen,
  onClose,
  onPaymentUpdated,
  payment
}) => {
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && payment) {
      // Pré-remplir avec la date du jour
      setPaymentDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payment || !paymentDate) {
      alert('Veuillez sélectionner une date de paiement');
      return;
    }

    setIsLoading(true);
    try {
      // Mettre à jour le paiement
      await paymentsAPI.update(payment.id, {
        status: 'paid',
        paymentDate: paymentDate
      });

      onPaymentUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Erreur lors de la mise à jour du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Marquer comme Payé
          </h3>
          
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-700">
              <strong>Joueur:</strong> {payment.player?.firstName} {payment.player?.lastName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Montant:</strong> {payment.amount}¢
            </p>
            <p className="text-sm text-gray-700">
              <strong>Description:</strong> {payment.description}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de paiement
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Mise à jour...' : 'Marquer comme Payé'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarkPaymentAsPaidModal;
