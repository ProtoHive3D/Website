export default function CheckoutSummary({ subtotal, discountRate, discountAmount, total }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
      {discountRate > 0 && (
        <p style={{ color: '#0070f3' }}>
          Bundle Discount ({(discountRate * 100).toFixed(0)}%): -${discountAmount.toFixed(2)}
        </p>
      )}
      <p><strong>Total:</strong> ${total.toFixed(2)}</p>
    </div>
  );
}