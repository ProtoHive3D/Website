'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState('');
  const searchParams = useSearchParams();

  // Auto-select inquiry type from ?type= query
  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      const select = document.querySelector('select[name="inquiry"]');
      if (select) select.value = type;
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const inquiry = e.target.inquiry.value;
    const message = e.target.message.value.trim();
    const honeypot = e.target.honeypot.value;

    if (honeypot) {
      e.preventDefault();
      return;
    }
    if (!name || !email || !inquiry || !message) {
      e.preventDefault();
      setFormStatus('Please fill out all required fields.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      e.preventDefault();
      setFormStatus('Please enter a valid email address.');
      return;
    }
    setFormStatus('Sending...');
  };

  return (
    <section id="contact-us" style={{ marginBottom: '3rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Contact Us</h2>
      <form
        action="https://formspree.io/f/xkgzlkje"
        method="POST"
        onSubmit={handleSubmit}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name="name" placeholder="Name" required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" placeholder="Email" required />

        <label htmlFor="inquiry">Inquiry Type</label>
        <select id="inquiry" name="inquiry" required>
          <option value="">Select Inquiry Type</option>
          <option value="quote">Quote Request</option>
          <option value="workshop">Workshop Inquiry</option>
          <option value="consultation">Design Consultation</option>
          <option value="general">General Question</option>
        </select>

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" placeholder="Your message..." required></textarea>

        {/* Honeypot */}
        <input
          type="text"
          name="honeypot"
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
        />

        <button type="submit">Send</button>
      </form>
      {formStatus && (
        <p style={{ marginTop: '1rem', color: '#e74c3c', textAlign: 'center' }}>
          {formStatus}
        </p>
      )}
    </section>
  );
}