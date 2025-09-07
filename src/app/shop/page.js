// File: src/app/shop/page.js
import FilamentCard from '@/components/FilamentCard';
import { SKU_List } from '@/data/skuList';
import { getRatingsForCombos } from '@/utils/getRatingsForCombos';
import ShopClient from './ShopClient';

export default async function ShopPage() {
  // ✅ Build unique (material, manufacturer) combos
  const combos = [...new Set(SKU_List.map(s => `${s.material}|${s.manufacturer}`))];

  // ✅ Fetch ratings server-side
  const ratingsMap = await getRatingsForCombos(combos);

  return (
    <ShopClient SKU_List={SKU_List} ratingsMap={ratingsMap} />
  );
}
