import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const GET = withLogging(withAdmin(async (req) => {
  const db = await getDB();
  const users = await db.all(`
    SELECT email, name, role, created_at
    FROM users
    ORDER BY created_at DESC
  `);

  return NextResponse.json({ success: true, users });
}));