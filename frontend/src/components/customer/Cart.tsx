/**
 * Cart Component
 * Copy to: frontend/src/components/customer/Cart.tsx
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items yet.</p>
        <Link to="/products" className="btn-primary inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('cart')} ({getCartCount()} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    📦
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-green-600 font-bold">₹{item.price}</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={item.quantity >= item.max_quantity}
                >
                  +
                </button>
              </div>
              
              {/* Item Total */}
              <div className="text-right min-w-[100px]">
                <p className="font-semibold">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹50</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{getCartTotal() * 0.05}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{getCartTotal() + 50 + (getCartTotal() * 0.05)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3"
            >
              Proceed to Checkout
            </button>
            
            <Link
              to="/products"
              className="w-full btn-secondary py-3 mt-2 text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;