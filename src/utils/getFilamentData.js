// File: src/utils/getFilamentData.js
import { getDB } from '@/utils/db';

export async function getFilamentData(material, manufacturer) {
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
    return { success: false };
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

  return {
    success: true,
    filament: {
      ...filament,
      images: images.map((i) => i.url)
    },
    reviews,
    avgRating,
    reviewCount
  };
}
