import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
      where: { id: (await params).id },
    });

    if (!parkingSpot) {
      return new NextResponse('Place de parking non trouvée', { status: 404 });
    }

    // Créer ou supprimer la réservation pour ce jour
    if (available) {
      await prisma.reservation.create({
        data: {
          date: new Date(day),
          spotId: (await params).id,
          userId: session.user.id,
        },
      });
    } else {
      await prisma.reservation.deleteMany({
        where: {
          spotId: (await params).id,
          date: new Date(day),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des jours disponibles:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 