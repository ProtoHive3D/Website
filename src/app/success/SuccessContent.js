// File: src/app/success/SuccessContent.js
// Last updated: 2025-09-02 21:53 CDT

'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';

export default function SuccessContent() {
  const params = useSearchParams();
  const jobId = params.get('jobId') || params.get('job'); // support both keys
  const fallback = {
    material: params.get('material'),
    color: params.get('color'),
    grams: params.get('grams'),
    cost: params.get('cost')
  };

  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchQuote = async () => {
      const res = await fetch(`/api/quote/${jobId}`);
      const data = await res.json();
      if (data.success) setQuote(data.quote);
    };

    fetchQuote(); // initial fetch
    const interval = setInterval(fetchQuote, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [jobId]);

  const display = quote || { job_id: jobId, ...fallback };

  return (
    <>
      <p>Thank you for your submission. Your quote has been recorded.</p>

      <p><strong>Job ID:</strong> {display.job_id}</p>
      <p><strong>Material:</strong> {display.material}</p>
      <p><strong>Color:</strong> {display.color}</p>
      <p><strong>Estimated Weight:</strong> {display.grams} g</p>
      <p><strong>Estimated Cost:</strong> ${display.cost}</p>

      {display.status && (
        <p style={{ marginTop: '1rem' }}>
          <strong>Status:</strong> <StatusBadge status={display.status} />
        </p>
      )}

      {display.created_at && (
        <p style={{ fontSize: '0.9rem', color: '#555' }}>
          Submitted: {new Date(display.created_at).toLocaleString()}
        </p>
      )}

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        You may print this page or save your Job ID for future reference.
      </p>
    </>
  );
}