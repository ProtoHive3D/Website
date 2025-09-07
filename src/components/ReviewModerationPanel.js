'use client';
import { useEffect, useState } from 'react';

export default function ReviewModerationPanel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [toast, setToast] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/reviews');
    const data = await res.json();
    if (data.success) setReviews(data.reviews);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleReview = async (id, isPublic) => {
    await fetch('/api/admin/reviews/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_public: isPublic })
    });
    setToast(`Review ${isPublic ? 'approved' : 'hidden'} successfully`);
    fetchReviews();
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = reviews.filter(r =>
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>Review Moderation</h3>

      <input
        type="text"
        placeholder="Search by email or message"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

      <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} style={{ marginBottom: '1rem' }}>
        <option value="timestamp">Newest</option>
        <option value="rating">Highest Rating</option>
      </select>

      {toast && <p style={{ color: '#0078d4', marginBottom: '1rem' }}>{toast}</p>}

      {loading ? (
        <p>Loading reviews...</p>
      ) : sorted.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Rating</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{r.email}</td>
                <td>{r.rating} ⭐</td>
                <td>{r.message}</td>
                <td>{r.status}</td>
                <td>
                  {r.is_public ? (
                    <button onClick={() => toggleReview(r.id, false)}>Hide</button>
                  ) : (
                    <button onClick={() => toggleReview(r.id, true)}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
