import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variables
 * REMOVE THIS IN PRODUCTION!
 */
export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    MONGODB_URI: !!process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
