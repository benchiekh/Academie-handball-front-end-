import React, { useState } from 'react';
import { playersAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface PlayerFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  position: string;
}

interface AddPlayerFormProps {
  onPlayerAdded: () => void;
  onCancel: () => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onPlayerAdded, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PlayerFormData>({
    firstName: '',
    lastName: '',
    birthDate: new Date().toISOString().split('T')[0],
    height: 0,
    weight: 0,
    position: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!user?.id) {
        setError('Utilisateur non connecté');
        return;
      }
      
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        height: formData.height,
        weight: formData.weight,
        position: formData.position,
        parentId: user.id,
        birthDate: formData.birthDate,
      };
      await playersAPI.create(payload);
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: new Date().toISOString().split('T')[0],
        height: 0,
        weight: 0,
        position: '',
      });
      onPlayerAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du joueur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full z-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un joueur</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Taille (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                min="100"
                max="250"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Poids (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                min="20"
                max="150"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionner une position</option>
                <option value="Gardien">Gardien</option>
                <option value="Ailier gauche">Ailier gauche</option>
                <option value="Ailier droit">Ailier droit</option>
                <option value="Arrière gauche">Arrière gauche</option>
                <option value="Arrière droit">Arrière droit</option>
                <option value="Demi-centre">Demi-centre</option>
                <option value="Pivot">Pivot</option>
                <option value="Avant-centre">Avant-centre</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerForm;
