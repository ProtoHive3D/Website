'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { getBundleDiscount } from '@/data/skuList';
import { devLog } from '@/utils/logger';
import CheckoutCartItem from '@/components/CheckoutCartItem';
import CheckoutSummary from '@/components/CheckoutSummary';
import QuoteSummary from '@/components/QuoteSummary';
import { useState } from 'react';

export default function CheckoutContent() {
  const params = useSearchParams();
  const jobId = params.get('job');
  const material = params.get('material');
  const color = params.get('color');
  const grams = params.get('grams');
  const cost = params.get('cost');
  const sku = params.get('sku');
  const emailParam = params.get('email') || '';

  const isQuoteCheckout = jobId && sku;
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Placeholder until you wire in real user email
  const currentUserEmail = emailParam;

  const totalRolls = cartItems
    .filter(item => item.type === 'filament')
    .reduce((sum, item) => sum + item.quantity, 0);

  const discountRate = getBundleDiscount(totalRolls);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = cartItems
    .filter(item => item.type === 'filament')
    .reduce((sum, item) => sum + item.price * item.quantity * discountRate, 0);
  const totalCost = subtotal - discountAmount;

  const handleSubmit = async () => {
    const payload = isQuoteCheckout
      ? {
          type: 'quote',
          jobId,
          sku,
          material,
          color,
          grams: parseFloat(grams),
          cost: parseFloat(cost),
          email: currentUserEmail
        }
      : {
          type: 'cart',
          items: cartItems,
          total: totalCost,
          email: currentUserEmail
        };

    devLog('Creating Stripe checkout session:', payload);

    try {
      setLoadingCheckout(true);
      const res = await fetch('/api/order/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success && result.url) {
        clearCart();
        window.location.href = result.url; // Redirect to Stripe Checkout
      } else {
        devLog('Checkout session creation failed:', result.error || 'Unknown error');
        alert('Checkout failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      devLog('Checkout session error:', err.message);
      alert('Unexpected error starting checkout.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <>
      {isQuoteCheckout ? (
        <QuoteSummary
          jobId={jobId}
          material={material}
          color={color}
          grams={grams}
          cost={cost}
        />
      ) : (
        <>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {cartItems.map((item) => (
                  <CheckoutCartItem
                    key={item.sku}
                    item={item}
                    discountRate={discountRate}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </ul>
              <CheckoutSummary
                subtotal={subtotal}
                discountRate={discountRate}
                discountAmount={discountAmount}
                total={totalCost}
              />
            </>
          )}
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={loadingCheckout || (!isQuoteCheckout && cartItems.length === 0)}
        style={{
          marginTop: '2rem',
          backgroundColor: loadingCheckout ? '#ccc' : '#28a745',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: loadingCheckout ? 'not-allowed' : 'pointer',
        }}
      >
        {loadingCheckout ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </>
  );
}
