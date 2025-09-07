'use client';
import { useCart } from '@/hooks/useCart';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import FilamentCard from '@/components/FilamentCard';
import Image from 'next/image';

export default function FilamentDetailClient({
  filament,
  reviews,
  avgRating,
  reviewCount,
  material,
  manufacturer,
  related,
  relatedRatingsMap
}) {
  const { addItem } = useCart();

  // Placeholder until you wire in real user email
  const userEmail = '';

  const handleAddToCart = (skuObj) => {
    addItem(skuObj.sku, 1, {
      material: skuObj.material,
      color: skuObj.color,
      image: skuObj.image,
      price: skuObj.costPerGram * 1000
    });
  };

  // Ensure we always have a valid image URL
  const galleryImages = (filament.images && filament.images.length > 0)
    ? filament.images
    : ['/filaments/default.jpg'];

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>{filament.name}</h2>

      {avgRating !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ color: '#f5a623', fontSize: '1.2rem' }}>
            {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
          </div>
          <span style={{ fontWeight: 'bold' }}>{avgRating.toFixed(2)}</span>
          <span style={{ color: '#555' }}>({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
        </div>
      )}

      <p style={{ color: '#555' }}>{filament.description}</p>

      {/* Specs */}
      <section style={{ marginTop: '1.5rem' }}>
        <h3>Specifications</h3>
        <ul>
          <li><strong>Diameter:</strong> {filament.diameter} mm</li>
          <li><strong>Print Temp:</strong> {filament.print_temp} °C</li>
          <li><strong>Spool Weight:</strong> {filament.spool_weight} g</li>
          <li><strong>Spool Type:</strong> {filament.spool_type}</li>
        </ul>
      </section>

      {/* Gallery */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Gallery</h3>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {galleryImages.map((src, i) => (
            <div key={i} style={{ position: 'relative', width: '200px', height: '200px', flex: '0 0 auto' }}>
              <Image
                src={src}
                alt={`Filament ${i}`}
                fill
                sizes="200px"
                style={{ borderRadius: '6px', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = '/filaments/default.jpg';
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Add to Cart */}
      <section style={{ marginTop: '2rem' }}>
        <button
          onClick={() => handleAddToCart({
            sku: `${material}-${manufacturer}`,
            material: filament.material,
            color: filament.color || '',
            image: galleryImages[0],
            costPerGram: filament.spool_weight ? (filament.print_temp > 230 ? 0.015 : 0.012) : 0
          })}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          Add to Cart
        </button>
      </section>

      {/* Reviews */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet for this material.</p>
        ) : (
          reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        )}

        <ReviewForm
          jobId={null}
          sku={`${manufacturer}-${material}`}
          userEmail={userEmail}
        />
      </section>

      {/* Related Filaments */}
      {related.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h3>Related Filaments</h3>
          <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            {related.map((item) => {
              const comboKey = `${item.material}|${item.manufacturer}`;
              const ratingData = relatedRatingsMap[comboKey] || { avgRating: null, reviewCount: 0 };

              return (
                <div key={item.sku} style={{ flex: '0 0 auto', width: '220px' }}>
                  <FilamentCard
                    sku={item.sku}
                    image={item.image}
                    material={item.material}
                    color={item.color}
                    price={item.costPerGram * 1000}
                    onAddToCart={() => handleAddToCart(item)}
                    avgRating={ratingData.avgRating}
                    reviewCount={ratingData.reviewCount}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
