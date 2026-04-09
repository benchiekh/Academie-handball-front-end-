"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const api_1 = require("../services/api");
const AddMonthlyPaymentModal = ({ isOpen, onClose, onPaymentAdded, month, existingPlayers }) => {
    const [selectedPlayerId, setSelectedPlayerId] = (0, react_1.useState)(0);
    const [paymentDate, setPaymentDate] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setSelectedPlayerId(0);
            setPaymentDate('');
        }
    }, [isOpen]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlayerId) {
            alert('Veuillez sélectionner un joueur');
            return;
        }
        setIsLoading(true);
        try {
            const isPaid = paymentDate && paymentDate.trim() !== '';
            await api_1.paymentsAPI.create({
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
        }
        catch (error) {
            console.error('Error adding payment:', error);
            alert('Erreur lors de l\'ajout du paiement');
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
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
              <select value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                <option value="">Choisir un joueur...</option>
                {existingPlayers.map((player) => (<option key={player.id} value={player.id}>
                    {player.firstName} {player.lastName} 
                    {player.parent ? ` (${player.parent.firstName} ${player.parent.lastName})` : ''}
                  </option>))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de paiement <span className="text-gray-400">(optionnel)</span>
              </label>
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              <p className="text-xs text-gray-500 mt-1">
                Si aucune date n'est spécifiée, le paiement sera marqué comme "En attente"
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" disabled={isLoading}>
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={isLoading}>
                {isLoading ? 'Ajout...' : 'Ajouter Paiement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
};
exports.default = AddMonthlyPaymentModal;
//# sourceMappingURL=AddMonthlyPaymentModal.js.map