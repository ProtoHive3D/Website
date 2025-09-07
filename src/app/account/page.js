'use client';
import { useEffect, useState } from 'react';
import ReviewForm from '@/components/ReviewForm';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReview, setOpenReview] = useState({}); // track toggled rows

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetch('/api/account');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setOrders(data.orders);
      }
      setLoading(false);
    };

    fetchAccount();
  }, []);

  const toggleReview = (jobId) => {
    setOpenReview((prev) => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading account...</p>;
  if (!user) return <p style={{ padding: '2rem' }}>Please log in to view your account.</p>;

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Welcome, {user.name || user.email}</h2>
      <p style={{ marginBottom: '2rem' }}>Here’s your order history and review options.</p>

      <section>
        <h3>Order History</h3>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem' }}>Job ID</th>
                <th style={{ padding: '0.5rem' }}>Material</th>
                <th style={{ padding: '0.5rem' }}>Color</th>
                <th style={{ padding: '0.5rem' }}>Grams</th>
                <th style={{ padding: '0.5rem' }}>Cost</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem' }}>Review</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem' }}>{o.job_id}</td>
                  <td style={{ padding: '0.5rem' }}>{o.material}</td>
                  <td style={{ padding: '0.5rem' }}>{o.color}</td>
                  <td style={{ padding: '0.5rem' }}>{o.grams}</td>
                  <td style={{ padding: '0.5rem' }}>${o.cost.toFixed(2)}</td>
                  <td style={{ padding: '0.5rem' }}>{o.status}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {o.status === 'fulfilled' ? (
                      <>
                        <button onClick={() => toggleReview(o.job_id)}>
                          {openReview[o.job_id] ? 'Hide Review Form' : 'Leave Review'}
                        </button>
                        {openReview[o.job_id] && (
                          <ReviewForm
                            jobId={o.job_id}
                            sku={o.sku}
                            userEmail={user.email}
                          />
                        )}
                      </>
                    ) : (
                      <span style={{ color: '#999' }}>Not eligible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => fetch('/api/logout').then(() => location.reload())}>
          Log Out
        </button>
      </div>
    </main>
  );
}
