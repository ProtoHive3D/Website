import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';

export async function GET() {
  const db = await getDB();
  const reviews = await db.all(`
    SELECT email, sku, scope, rating, message, is_public, timestamp
    FROM reviews
    WHERE is_public = 1
    ORDER BY rating DESC, LENGTH(message) DESC, timestamp DESC
    LIMIT 10
  `);

  return NextResponse.json({ success: true, reviews });
}