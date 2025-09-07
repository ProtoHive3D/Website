'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';

export default function QuoteDetailPage() {
  const { jobId } = useParams();
  const [quote, setQuote] = useState(null);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (jobId) {
      fetch(`/api/quote/${jobId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setQuote(data.quote);
            setFormData(data.quote);
            setStatus(data.quote.status);
          }
        });
    }
  }, [jobId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/update-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, ...formData, status })
    });
    const data = await res.json();
    if (data.success) setQuote(data.updated);
  };

  const handleDelete = async () => {
    const confirmed = confirm(`Delete quote ${jobId}?`);
    if (!confirmed) return;

    const res = await fetch('/api/admin/delete-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    });

    const data = await res.json();
    if (data.success) {
      window.location.href = '/admin/quotes';
    }
  };

  if (!quote) return <p style={{ padding: '2rem' }}>Loading quote details...</p>;

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edit Quote</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Material:
          <input
            type="text"
            value={formData.material || ''}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          />
        </label>
        <label>
          Color:
          <input
            type="text"
            value={formData.color || ''}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </label>
        <label>
          Cost:
          <input
            type="number"
            value={formData.cost || ''}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="submitted">Submitted</option>
            <option value="in_production">In Production</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <button type="submit" style={{ backgroundColor: '#0070f3', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px' }}>
          Update Quote
        </button>
      </form>

      <button
        onClick={handleDelete}
        style={{
          backgroundColor: '#e74c3c',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          marginTop: '1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Delete Quote
      </button>

      <button
        onClick={() => window.print()}
        style={{
          backgroundColor: '#2ecc71',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          marginTop: '1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Print Summary
      </button>

      <div className="print-summary" style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>ProtoHive3D Quote Summary</h1>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <p><strong>Job ID:</strong> {quote.job_id}</p>
        <p><strong>Material:</strong> {quote.material}</p>
        <p><strong>Color:</strong> {quote.color}</p>
        <p><strong>Grams:</strong> {quote.grams}</p>
        <p><strong>Cost:</strong> ${quote.cost}</p>
        <p><strong>Status:</strong> <StatusBadge status={quote.status} /></p>
        <p><strong>Submitted:</strong> {new Date(quote.created_at).toLocaleString()}</p>
      </div>

      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-size: 12pt;
            color: #000;
          }

          .print-summary {
            padding: 2rem;
            max-width: 600px;
            margin: 0 auto;
          }

          button, nav, .non-printable {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}