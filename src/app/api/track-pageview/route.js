import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';

export async function POST(req) {
  const { path } = await req.json();
  const timestamp = new Date().toISOString();

  if (!path) {
    return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 });
  }

  const db = await getDB();
  await db.run('INSERT INTO pageviews (path, timestamp) VALUES (?, ?)', [path, timestamp]);

  return NextResponse.json({ success: true });
}
