import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const { day, available } = await request.json();

    if (!day || typeof available !== 'boolean') {
      return new NextResponse('Jour et disponibilité requis', { status: 400 });
    }

    // Vérifier si la place existe
    const parkingSpot = await prisma.parkingSpot.findUnique({
      where: { id: params.id },
    });

    if (!parkingSpot) {
      return new NextResponse('Place de parking non trouvée', { status: 404 });
    }

    // Mettre à jour la disponibilité du jour
    const updatedSpot = await prisma.parkingSpot.update({
      where: { id: params.id },
      data: {
        availableDays: {
          ...parkingSpot.availableDays,
          [day]: available,
        },
      },
    });

    return NextResponse.json(updatedSpot);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des jours disponibles:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 