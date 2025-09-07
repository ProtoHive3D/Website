'use client';

import QuoteSummary from './QuoteSummary';

export default function QuoteSummarySection({
  summaryRef,
  quoteMeta,
  selectedColor,
  selectedSKU,
  estimatedCost,
  selectedMaterial,
  handleCheckout
}) {
  if (!quoteMeta || !selectedColor || !selectedSKU) return null;

  return (
    <div ref={summaryRef} style={{ marginTop: '2rem' }}>
      <QuoteSummary
        jobId={quoteMeta.jobId}
        grams={quoteMeta.grams}
        cost={estimatedCost}
        material={selectedMaterial}
        color={selectedColor}
        sku={selectedSKU.sku}
        onCheckout={handleCheckout}
      />
    </div>
  );
}