import { Suspense } from 'react';
import HomeContent from './HomeContent';

export default function HomePage() {
  return (
    <Suspense fallback={<p>Loading home page...</p>}>
      <HomeContent />
    </Suspense>
  );
}
