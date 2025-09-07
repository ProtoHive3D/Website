import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const GET = withLogging(withAdmin(async (req) => {
  const db = await getDB();
  const url = new URL(req.url);

  const actor = url.searchParams.get('actor')?.trim();
  const action = url.searchParams.get('action')?.trim();
  const role = url.searchParams.get('role')?.trim();
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

  if (role) {
    baseQuery += ` AND details LIKE ?`;
    params.push(`%role to ${role}%`);
  }

  if (start) {
    baseQuery += ` AND timestamp >= ?`;
    params.push(start);
  }

  if (end) {
    baseQuery += ` AND timestamp <= ?`;
    params.push(end);
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
  const { total } = await db.get(countQuery, params);
  const totalPages = Math.ceil(total / limit);

  const logsQuery = `SELECT id, actor_email, action, target, details, timestamp ${baseQuery} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
  const logs = await db.all(logsQuery, [...params, limit, offset]);

  return NextResponse.json({
    success: true,
    logs,
    pagination: {
      currentPage: page,
      totalPages,
      totalEntries: total,
      limit
    }
  });
}));