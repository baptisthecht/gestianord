'use client';

import { ParkingSpot, User } from '@prisma/client';
import { useState } from 'react';

type ParkingSpotWithUser = ParkingSpot & {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
};

interface ParkingSpotListProps {
  spots: ParkingSpotWithUser[];
  users: User[];
  onSpotUpdated: () => void;
}

export default function ParkingSpotList({ spots, users, onSpotUpdated }: ParkingSpotListProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDayToggle = async (spotId: string, day: string) => {
    setLoading(true);
    setError(null);

    try {
      const spot = spots.find(s => s.id === spotId);
      if (!spot) {
        throw new Error('Place non trouvée');
      }

      const response = await fetch(`/api/parking-spots/${spotId}/days`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day,
          value: !spot[day as keyof ParkingSpot],
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      onSpotUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numéro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigné à
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lundi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mardi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mercredi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jeudi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendredi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {spots.map((spot) => (
            <tr key={spot.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {spot.number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {spot.user ? `${spot.user.firstName} ${spot.user.lastName}` : '-'}
              </td>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDayToggle(spot.id, day)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      spot[day as keyof ParkingSpot]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {spot[day as keyof ParkingSpot] ? 'Disponible' : 'Indisponible'}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 