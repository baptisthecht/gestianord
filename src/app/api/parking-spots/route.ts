import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/authOptions';

interface SessionUser {
  role: Role;
}

// GET /api/parking-spots - Liste toutes les places de parking
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const parkingSpots = await prisma.parkingSpot.findMany({
      include: {
        defaultUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        reservations: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(parkingSpots);
  } catch (error) {
    console.error('Erreur lors de la récupération des places de parking:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}

// POST /api/parking-spots - Crée une nouvelle place de parking
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const { number } = await request.json();

    if (!number) {
      return new NextResponse('Le numéro de place est requis', { status: 400 });
    }

    const existingSpot = await prisma.parkingSpot.findFirst({
      where: { number },
    });

    if (existingSpot) {
      return new NextResponse('Une place avec ce numéro existe déjà', { status: 400 });
    }

    const parkingSpot = await prisma.parkingSpot.create({
      data: {
        number,
      },
    });

    return NextResponse.json(parkingSpot);
  } catch (error) {
    console.error('Erreur lors de la création de la place de parking:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}

// PATCH /api/parking-spots/:id - Met à jour une place de parking
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as SessionUser).role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, userId } = body;

    const parkingSpot = await prisma.parkingSpot.update({
      where: { id },
      data: {
        defaultUserId: userId || null,
      },
      include: {
        defaultUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(parkingSpot);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
} 