'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      window.location.href = '/account';
    } else {
      setStatus(data.error || 'Login failed');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Log In</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="submit" value="Log In" />
      </form>
      {status && <p style={{ marginTop: '1rem', color: '#f00' }}>{status}</p>}
    </main>
  );
}