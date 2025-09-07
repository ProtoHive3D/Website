import { getDB } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { jobId, material, color, cost, status } = await req.json();

  if (!jobId) {
    return NextResponse.json({ success: false, error: 'Missing jobId' }, { status: 400 });
  }

  const db = await getDB();
  await db.run(`
    UPDATE quotes
    SET material = ?, color = ?, cost = ?, status = ?
    WHERE job_id = ?
  `, [material, color, cost, status, jobId]);

  const updated = await db.get('SELECT * FROM quotes WHERE job_id = ?', [jobId]);

  return NextResponse.json({ success: true, updated });
}
