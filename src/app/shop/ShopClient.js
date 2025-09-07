'use client';
import { useState } from 'react';
import FilamentCard from '@/components/FilamentCard';
import { useCart } from '@/hooks/useCart';

export default function ShopClient({ SKU_List, ratingsMap }) {
  const [materialFilter, setMaterialFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const { addItem } = useCart();

  const uniqueMaterials = [...new Set(SKU_List.map(s => s.material))];
  const uniqueManufacturers = [...new Set(SKU_List.map(s => s.manufacturer))];

  let filtered = SKU_List.filter(sku => {
    return (!materialFilter || sku.material === materialFilter) &&
           (!manufacturerFilter || sku.manufacturer === manufacturerFilter);
  });

  if (sortOrder === 'priceLow') {
    filtered.sort((a, b) => a.costPerGram - b.costPerGram);
  } else if (sortOrder === 'priceHigh') {
    filtered.sort((a, b) => b.costPerGram - a.costPerGram);
  }

  const handleAddToCart = (skuObj) => {
    addItem(skuObj.sku, 1, {
      material: skuObj.material,
      color: skuObj.color,
      image: skuObj.image,
      price: skuObj.costPerGram * 1000
    });
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Filament Shop</h2>
      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Filter by material or manufacturer. Sort by price. Click any card to view full specs, gallery, and reviews.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <select value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)}>
          <option value="">All Materials</option>
          {uniqueMaterials.map((mat) => (
            <option key={mat} value={mat}>{mat}</option>
          ))}
        </select>

        <select value={manufacturerFilter} onChange={(e) => setManufacturerFilter(e.target.value)}>
          <option value="">All Manufacturers</option>
          {uniqueManufacturers.map((mfr) => (
            <option key={mfr} value={mfr}>{mfr}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Sort by</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {filtered.map((item) => {
          const comboKey = `${item.material}|${item.manufacturer}`;
          const ratingData = ratingsMap[comboKey] || { avgRating: null, reviewCount: 0 };

          return (
            <FilamentCard
              key={item.sku}
              sku={item.sku}
              image={item.image}
              material={item.material}
              color={item.color}
              price={item.costPerGram * 1000}
              onAddToCart={() => handleAddToCart(item)}
              avgRating={ratingData.avgRating}
              reviewCount={ratingData.reviewCount}
            />
          );
        })}
      </div>
    </main>
  );
}
