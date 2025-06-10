import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });

    if (!reservation) {
      return new NextResponse('Réservation non trouvée', { status: 404 });
    }

    // Vérifier si l'utilisateur est autorisé à annuler la réservation
    if (reservation.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé à annuler cette réservation', { status: 403 });
    }

    // Vérifier si la date n'est pas passée
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservation.date < today) {
      return new NextResponse('Impossible d\'annuler une réservation passée', { status: 400 });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        isCancelled: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        spot: true,
      },
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 