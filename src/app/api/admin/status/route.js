import { getDB } from '@/utils/db';
import { NextResponse } from 'next/server';
import { devLog } from '@/utils/logger'; // optional, if you're using your devLog utility

const ALLOWED_STATUSES = ['submitted', 'in_production', 'shipped', 'completed'];

export async function POST(req) {
  const { jobId, status } = await req.json();

  if (!jobId || !status) {
    return NextResponse.json({ success: false, error: 'Missing jobId or status' }, { status: 400 });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 422 });
  }

  const db = await getDB();
  await db.run('UPDATE quotes SET status = ? WHERE job_id = ?', [status, jobId]);

  devLog(`Status updated: ${jobId} → ${status}`);

  return NextResponse.json({
    success: true,
    updated: { jobId, status },
    message: `Quote ${jobId} updated to status: ${status}`
  });
}
