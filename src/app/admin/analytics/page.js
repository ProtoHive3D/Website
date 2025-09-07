'use client';
import { useEffect, useState } from 'react';

export default function AdminAnalyticsPage() {
  const [clicks, setClicks] = useState([]);
  const [pageviews, setPageviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setClicks(data.clicks);
        setPageviews(data.pageviews);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading analytics...</p>;

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Admin Dashboard: Analytics</h2>

      {/* 🔗 Click Events */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Click Events</h3>
        {clicks.length === 0 ? (
          <p>No clicks recorded.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Label</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {clicks.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem' }}>{c.label}</td>
                  <td style={{ padding: '0.5rem' }}>{new Date(c.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 📈 Pageviews */}
      <section style={{ marginTop: '3rem' }}>
        <h3>Pageviews</h3>
        {pageviews.length === 0 ? (
          <p>No pageviews recorded.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Path</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {pageviews.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem' }}>{p.path}</td>
                  <td style={{ padding: '0.5rem' }}>{new Date(p.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
