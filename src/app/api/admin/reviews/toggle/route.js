import { NextResponse } from 'next/server';
import { getDB, logAudit } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';
import { serverLog } from '@/utils/serverLog';

export const POST = withLogging(withAdmin(async (req) => {
  const actor = req.headers.get('x-user-email');
  const payload = await req.json();

  const ids = Array.isArray(payload.id) ? payload.id : [payload.id];
  const isPublic = payload.is_public;

  if (!ids.every(id => typeof id === 'number') || typeof isPublic !== 'boolean') {
    serverLog('Review toggle failed: Invalid input', {
      route: '/api/reviews/toggle',
      actor,
      ids,
      isPublic,
      status: 400
    }, 'warn');
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  const db = await getDB();

  try {
    const placeholders = ids.map(() => '?').join(', ');
    await db.run(
      `UPDATE reviews SET is_public = ?, status = ? WHERE id IN (${placeholders})`,
      [isPublic ? 1 : 0, isPublic ? 'approved' : 'hidden', ...ids]
    );

    serverLog('Review visibility updated', {
      route: '/api/reviews/toggle',
      actor,
      ids,
      isPublic,
      status: isPublic ? 'approved' : 'hidden'
    }, 'audit');

    for (const id of ids) {
      await logAudit({
        actor_email: actor,
        action: 'review_toggle',
        target: `review#${id}`,
        details: `is_public set to ${isPublic}`
      });
    }

    if (ids.length > 1) {
      await logAudit({
        actor_email: actor,
        action: 'bulk_review_toggle',
        target: `reviews[${ids.length}]`,
        details: `Bulk toggle to ${isPublic ? 'public' : 'hidden'} for IDs: ${ids.join(', ')}`
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    serverLog('Review toggle error', {
      route: '/api/reviews/toggle',
      actor,
      error: err.message
    }, 'error');
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}));