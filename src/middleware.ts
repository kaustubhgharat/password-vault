// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

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