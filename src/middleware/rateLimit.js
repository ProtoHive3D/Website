// /src/middleware/rateLimit.js
import { NextResponse } from 'next/server';

const rateMap = new Map();

export function withRateLimit(handler, limit = 10, windowMs = 60000) {
  return async function wrapped(req) {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();

    const entry = rateMap.get(ip) || { count: 0, start: now };
    if (now - entry.start < windowMs) {
      if (entry.count >= limit) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
      }
      entry.count += 1;
    } else {
      entry.count = 1;
      entry.start = now;
    }

    rateMap.set(ip, entry);
    return handler(req);
  };
}