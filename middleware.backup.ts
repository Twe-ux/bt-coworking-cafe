// Backup of TypeScript middleware
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

  // Add custom headers to prove middleware ran
  // User can check these in browser DevTools > Network tab
  const response = NextResponse.next();
  response.headers.set('X-Middleware-Executed', 'true');
  response.headers.set('X-Middleware-Path', pathname);
  response.headers.set('X-Middleware-Time', new Date().toISOString());

  return response;
}

// Match ALL routes except static files (testing)
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
