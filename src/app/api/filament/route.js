// File: src/app/api/filament/route.js
import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const material = searchParams.get('material');
  const manufacturer = searchParams.get('manufacturer');

  if (!material || !manufacturer) {
    return NextResponse.json(
      { success: false, error: 'Missing material or manufacturer' },
      { status: 400 }
    );
  }

  const cacheKey = `${material}|${manufacturer}`;
  const now = Date.now();

  // ✅ Serve from cache if fresh
  if (cache.has(cacheKey)) {
    const { timestamp, data } = cache.get(cacheKey);
    if (now - timestamp < CACHE_TTL) {
      return NextResponse.json(data);
    }
  }

  const db = await getDB();

  const filament = await db.get(
    `
    SELECT material, manufacturer, name, description, diameter, print_temp, spool_weight, spool_type
    FROM filament_specs
    WHERE material = ? AND manufacturer = ?
    `,
    [material, manufacturer]
  );

  if (!filament) {
    return NextResponse.json(
      { success: false, error: 'Filament not found' },
      { status: 404 }
    );
  }

  const images = await db.all(
    `
    SELECT url
    FROM filament_images
    WHERE material = ? AND manufacturer = ?
    ORDER BY sort_order ASC
    `,
    [material, manufacturer]
  );

  const reviews = await db.all(
    `
    SELECT id, email, rating, message, timestamp, sku, scope
    FROM reviews
    WHERE scope = 'filament'
      AND is_public = 1
      AND sku IN (
        SELECT sku FROM quotes
        WHERE material = ? AND manufacturer = ?
      )
    ORDER BY rating DESC, LENGTH(message) DESC, timestamp DESC
    `,
    [material, manufacturer]
  );

  let avgRating = null;
  let reviewCount = reviews.length;
  if (reviewCount > 0) {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    avgRating = parseFloat((total / reviewCount).toFixed(2));
  }

  const responseData = {
    success: true,
    filament: {
      ...filament,
      images: images.map((i) => i.url)
    },
    reviews,
    avgRating,
    reviewCount
  };

  // ✅ Store in cache
  cache.set(cacheKey, { timestamp: now, data: responseData });

  return NextResponse.json(responseData);
}
