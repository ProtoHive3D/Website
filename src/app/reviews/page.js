// File: src/app/reviews/page.js
// Last updated: 2025-09-02 21:34 CDT

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        // Sort by rating (desc), then message length (desc), then timestamp
        const sorted = data.reviews
          .filter(r => r.is_public)
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.message.length - a.message.length;
          })
          .slice(0, 3); // Top 3 only
        setReviews(sorted);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading reviews...</p>;

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Customer Reviews</h2>
      <p style={{ marginBottom: '2rem', color: '#555' }}>
        Here are a few of our most enthusiastic reviews from verified customers. We prioritize quality, transparency, and satisfaction in every order.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{r.email}</p>
            <p style={{ color: '#f39c12' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
            <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>&ldquo;{r.message}&rdquo;</p>
            <p style={{ fontSize: '0.85rem', color: '#777' }}>
              {r.scope === 'product' && r.sku ? `Verified purchase of ${r.sku}` : 'Order-level feedback'}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link href="https://www.etsy.com/shop/protohive3d#reviews" target="_blank" rel="noopener noreferrer">
          <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px' }}>
            View All Reviews on Etsy
          </button>
        </Link>
      </div>
    </main>
  );
}