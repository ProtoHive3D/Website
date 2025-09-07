import { NextResponse } from 'next/server';
import { getDB, logAudit } from '@/utils/db';
import { withSession } from '@/middleware/session';
import { withLogging } from '@/middleware/logging';

export const POST = withLogging(withSession(async (req) => {
  const email = req.headers.get('x-user-email');
  const body = await req.json();
  const { jobId, sku, scope, rating, message } = body;

  if (!jobId || !scope || !rating || !message) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  const db = await getDB();

  // ✅ Verify user owns the job and it's fulfilled
  const quote = await db.get(`
    SELECT status FROM quotes
    WHERE job_id = ? AND email = ?
  `, [jobId, email]);

  if (!quote || quote.status !== 'fulfilled') {
    return NextResponse.json({ success: false, error: 'Review not allowed — job not fulfilled or not owned by user' }, { status: 403 });
  }

  // ✅ Insert review
  await db.run(`
    INSERT INTO reviews (job_id, email, sku, scope, rating, message, status, is_public)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', 0)
  `, [jobId, email, sku || null, scope, rating, message]);

  // ✅ Log audit trail
  await logAudit({
    actor_email: email,
    action: 'review_submit',
    target: jobId,
    details: `Submitted ${rating}-star review for ${scope}`
  });

  return NextResponse.json({ success: true, message: 'Review submitted for moderation' });
}));
