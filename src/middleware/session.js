import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'protohive-secret';

export function withSession(handler) {
  return async function wrapped(req) {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/session=([^;]+)/);
    const token = match?.[1];

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, SECRET);

      // Attach user info to request headers
      req.headers.set('x-user-id', decoded.id);
      req.headers.set('x-user-email', decoded.email);
      req.headers.set('x-user-role', decoded.role);

      return handler(req);
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }
  };
}