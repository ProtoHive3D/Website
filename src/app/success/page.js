// File: src/app/success/page.js
// Last updated: 2025-09-02 21:53 CDT

'use client';
import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function SuccessPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Quote Submitted Successfully</h2>
      <Suspense fallback={<p>Loading quote details...</p>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}