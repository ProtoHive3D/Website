import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withSession } from '@/middleware/session';
import { withRateLimit } from '@/middleware/rateLimit';
import { withLogging } from '@/middleware/logging';

export const POST = withLogging(withRateLimit(withSession(async (req) => {
  const { jobId, email, sku, scope, rating, message } = await req.json();
  const timestamp = new Date().toISOString();

  if (!email || !message || !rating || (scope === 'product' && !sku)) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const db = await getDB();
  await db.run(
    `INSERT INTO reviews (job_id, email, sku, scope, rating, message, timestamp, is_public, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [jobId, email, sku || null, scope, rating, message, timestamp, false, 'pending']
  );

  return NextResponse.json({ success: true });
})));