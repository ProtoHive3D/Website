'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { devLog } from '@/utils/logger';
import { SKU_List } from '@/data/skuList';
import { materials } from '@/data/materials';

import QuoteUploadForm from '@/components/QuoteUploadForm';
import PrintTypeAndQuantity from '@/components/PrintTypeAndQuantity';
import MaterialSelector from '@/components/MaterialSelector';
import ColorPickerModal from '@/components/ColorPickerModal';
import QuoteSummarySection from '@/components/QuoteSummarySection';
import ExportTipsModal from '@/components/ExportTipsModal';

export default function QuoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summaryRef = useRef(null);

  const [formStatus, setFormStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [quoteMeta, setQuoteMeta] = useState(null);

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [printType, setPrintType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('N/A');

  const availableMaterials = useMemo(() => {
    return materials.filter(m =>
      m.colors.some(c => {
        const sku = SKU_List.find(s => s.sku === c.sku);
        return sku?.quantity > 0;
      })
    );
  }, []);

  const availableColors = useMemo(() => {
    const mat = materials.find(m => m.id === selectedMaterial);
    return mat?.colors.filter(c => {
      const sku = SKU_List.find(s => s.sku === c.sku);
      return sku?.quantity > 0;
    }) || [];
  }, [selectedMaterial]);

  const selectedSKU = useMemo(() => {
    return SKU_List.find(s =>
      s.material === selectedMaterial &&
      s.color === selectedColor &&
      s.quantity > 0
    );
  }, [selectedMaterial, selectedColor]);

  useEffect(() => {
    const param = searchParams.get('printType');
    setPrintType(param || 'Personalized Custom Print');
  }, [searchParams]);

  useEffect(() => {
    devLog('Selected SKU:', selectedSKU);
    devLog('Grams:', quoteMeta?.grams);

    const q = parseInt(quantity, 10);
    if (
      selectedSKU?.costPerGram &&
      quoteMeta?.grams &&
      !isNaN(quoteMeta.grams) &&
      q >= 1 && q <= 100
    ) {
      const cost = selectedSKU.costPerGram * quoteMeta.grams * q;
      setEstimatedCost(cost.toFixed(2));
    } else {
      setEstimatedCost('N/A');
    }
  }, [selectedSKU, quoteMeta, quantity]);

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    setSelectedColor(null);
    setShowColorPicker(true);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleCheckout = () => {
    const query = new URLSearchParams();
    query.set('job', quoteMeta.jobId);
    query.set('material', selectedMaterial);
    query.set('color', selectedColor);
    query.set('grams', quoteMeta.grams.toFixed(1));
    query.set('cost', estimatedCost);
    query.set('sku', selectedSKU?.sku || '');
    query.set('quantity', quantity);
    query.set('printType', printType);
    router.replace(`/checkout?${query.toString()}`);
  };

  return (
    <>
      <p style={{
        marginBottom: '1rem',
        fontSize: '0.95rem',
        color: '#555',
        textAlign: 'center',
        maxWidth: '600px',
        marginInline: 'auto'
      }}>
        Please upload a valid 3D file (.stl, .obj, or .3mf) under 10MB.  
        Your model must fit within our printer&apos;s build volume: <strong>235×225×255 mm</strong>.  
        <a onClick={() => setShowModal(true)} style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0070f3' }}>
          Export tips for 3MF and OBJ files
        </a>
      </p>

      <QuoteUploadForm
        onValidated={(meta) => setQuoteMeta(meta)}
        setFormStatus={setFormStatus}
        setStatusType={setStatusType}
      />

      {quoteMeta && (
        <PrintTypeAndQuantity
          printType={printType}
          setPrintType={setPrintType}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      )}

      {quoteMeta?.grams && (
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
          Estimated Weight: <strong>{quoteMeta.grams.toFixed(1)} g</strong>
        </p>
      )}
      {quoteMeta?.grams && selectedSKU?.costPerGram && (
        <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
          Estimated Cost: <strong>${estimatedCost}</strong>
        </p>
      )}

      {quoteMeta && (
        <>
          <MaterialSelector
            availableMaterials={availableMaterials}
            selectedMaterial={selectedMaterial}
            selectedColor={selectedColor}
            showColorPicker={showColorPicker}
            availableColors={availableColors}
            handleMaterialClick={handleMaterialClick}
            handleColorSelect={handleColorSelect}
            selectedSKU={selectedSKU}
            quoteMeta={quoteMeta}
            estimatedCost={estimatedCost}
            handleCheckout={handleCheckout}
          />

          {showColorPicker && (
            <ColorPickerModal
              selectedMaterial={selectedMaterial}
              availableColors={availableColors}
              handleColorSelect={handleColorSelect}
            />
          )}

          <QuoteSummarySection
            summaryRef={summaryRef}
            quoteMeta={quoteMeta}
            selectedColor={selectedColor}
            selectedSKU={selectedSKU}
            estimatedCost={estimatedCost}
            selectedMaterial={selectedMaterial}
            handleCheckout={handleCheckout}
          />
        </>
      )}

      <ExportTipsModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
