import { NextResponse } from 'next/server';
import { getDB, verifyAuditLogIntegrity } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const POST = withLogging(withAdmin(async (req) => {
  const { ids } = await req.json();
  if (!Array.isArray(ids)) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  const results = {};
  for (const id of ids) {
    results[id] = await verifyAuditLogIntegrity(id);
  }

  return NextResponse.json({ success: true, integrity: results });
}));