import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

console.log('🔧 Middleware module loaded');
console.log('🔧 NEXTAUTH_SECRET available:', !!process.env.NEXTAUTH_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log('🔒 Middleware executing for:', pathname);

  // Get token from JWT
  console.log('🔒 Getting token with secret:', process.env.NEXTAUTH_SECRET ? 'SECRET_PRESENT' : 'SECRET_MISSING');
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Get user role from token
  const userRole = token?.role as {
    slug: 'dev' | 'admin' | 'staff' | 'client';
    level: number;
  } | undefined;

  console.log('🔒 Middleware:', {
    pathname,
    hasToken: !!token,
    role: userRole?.slug,
    level: userRole?.level,
  });

  // Redirect authenticated users trying to access auth pages
  if (pathname.startsWith('/auth/') && token) {
    const redirectPath = getRedirectPathByRole(userRole?.slug || 'client');
    console.log('🔒 Redirecting authenticated user from /auth/ to:', redirectPath);
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

    // Protect client dashboard (/id)
    if (pathname.startsWith('/id')) {
      if (!token) {
        return NextResponse.redirect(
          new URL(`/auth/login?callbackUrl=${pathname}`, req.url)
        );
      }

      // Only clients (and higher roles) can access
      if (userRole && userRole.level >= 10) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Protect dev dashboard
    if (pathname.startsWith('/dashboard/dev')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      if (userRole?.slug === 'dev' && userRole.level === 100) {
        return NextResponse.next();
      }

      // Redirect to appropriate dashboard
      const redirectPath = getRedirectPathByRole(userRole?.slug || 'client');
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Protect admin dashboard
    if (pathname.startsWith('/dashboard/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      if (userRole && (userRole.slug === 'admin' || userRole.slug === 'dev')) {
        return NextResponse.next();
      }

      const redirectPath = getRedirectPathByRole(userRole?.slug || 'client');
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Protect staff dashboard
    if (pathname.startsWith('/dashboard/staff')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      if (
        userRole &&
        (userRole.slug === 'staff' || userRole.slug === 'admin' || userRole.slug === 'dev')
      ) {
        return NextResponse.next();
      }

      const redirectPath = getRedirectPathByRole(userRole?.slug || 'client');
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Protect other dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      // Allow access if user has at least staff level
      if (userRole && userRole.level >= 50) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL('/id', req.url));
    }

    return NextResponse.next();
}

function getRedirectPathByRole(
  roleSlug: 'dev' | 'admin' | 'staff' | 'client'
): string {
  const redirectPaths: Record<string, string> = {
    dev: '/dashboard/dev',
    admin: '/dashboard/admin',
    staff: '/dashboard/staff',
    client: '/id',
  };

  return redirectPaths[roleSlug] || '/';
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
