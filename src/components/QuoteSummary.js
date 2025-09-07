import Image from 'next/image';

export default function QuoteSummary({
  material,
  color,
  grams,
  cost,
  manufacturer,
  imagePath,
  showImage = false,
  showButtons = false,
  handleCheckout
}) {
  const fallbackImage = imagePath || '/filaments/default.jpg';

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Quote Summary</h3>

      {showImage && (
        <Image
          src={fallbackImage}
          alt={`${material || 'Material'} ${color || 'Color'}`}
          width={800}
          height={400}
          style={{ borderRadius: '6px', marginBottom: '1rem' }}
          onError={(e) => {
            e.target.src = '/filaments/default.jpg';
          }}
        />
      )}

      <ul style={{ listStyle: 'none', padding: 0, fontSize: '1rem', color: '#333' }}>
        <li><strong>Material:</strong> {material || '—'}</li>
        <li><strong>Color:</strong> {color || '—'}</li>
        {manufacturer && <li><strong>Manufacturer:</strong> {manufacturer}</li>}
        <li><strong>Estimated Weight:</strong> {
          grams && !isNaN(parseFloat(grams))
            ? `${parseFloat(grams).toFixed(1)} g`
            : 'N/A'
        }</li>
        <li><strong>Estimated Cost:</strong> {
          cost && !isNaN(parseFloat(cost))
            ? `$${parseFloat(cost).toFixed(2)}`
            : 'N/A'
        } <span style={{ color: '#888' }}>(taxes calculated at checkout)</span></li>
      </ul>

      {showButtons && (
        <>
          <button onClick={handleCheckout} style={{
            marginTop: '2rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Checkout
          </button>

          <button onClick={() => window.print()} style={{
            marginTop: '1rem',
            backgroundColor: '#ccc',
            color: '#333',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}>
            Print Summary
          </button>
        </>
      )}
    </div>
  );
}