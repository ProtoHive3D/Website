export default function ReviewCard({ review }) {
  const { email, rating, message, timestamp } = review;

  const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1***$2');
  const date = new Date(timestamp).toLocaleDateString();

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#fafafa'
    }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>{maskedEmail}</strong> <span style={{ color: '#999', fontSize: '0.85rem' }}>on {date}</span>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ color: i <= rating ? '#f5a623' : '#ccc', fontSize: '1.2rem' }}>★</span>
        ))}
      </div>

      <p style={{ fontSize: '0.95rem', color: '#333' }}>{message}</p>
    </div>
  );
}
