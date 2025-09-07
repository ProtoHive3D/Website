'use client';

export default function ExportTipsModal({ showModal, setShowModal }) {
  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <h3>Export Tips for 3MF and OBJ</h3>
        <ul>
          <li>Use millimeters as your export unit.</li>
          <li>Ensure your model is watertight and manifold.</li>
          <li>Center your model and remove unused meshes.</li>
          <li>For OBJ, include the .mtl file if textures are relevant.</li>
        </ul>
        <button onClick={() => setShowModal(false)} style={{
          marginTop: '1rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Close
        </button>
      </div>
    </div>
  );
}