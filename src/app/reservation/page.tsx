'use client';

import ParkingView from '@/components/reservation/ParkingView';
import { useState } from 'react';

export default function ReservationPage() {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);

  const handleSpotSelect = (spotId: number) => {
    setSelectedSpot(spotId);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Réservation de place de parking</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sélectionnez une place</h2>
        <ParkingView onSpotSelect={handleSpotSelect} />
        
        {selectedSpot && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              Place {selectedSpot} sélectionnée
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {
                // Ici, vous pourrez ajouter la logique de réservation
                alert(`Réservation de la place ${selectedSpot} confirmée`);
              }}
            >
              Confirmer la réservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 