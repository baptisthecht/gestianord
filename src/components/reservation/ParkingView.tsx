'use client';

import { useEffect, useState } from 'react';

interface ParkingSpot {
  id: number;
  number: string;
  isOccupied: boolean;
  isSelected: boolean;
}

interface ParkingViewProps {
  onSpotSelect: (spotId: number) => void;
}

export default function ParkingView({ onSpotSelect }: ParkingViewProps) {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/parking-spots');
        const data = await response.json();
        setSpots(data.map((spot: Omit<ParkingSpot, 'isSelected'>) => ({
          ...spot,
          isSelected: false
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  const handleSpotClick = (spotId: number) => {
    if (spots.find(spot => spot.id === spotId)?.isOccupied) return;

    setSpots(spots.map(spot => ({
      ...spot,
      isSelected: spot.id === spotId ? !spot.isSelected : false
    })));
    
    onSpotSelect(spotId);
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement des places...</div>;
  }

  return (
    <div className="p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
        {/* Entrée du parking */}
        <div className="mb-6 text-center">
          <div className="w-32 h-8 bg-gray-600 mx-auto rounded-t-lg"></div>
          <div className="text-white text-sm mt-2">ENTRÉE</div>
        </div>

        {/* Grille du parking */}
        <div className="space-y-6">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex flex-wrap justify-center gap-4">
              {spots
                .filter((_, index) => Math.floor(index / 5) === row)
                .map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => handleSpotClick(spot.id)}
                    className={`
                      relative w-28 h-20 rounded-lg transition-all duration-300
                      ${spot.isOccupied 
                        ? 'bg-red-500/80' 
                        : spot.isSelected 
                          ? 'bg-green-500/80' 
                          : 'bg-white/90 hover:bg-white'
                      }
                      ${spot.isOccupied ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                      shadow-lg hover:shadow-xl
                      flex items-center justify-center
                      border-2 ${spot.isOccupied ? 'border-red-600' : spot.isSelected ? 'border-green-600' : 'border-gray-300'}
                    `}
                  >
                    {/* Numéro de place */}
                    <div className="text-xl font-bold text-gray-800">{spot.number}</div>
                    
                    {/* Indicateur d'état */}
                    {spot.isOccupied && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      </div>
                    )}
                    {spot.isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="mt-8 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-lg border-2 border-gray-300"></div>
            <span className="text-white">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500/80 rounded-lg border-2 border-red-600"></div>
            <span className="text-white">Occupé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500/80 rounded-lg border-2 border-green-600"></div>
            <span className="text-white">Sélectionné</span>
          </div>
        </div>
      </div>
    </div>
  );
} 