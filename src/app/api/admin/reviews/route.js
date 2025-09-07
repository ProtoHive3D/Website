import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const GET = withLogging(withAdmin(async (req) => {
  const db = await getDB();
  const reviews = await db.all(`
    SELECT id, email, sku, scope, rating, message, is_public, timestamp, status
    FROM reviews
    ORDER BY timestamp DESC
  `);

  return NextResponse.json({ success: true, reviews });
}));