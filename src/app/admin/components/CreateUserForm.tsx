'use client';

import { useState } from 'react';

interface CreateUserFormProps {
  onUserCreated: () => void;
}

export default function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUserPassword, setNewUserPassword] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNewUserPassword(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      setNewUserPassword(data.plainPassword);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'USER',
      });
      onUserCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Créer un nouvel utilisateur</h3>
      
      {newUserPassword && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 font-medium">Utilisateur créé avec succès !</p>
          <p className="text-sm text-green-600 mt-2">
            Mot de passe généré : <span className="font-mono">{newUserPassword}</span>
          </p>
          <p className="text-sm text-red-600 mt-2">
            Important : Copiez ce mot de passe, il ne sera plus visible après !
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création en cours...' : 'Créer l\'utilisateur'}
        </button>
      </form>
    </div>
  );
} 