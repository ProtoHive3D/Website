// /src/middleware/admin.js
import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';

export function withAdmin(handler) {
  return async function wrapped(req) {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/user=([^;]+)/);
    const email = match?.[1];

    if (!email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDB();
    const user = await db.get(`SELECT email FROM users WHERE email = ?`, [email]);

    const isAdmin = email === 'admin@protohive3d.com'; // Replace with your admin logic

    if (!user || !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    req.headers.set('x-user-email', email);
    return handler(req);
  };
}