'use client';
import Image from 'next/image';

export default function ThankYouPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Thank You for Your Order</h2>
      <p>Your order has been received and is now being processed.</p>

      <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#555' }}>
        We’ll send you an email with tracking details once your items ship.
      </p>

      <Image
        src="/icons/confirmation.svg"
        alt="Order confirmed"
        width={120}
        height={120}
        style={{ marginTop: '2rem' }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
        Need help? <a href="/contact" style={{ color: '#0070f3' }}>Contact support</a>
      </p>
    </main>
  );
}