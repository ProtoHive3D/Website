import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';

export async function POST(req) {
  const { label } = await req.json();
  const timestamp = new Date().toISOString();

  if (!label) {
    return NextResponse.json({ success: false, error: 'Missing label' }, { status: 400 });
  }

  const db = await getDB();
  await db.run('INSERT INTO click_events (label, timestamp) VALUES (?, ?)', [label, timestamp]);

  return NextResponse.json({ success: true });
}
