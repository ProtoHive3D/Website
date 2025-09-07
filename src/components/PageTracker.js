'use client';
import { useEffect } from 'react';

export default function PageTracker() {
  useEffect(() => {
    fetch('/api/track-pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname })
    });
  }, []);

  return null;
}