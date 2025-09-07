import Image from 'next/image';

export default function ShopMaterialCard({ material, description, image, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', // needed for badge positioning
        cursor: 'pointer',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.2s ease-in-out'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      {/* Bundle & Save badge */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: '#ff9800',
        color: '#fff',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
      }}>
        Bundle & Save
      </div>

      <Image
        src={image}
        alt={material}
        width={100}
        height={100}
        style={{ marginBottom: '0.5rem', borderRadius: '6px' }}
        onError={(e) => {
          if (!e.target.src.includes('default.jpg')) {
            e.target.src = '/filaments/default.jpg';
          }
        }}
      />
      <h4>{material}</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#555' }}>
        {description.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}