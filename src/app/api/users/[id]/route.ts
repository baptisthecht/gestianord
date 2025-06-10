import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/authOptions';

export async function DELETE(
  request: Request,
  { params }: Promise<{ params: { id: string } }>
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return new NextResponse('Utilisateur non trouvé', { status: 404 });
    }

    // Vérifier si l'utilisateur est l'admin par défaut
    if (user.email === 'admin@example.com') {
      return new NextResponse('Impossible de supprimer l\'administrateur par défaut', { status: 400 });
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 