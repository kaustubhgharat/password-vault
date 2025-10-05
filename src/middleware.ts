// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function middleware(req: NextRequest) {
  // --- TEMPORARY DEBUGGING LOGS ---
  // Log 1: Check if the secret variable exists on the server
  console.log(
    "NEXTAUTH_SECRET check:", 
    process.env.NEXTAUTH_SECRET ? `Exists (length: ${process.env.NEXTAUTH_SECRET.length})` : "MISSING or EMPTY"
  );

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Log 2: Check if the token was successfully decoded
  console.log("Token decoded by middleware:", token ? "Yes, found user." : "No, token is null.");
  // --- END OF DEBUGGING LOGS ---

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('X-User-ID', token.id as string);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/vault/:path*', '/api/auth/status'],
};