import { NextResponse } from 'next/server';
import { exportAuditLogsToFile } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const POST = withLogging(withAdmin(async () => {
  const filePath = await exportAuditLogsToFile();
  return NextResponse.json({ success: true, message: `Logs exported to ${filePath}` });
}));