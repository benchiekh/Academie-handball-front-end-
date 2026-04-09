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
const AddChildModal = ({ isOpen, onClose, onChildAdded, parentId, parentName }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        birthDate: new Date().toISOString().split('T')[0],
        height: 0,
        weight: 0,
        position: '',
        isActive: true,
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'height' || name === 'weight' ? Number(value) : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:3001/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    ...formData,
                    parentId: parentId,
                }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la création de l\'enfant');
            }
            onChildAdded();
            onClose();
            setFormData({
                firstName: '',
                lastName: '',
                birthDate: new Date().toISOString().split('T')[0],
                height: 0,
                weight: 0,
                position: '',
                isActive: true,
            });
        }
        catch (error) {
            setError('Erreur lors de la création de l\'enfant');
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ajouter un enfant à {parentName}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Taille (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} required min="50" max="250" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Poids (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} required min="20" max="200" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <select name="position" value={formData.position} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Sélectionner une position</option>
                <option value="Gardien">Gardien</option>
                <option value="Arrière gauche">Arrière gauche</option>
                <option value="Arrière droit">Arrière droit</option>
                <option value="Demi-centre">Demi-centre</option>
                <option value="Ailier gauche">Ailier gauche</option>
                <option value="Ailier droit">Ailier droit</option>
                <option value="Pivot">Pivot</option>
              </select>
            </div>

            {error && (<div className="text-red-600 text-sm">{error}</div>)}

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                Annuler
              </button>
              <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                {isLoading ? 'Création...' : 'Ajouter l\'enfant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
};
exports.default = AddChildModal;
//# sourceMappingURL=AddChildModal.js.map