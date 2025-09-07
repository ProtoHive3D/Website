// components/StatusBadge.js
export default function StatusBadge({ status }) {
  const colorMap = {
    submitted: '#3498db',
    in_production: '#f39c12',
    shipped: '#2ecc71',
    completed: '#8e44ad'
  };

  const labelMap = {
    submitted: 'Submitted',
    in_production: 'In Production',
    shipped: 'Shipped',
    completed: 'Completed'
  };

  const bgColor = colorMap[status] || '#999';
  const label = labelMap[status] || 'Unknown';

  return (
    <span style={{
      backgroundColor: bgColor,
      color: '#fff',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    }}>
      {label}
    </span>
  );
}
