import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withSession } from '@/middleware/session';
import { withLogging } from '@/middleware/logging';

export const GET = withLogging(withSession(async (req) => {
  const email = req.headers.get('x-user-email');
  if (!email) {
    return NextResponse.json({ success: false, error: 'Not logged in' }, { status: 401 });
  }

  const db = await getDB();
  const orders = await db.all(
    `SELECT job_id, material, color, grams, cost, sku, status, created_at
     FROM quotes
     WHERE email = ?
     ORDER BY created_at DESC`,
    [email]
  );

  return NextResponse.json({
    success: true,
    user: { email },
    orders
  });
}));