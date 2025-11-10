import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Module-level log - should appear when server starts
console.log('========================================');
console.log('🔧 MIDDLEWARE MODULE LOADED');
console.log('🔧 Time:', new Date().toISOString());
console.log('========================================');

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // This should log for EVERY request
  console.log('========================================');
  console.log('🔒 MIDDLEWARE EXECUTING');
  console.log('🔒 Path:', pathname);
  console.log('🔒 Method:', req.method);
  console.log('========================================');

  return NextResponse.next();
}

// Match ALL routes (very permissive for testing)
export const config = {
  matcher: [
    '/auth/:path*',
    '/id/:path*',
    '/dashboard/:path*',
  ],
};
