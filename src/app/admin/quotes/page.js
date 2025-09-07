'use client';
import { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;

  useEffect(() => {
    fetch('/api/admin/quotes')
      .then(res => res.json())
      .then(data => {
        if (data.success) setQuotes(data.quotes);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset to first page when filter changes
  }, [filterStatus]);

  const handleDelete = async (jobId) => {
    const confirmed = confirm(`Delete quote ${jobId}?`);
    if (!confirmed) return;

    const res = await fetch('/api/admin/delete-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    });

    const data = await res.json();
    if (data.success) {
      setQuotes(prev => prev.filter(q => q.job_id !== jobId));
    }
  };

  const filteredQuotes = quotes.filter(q => filterStatus === 'all' || q.status === filterStatus);
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const paginatedQuotes = filteredQuotes.slice((currentPage - 1) * quotesPerPage, currentPage * quotesPerPage);

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Admin Dashboard: Quotes</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={async () => {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
            window.location.href = '/admin/login';
          }}
          style={{
            backgroundColor: '#555',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>

        <label>
          Filter by status:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem', borderRadius: '4px' }}
          >
            <option value="all">All</option>
            <option value="submitted">Submitted</option>
            <option value="in_production">In Production</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      {filteredQuotes.length === 0 ? (
        <p>No quotes found.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Job ID</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Material</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Color</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Grams</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Cost</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Submitted</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuotes.map((q) => (
                <tr key={q.job_id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem' }}>{q.job_id}</td>
                  <td style={{ padding: '0.5rem' }}>{q.material}</td>
                  <td style={{ padding: '0.5rem' }}>{q.color}</td>
                  <td style={{ padding: '0.5rem' }}>{q.grams}</td>
                  <td style={{ padding: '0.5rem' }}>${q.cost}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={q.status} />
                      <select
                        value={q.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const res = await fetch('/api/admin/status', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ jobId: q.job_id, status: newStatus })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setQuotes(prev =>
                              prev.map(q2 =>
                                q2.job_id === q.job_id ? { ...q2, status: newStatus } : q2
                              )
                            );
                          }
                        }}
                        style={{
                          padding: '0.25rem',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          backgroundColor: '#fff',
                          fontSize: '0.9rem'
                        }}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="in_production">In Production</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {new Date(q.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <a
                      href={`/admin/quotes/${q.job_id}`}
                      style={{ color: '#0070f3', textDecoration: 'underline', marginRight: '1rem' }}
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(q.job_id)}
                      style={{
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: currentPage === 1 ? '#eee' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Prev
            </button>

            <span style={{ alignSelf: 'center' }}>Page {currentPage}</span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: currentPage >= totalPages ? '#eee' : '#fff',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}