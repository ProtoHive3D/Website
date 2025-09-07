'use client';

import { useState, useEffect } from 'react';

export default function QuoteUploadForm({ onValidated, setFormStatus, setStatusType }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    quantity: ''
  });

  useEffect(() => {
    const saved = sessionStorage.getItem('quoteForm');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('quoteForm', JSON.stringify(formData));
  }, [formData]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const honeypot = e.target.honeypot.value;
    if (honeypot) return;

    const { name, email, quantity } = formData;
    if (!name || !email || !quantity || !file) {
      setFormStatus('Please fill out all required fields.');
      setStatusType('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormStatus('Your file is too large. Please upload a file under 10MB.');
      setStatusType('error');
      return;
    }

    const allowedExtensions = ['stl', 'obj', '3mf'];
    const fileExt = file.name.toLowerCase().split('.').pop();
    if (!allowedExtensions.includes(fileExt)) {
      setFormStatus('Unsupported file type. Please upload STL, OBJ, or 3MF files.');
      setStatusType('error');
      return;
    }

    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('quantity', quantity);
    form.append('file', file);

    setFormStatus('Sending...');
    setStatusType('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        body: form
      });
      const data = await res.json();

      if (data.success && data.jobId) {
        const grams = parseFloat(data.grams);
        onValidated({
          jobId: data.jobId,
          grams,
          dimensions: data.dimensions
        });
        setFormStatus('3D file validated! Select your material below.');
        setStatusType('success');
      } else {
        setFormStatus('There was a problem with your submission.');
        setStatusType('error');
      }
    } catch {
      setFormStatus('Something went wrong. Please try again later.');
      setStatusType('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} style={{ marginTop: '2rem' }}>
      <input type="text" name="honeypot" style={{ display: 'none' }} />

      <label>
        Name:
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        />
      </label>

      <br /><br />

      <label>
        Email:
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        />
      </label>

      <br /><br />

      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          required
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        />
      </label>

      <br /><br />

      <div
        style={{
          border: '2px dashed #0070f3',
          padding: '1rem',
          borderRadius: '6px',
          backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onClick={() => document.getElementById('fileInput').click()}
      >
        {file ? (
          <p><strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</p>
        ) : (
          <p>Drag and drop your 3D file here, or click to select</p>
        )}
        <input
          type="file"
          id="fileInput"
          name="file"
          required
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </div>

      <br />

      <button type="submit" style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Submit File
      </button>
    </form>
  );
}