import React, { useState } from 'react';
import { usersAPI, playersAPI } from '../services/api';

interface ParentFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ChildFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  position: string;
}

interface AddParentFormProps {
  onParentAdded: () => void;
}

interface ParentFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ChildFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  position: string;
  isActive: boolean;
}

interface PaymentFormData {
  paymentDate: string;
}

const AddParentForm: React.FC<AddParentFormProps> = ({ onParentAdded }) => {
  const [formData, setFormData] = useState<ParentFormData>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [childData, setChildData] = useState<ChildFormData>({
    firstName: '',
    lastName: '',
    birthDate: new Date().toISOString().split('T')[0],
    height: 0,
    weight: 0,
    position: '',
    isActive: true,
  });
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    paymentDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Réinitialiser l'erreur de username quand l'utilisateur modifie le champ
    if (name === 'username') {
      setUsernameError('');
      setError('');
    }
  };

  const handleChildChange = (e: any) => {
    const { name, value } = e.target;
    setChildData(prev => ({
      ...prev,
      [name]: name === 'height' || name === 'weight' ? Number(value) : 
             name === 'isActive' ? value === 'true' || value === true : value,
    }));
  };

  const handlePaymentChange = (e: any) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== handleSubmit started ===');
    setIsLoading(true);
    setError('');

    try {
      // Créer le parent
      console.log('Creating parent with data:', formData);
      const parent = await usersAPI.create({
        ...formData,
        role: 'parent',
      });
      
      console.log('Parent created successfully:', parent);

      // Créer l'enfant associé au parent
      console.log('Creating child with parent ID:', parent.id);
      console.log('Child data:', childData);
      
      const child = await playersAPI.createAdmin({
        ...childData,
        parentId: Number(parent.id), // Convertir en nombre
        paymentDate: paymentData.paymentDate || undefined, // Ajouter la date de paiement
      });
      
      console.log('Child created:', child);
      
      // Le paiement est maintenant créé automatiquement par le backend
      
      // Réinitialiser les formulaires
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
      
      // Forcer un rechargement des données après un délai plus long
      // pour s'assurer que le paiement est bien créé en base
      setTimeout(() => {
        onParentAdded();
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'ajout du parent et de l\'enfant';
      
      // Vérifier si c'est une erreur de username déjà pris
      if (errorMessage.includes('déjà pris') || errorMessage.includes('already taken')) {
        setUsernameError('Ce nom d\'utilisateur est déjà utilisé');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Parent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    usernameError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {usernameError && (
                  <p className="text-red-600 text-sm mt-1">{usernameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Enfant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={childData.firstName}
                  onChange={handleChildChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={childData.lastName}
                  onChange={handleChildChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input
                  type="date"
                  name="birthDate"
                  value={childData.birthDate}
                  onChange={handleChildChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Taille (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={childData.height}
                  onChange={handleChildChange}
                  required
                  min="50"
                  max="250"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Poids (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={childData.weight}
                  onChange={handleChildChange}
                  required
                  min="20"
                  max="200"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select
                  name="position"
                  value={childData.position}
                  onChange={handleChildChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
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
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentData.paymentDate}
                  onChange={handlePaymentChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Laissez vide si non payé"
                />
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Ajout en cours...' : 'Ajouter le parent et son enfant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParentForm;
