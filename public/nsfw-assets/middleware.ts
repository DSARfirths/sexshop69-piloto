import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/nsfw-assets/')) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noimageindex');
    return res;
  }
  return NextResponse.next();
}
export const config = { matcher: ['/nsfw-assets/:path*'] };
