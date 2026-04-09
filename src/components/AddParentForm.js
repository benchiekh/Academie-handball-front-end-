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
const AddParentForm = ({ onParentAdded }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [childData, setChildData] = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        birthDate: new Date().toISOString().split('T')[0],
        height: 0,
        weight: 0,
        position: '',
        isActive: true,
    });
    const [paymentData, setPaymentData] = (0, react_1.useState)({
        paymentDate: '',
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [usernameError, setUsernameError] = (0, react_1.useState)('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'username') {
            setUsernameError('');
            setError('');
        }
    };
    const handleChildChange = (e) => {
        const { name, value } = e.target;
        setChildData(prev => ({
            ...prev,
            [name]: name === 'height' || name === 'weight' ? Number(value) :
                name === 'isActive' ? value === 'true' || value === true : value,
        }));
    };
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('=== handleSubmit started ===');
        setIsLoading(true);
        setError('');
        try {
            console.log('Creating parent with data:', formData);
            const parent = await api_1.usersAPI.create({
                ...formData,
                role: 'parent',
            });
            console.log('Parent created successfully:', parent);
            console.log('Creating child with parent ID:', parent.id);
            console.log('Child data:', childData);
            const child = await api_1.playersAPI.createAdmin({
                ...childData,
                parentId: Number(parent.id),
                paymentDate: paymentData.paymentDate || undefined,
            });
            console.log('Child created:', child);
            setFormData({
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
            });
            setChildData({
                firstName: '',
                lastName: '',
                birthDate: new Date().toISOString().split('T')[0],
                height: 0,
                weight: 0,
                position: '',
                isActive: true,
            });
            setPaymentData({
                paymentDate: '',
            });
            setUsernameError('');
            setTimeout(() => {
                onParentAdded();
            }, 1000);
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'ajout du parent et de l\'enfant';
            if (errorMessage.includes('déjà pris') || errorMessage.includes('already taken')) {
                setUsernameError('Ce nom d\'utilisateur est déjà utilisé');
            }
            else {
                setError(errorMessage);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Parent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required className={`mt-1 block w-full border rounded-md px-3 py-2 ${usernameError ? 'border-red-300' : 'border-gray-300'}`}/>
                {usernameError && (<p className="text-red-600 text-sm mt-1">{usernameError}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Enfant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" name="firstName" value={childData.firstName} onChange={handleChildChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" name="lastName" value={childData.lastName} onChange={handleChildChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input type="date" name="birthDate" value={childData.birthDate} onChange={handleChildChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Taille (cm)</label>
                <input type="number" name="height" value={childData.height} onChange={handleChildChange} required min="50" max="250" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Poids (kg)</label>
                <input type="number" name="weight" value={childData.weight} onChange={handleChildChange} required min="20" max="200" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select name="position" value={childData.position} onChange={handleChildChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
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
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Paiement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de paiement</label>
                <input type="date" name="paymentDate" value={paymentData.paymentDate} onChange={handlePaymentChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Laissez vide si non payé"/>
                <p className="text-xs text-gray-500 mt-1">Laissez ce champ vide si le paiement n'a pas encore été effectué</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Un paiement mensuel sera créé pour l'enfant. Si vous remplissez la date de paiement, il sera marqué comme payé.
          </p>
        </div>

        {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>)}

        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {isLoading ? 'Ajout en cours...' : 'Ajouter le parent et son enfant'}
          </button>
        </div>
      </form>
    </div>);
};
exports.default = AddParentForm;
//# sourceMappingURL=AddParentForm.js.map