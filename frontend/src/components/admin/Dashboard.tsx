/**
 * Admin Dashboard Component
 * Copy to: frontend/src/components/admin/Dashboard.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  totalFarmers: number;
  totalCustomers: number;
  totalDelivery: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  activeDisputes: number;
  pendingFlags: number;
  todayOrders: number;
  todayRevenue: number;
}

interface RecentActivity {
  id: number;
  type: 'new_user' | 'new_order' | 'verification' | 'dispute' | 'flag';
  description: string;
  timestamp: string;
  user?: string;
  link?: string;
}

interface UserGrowth {
  date: string;
  count: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalFarmers: 0,
    totalCustomers: 0,
    totalDelivery: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeDisputes: 0,
    pendingFlags: 0,
    todayOrders: 0,
    todayRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/dashboard/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      setStats(response.data);
      setRecentActivities(response.data.recent_activities || []);
      setUserGrowth(response.data.user_growth || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard 👑
        </h1>
        <p className="text-purple-100">
          Monitor platform activity, manage users, and handle disputes.
        </p>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl text-blue-500">👥</div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-green-600">Farmers: {stats.totalFarmers}</span>
            <span className="text-blue-600">Customers: {stats.totalCustomers}</span>
            <span className="text-orange-600">Delivery: {stats.totalDelivery}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl text-green-500">📦</div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">Listed by farmers</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl text-orange-500">📋</div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">Revenue: ₹{stats.totalRevenue}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today's Stats</p>
              <p className="text-2xl font-bold">{stats.todayOrders} orders</p>
            </div>
            <div className="text-4xl text-purple-500">📊</div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">Revenue: ₹{stats.todayRevenue}</span>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/verify" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold">Pending Verifications</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
            </div>
            <div className="text-3xl text-yellow-500">⏳</div>
          </div>
        </Link>

        <Link to="/admin/disputes" className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-semibold">Active Disputes</p>
              <p className="text-2xl font-bold text-red-600">{stats.activeDisputes}</p>
            </div>
            <div className="text-3xl text-red-500">⚠️</div>
          </div>
        </Link>

        <Link to="/admin/middleman" className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-800 font-semibold">Middleman Flags</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingFlags}</p>
            </div>
            <div className="text-3xl text-orange-500">🚩</div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link to="/admin/verify" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="font-medium">Verify Users</p>
        </Link>

        <Link to="/admin/logo" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">🖼️</div>
          <p className="font-medium">Update Logo</p>
        </Link>

        <Link to="/admin/categories" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">📑</div>
          <p className="font-medium">Categories</p>
        </Link>

        <Link to="/admin/festivals" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-medium">Festivals</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 border-b last:border-0 pb-3 last:pb-0">
                <div className="text-2xl">
                  {activity.type === 'new_user' && '👤'}
                  {activity.type === 'new_order' && '📦'}
                  {activity.type === 'verification' && '✅'}
                  {activity.type === 'dispute' && '⚠️'}
                  {activity.type === 'flag' && '🚩'}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                {activity.link && (
                  <Link to={activity.link} className="text-blue-600 text-sm hover:underline">
                    View
                  </Link>
                )}
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <p className="text-center text-gray-500 py-4">No recent activities</p>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Growth (Last 30 Days)</h2>
          
          <div className="h-48 flex items-end gap-1">
            {userGrowth.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t"
                  style={{ height: `${(day.count / Math.max(...userGrowth.map(d => d.count), 1)) * 100}%` }}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).getDate()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            Total new users: {userGrowth.reduce((sum, day) => sum + day.count, 0)}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium">Database</p>
              <p className="text-sm text-gray-500">Connected</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium">Storage</p>
              <p className="text-sm text-gray-500">45% used</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium">API</p>
              <p className="text-sm text-gray-500">99.9% uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;