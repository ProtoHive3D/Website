'use client';

import MaterialCard from './MaterialCard';

export default function MaterialSelector({
  availableMaterials,
  selectedMaterial,
  selectedColor,
  showColorPicker,
  availableColors,
  handleMaterialClick,
  handleColorSelect,
  selectedSKU,
  quoteMeta,
  estimatedCost,
  handleCheckout
}) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>Select Material</h3>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          maxWidth: '500px',
          flexShrink: 0
        }}>
          {availableMaterials.map((mat) => {
            const fallbackSKU = selectedSKU?.sku
              ? selectedSKU
              : mat.colors.find(c => c.name === 'Black')?.sku
              || mat.colors[0]?.sku;

            return (
              <MaterialCard
                key={mat.id}
                mat={mat.id}
                sku={fallbackSKU}
                selectedMaterial={selectedMaterial}
                selectedColor={selectedColor}
                showColorPicker={showColorPicker}
                availableColors={availableColors.map(c => c.name)}
                handleMaterialClick={handleMaterialClick}
                handleColorSelect={handleColorSelect}
                selectedSKU={selectedSKU}
                quoteMeta={quoteMeta}
                estimatedCost={estimatedCost}
                handleCheckout={handleCheckout}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}