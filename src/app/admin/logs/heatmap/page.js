'use client';
import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export default function AdminHeatmapPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success) setLogs(data.logs);
    };
    fetchLogs();
  }, []);

  const today = new Date();
  const startDate = new Date();
  startDate.setMonth(today.getMonth() - 3); // Last 3 months

  const values = logs.reduce((acc, log) => {
    const date = log.timestamp.slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const heatmapData = Object.entries(values).map(([date, count]) => ({
    date,
    count
  }));

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Admin Activity Heatmap</h2>
      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Visualize admin actions over time. Darker cells = more activity.
      </p>

      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={heatmapData}
        classForValue={val => {
          if (!val) return 'color-empty';
          if (val.count >= 10) return 'color-scale-4';
          if (val.count >= 5) return 'color-scale-3';
          if (val.count >= 2) return 'color-scale-2';
          return 'color-scale-1';
        }}
        tooltipDataAttrs={val => ({
          'data-tip': `${val.date}: ${val.count} actions`
        })}
        showWeekdayLabels
      />
    </main>
  );
}