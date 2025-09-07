export async function getRatingsForCombos(combos) {
  const results = {};

  await Promise.all(
    combos.map(async (combo) => {
      const [material, manufacturer] = combo.split('|');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/filament?material=${material}&manufacturer=${manufacturer}`,
        { cache: 'no-store' } // ensure fresh SSR fetch
      );
      const data = await res.json();
      if (data.success) {
        results[combo] = {
          avgRating: data.avgRating,
          reviewCount: data.reviewCount
        };
      }
    })
  );

  return results;
}
