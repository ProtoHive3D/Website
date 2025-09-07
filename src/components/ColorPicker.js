// /src/components/ColorPicker.js
import Image from 'next/image';

export default function ColorPicker({ colors, selectedColor, handleColorSelect }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem' }} className="fade-in">
      <h4 style={{ marginBottom: '0.5rem' }}>Color Options</h4>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {colors.map((color) => (
          <div
            key={color.sku}
            onClick={() => handleColorSelect(color.name)}
            style={{
              border: selectedColor === color.name ? '3px solid #0070f3' : '2px solid #ccc',
              borderRadius: '6px',
              padding: '4px',
              cursor: 'pointer',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              boxShadow: selectedColor === color.name ? '0 0 6px rgba(0, 112, 243, 0.6)' : 'none'
            }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleColorSelect(color.name);
            }}
          >
            <Image
              src={color.image}
              alt={color.name}
              width={40}
              height={40}
              style={{ borderRadius: '4px', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}