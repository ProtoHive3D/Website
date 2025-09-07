import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { withAdmin } from '@/middleware/admin';
import { withLogging } from '@/middleware/logging';

export const GET = withLogging(withAdmin(async (req) => {
  const db = await getDB();
  const clicks = await db.all('SELECT label, timestamp FROM click_events ORDER BY timestamp DESC');
  const pageviews = await db.all('SELECT path, timestamp FROM pageviews ORDER BY timestamp DESC');

  return NextResponse.json({ success: true, clicks, pageviews });
}));