import { getDB } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json({ success: false, error: 'Missing jobId' }, { status: 400 });
  }

  const db = await getDB();
  await db.run('DELETE FROM quotes WHERE job_id = ?', [jobId]);

  return NextResponse.json({ success: true, deleted: jobId });
}
