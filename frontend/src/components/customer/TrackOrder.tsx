/**
 * Track Order Component
 * Copy to: frontend/src/components/customer/TrackOrder.tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface OrderDetails {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  delivery_address: string;
  delivery_instructions: string;
  created_at: string;
  confirmed_at: string | null;
  assigned_at: string | null;
  picked_up_at: string | null;
  out_for_delivery_at: string | null;
  delivered_at: string | null;
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price_per_unit: number;
    total_price: number;
  }>;
  farmer_name: string;
  farmer_phone: string;
  delivery_partner_name: string | null;
  delivery_partner_phone: string | null;
}

interface TrackingUpdate {
  status: string;
  location?: { lat: number; lng: number };
  notes: string;
  timestamp: string;
}

const TrackOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [tracking, setTracking] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchTracking, 30000);
    
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/orders/${id}/track/`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      setOrder(response.data.order);
      setTracking(response.data.status_history || []);
    } catch (err) {
      setError('Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/orders/${id}/track/`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      setTracking(response.data.status_history || []);
    } catch (err) {
      console.error('Failed to fetch tracking updates');
    }
  };

  const getStatusStep = (status: string) => {
    const steps = [
      'PENDING',
      'CONFIRMED',
      'ASSIGNED',
      'PICKED_UP',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];
    return steps.indexOf(status);
  };

  const getStatusColor = (step: number, currentStep: number) => {
    if (step < currentStep) return 'bg-green-500';
    if (step === currentStep) return 'bg-green-500 animate-pulse';
    return 'bg-gray-300';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      'PENDING': '⏳',
      'CONFIRMED': '✅',
      'ASSIGNED': '🚚',
      'PICKED_UP': '📦',
      'OUT_FOR_DELIVERY': '🚛',
      'DELIVERED': '🏠'
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
        <button onClick={() => navigate('/orders')} className="btn-primary">
          Back to Orders
        </button>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Track Order #{order.order_number}</h1>

      {/* Progress Tracker */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between mb-8">
          {['Pending', 'Confirmed', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'].map((step, index) => (
            <div key={step} className="flex-1 text-center">
              <div className="relative">
                <div className={`w-8 h-8 mx-auto rounded-full ${getStatusColor(index, currentStep)} text-white flex items-center justify-center`}>
                  {index + 1}
                </div>
                {index < 5 && (
                  <div className={`absolute top-4 left-1/2 w-full h-1 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
              <p className="text-xs mt-2">{step}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <span className="text-lg font-semibold text-green-600">
            {getStatusIcon(order.status)} {order.status}
          </span>
          <p className="text-gray-600 mt-1">
            {order.status === 'DELIVERED' && order.delivered_at && (
              <>Delivered on {new Date(order.delivered_at).toLocaleString()}</>
            )}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product_name} x{item.quantity}</span>
                <span>₹{item.total_price}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Delivery Details</h2>
          <p className="text-gray-700 mb-2">{order.delivery_address}</p>
          {order.delivery_instructions && (
            <p className="text-sm text-gray-500 mb-4">
              Instructions: {order.delivery_instructions}
            </p>
          )}
          
          {order.delivery_partner_name && (
            <div className="border-t pt-4 mt-2">
              <p className="font-medium">Delivery Partner</p>
              <p className="text-gray-700">{order.delivery_partner_name}</p>
              {order.delivery_partner_phone && (
                <p className="text-sm text-gray-500">📞 {order.delivery_partner_phone}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-4">Tracking Updates</h2>
        
        {tracking.length > 0 ? (
          <div className="space-y-4">
            {tracking.map((update, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-16 text-right text-sm text-gray-500">
                  {new Date(update.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex-shrink-0 w-32">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(getStatusStep(update.status), 100)}`}>
                    {update.status}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">{update.notes || `Order is ${update.status.toLowerCase()}`}</p>
                  {update.location && (
                    <p className="text-sm text-gray-500">
                      📍 Location updated
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No tracking updates yet
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate('/orders')}
          className="btn-secondary"
        >
          Back to Orders
        </button>
        
        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
          <button
            onClick={() => {/* Handle cancel order */}}
            className="btn-danger"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;