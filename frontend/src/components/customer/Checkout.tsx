/**
 * Checkout Component
 * Copy to: frontend/src/components/customer/Checkout.tsx
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const Checkout: React.FC = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    delivery_address: '',
    delivery_instructions: '',
    payment_method: 'RAZORPAY',
    order_type: 'NORMAL',
    scheduled_date: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        product: item.product_id,
        quantity: item.quantity
      }));

      const orderData = {
        ...formData,
        items: orderItems
      };

      const response = await axios.post('http://localhost:8000/api/orders/create/', orderData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (response.data) {
        clearCart();
        
        // Handle payment based on method
        if (formData.payment_method === 'RAZORPAY') {
          // Redirect to payment
          navigate(`/payment/${response.data.id}`);
        } else {
          // COD order placed successfully
          navigate('/orders', { state: { message: 'Order placed successfully!' } });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Delivery Address */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                className="input-field"
                rows={3}
                required
              />
            </div>

            {/* Delivery Instructions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Instructions (Optional)</h2>
              <input
                type="text"
                name="delivery_instructions"
                value={formData.delivery_instructions}
                onChange={handleChange}
                placeholder="e.g., Leave at door, Call before delivery"
                className="input-field"
              />
            </div>

            {/* Order Type */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Type</h2>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="order_type"
                    value="NORMAL"
                    checked={formData.order_type === 'NORMAL'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Normal Order
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="order_type"
                    value="PREORDER"
                    checked={formData.order_type === 'PREORDER'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Preorder
                </label>
              </div>
            </div>

            {/* Scheduled Date (for preorders) */}
            {formData.order_type === 'PREORDER' && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Preferred Delivery Date</h2>
                <input
                  type="date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>
            )}

            {/* Payment Method */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="RAZORPAY"
                    checked={formData.payment_method === 'RAZORPAY'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Razorpay</span>
                    <p className="text-sm text-gray-500">Pay online via UPI, Card, NetBanking</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={formData.payment_method === 'COD'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive the order</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            {/* Items List */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;