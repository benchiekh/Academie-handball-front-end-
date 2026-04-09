import React, { useState, useEffect } from 'react';
import { Player, Payment } from '../types';
import { paymentsAPI } from '../services/api';

interface AddMonthlyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentAdded: () => void;
  month: string;
  existingPlayers: Player[];
}

const AddMonthlyPaymentModal: React.FC<AddMonthlyPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentAdded,
  month,
  existingPlayers
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Réinitialiser le formulaire
      setSelectedPlayerId(0);
      setPaymentDate('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlayerId) {
      alert('Veuillez sélectionner un joueur');
      return;
    }

    setIsLoading(true);
    try {
      // Déterminer le statut selon si une date de paiement est fournie
      const isPaid = paymentDate && paymentDate.trim() !== '';
      
      // Créer un nouveau paiement pour le joueur existant
      await paymentsAPI.create({
        playerId: selectedPlayerId,
        type: 'monthly',
        amount: 50,
        dueDate: new Date().toISOString().split('T')[0],
        status: isPaid ? 'paid' : 'pending',
        description: `Mensualité ${month}${isPaid ? ' - Payé' : ' - En attente'}`,
        paymentDate: isPaid ? paymentDate : undefined
      });

      onPaymentAdded();
      onClose();
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Erreur lors de l\'ajout du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Ajouter Paiement - {month}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionner un joueur
              </label>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Choisir un joueur...</option>
                {existingPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.firstName} {player.lastName} 
                    {player.parent ? ` (${player.parent.firstName} ${player.parent.lastName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de paiement <span className="text-gray-400">(optionnel)</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Si aucune date n'est spécifiée, le paiement sera marqué comme "En attente"
              </p>
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Ajout...' : 'Ajouter Paiement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMonthlyPaymentModal;
