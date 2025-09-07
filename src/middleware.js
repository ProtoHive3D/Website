import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {
  const url = req.nextUrl;
  const session = req.cookies.get('admin_session');

  const isAdminRoute = url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login');

  if (isAdminRoute && session?.value !== 'valid') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
