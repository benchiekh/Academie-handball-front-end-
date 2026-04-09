import React, { useState, useEffect } from 'react';
import { playersAPI, usersAPI } from '../services/api';
import { User, Player } from '../types';

interface PlayerFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  position: string;
  parentId: number;
}

interface AddPlayerAdminFormProps {
  onPlayerAdded: () => void;
  onCancel: () => void;
}

const AddPlayerAdminForm: React.FC<AddPlayerAdminFormProps> = ({ onPlayerAdded, onCancel }) => {
  const [formData, setFormData] = useState<PlayerFormData>({
    firstName: '',
    lastName: '',
    birthDate: new Date().toISOString().split('T')[0],
    height: 0,
    weight: 0,
    position: '',
    parentId: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [parents, setParents] = useState<User[]>([]);

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    try {
      const users = await usersAPI.findAll();
      const parentUsers = users.filter(user => user.role === 'parent');
      setParents(parentUsers);
    } catch (err) {
      console.error('Error loading parents:', err);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'birthDate' ? value : (name === 'parentId' ? Number(value) : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.parentId) {
        setError('Veuillez sélectionner un parent');
        return;
      }
      
      await playersAPI.createAdmin(formData);
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: new Date().toISOString().split('T')[0],
        height: 0,
        weight: 0,
        position: '',
        parentId: 0,
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
        <div className="max-w-2xl w-full space-y-6 bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un joueur (Admin)</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700">Parent</label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner un parent</option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.firstName} {parent.lastName}
                    </option>
                  ))}
                </select>
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

export default AddPlayerAdminForm;
