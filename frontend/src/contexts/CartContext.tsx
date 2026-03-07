/**
 * Cart Context
 * Copy to: frontend/src/contexts/CartContext.tsx
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  max_quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loading]);

  const addToCart = (product: any) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Increase quantity if already in cart
        return prevItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.available_quantity) }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: Date.now(), // temporary id
          product_id: product.id,
          name: product.name_en || product.name,
          price: product.price_per_unit || product.price,
          quantity: 1,
          max_quantity: product.available_quantity || 999,
          image: product.images?.[0]
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.max_quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    loading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;