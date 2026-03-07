/**
 * Admin Dashboard Component - Complete Bilingual
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
  const { language } = useLanguage();
  const isTamil = language === 'ta';
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

  // Tamil translations
  const t = {
    welcome: isTamil ? 'நிர்வாகி கட்டுப்பாட்டகம்' : 'Admin Dashboard',
    welcomeDesc: isTamil 
      ? 'தள செயல்பாட்டை கண்காணிக்கவும், பயனர்களை நிர்வகிக்கவும், சர்ச்சைகளை கையாளவும்.' 
      : 'Monitor platform activity, manage users, and handle disputes.',
    totalUsers: isTamil ? 'மொத்த பயனர்கள்' : 'Total Users',
    farmers: isTamil ? 'விவசாயிகள்' : 'Farmers',
    customers: isTamil ? 'வாடிக்கையாளர்கள்' : 'Customers',
    delivery: isTamil ? 'விநியோகம்' : 'Delivery',
    totalProducts: isTamil ? 'மொத்த பொருட்கள்' : 'Total Products',
    listedByFarmers: isTamil ? 'விவசாயிகளால் பட்டியலிடப்பட்டவை' : 'Listed by farmers',
    totalOrders: isTamil ? 'மொத்த ஆர்டர்கள்' : 'Total Orders',
    revenue: isTamil ? 'வருவாய்' : 'Revenue',
    todayStats: isTamil ? 'இன்றைய புள்ளிவிவரங்கள்' : "Today's Stats",
    orders: isTamil ? 'ஆர்டர்கள்' : 'orders',
    pendingVerifications: isTamil ? 'நிலுவை சரிபார்ப்புகள்' : 'Pending Verifications',
    activeDisputes: isTamil ? 'செயலில் உள்ள சர்ச்சைகள்' : 'Active Disputes',
    middlemanFlags: isTamil ? 'இடைத்தரகர் கொடிகள்' : 'Middleman Flags',
    quickActions: isTamil ? 'விரைவு செயல்கள்' : 'Quick Actions',
    verifyUsers: isTamil ? 'பயனர்களை சரிபார்க்க' : 'Verify Users',
    updateLogo: isTamil ? 'லோகோவை புதுப்பிக்க' : 'Update Logo',
    categories: isTamil ? 'வகைகள்' : 'Categories',
    festivals: isTamil ? 'பண்டிகைகள்' : 'Festivals',
    recentActivities: isTamil ? 'சமீபத்திய செயல்பாடுகள்' : 'Recent Activities',
    userGrowth: isTamil ? 'பயனர் வளர்ச்சி (கடந்த 30 நாட்கள்)' : 'User Growth (Last 30 Days)',
    totalNewUsers: isTamil ? 'மொத்த புதிய பயனர்கள்' : 'Total new users',
    systemHealth: isTamil ? 'அமைப்பு ஆரோக்கியம்' : 'System Health',
    database: isTamil ? 'தரவுத்தளம்' : 'Database',
    connected: isTamil ? 'இணைக்கப்பட்டது' : 'Connected',
    storage: isTamil ? 'சேமிப்பு' : 'Storage',
    used: isTamil ? 'பயன்படுத்தப்பட்டது' : 'used',
    api: isTamil ? 'ஏபிஐ' : 'API',
    uptime: isTamil ? 'இயக்க நேரம்' : 'uptime',
    view: isTamil ? 'காண்க' : 'View',
    newUser: isTamil ? 'புதிய பயனர்' : 'New user',
    newOrder: isTamil ? 'புதிய ஆர்டர்' : 'New order',
    registered: isTamil ? 'பதிவு செய்யப்பட்டார்' : 'registered',
    placed: isTamil ? 'ஆர்டர் செய்யப்பட்டது' : 'placed'
  };

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

  const getActivityText = (activity: RecentActivity) => {
    if (isTamil) {
      switch (activity.type) {
        case 'new_user':
          return `புதிய பயனர் பதிவு: ${activity.user}`;
        case 'new_order':
          return `புதிய ஆர்டர் #${activity.description.split('#')[1]}`;
        case 'verification':
          return `புதிய சரிபார்ப்பு கோரிக்கை`;
        case 'dispute':
          return `புதிய சர்ச்சை பதிவு`;
        case 'flag':
          return `புதிய இடைத்தரகர் கொடி`;
        default:
          return activity.description;
      }
    }
    return activity.description;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t.welcome} 👑
        </h1>
        <p className="text-purple-100">
          {t.welcomeDesc}
        </p>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t.totalUsers}</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl text-blue-500">👥</div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-green-600">{t.farmers}: {stats.totalFarmers}</span>
            <span className="text-blue-600">{t.customers}: {stats.totalCustomers}</span>
            <span className="text-orange-600">{t.delivery}: {stats.totalDelivery}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t.totalProducts}</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl text-green-500">📦</div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">{t.listedByFarmers}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t.totalOrders}</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl text-orange-500">📋</div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">{t.revenue}: ₹{stats.totalRevenue}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t.todayStats}</p>
              <p className="text-2xl font-bold">{stats.todayOrders} {t.orders}</p>
            </div>
            <div className="text-4xl text-purple-500">📊</div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">{t.revenue}: ₹{stats.todayRevenue}</span>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/verify" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold">{t.pendingVerifications}</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
            </div>
            <div className="text-3xl text-yellow-500">⏳</div>
          </div>
        </Link>

        <Link to="/admin/disputes" className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-semibold">{t.activeDisputes}</p>
              <p className="text-2xl font-bold text-red-600">{stats.activeDisputes}</p>
            </div>
            <div className="text-3xl text-red-500">⚠️</div>
          </div>
        </Link>

        <Link to="/admin/middleman" className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-800 font-semibold">{t.middlemanFlags}</p>
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
          <p className="font-medium">{t.verifyUsers}</p>
        </Link>

        <Link to="/admin/logo" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">🖼️</div>
          <p className="font-medium">{t.updateLogo}</p>
        </Link>

        <Link to="/admin/categories" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">📑</div>
          <p className="font-medium">{t.categories}</p>
        </Link>

        <Link to="/admin/festivals" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-medium">{t.festivals}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t.recentActivities}</h2>
          
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
                  <p className="text-sm">{getActivityText(activity)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString(isTamil ? 'ta-IN' : 'en-IN')}
                  </p>
                </div>
                {activity.link && (
                  <Link to={activity.link} className="text-blue-600 text-sm hover:underline">
                    {t.view}
                  </Link>
                )}
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                {isTamil ? 'சமீபத்திய செயல்பாடுகள் இல்லை' : 'No recent activities'}
              </p>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t.userGrowth}</h2>
          
          <div className="h-48 flex items-end gap-1">
            {userGrowth.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                  style={{ height: `${(day.count / Math.max(...userGrowth.map(d => d.count), 1)) * 100}%` }}
                  title={`${new Date(day.date).toLocaleDateString()}: ${day.count} ${isTamil ? 'பயனர்கள்' : 'users'}`}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).getDate()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            {t.totalNewUsers}: {userGrowth.reduce((sum, day) => sum + day.count, 0)}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t.systemHealth}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium">{t.database}</p>
              <p className="text-sm text-gray-500">{t.connected}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium">{t.storage}</p>
              <p className="text-sm text-gray-500">45% {t.used}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium">{t.api}</p>
              <p className="text-sm text-gray-500">99.9% {t.uptime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;