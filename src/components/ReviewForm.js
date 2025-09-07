'use client';
import { useEffect, useState } from 'react';

export default function ReviewForm({ jobId, sku, userEmail }) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [scope, setScope] = useState('filament');

  useEffect(() => {
    // Auto-detect scope from SKU
    if (sku?.startsWith('PH-SVC')) setScope('service');
    else if (sku?.startsWith('PH-FIL')) setScope('filament');

    // Check if review already exists
    const checkReview = async () => {
      const res = await fetch(`/api/reviews?jobId=${jobId}`);
      const data = await res.json();
      if (data.success && data.reviews?.length > 0) {
        setAlreadyReviewed(true);
      }
    };

    checkReview();
  }, [jobId, sku]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    if (!message || rating < 1 || rating > 5) {
      setStatus({ type: 'error', text: 'Please enter a valid rating and message.' });
      setSubmitting(false);
      return;
    }

    const res = await fetch('/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, sku, scope, rating, message })
    });

    const data = await res.json();
    if (data.success) {
      setStatus({ type: 'success', text: 'Review submitted for moderation.' });
      setMessage('');
    } else {
      setStatus({ type: 'error', text: data.error || 'Submission failed.' });
    }

    setSubmitting(false);
  };

  if (!userEmail || alreadyReviewed) return null;

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <h3>Leave a Review <span style={{ fontSize: '0.9rem', color: '#0078d4' }}>Verified Purchase</span></h3>

      <label>
        Rating:
        <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          {[1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              onClick={() => setRating(r)}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: r <= rating ? '#f5a623' : '#ccc',
                marginRight: '0.25rem'
              }}
            >
              ★
            </span>
          ))}
        </div>
      </label>

      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          placeholder="Share your experience..."
        />
      </label>

      <br />

      <button type="submit" disabled={submitting} style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#0078d4',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>

      {status && (
        <p style={{ marginTop: '1rem', color: status.type === 'error' ? '#e74c3c' : '#0078d4' }}>
          {status.text}
        </p>
      )}
    </form>
  );
}
