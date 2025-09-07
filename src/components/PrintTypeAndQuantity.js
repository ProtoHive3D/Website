'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PrintTypeAndQuantity({ printType, setPrintType, quantity, setQuantity }) {
  const searchParams = useSearchParams();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const param = searchParams.get('printType');
    if (param) {
      setPrintType(param);
    } else {
      setPrintType('Personalized Custom Print');
    }
  }, [searchParams, setPrintType]);

  useEffect(() => {
    const q = parseInt(quantity, 10);
    setShowWarning(q > 10);
  }, [quantity]);

  return (
    <section style={{ marginTop: '2rem' }}>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Print Type:
        <select
          value={printType}
          onChange={(e) => setPrintType(e.target.value)}
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        >
          <option>Personalized Custom Print</option>
          {[...Array(10)].map((_, i) => (
            <option key={i}>Print Model {i + 1}</option>
          ))}
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Quantity:
        <input
          type="number"
          min="1"
          max="100"
          value={quantity}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              setQuantity(val);
            }
          }}
          style={{ marginLeft: '1rem', padding: '0.5rem', width: '80px' }}
        />
      </label>

      {showWarning && (
        <p style={{ color: '#b00', fontSize: '0.9rem' }}>
          Orders over 10 will take an exceptional amount of time.
        </p>
      )}
    </section>
  );
}