'use client';
import { useEffect, useState } from 'react';
import ReviewModerationPanel from '@/components/ReviewModerationPanel';
import UserManagementPanel from '@/components/UserManagementPanel';


export default function AdminDashboardPage() {
  const [summary, setSummary] = useState({
    total: 0,
    recentAction: null,
    activeAdmins: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch('/api/admin/audit-logs?page=1&limit=100');
      const data = await res.json();
      if (data.success) {
        const logs = data.logs;
        const total = data.pagination.totalEntries;
        const recentAction = logs[0];
        const activeAdmins = new Set(logs.map(l => l.actor_email)).size;

        setSummary({ total, recentAction, activeAdmins });
      }
    };

    fetchSummary();
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Admin Dashboard</h2>

      {/* ✅ Audit Summary Card */}
      <div style={{
        background: '#f5f5f5',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Audit Summary</h3>
        <p><strong>Total Logs:</strong> {summary.total}</p>
        <p><strong>Active Admins:</strong> {summary.activeAdmins}</p>
        {summary.recentAction && (
          <p>
            <strong>Recent Action:</strong> {summary.recentAction.actor_email} → {summary.recentAction.action} on {summary.recentAction.target || '—'}
          </p>
        )}
        <a href="/admin/audit-logs" style={{ marginTop: '0.5rem', display: 'inline-block', color: '#0078d4' }}>
          View Full Audit Logs →
        </a>
      </div>

      {/* 🧩 Add other admin tools or cards below */}
	  <ReviewModerationPanel />
	  <UserManagementPanel />

      <section>
        <h3>Tools & Moderation</h3>
        <p>Use the sidebar or links above to manage reviews, users, and system settings.</p>
      </section>
    </main>
  );
}