'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { getBundleDiscount } from '@/data/skuList';
import { parseSku } from '@/utils/parseSku';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Placeholder email until auth is wired in
  const currentUserEmail = '';

  const totalRolls = cartItems
    .filter(item => item.type === 'filament' || item.material)
    .reduce((sum, item) => sum + item.quantity, 0);

  const discountRate = getBundleDiscount(totalRolls);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = cartItems
    .filter(item => item.type === 'filament' || item.material)
    .reduce((sum, item) => sum + (item.price * item.quantity * discountRate), 0);
  const totalCost = subtotal - discountAmount;

  const handleCheckout = async () => {
    try {
      setLoadingCheckout(true);
      const res = await fetch('/api/order/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cart',
          items: cartItems,
          total: totalCost,
          email: currentUserEmail
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout error.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item) => {
              const isFilament = item.type === 'filament' || item.material;
              const discountedPrice = isFilament && discountRate > 0
                ? parseFloat((item.price * (1 - discountRate)).toFixed(2))
                : item.price;
              const { manufacturer } = parseSku(item.sku);

              return (
                <li
                  key={item.sku}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '1rem',
                  }}
                >
                  <Link href={`/filament/${item.material}/${manufacturer}`}>
                    <Image
                      src={item.image}
                      alt={item.color}
                      width={80}
                      height={80}
                      style={{ borderRadius: '6px', cursor: 'pointer' }}
                    />
                  </Link>

                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: 0 }}>
                      <Link
                        href={`/filament/${item.material}/${manufacturer}`}
                        style={{ textDecoration: 'none', color: '#0070f3' }}
                      >
                        {item.material} – {item.color}
                      </Link>
                    </h4>

                    {isFilament && discountRate > 0 ? (
                      <>
                        <p style={{ margin: 0 }}>
                          <span style={{ textDecoration: 'line-through', color: '#888' }}>
                            ${item.price.toFixed(2)}
                          </span>{' '}
                          <span style={{ color: '#0070f3', fontWeight: 'bold' }}>
                            ${discountedPrice.toFixed(2)}
                          </span>{' '}
                          × {item.quantity}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#0070f3', margin: 0 }}>
                          {`${(discountRate * 100).toFixed(0)}% Bundle Savings`} – You save ${( (item.price - discountedPrice) * item.quantity ).toFixed(2)}!
                        </p>
                      </>
                    ) : (
                      <p style={{ margin: 0 }}>
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    )}

                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => updateQuantity(item.sku, parseInt(e.target.value))}
                      style={{ width: '60px', marginTop: '0.25rem' }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${item.material} – ${item.color} from cart?`)) {
                        removeItem(item.sku);
                      }
                    }}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.4rem 0.8rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>

          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>

          {discountRate > 0 && (
            <p style={{ color: '#0070f3' }}>
              Bundle Discount ({(discountRate * 100).toFixed(0)}%): -${discountAmount.toFixed(2)}
            </p>
          )}

          <p><strong>Total:</strong> ${totalCost.toFixed(2)}</p>

          {discountRate < 0.10 && totalRolls > 0 && (
            <p style={{ color: '#0070f3' }}>
              Add {discountRate === 0 ? 3 - totalRolls : 10 - totalRolls} more roll
              {(discountRate === 0 ? 3 - totalRolls : 10 - totalRolls) > 1 ? 's' : ''} to unlock{' '}
              {discountRate === 0 ? '5%' : '10%'} off!
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={clearCart}
              style={{
                backgroundColor: '#e74c3c',
                color: '#fff',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Clear Cart
            </button>

            <button
              disabled={cartItems.length === 0 || loadingCheckout}
              onClick={handleCheckout}
              style={{
                backgroundColor: cartItems.length === 0 ? '#ccc' : '#0070f3',
                color: '#fff',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                flex: 1
              }}
            >
              {loadingCheckout ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
