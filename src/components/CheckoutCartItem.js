import Image from 'next/image';

export default function CheckoutCartItem({ item, discountRate, updateQuantity, removeItem }) {
  const discountedPrice = item.type === 'filament' && discountRate > 0
    ? item.price * (1 - discountRate)
    : item.price;

  const savings = item.type === 'filament' && discountRate > 0
    ? (item.price - discountedPrice) * item.quantity
    : 0;

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem',
      }}
    >
      <Image
        src={item.image}
        alt={item.color || `${item.material} image`}
        width={80}
        height={80}
        style={{ borderRadius: '6px' }}
      />
      <div style={{ flexGrow: 1 }}>
        <h4>{item.material} – {item.color}</h4>
        <p>
          ${item.price.toFixed(2)} ×{' '}
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={(e) => updateQuantity(item.sku, parseInt(e.target.value))}
            style={{ width: '60px', marginLeft: '0.5rem' }}
          />
        </p>
        {savings > 0 && (
          <p style={{ fontSize: '0.8rem', color: '#0070f3', margin: 0 }}>
            {(discountRate * 100).toFixed(0)}% Bundle Savings – You save ${savings.toFixed(2)}!
          </p>
        )}
      </div>
      <button onClick={() => removeItem(item.sku)}>Remove</button>
    </li>
  );
}