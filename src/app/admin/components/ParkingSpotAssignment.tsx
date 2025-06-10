'use client';

import { ParkingSpot, User } from '@prisma/client';
import { useState } from 'react';

interface ParkingSpotAssignmentProps {
  spot: ParkingSpot;
  users: User[];
  onAssignmentUpdated: () => void;
}

export default function ParkingSpotAssignment({ spot, users, onAssignmentUpdated }: ParkingSpotAssignmentProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(spot.assignedToId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssignment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/parking-spots/${spot.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedUserId || null }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      onAssignmentUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Assignation de la place {spot.number}</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
            Utilisateur assigné
          </label>
          <select
            id="user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Aucun utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssignment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mise à jour en cours...' : 'Mettre à jour l\'assignation'}
        </button>
      </div>
    </div>
  );
} 