import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const GET = withLogging(withAdmin(async (req) => {
  const db = await getDB();
  const url = new URL(req.url);

  const actor = url.searchParams.get('actor')?.trim();
  const action = url.searchParams.get('action')?.trim();
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '25');
  const offset = (page - 1) * limit;

  let baseQuery = `FROM audit_logs WHERE 1=1`;
  const params = [];

  if (actor) {
    baseQuery += ` AND actor_email LIKE ?`;
    params.push(`%${actor}%`);
  }

  if (action) {
    baseQuery += ` AND action = ?`;
    params.push(action);
  }

  if (start) {
    baseQuery += ` AND timestamp >= ?`;
    params.push(start);
  }

  if (end) {
    baseQuery += ` AND timestamp <= ?`;
    params.push(end);
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
  const { total } = await db.get(countQuery, params);
  const totalPages = Math.ceil(total / limit);

  // Get paginated logs
  const logsQuery = `SELECT actor_email, action, target, details, timestamp ${baseQuery} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
  const logs = await db.all(logsQuery, [...params, limit, offset]);

  const headers = ['actor_email', 'action', 'target', 'details', 'timestamp'];
  const csvRows = [
    `# Exported page ${page} of ${totalPages} (${total} total entries)`,
    headers.join(','),
    ...logs.map(log =>
      headers.map(h => `"${(log[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="audit_logs_page_${page}.csv"'
    }
  });
}));