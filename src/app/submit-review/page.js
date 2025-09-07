'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SubmitReviewPage() {
  const [formStatus, setFormStatus] = useState('');
  const [isGeneral, setIsGeneral] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobId = e.target.jobId.value.trim();
    const email = e.target.email.value.trim();
    const sku = e.target.sku.value.trim();
    const scope = e.target.scope.value;
    const rating = parseInt(e.target.rating.value);
    const message = e.target.message.value.trim();
    const honeypot = e.target.honeypot.value;

    if (honeypot) return; // bot detected

    if (!email || !message || !rating || (scope === 'product' && !sku)) {
      setFormStatus('Please fill out all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setFormStatus('Please enter a valid email address.');
      return;
    }

    const res = await fetch('/api/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, email, sku, scope, rating, message })
    });

    const data = await res.json();
    if (data.success) {
      setFormStatus('Review submitted! Pending moderation.');
      e.target.reset();
    } else {
      setFormStatus('Error submitting review. Please try again.');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Submit a Review</h2>
      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Share your experience with a product or order. All reviews are moderated before publishing.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" name="jobId" placeholder="Job ID (optional)" />
        <input type="email" name="email" placeholder="Email (required)" required />
        <select name="scope" required onChange={(e) => setIsGeneral(e.target.value === 'general')}>
          <option value="">Review Scope</option>
          <option value="product">Specific Product</option>
          <option value="order">Entire Order</option>
          <option value="general">General Feedback</option>
        </select>
        {!isGeneral && (
          <input type="text" name="sku" placeholder="Product SKU (required if reviewing a product)" />
        )}
        <select name="rating" required>
          <option value="">Rating</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>
        <textarea name="message" placeholder="Your review..." required></textarea>
        <input type="text" name="honeypot" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
        <input type="submit" value="Submit Review" />
      </form>

      {formStatus && <p style={{ marginTop: '1rem', color: '#0070f3' }}>{formStatus}</p>}

      {isGeneral && (
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#777' }}>
          For general questions or feedback, please use our <Link href="#contact">Contact Us</Link> form on the homepage.
        </p>
      )}
    </main>
  );
}
