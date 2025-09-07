'use client';
import { useEffect, useState } from 'react';

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actorFilter, setActorFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 25;

  const [integrityMap, setIntegrityMap] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      const params = new URLSearchParams({
        actor: actorFilter,
        action: actionFilter,
        role: roleFilter,
        start: startDate,
        end: endDate,
        page: currentPage,
        limit: logsPerPage
      });

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
      setLoading(false);
    };

    fetchLogs();
  }, [actorFilter, actionFilter, roleFilter, startDate, endDate, currentPage]);

  useEffect(() => {
    if (!logs.length) return;

    const fetchIntegrity = async () => {
      const ids = logs.map(log => log.id);
      const res = await fetch('/api/admin/audit-logs/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      const data = await res.json();
      if (data.success) setIntegrityMap(data.integrity);
    };

    fetchIntegrity();
  }, [logs]);

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  const exportUrl = `/api/admin/audit-logs/export?actor=${actorFilter}&action=${actionFilter}&role=${roleFilter}&start=${startDate}&end=${endDate}&page=${currentPage}&limit=${logsPerPage}`;

  if (loading) return <p style={{ padding: '2rem' }}>Loading audit logs...</p>;

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Admin Dashboard: Audit Logs</h2>
      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Every sensitive action is logged for transparency and traceability.
      </p>

      <a
        href={exportUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', marginBottom: '1rem' }}
      >
        <button>Download Filtered CSV</button>
      </a>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by actor email"
          value={actorFilter}
          onChange={e => setActorFilter(e.target.value)}
        />
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          <option value="">Filter by action type</option>
          {uniqueActions.map((action, i) => (
            <option key={i} value={action}>{action}</option>
          ))}
        </select>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">Filter by affected role</option>
          <option value="admin">admin</option>
          <option value="moderator">moderator</option>
          <option value="user">user</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      {logs.length === 0 ? (
        <p>No logs match the selected filters.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem' }}>Actor</th>
                <th style={{ padding: '0.5rem' }}>Action</th>
                <th style={{ padding: '0.5rem' }}>Target</th>
                <th style={{ padding: '0.5rem' }}>Details</th>
                <th style={{ padding: '0.5rem' }}>Timestamp</th>
                <th style={{ padding: '0.5rem' }}>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem' }}>{log.actor_email}</td>
                  <td style={{ padding: '0.5rem' }}>{log.action}</td>
                  <td style={{ padding: '0.5rem' }}>{log.target || '—'}</td>
                  <td style={{ padding: '0.5rem' }}>{log.details}</td>
                  <td style={{ padding: '0.5rem' }}>{log.timestamp}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {integrityMap[log.id] === true ? '✅' :
                     integrityMap[log.id] === false ? '❌' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: currentPage === i + 1 ? '#333' : '#eee',
                  color: currentPage === i + 1 ? '#fff' : '#000',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}