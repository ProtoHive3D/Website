import Image from 'next/image';

export default function ShopColorPicker({ material, colors, price, onAddToCart, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        <h3>{material} Colors</h3>
        <p style={{ marginBottom: '0.5rem', color: '#555' }}>
          Price: <strong>${price.toFixed(2)} / kg</strong>
        </p>
        <p style={{ marginBottom: '1rem', color: '#555' }}>
          Select a color to add to cart and continue.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {colors.map((color, i) => (
            <div key={i} style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '1rem',
              width: '120px',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <Image
                src={color.image}
                alt={color.name}
                width={120}
                height={120}
                style={{ borderRadius: '4px', objectFit: 'cover' }}
              />
              <p style={{ marginTop: '0.5rem' }}>{color.name}</p>
              <button
                style={{
                  marginTop: '0.5rem',
                  backgroundColor: '#0070f3',
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  onAddToCart({
                    sku: color.sku,
                    material,
                    color: color.name,
                    image: color.image,
                    price,           // ✅ per‑kg shop price
                    type: 'filament' // ✅ so bundle discount applies
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <button
          style={{
            marginTop: '1rem',
            backgroundColor: '#ccc',
            color: '#000',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}