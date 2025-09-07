import { getFilamentData } from '@/utils/getFilamentData';
import { SKU_List } from '@/data/skuList';
import { getRatingsForCombos } from '@/utils/getRatingsForCombos';
import FilamentDetailClient from './FilamentDetailClient';

export default async function FilamentMaterialPage({ params }) {
  const { material, manufacturer } = params;

  const data = await getFilamentData(material, manufacturer);

  if (!data.success) {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Filament not found</h2>
      </main>
    );
  }

  // ✅ Find related SKUs: same material, different color
  const related = SKU_List.filter(
    (sku) =>
      sku.material === material &&
      sku.manufacturer === manufacturer &&
      sku.image !== data.filament.images[0]
  );

  // ✅ Build combo keys for ratings
  const relatedCombos = [...new Set(related.map(s => `${s.material}|${s.manufacturer}`))];
  const relatedRatingsMap = await getRatingsForCombos(relatedCombos);

  return (
    <FilamentDetailClient
      filament={data.filament}
      reviews={data.reviews}
      avgRating={data.avgRating}
      reviewCount={data.reviewCount}
      material={material}
      manufacturer={manufacturer}
      related={related}
      relatedRatingsMap={relatedRatingsMap}
    />
  );
}
