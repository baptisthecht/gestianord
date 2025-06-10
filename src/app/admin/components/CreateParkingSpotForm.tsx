'use client';

import { useState } from 'react';

interface CreateParkingSpotFormProps {
  onSpotCreated: () => void;
}

export default function CreateParkingSpotForm({ onSpotCreated }: CreateParkingSpotFormProps) {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parking-spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setNumber('');
      onSpotCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Créer une nouvelle place de parking</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de place
          </label>
          <input
            type="text"
            id="number"
            required
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création en cours...' : 'Créer la place'}
        </button>
      </form>
    </div>
  );
} 