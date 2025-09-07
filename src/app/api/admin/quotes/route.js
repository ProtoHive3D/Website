import { getDB } from '@/utils/db'; // adjust path if needed
import { NextResponse } from 'next/server';

export async function GET() {
  const db = await getDB();
  const rows = await db.all(`
    SELECT job_id, material, color, grams, cost, status, created_at
    FROM quotes
    ORDER BY created_at DESC
  `);

  return NextResponse.json(rows);
}
