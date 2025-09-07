import { Suspense } from 'react';
import QuoteContent from './QuoteContent';

export default function QuotePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Request a 3D Printing Quote</h2>
      <Suspense fallback={<p>Loading quote form...</p>}>
        <QuoteContent />
      </Suspense>
    </main>
  );
}
