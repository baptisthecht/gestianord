'use client';

import { ParkingSpot } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ReservationWithDetails {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  spotId: string;
  isCancelled: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  spot: ParkingSpot;
}

interface ParkingSpotWithDetails extends ParkingSpot {
  defaultUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  reservations: ReservationWithDetails[];
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [spots, setSpots] = useState<ParkingSpotWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const spotsResponse = await fetch('/api/parking-spots');
        if (!spotsResponse.ok) {
          throw new Error('Erreur lors du chargement des places');
        }
        const spotsData = await spotsResponse.json();
        setSpots(spotsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const handleReservation = async (spotId: string) => {
    if (!session) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          spotId,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Rafraîchir les places
      const spotsResponse = await fetch('/api/parking-spots/public');
      const spotsData = await spotsResponse.json();
      setSpots(spotsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Rafraîchir les places
      const spotsResponse = await fetch('/api/parking-spots/public');
      const spotsData = await spotsResponse.json();
      setSpots(spotsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const isSpotReserved = (spot: ParkingSpotWithDetails, date: string) => {
    return spot.reservations.some(
      (reservation) =>
        reservation.date.toISOString().split('T')[0] === date &&
        !reservation.isCancelled
    );
  };

  const getReservationForSpot = (spot: ParkingSpotWithDetails, date: string) => {
    return spot.reservations.find(
      (reservation) =>
        reservation.date.toISOString().split('T')[0] === date &&
        !reservation.isCancelled
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Places de Parking
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez une date et réservez votre place
          </p>
        </div>

        <div className="mb-8">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="block w-full max-w-xs mx-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot) => {
            const isReserved = isSpotReserved(spot, selectedDate);
            const reservation = getReservationForSpot(spot, selectedDate);
            const isMyReservation = reservation?.user.email === session?.user?.email;
            const isDefaultSpot = spot.defaultUser?.email === session?.user?.email;

            return (
              <div
                key={spot.id}
                className={`bg-white rounded-lg shadow-md p-6 transition-all ${
                  isMyReservation || isDefaultSpot
                    ? 'ring-2 ring-green-500'
                    : isReserved
                    ? 'opacity-50'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Place {spot.number}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isMyReservation || isDefaultSpot
                        ? 'bg-green-100 text-green-800'
                        : isReserved
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isMyReservation
                      ? 'Votre réservation'
                      : isDefaultSpot
                      ? 'Votre place par défaut'
                      : isReserved
                      ? 'Occupée'
                      : 'Disponible'}
                  </span>
                </div>

                {spot.defaultUser && (
                  <p className="text-sm text-gray-600 mb-2">
                    Place par défaut de : {spot.defaultUser.firstName}{' '}
                    {spot.defaultUser.lastName}
                  </p>
                )}

                {reservation && (
                  <p className="text-sm text-gray-600 mb-4">
                    Réservée par : {reservation.user.firstName}{' '}
                    {reservation.user.lastName}
                  </p>
                )}

                {isMyReservation ? (
                  <button
                    onClick={() => handleCancelReservation(reservation!.id)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Annuler la réservation
                  </button>
                ) : (
                  !isReserved && (
                    <button
                      onClick={() => handleReservation(spot.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Réserver
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
