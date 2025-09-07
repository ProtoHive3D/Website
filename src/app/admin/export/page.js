// File: src/app/admin/export/page.js
// Last updated: 2025-09-02 21:58 CDT

'use client';
import { useState } from 'react';

export default function ExportPage() {
  const [status, setStatus] = useState(null);

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export');
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quotes.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus('Export successful');
    } catch (err) {
      setStatus('Export failed: ' + err.message);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Export Quotes</h2>
      <p>Click below to download a CSV of all submitted quotes.</p>
      <button
        onClick={handleExport}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Download CSV
      </button>
      {status && <p style={{ marginTop: '1rem', color: '#555' }}>{status}</p>}
    </main>
  );
}