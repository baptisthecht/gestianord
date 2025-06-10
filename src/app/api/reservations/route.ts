import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/authOptions';

// GET /api/reservations - Liste les réservations
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return new NextResponse('Dates requises', { status: 400 });
    }

    // Convertir les dates en début et fin de journée
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        isCancelled: false,
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
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}

// POST /api/reservations - Crée une nouvelle réservation
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const { date, spotId } = await request.json();

    if (!date || !spotId) {
      return new NextResponse('Date et place requises', { status: 400 });
    }

    // Convertir la date en début de journée
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return new NextResponse('Impossible de réserver une date passée', { status: 400 });
    }

    // Vérifier si la place existe
    const spot = await prisma.parkingSpot.findUnique({
      where: { id: spotId },
    });

    if (!spot) {
      return new NextResponse('Place non trouvée', { status: 404 });
    }

    // Vérifier si la place est déjà réservée pour cette date
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        spotId,
        date: reservationDate,
        isCancelled: false,
      },
    });

    if (existingReservation) {
      return new NextResponse('Place déjà réservée pour cette date', { status: 400 });
    }

    // Vérifier si l'utilisateur a déjà une réservation pour cette date
    const userReservation = await prisma.reservation.findFirst({
      where: {
        userId: session.user.id,
        date: reservationDate,
        isCancelled: false,
      },
    });

    if (userReservation) {
      return new NextResponse('Vous avez déjà une réservation pour cette date', { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        date: reservationDate,
        user: {
          connect: {
            id: session.user.id
          }
        },
        spot: {
          connect: {
            id: spotId
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        spot: true
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 