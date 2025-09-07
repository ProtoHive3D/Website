'use client';

import { useState } from 'react';
import { materials } from '@/data/materials'; // ✅ real data
import { useCart } from '@/hooks/useCart';
import ShopMaterialCard from './ShopMaterialCard';
import ShopColorPicker from './ShopColorPicker';
import styles from './FilamentShop.module.css';

export default function FilamentShop() {
  const { addItem } = useCart();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState('');

  const handleMaterialClick = (mat) => {
    setSelectedMaterial(mat);
    setSelectedColor(null);
    setQuantity('');
    setShowColorPicker(true);
  };

  // Called when a color is chosen in the modal
  const handleAddToCart = (colorObj) => {
    // Add to cart with correct metadata for bundle discount
    addItem(colorObj.sku, 1, {
      material: colorObj.material,
      color: colorObj.color,
      image: colorObj.image,
      price: colorObj.price, // per‑kg shop price
      type: 'filament'
    });
    setSelectedColor(colorObj);
    setShowColorPicker(false);
  };

  const handleCheckout = () => {
    if (quantity >= 1 && quantity <= 100 && selectedMaterial && selectedColor) {
      const params = new URLSearchParams({
        material: selectedMaterial.name,
        color: selectedColor.name,
        quantity
      });
      window.location.href = `/checkout?${params.toString()}`;
    }
  };

  return (
    <div className={styles.shopContainer}>
      <h2 className={styles.heading}>Filament Shop</h2>

      {/* Bundle & Save banner */}
      <div className={styles.bundleBanner}>
        📦 <strong>Bundle & Save:</strong> Buy 3+ rolls for 5% off • Buy 10+ rolls for 10% off
      </div>

      {/* Step 1: Material selection */}
      <div className={styles.materialGrid}>
        {materials.map((mat, idx) => (
          <ShopMaterialCard
            key={idx}
            material={mat.name}
            description={mat.description}
            image={mat.image}
            onClick={() => handleMaterialClick(mat)}
          />
        ))}
      </div>

      {/* Step 2: Color picker modal */}
      {showColorPicker && selectedMaterial && (
        <ShopColorPicker
          material={selectedMaterial.name}
          colors={selectedMaterial.colors}
          price={selectedMaterial.price} // per‑kg shop price
          onAddToCart={(color) =>
            handleAddToCart({
              sku: color.sku,
              material: selectedMaterial.name,
              color: color.name,
              image: color.image,
              price: selectedMaterial.price,
              type: 'filament'
            })
          }
          onClose={() => setShowColorPicker(false)}
        />
      )}

      {/* Step 3: Quantity + Checkout (optional if you want direct checkout flow) */}
      {selectedColor && (
        <>
          <div className={styles.stepHeader}>
            <p>
              Selected: <strong>{selectedMaterial.name}</strong> — {selectedColor.name}
            </p>
          </div>

          <div className={styles.quantityRow}>
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {quantity > 10 && (
            <p className={styles.warning}>
              Orders over 10 will take an exceptional amount of time.
            </p>
          )}

          <button
            className={styles.checkoutButton}
            disabled={!quantity || quantity < 1 || quantity > 100}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}