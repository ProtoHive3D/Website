import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';
import { serverLog } from '@/utils/serverLog';

export const GET = withLogging(withAdmin(async (req) => {
  try {
    const actor = req.headers.get('x-user-email') || 'unknown';

    const db = await getDB();
    const reviews = await db.all(`
      SELECT id, job_id, email, sku, scope, rating, message, timestamp, is_public, status
      FROM reviews
      ORDER BY timestamp DESC
    `);

    const headers = [
      'id',
      'job_id',
      'email',
      'sku',
      'scope',
      'rating',
      'message',
      'timestamp',
      'is_public',
      'status'
    ];

    const csvRows = [
      headers.join(','),
      ...reviews.map(r =>
        headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');

    serverLog('Review export completed', {
      route: '/api/admin/reviews/export',
      actor,
      rowCount: reviews.length
    }, 'audit');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="reviews.csv"'
      }
    });
  } catch (err) {
    serverLog('Review export error', {
      route: '/api/admin/reviews/export',
      error: err.message
    }, 'error');

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}));