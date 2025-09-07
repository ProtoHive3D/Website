// File: src/app/checkout/page.js
// Updated to align with Stripe checkout flow

'use client';
import { Suspense } from 'react';
import CheckoutContent from '@/components/CheckoutContent';

export default function CheckoutPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Review & Proceed to Payment</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Please review your order details below. When you’re ready, click the button to securely complete your payment.
      </p>
      <Suspense fallback={<p>Loading checkout...</p>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
