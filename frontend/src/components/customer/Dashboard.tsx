/**
 * Customer Dashboard Component
 * Copy to: frontend/src/components/customer/Dashboard.tsx
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_type: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent orders
      const ordersResponse = await axios.get('http://localhost:8000/api/orders/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const orders = ordersResponse.data.results || ordersResponse.data;
      setRecentOrders(orders.slice(0, 5));

      // Calculate stats
      const totalOrders = orders.length;
      const totalSpent = orders
        .filter((o: Order) => o.status === 'DELIVERED')
        .reduce((sum: number, o: Order) => sum + o.total_amount, 0);
      const pendingOrders = orders.filter((o: Order) => 
        ['PENDING', 'CONFIRMED', 'ASSIGNED'].includes(o.status)
      ).length;
      const deliveredOrders = orders.filter((o: Order) => o.status === 'DELIVERED').length;

      setStats({
        totalOrders,
        totalSpent,
        pendingOrders,
        deliveredOrders
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'ASSIGNED': 'bg-purple-100 text-purple-800',
      'PICKED_UP': 'bg-indigo-100 text-indigo-800',
      'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-green-100">
          Browse fresh produce directly from farmers and track your orders here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <div className="text-gray-600">Total Orders</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold">₹{stats.totalSpent}</div>
          <div className="text-gray-600">Total Spent</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          <div className="text-gray-600">Pending Orders</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
          <div className="text-gray-600">Delivered</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">🛒</div>
          <div>
            <h3 className="font-semibold text-lg">Browse Products</h3>
            <p className="text-gray-600 text-sm">Explore fresh produce from local farmers</p>
          </div>
        </Link>

        <Link to="/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📋</div>
          <div>
            <h3 className="font-semibold text-lg">My Orders</h3>
            <p className="text-gray-600 text-sm">Track and manage your orders</p>
          </div>
        </Link>

        <Link to="/profile" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">👤</div>
          <div>
            <h3 className="font-semibold text-lg">My Profile</h3>
            <p className="text-gray-600 text-sm">Update your details and preferences</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/orders" className="text-green-600 hover:text-green-700">
            View All →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Order #</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{order.order_number}</td>
                    <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{order.order_type}</td>
                    <td className="px-4 py-3">₹{order.total_amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        to={`/track-order/${order.id}`}
                        className="text-green-600 hover:text-green-700"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No orders yet</p>
            <Link to="/products" className="text-green-600 hover:text-green-700 mt-2 inline-block">
              Start Shopping →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;