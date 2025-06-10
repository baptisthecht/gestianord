import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';

interface SessionUser {
  role: Role;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as SessionUser).role !== 'ADMIN') {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const { userId } = await request.json();

    // Vérifier si la place existe
    const parkingSpot = await prisma.parkingSpot.findUnique({
      where: { id: (await params).id },
    });

    if (!parkingSpot) {
      return new NextResponse('Place de parking non trouvée', { status: 404 });
    }

    // Si un utilisateur est spécifié, vérifier qu'il existe
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return new NextResponse('Utilisateur non trouvé', { status: 404 });
      }
    }

    // Mettre à jour l'assignation
    const updatedSpot = await prisma.parkingSpot.update({
      where: { id: (await params).id },
      data: {
        defaultUserId: userId || null,
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
    console.error('Erreur lors de la mise à jour de l\'assignation:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 