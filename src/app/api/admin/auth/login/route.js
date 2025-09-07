import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serverLog } from '@/utils/serverLog';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'protohive3d';

export async function POST(req) {
  try {
    const { password, logout } = await req.json();
    const actor = req.headers.get('x-user-email') || 'unknown';

    if (logout === true) {
      cookies().delete('admin_session');
      serverLog('Admin logout', {
        route: '/api/admin/auth/login',
        actor
      }, 'audit');
      return NextResponse.json({ success: true });
    }

    if (!password) {
      serverLog('Login failed: Missing password', {
        route: '/api/admin/auth/login',
        actor,
        status: 400
      }, 'warn');
      return NextResponse.json({ success: false, error: 'Missing password' }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      cookies().set('admin_session', 'valid', { httpOnly: true, path: '/' });
      serverLog('Admin login successful', {
        route: '/api/admin/auth/login',
        actor
      }, 'audit');
      return NextResponse.json({ success: true });
    }

    serverLog('Login failed: Invalid password', {
      route: '/api/admin/auth/login',
      actor,
      status: 401
    }, 'warn');
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (err) {
    serverLog('Login route error', {
      route: '/api/admin/auth/login',
      error: err.message
    }, 'error');
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}