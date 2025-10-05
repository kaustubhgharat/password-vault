// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/tokens';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('X-User-ID', decoded.id as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
     console.log(error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}

export const config = {
  matcher: '/api/vault/:path*',
};