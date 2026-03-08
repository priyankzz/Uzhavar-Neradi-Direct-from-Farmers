/**
 * Customer Dashboard Component - Bilingual
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

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  const [loading, setLoading] = useState(true);

  // Tamil translations
  const t = {
    welcome: isTamil ? 'மீண்டும் வரவேற்கிறோம்' : 'Welcome back',
    browseFresh: isTamil 
      ? 'விவசாயிகளிடமிருந்து நேரடியாக புத்துணர்ச்சியான பொருட்களை உலாவி உங்கள் ஆர்டர்களை இங்கே கண்காணிக்கவும்.' 
      : 'Browse fresh produce directly from farmers and track your orders here.',
    totalOrders: isTamil ? 'மொத்த ஆர்டர்கள்' : 'Total Orders',
    totalSpent: isTamil ? 'மொத்த செலவு' : 'Total Spent',
    pendingOrders: isTamil ? 'நிலுவையில் உள்ள ஆர்டர்கள்' : 'Pending Orders',
    delivered: isTamil ? 'விநியோகிக்கப்பட்டது' : 'Delivered',
    browseProducts: isTamil ? 'பொருட்களை உலாவுக' : 'Browse Products',
    exploreProducts: isTamil ? 'உள்ளூர் விவசாயிகளிடமிருந்து புத்துணர்ச்சியான பொருட்களை ஆராயுங்கள்' : 'Explore fresh produce from local farmers',
    myOrders: isTamil ? 'எனது ஆர்டர்கள்' : 'My Orders',
    trackOrders: isTamil ? 'உங்கள் ஆர்டர்களை கண்காணிக்கவும் நிர்வகிக்கவும்' : 'Track and manage your orders',
    myProfile: isTamil ? 'எனது சுயவிவரம்' : 'My Profile',
    updateDetails: isTamil ? 'உங்கள் விவரங்கள் மற்றும் விருப்பங்களைப் புதுப்பிக்கவும்' : 'Update your details and preferences',
    recentOrders: isTamil ? 'சமீபத்திய ஆர்டர்கள்' : 'Recent Orders',
    viewAll: isTamil ? 'அனைத்தையும் காண்க' : 'View All',
    orderNo: isTamil ? 'ஆர்டர் எண்' : 'Order #',
    date: isTamil ? 'தேதி' : 'Date',
    type: isTamil ? 'வகை' : 'Type',
    amount: isTamil ? 'தொகை' : 'Amount',
    status: isTamil ? 'நிலை' : 'Status',
    action: isTamil ? 'செயல்' : 'Action',
    track: isTamil ? 'கண்காணி' : 'Track',
    noOrders: isTamil ? 'இதுவரை ஆர்டர்கள் இல்லை' : 'No orders yet',
    startShopping: isTamil ? 'ஷாப்பிங் தொடங்குங்கள்' : 'Start Shopping',
    pending: isTamil ? 'நிலுவையில்' : 'Pending',
    confirmed: isTamil ? 'உறுதி செய்யப்பட்டது' : 'Confirmed',
    assigned: isTamil ? 'ஒதுக்கப்பட்டது' : 'Assigned',
    pickedUp: isTamil ? 'எடுக்கப்பட்டது' : 'Picked Up',
    outForDelivery: isTamil ? 'விநியோகத்திற்கு' : 'Out for Delivery',
    cancelled: isTamil ? 'ரத்து செய்யப்பட்டது' : 'Cancelled'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const ordersResponse = await axios.get('http://localhost:8000/api/orders/', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      
      const orders = ordersResponse.data.results || ordersResponse.data;
      setRecentOrders(orders.slice(0, 5));

      const totalOrders = orders.length;
      const totalSpent = orders
        .filter((o: Order) => o.status === 'DELIVERED')
        .reduce((sum: number, o: Order) => sum + o.total_amount, 0);
      const pendingOrders = orders.filter((o: Order) => 
        ['PENDING', 'CONFIRMED', 'ASSIGNED'].includes(o.status)
      ).length;
      const deliveredOrders = orders.filter((o: Order) => o.status === 'DELIVERED').length;

      setStats({ totalOrders, totalSpent, pendingOrders, deliveredOrders });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': t.pending,
      'CONFIRMED': t.confirmed,
      'ASSIGNED': t.assigned,
      'PICKED_UP': t.pickedUp,
      'OUT_FOR_DELIVERY': t.outForDelivery,
      'DELIVERED': t.delivered,
      'CANCELLED': t.cancelled
    };
    return statusMap[status] || status;
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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t.welcome}, {user?.username}! 👋
        </h1>
        <p className="text-green-100">{t.browseFresh}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <div className="text-gray-600">{t.totalOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold">₹{stats.totalSpent}</div>
          <div className="text-gray-600">{t.totalSpent}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          <div className="text-gray-600">{t.pendingOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
          <div className="text-gray-600">{t.delivered}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">🛒</div>
          <div>
            <h3 className="font-semibold text-lg">{t.browseProducts}</h3>
            <p className="text-gray-600 text-sm">{t.exploreProducts}</p>
          </div>
        </Link>

        <Link to="/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📋</div>
          <div>
            <h3 className="font-semibold text-lg">{t.myOrders}</h3>
            <p className="text-gray-600 text-sm">{t.trackOrders}</p>
          </div>
        </Link>

        <Link to="/profile" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">👤</div>
          <div>
            <h3 className="font-semibold text-lg">{t.myProfile}</h3>
            <p className="text-gray-600 text-sm">{t.updateDetails}</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t.recentOrders}</h2>
          <Link to="/orders" className="text-green-600 hover:text-green-700">
            {t.viewAll} →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">{t.orderNo}</th>
                  <th className="px-4 py-2 text-left">{t.date}</th>
                  <th className="px-4 py-2 text-left">{t.type}</th>
                  <th className="px-4 py-2 text-left">{t.amount}</th>
                  <th className="px-4 py-2 text-left">{t.status}</th>
                  <th className="px-4 py-2 text-left">{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{order.order_number}</td>
                    <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN')}</td>
                    <td className="px-4 py-3">{order.order_type}</td>
                    <td className="px-4 py-3">₹{order.total_amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/track-order/${order.id}`} className="text-green-600 hover:text-green-700">
                        {t.track}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{t.noOrders}</p>
            <Link to="/products" className="text-green-600 hover:text-green-700 mt-2 inline-block">
              {t.startShopping} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;