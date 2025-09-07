'use client';
import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

export default function AuditSummaryPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success) setLogs(data.logs);
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!logs.length) return;

    const ctx = document.getElementById('actionChart');
    const counts = logs.reduce((acc, log) => {
      const date = log.timestamp.slice(0, 10);
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [{ label: 'Actions per Day', data: Object.values(counts) }]
      }
    });
  }, [logs]);

  return (
    <main style={{ padding: '2rem' }}>
      <h2>Audit Summary</h2>
      <canvas id="actionChart" width="800" height="400"></canvas>
    </main>
  );
}