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
const MarkPaymentAsPaidModal = ({ isOpen, onClose, onPaymentUpdated, payment }) => {
    const [paymentDate, setPaymentDate] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isOpen && payment) {
            setPaymentDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, payment]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!payment || !paymentDate) {
            alert('Veuillez sélectionner une date de paiement');
            return;
        }
        setIsLoading(true);
        try {
            await api_1.paymentsAPI.update(payment.id, {
                status: 'paid',
                paymentDate: paymentDate
            });
            onPaymentUpdated();
            onClose();
        }
        catch (error) {
            console.error('Error updating payment:', error);
            alert('Erreur lors de la mise à jour du paiement');
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!isOpen || !payment)
        return null;
    return (<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
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
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required/>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" disabled={isLoading}>
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50" disabled={isLoading}>
                {isLoading ? 'Mise à jour...' : 'Marquer comme Payé'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
};
exports.default = MarkPaymentAsPaidModal;
//# sourceMappingURL=MarkPaymentAsPaidModal.js.map