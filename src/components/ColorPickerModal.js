'use client';

import ColorPicker from './ColorPicker';
import { SKU_List } from '@/data/skuList';

export default function ColorPickerModal({
  selectedMaterial,
  availableColors,
  selectedColor,
  handleColorSelect
}) {
  if (!selectedMaterial || !availableColors.length) return null;

  const enrichedColors = availableColors.map(c => ({
    name: c.name,
    sku: c.sku,
    image: c.image,
    costPerGram: SKU_List.find(s => s.sku === c.sku)?.costPerGram || 0
  }));

  return (
    <div style={{ marginTop: '2rem' }}>
      <ColorPicker
        colors={enrichedColors}
        selectedColor={selectedColor}
        handleColorSelect={handleColorSelect}
      />
    </div>
  );
}