import Link from 'next/link';
import Image from 'next/image';
import { parseSku } from '@/utils/parseSku';

export default function FilamentCard({
  sku,
  image,
  material,
  color,
  price,
  onAddToCart,
  avgRating,
  reviewCount
}) {
  const { manufacturer } = parseSku(sku);

  // Use a fallback image if the provided one is missing or broken
  const displayImage = image && image.trim() !== '' ? image : '/filaments/default.jpg';

  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: '1rem',
        borderRadius: '8px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        backgroundColor: '#fff'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      <div style={{ position: 'relative', width: '100%', height: '160px' }}>
        <Image
          src={displayImage}
          alt={`${material} – ${color}`}
          fill
          sizes="(max-width: 768px) 100vw, 200px"
          style={{
            borderRadius: '6px',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Next/Image doesn't allow direct src mutation, so we handle fallback via state if needed
            e.currentTarget.src = '/filaments/default.jpg';
          }}
        />
      </div>

      <h4 style={{ marginTop: '0.75rem', fontSize: '1rem' }}>{material}</h4>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{color}</p>

      {/* ✅ Rating Summary */}
      {avgRating !== null && reviewCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '0.25rem'
          }}
        >
          <div style={{ color: '#f5a623', fontSize: '1rem' }}>
            {'★'.repeat(Math.round(avgRating))}
            {'☆'.repeat(5 - Math.round(avgRating))}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#555' }}>({reviewCount})</span>
        </div>
      )}

      <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>${price.toFixed(2)}</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button
          onClick={onAddToCart}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.85rem',
            flex: 1
          }}
        >
          Add to Cart
        </button>

        <Link href={`/filament/${material}/${manufacturer}`}>
          <button
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: '#0078d4',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.85rem',
              flex: 1
            }}
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
