import Image from 'next/image';
import ColorPicker from './ColorPicker';
import QuoteSummary from './QuoteSummary';

export default function MaterialCard({
  mat,
  sku,
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
    <div
      key={mat}
      onClick={() => handleMaterialClick(mat)}
      style={{
        border: selectedMaterial === mat ? '2px solid #0070f3' : '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        width: '240px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      <Image
        src={sku?.image || '/filaments/default.jpg'}
        alt={mat}
        width={240}
        height={160}
        style={{ borderRadius: '4px' }}
        onError={(e) => {
          if (!e.target.src.includes('default.jpg')) {
            e.target.src = '/filaments/default.jpg';
          }
        }}
      />
      <h4>{mat}</h4>
      <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
        {MATERIAL_DESCRIPTIONS[mat]?.map((b, i) => (
          <li key={i} style={{ fontSize: '0.85rem', color: '#555' }}>{b}</li>
        ))}
      </ul>

      <p
        style={{
          fontSize: '0.8rem',
          color: '#777',
          marginTop: '0.5rem'
        }}
      >
        Cost per gram: <strong>${sku?.costPerGram?.toFixed(4) || '—'}</strong>
      </p>

      {selectedMaterial === mat && showColorPicker && (
        <ColorPicker
          availableColors={availableColors}
          selectedColor={selectedColor}
          handleColorSelect={handleColorSelect}
        />
      )}

      {selectedMaterial === mat && selectedColor && (
        <QuoteSummary
          selectedMaterial={selectedMaterial}
          selectedColor={selectedColor}
          selectedSKU={selectedSKU}
          quoteMeta={quoteMeta}
          estimatedCost={estimatedCost}
          handleCheckout={handleCheckout}
        />
      )}
    </div>
  );
}