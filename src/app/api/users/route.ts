import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

const prisma = new PrismaClient();

interface SessionUser {
  role: Role;
}

// Générer un mot de passe aléatoire
function generatePassword(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// GET /api/users - Liste tous les utilisateurs
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as SessionUser).role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        defaultSpot: true,
        reservations: {
          include: {
            spot: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch  {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

// POST /api/users - Crée un nouvel utilisateur
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as SessionUser).role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, firstName, lastName, role = "USER" } = body;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Cet email est déjà utilisé", { status: 400 });
    }

    // Générer un mot de passe aléatoire
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      },
    });

    // Retourner l'utilisateur avec le mot de passe en clair (uniquement pour l'affichage initial)
    return NextResponse.json({
      ...user,
      plainPassword: password, // Le mot de passe en clair pour l'affichage initial
    });
  } catch {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
} 