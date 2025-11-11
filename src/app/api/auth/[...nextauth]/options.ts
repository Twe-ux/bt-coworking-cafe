import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  findUserByEmail,
  verifyPassword,
  getRedirectPathByRole,
  initializeRoles,
} from '@/lib/auth-helpers';

// Track if roles have been initialized
let rolesInitialized = false;

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('🔒 Auth failed: Missing email or password');
          throw new Error('Email and password are required');
        }

        console.log('🔒 Auth attempt for email:', credentials.email);

        try {
          // Initialize roles on first authentication attempt
          if (!rolesInitialized) {
            console.log('🔒 Initializing roles...');
            try {
              await initializeRoles();
              rolesInitialized = true;
              console.log('🔒 Roles initialized successfully');
            } catch (error) {
              console.error('🔒 Failed to initialize roles:', error);
              // Don't throw here - roles might already exist
            }
          }

          // Find user with populated role
          console.log('🔒 Looking up user:', credentials.email);
          const user = await findUserByEmail(credentials.email);

          if (!user) {
            console.error('🔒 User not found:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('🔒 User found:', {
            email: user.email,
            hasPassword: !!user.password,
            role: (user.role as any)?.slug || 'no role'
          });

          // Verify password
          console.log('🔒 Verifying password...');
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            console.error('🔒 Invalid password for:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('🔒 Password verified successfully');

          // Check if email is verified (optional)
          // if (!user.emailVerifiedAt) {
          //   throw new Error('Please verify your email first');
          // }

          // Update last login
          user.lastLoginAt = new Date();
          await user.save();

          const role = user.role as any;

          // Return user data for session
          return {
            id: (user._id as any).toString(),
            email: user.email,
            name: user.givenName || user.username || user.email,
            username: user.username,
            role: {
              id: role._id.toString(),
              slug: role.slug,
              name: role.name,
              level: role.level,
            },
          };
        } catch (error) {
          console.error('Auth error:', error);

          // Better error messages for debugging
          if (error instanceof Error) {
            if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
              throw new Error('Database connection failed. Please try again later.');
            }
            throw new Error(error.message);
          }

          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login', // Updated to new site auth path
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          username: token.username as string,
          role: token.role as {
            id: string;
            slug: 'dev' | 'admin' | 'staff' | 'client';
            name: string;
            level: number;
          },
        };
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle redirects after login
      if (url.startsWith('/')) {
        return url;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};
