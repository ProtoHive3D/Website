'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [status, setStatus] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const name = e.target.name.value.trim();

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    const data = await res.json();
    if (data.success) {
      window.location.href = '/account';
    } else {
      setStatus(data.error || 'Signup failed');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" name="name" placeholder="Name (optional)" />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="submit" value="Create Account" />
      </form>
      {status && <p style={{ marginTop: '1rem', color: '#f00' }}>{status}</p>}
    </main>
  );
}