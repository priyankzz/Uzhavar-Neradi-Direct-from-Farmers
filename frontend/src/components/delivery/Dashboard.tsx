/**
 * Delivery Partner Dashboard Component
 * Copy to: frontend/src/components/delivery/Dashboard.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface DeliveryStats {
  totalDeliveries: number;
  completedToday: number;
  pendingDeliveries: number;
  totalEarnings: number;
  averageRating: number;
}

interface ActiveDelivery {
  id: number;
  order_number: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  status: string;
  estimated_delivery_time: string;
  total_amount: number;
  items: Array<{
    product_name: string;
    quantity: number;
  }>;
}

const DeliveryDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DeliveryStats>({
    totalDeliveries: 0,
    completedToday: 0,
    pendingDeliveries: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    getCurrentLocation();
    
    // Refresh location every 30 seconds
    const locationInterval = setInterval(updateLocation, 30000);
    
    return () => clearInterval(locationInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch assigned deliveries
      const deliveriesResponse = await axios.get(
        'http://localhost:8000/api/orders/delivery/assignments/',
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const deliveries = deliveriesResponse.data.results || deliveriesResponse.data;
      
      // Calculate stats
      const today = new Date().toDateString();
      const completedToday = deliveries.filter((d: any) => 
        d.status === 'DELIVERED' && 
        new Date(d.updated_at).toDateString() === today
      ).length;

      const pendingDeliveries = deliveries.filter((d: any) => 
        ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(d.status)
      ).length;

      // Mock stats for now (will be replaced with real API)
      setStats({
        totalDeliveries: deliveries.length,
        completedToday,
        pendingDeliveries,
        totalEarnings: completedToday * 50, // ₹50 per delivery
        averageRating: 4.8
      });

      // Set active deliveries (pending and in-progress)
      setActiveDeliveries(deliveries.filter((d: any) => 
        ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(d.status)
      ));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Unable to get your location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  const updateLocation = async () => {
    if (currentLocation) {
      try {
        await axios.post(
          'http://localhost:8000/api/users/delivery/location/',
          currentLocation,
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        );
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'PICKED_UP': 'bg-indigo-100 text-indigo-800',
      'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}! 🚚
        </h1>
        <p className="text-blue-100">
          Manage your deliveries and track your earnings here.
        </p>
      </div>

      {/* Location Status */}
      <div className={`mb-6 p-4 rounded-lg ${
        currentLocation ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📍</span>
            <div>
              <p className="font-medium">
                {currentLocation ? 'Location sharing active' : 'Location sharing unavailable'}
              </p>
              {currentLocation ? (
                <p className="text-sm text-gray-600">
                  Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-yellow-700">{locationError || 'Enable location for better tracking'}</p>
              )}
            </div>
          </div>
          {!currentLocation && (
            <button
              onClick={getCurrentLocation}
              className="btn-primary text-sm"
            >
              Enable Location
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📦</div>
          <div className="text-xl font-bold">{stats.totalDeliveries}</div>
          <div className="text-xs text-gray-600">Total Deliveries</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-xl font-bold">{stats.completedToday}</div>
          <div className="text-xs text-gray-600">Completed Today</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">⏳</div>
          <div className="text-xl font-bold">{stats.pendingDeliveries}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xl font-bold">₹{stats.totalEarnings}</div>
          <div className="text-xs text-gray-600">Today's Earnings</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-xl font-bold">{stats.averageRating}</div>
          <div className="text-xs text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/delivery/assignments" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📋</div>
          <div>
            <h3 className="font-semibold text-lg">View Assignments</h3>
            <p className="text-gray-600 text-sm">See all pending delivery requests</p>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="text-4xl mr-4">📊</div>
          <div>
            <h3 className="font-semibold text-lg">Performance</h3>
            <p className="text-gray-600 text-sm">On-time delivery: 98%</p>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
        
        {activeDeliveries.length > 0 ? (
          <div className="space-y-4">
            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm text-gray-500">
                      Order #{delivery.order_number}
                    </p>
                    <p className="font-semibold">{delivery.customer_name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="text-sm">{delivery.customer_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-sm">{delivery.customer_phone}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Items:</p>
                    <p className="text-sm">
                      {delivery.items.map(item => `${item.product_name} x${item.quantity}`).join(', ')}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">₹{delivery.total_amount}</p>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/delivery/assignments/${delivery.id}`}
                    className="btn-primary text-sm"
                  >
                    Update Status
                  </Link>
                  <button
                    onClick={() => {/* Open navigation */}}
                    className="btn-secondary text-sm"
                  >
                    Navigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-3">🚚</p>
            <p>No active deliveries</p>
            <p className="text-sm mt-2">Check assignments for new delivery requests</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Delivery Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Always verify customer identity before handing over the order</li>
          <li>• Update status promptly for accurate tracking</li>
          <li>• Keep your location sharing on for better route optimization</li>
          <li>• Contact support if you face any issues with delivery</li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryDashboard;