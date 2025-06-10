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
    const { day } = await request.json();
    const spotId = params.id;

    // Vérifier si la place existe
    const spot = await prisma.parkingSpot.findUnique({
      where: { id: spotId },
    });

    if (!spot) {
      return new NextResponse('Place non trouvée', { status: 404 });
    }

    // Vérifier si la place est disponible pour le jour sélectionné
    if (!spot[day as keyof typeof spot]) {
      return new NextResponse('Place non disponible pour ce jour', { status: 400 });
    }

    // Vérifier si l'utilisateur a déjà une place réservée pour ce jour
    const existingReservation = await prisma.parkingSpot.findFirst({
      where: {
        defaultUserId: session.user.id,
        [day]: true,
      },
    });

    if (existingReservation) {
      return new NextResponse('Vous avez déjà une place réservée pour ce jour', { status: 400 });
    }

    // Mettre à jour la place
    const updatedSpot = await prisma.parkingSpot.update({
      where: { id: spotId },
      data: {
        defaultUserId: session.user.id,
      },
      include: {
        defaultUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSpot);
  } catch (error) {
    console.error('Erreur lors de la réservation:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 