import { NextResponse } from 'next/server';
import { getDB, logAudit } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const POST = withLogging(withAdmin(async (req) => {
  const actor = req.headers.get('x-user-email');
  const { email, role } = await req.json();

  if (!email || !['user', 'admin', 'moderator'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  const db = await getDB();
  await db.run(`UPDATE users SET role = ? WHERE email = ?`, [role, email]);

  await logAudit({
    actor_email: actor,
    action: 'role_change',
    target: email,
    details: `Set role to ${role}`
  });

  return NextResponse.json({ success: true });
}));