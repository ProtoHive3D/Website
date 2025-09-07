import { NextResponse } from 'next/server';
import { archiveOldLogs } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';
import { serverLog } from '@/utils/serverLog';

export const POST = withLogging(withAdmin(async (req) => {
  const actor = req.headers.get('x-user-email') || 'unknown';

  try {
    const archivedCount = await archiveOldLogs(90); // Archive logs older than 90 days

    serverLog('Audit logs archived', {
      route: '/api/admin/audit-logs/archive',
      actor,
      archivedCount
    }, 'audit');

    return NextResponse.json({ success: true, message: 'Old logs archived', archived: archivedCount });
  } catch (err) {
    serverLog('Audit archive error', {
      route: '/api/admin/audit-logs/archive',
      actor,
      error: err.message
    }, 'error');

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}));