import { getDB } from '@/utils/db';
import { NextResponse } from 'next/server';
import { serverLog } from '@/utils/serverLog';

export async function GET(req, { params }) {
  const jobId = params.jobId;

  if (!jobId) {
    serverLog('Quote fetch failed: Missing jobId', {
      route: '/api/quote/[jobId]',
      status: 400
    }, 'warn');
    return NextResponse.json({ success: false, error: 'Missing jobId' }, { status: 400 });
  }

  try {
    serverLog('Quote fetch initiated', {
      route: '/api/quote/[jobId]',
      jobId
    }, 'info');

    const db = await getDB();
    const quote = await db.get(`
      SELECT job_id, material, color, grams, cost, sku, status, created_at
      FROM quotes
      WHERE job_id = ?
    `, [jobId]);

    if (!quote) {
      serverLog('Quote not found', {
        route: '/api/quote/[jobId]',
        jobId,
        status: 404
      }, 'warn');
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
    }

    serverLog('Quote retrieved successfully', {
      route: '/api/quote/[jobId]',
      jobId,
      quote
    }, 'info');

    return NextResponse.json({ success: true, quote });
  } catch (err) {
    serverLog('Quote fetch error', {
      route: '/api/quote/[jobId]',
      jobId,
      error: err.message
    }, 'error');

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}