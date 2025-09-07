import { useState, useEffect } from 'react';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);

  // Optional: Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (sku, quantity = 1, metadata = {}) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.sku === sku);
      if (existing) {
        return prev.map(item =>
          item.sku === sku
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { sku, quantity, ...metadata }];
    });
  };

  const removeItem = (sku) => {
    setCartItems(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku, quantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.sku === sku ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems
  };
}