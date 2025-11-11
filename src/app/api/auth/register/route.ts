import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username, givenName, roleSlug } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Only allow 'client' role for public registration
    // Admin/Staff/Dev roles can only be created by existing admins
    const allowedRoleSlug = roleSlug === 'client' ? 'client' : 'client';

    // Create user
    const user = await createUser({
      email,
      password,
      username,
      givenName,
      roleSlug: allowedRoleSlug,
    });

    return NextResponse.json(
      {
        message: 'Utilisateur créé avec succès',
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          username: user.username,
          givenName: user.givenName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle duplicate email error
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la création du compte',
      },
      { status: 500 }
    );
  }
}
