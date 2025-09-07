'use client';
import { useEffect, useState } from 'react';

export default function AdminReviewModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [skuFilter, setSkuFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setFiltered(data.reviews);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    let result = [...reviews];

    if (skuFilter) result = result.filter(r => r.sku === skuFilter);
    if (ratingFilter) result = result.filter(r => r.rating === parseInt(ratingFilter));
    if (searchTerm)
      result = result.filter(r =>
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (dateStart)
      result = result.filter(r => new Date(r.timestamp) >= new Date(dateStart));
    if (dateEnd)
      result = result.filter(r => new Date(r.timestamp) <= new Date(dateEnd));

    setFiltered(result);
  }, [skuFilter, ratingFilter, searchTerm, dateStart, dateEnd, reviews]);

  const toggleVisibility = async (id, currentStatus) => {
    const res = await fetch('/api/admin/reviews/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_public: !currentStatus })
    });

    const data = await res.json();
    if (data.success) {
      const updated = reviews.map(r => r.id === id ? { ...r, is_public: !currentStatus } : r);
      setReviews(updated);
    }
  };

  const bulkToggle = async (makePublic = true) => {
    for (const id of selectedIds) {
      await fetch('/api/admin/reviews/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_public: makePublic })
      });
    }

    const updated = reviews.map(r =>
      selectedIds.includes(r.id) ? { ...r, is_public: makePublic } : r
    );

    setReviews(updated);
    setSelectedIds([]);
  };

  const handleCheckbox = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const uniqueSKUs = [...new Set(reviews.map(r => r.sku).filter(Boolean))];

  if (loading) return <p style={{ padding: '2rem' }}>Loading reviews...</p>;

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Admin Dashboard: Review Moderation</h2>

      {/* 🔽 Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <select value={skuFilter} onChange={e => setSkuFilter(e.target.value)}>
          <option value="">Filter by SKU</option>
          {uniqueSKUs.map((sku, i) => (
            <option key={i} value={sku}>{sku}</option>
          ))}
        </select>

        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
          <option value="">Filter by Rating</option>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{'★'.repeat(r)}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search email or message"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <input
          type="date"
          value={dateStart}
          onChange={e => setDateStart(e.target.value)}
        />
        <input
          type="date"
          value={dateEnd}
          onChange={e => setDateEnd(e.target.value)}
        />

        <a href="/api/admin/reviews/export" download>
          <button>Download CSV</button>
        </a>
      </div>

      {/* 🧰 Bulk Moderation Controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => bulkToggle(true)}>Make Public</button>
        <button onClick={() => bulkToggle(false)}>Hide</button>
      </div>

      {filtered.length === 0 ? (
        <p>No reviews match the selected filters.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem' }}></th>
              <th style={{ padding: '0.5rem' }}>Email</th>
              <th style={{ padding: '0.5rem' }}>SKU</th>
              <th style={{ padding: '0.5rem' }}>Scope</th>
              <th style={{ padding: '0.5rem' }}>Rating</th>
              <th style={{ padding: '0.5rem' }}>Message</th>
              <th style={{ padding: '0.5rem' }}>Visible</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={() => handleCheckbox(r.id)}
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>{r.email}</td>
                <td style={{ padding: '0.5rem' }}>{r.sku || '—'}</td>
                <td style={{ padding: '0.5rem' }}>{r.scope}</td>
                <td style={{ padding: '0.5rem' }}>{'★'.repeat(r.rating)}</td>
                <td style={{ padding: '0.5rem' }}>{r.message}</td>
                <td style={{ padding: '0.5rem' }}>{r.is_public ? '✅' : '❌'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button onClick={() => toggleVisibility(r.id, r.is_public)}>
                    {r.is_public ? 'Hide' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}