'use client';

import { ParkingSpot, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateParkingSpotForm from './components/CreateParkingSpotForm';
import CreateUserForm from './components/CreateUserForm';
import ParkingSpotList from './components/ParkingSpotList';
import UserList from './components/UserList';

type ParkingSpotWithUser = ParkingSpot & {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
};

export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpotWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersResponse, spotsResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/parking-spots'),
        ]);

        if (!usersResponse.ok || !spotsResponse.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const [usersData, spotsData] = await Promise.all([
          usersResponse.json(),
          spotsResponse.json(),
        ]);

        setUsers(usersData);
        setParkingSpots(spotsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, router]);

  if (status === 'loading' || loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
          <CreateUserForm onUserCreated={() => window.location.reload()} />
          <div className="mt-8">
            <UserList users={users} onUserDeleted={() => window.location.reload()} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Gestion des places de parking</h2>
          <CreateParkingSpotForm onSpotCreated={() => window.location.reload()} />
          <div className="mt-8">
            <ParkingSpotList
              spots={parkingSpots}
              users={users}
              onSpotUpdated={() => window.location.reload()}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 