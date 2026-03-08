/**
 * Admin Dashboard Component - Fixed Tamil Layout
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

  // Tamil translations (with shorter versions for compact display)
  const t = {
    welcome: isTamil ? 'நிர்வாகி கட்டுப்பாட்டகம்' : 'Admin Dashboard',
    welcomeDesc: isTamil 
      ? 'தள செயல்பாட்டை கண்காணிக்கவும், பயனர்களை நிர்வகிக்கவும்' 
      : 'Monitor platform activity, manage users, and handle disputes.',
    totalUsers: isTamil ? 'மொத்த பயனர்கள்' : 'Total Users',
    farmers: isTamil ? 'விவசாயிகள்' : 'Farmers',
    customers: isTamil ? 'வாடிக்கையாளர்கள்' : 'Customers',
    delivery: isTamil ? 'விநியோகம்' : 'Delivery',
    totalProducts: isTamil ? 'மொத்த பொருட்கள்' : 'Total Products',
    listedByFarmers: isTamil ? 'விவசாயிகள் பட்டியல்' : 'Listed by farmers',
    totalOrders: isTamil ? 'மொத்த ஆர்டர்கள்' : 'Total Orders',
    revenue: isTamil ? 'வருவாய்' : 'Revenue',
    todayStats: isTamil ? 'இன்றைய புள்ளிவிவரங்கள்' : "Today's Stats",
    orders: isTamil ? 'ஆர்டர்கள்' : 'orders',
    pendingVerifications: isTamil ? 'நிலுவை சரிபார்ப்புகள்' : 'Pending Verifications',
    activeDisputes: isTamil ? 'செயலில் சர்ச்சைகள்' : 'Active Disputes',
    middlemanFlags: isTamil ? 'இடைத்தரகர் கொடிகள்' : 'Middleman Flags',
    quickActions: isTamil ? 'விரைவு செயல்கள்' : 'Quick Actions',
    verifyUsers: isTamil ? 'சரிபார்ப்பு' : 'Verify Users',
    updateLogo: isTamil ? 'லோகோ' : 'Update Logo',
    categories: isTamil ? 'வகைகள்' : 'Categories',
    festivals: isTamil ? 'பண்டிகைகள்' : 'Festivals',
    recentActivities: isTamil ? 'சமீபத்திய செயல்பாடுகள்' : 'Recent Activities',
    userGrowth: isTamil ? 'பயனர் வளர்ச்சி' : 'User Growth',
    totalNewUsers: isTamil ? 'மொத்த புதிய பயனர்கள்' : 'Total new users',
    systemHealth: isTamil ? 'அமைப்பு ஆரோக்கியம்' : 'System Health',
    database: isTamil ? 'தரவுத்தளம்' : 'Database',
    connected: isTamil ? 'இணைக்கப்பட்டது' : 'Connected',
    storage: isTamil ? 'சேமிப்பு' : 'Storage',
    used: isTamil ? 'பயன்பாடு' : 'used',
    api: isTamil ? 'ஏபிஐ' : 'API',
    uptime: isTamil ? 'இயக்க நேரம்' : 'uptime',
    view: isTamil ? 'காண்க' : 'View',
    newUser: isTamil ? 'புதிய பயனர்' : 'New user',
    newOrder: isTamil ? 'புதிய ஆர்டர்' : 'New order',
    registered: isTamil ? 'பதிவு' : 'registered',
    placed: isTamil ? 'ஆர்டர்' : 'placed'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/dashboard/', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
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
          return `புதிய பயனர்: ${activity.user || ''}`;
        case 'new_order':
          return `புதிய ஆர்டர் #${activity.description.split('#')[1] || ''}`;
        case 'verification':
          return `புதிய சரிபார்ப்பு`;
        case 'dispute':
          return `புதிய சர்ச்சை`;
        case 'flag':
          return `புதிய கொடி`;
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
        <p className="text-purple-100 text-sm md:text-base">
          {t.welcomeDesc}
        </p>
      </div>

      {/* Key Stats Cards - Fixed with flex-wrap for Tamil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs truncate">{t.totalUsers}</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="text-3xl text-blue-500 flex-shrink-0">👥</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded whitespace-nowrap">{t.farmers}: {stats.totalFarmers}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">{t.customers}: {stats.totalCustomers}</span>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded whitespace-nowrap">{t.delivery}: {stats.totalDelivery}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs truncate">{t.totalProducts}</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="text-3xl text-green-500 flex-shrink-0">📦</div>
          </div>
          <div className="mt-3 text-xs text-gray-600 truncate">
            {t.listedByFarmers}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs truncate">{t.totalOrders}</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="text-3xl text-orange-500 flex-shrink-0">📋</div>
          </div>
          <div className="mt-3 text-xs text-gray-600 truncate">
            {t.revenue}: ₹{stats.totalRevenue}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs truncate">{t.todayStats}</p>
              <p className="text-xl font-bold">{stats.todayOrders} {t.orders}</p>
            </div>
            <div className="text-3xl text-purple-500 flex-shrink-0">📊</div>
          </div>
          <div className="mt-3 text-xs text-gray-600 truncate">
            {t.revenue}: ₹{stats.todayRevenue}
          </div>
        </div>
      </div>

      {/* Alert Cards - Fixed with proper text wrapping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/verify" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-yellow-800 font-semibold text-sm truncate">{t.pendingVerifications}</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
            </div>
            <div className="text-3xl text-yellow-500 flex-shrink-0">⏳</div>
          </div>
        </Link>

        <Link to="/admin/disputes" className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-red-800 font-semibold text-sm truncate">{t.activeDisputes}</p>
              <p className="text-2xl font-bold text-red-600">{stats.activeDisputes}</p>
            </div>
            <div className="text-3xl text-red-500 flex-shrink-0">⚠️</div>
          </div>
        </Link>

        <Link to="/admin/middleman" className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-orange-800 font-semibold text-sm truncate">{t.middlemanFlags}</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingFlags}</p>
            </div>
            <div className="text-3xl text-orange-500 flex-shrink-0">🚩</div>
          </div>
        </Link>
      </div>

      {/* Quick Actions - Fixed grid for Tamil */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link to="/admin/verify" className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition text-center">
          <div className="text-2xl mb-1">✅</div>
          <p className="font-medium text-xs sm:text-sm truncate">{t.verifyUsers}</p>
        </Link>

        <Link to="/admin/logo" className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition text-center">
          <div className="text-2xl mb-1">🖼️</div>
          <p className="font-medium text-xs sm:text-sm truncate">{t.updateLogo}</p>
        </Link>

        <Link to="/admin/categories" className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition text-center">
          <div className="text-2xl mb-1">📑</div>
          <p className="font-medium text-xs sm:text-sm truncate">{t.categories}</p>
        </Link>

        <Link to="/admin/festivals" className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition text-center">
          <div className="text-2xl mb-1">🎉</div>
          <p className="font-medium text-xs sm:text-sm truncate">{t.festivals}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">{t.recentActivities}</h2>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 border-b last:border-0 pb-2 last:pb-0">
                <div className="text-xl flex-shrink-0">
                  {activity.type === 'new_user' && '👤'}
                  {activity.type === 'new_order' && '📦'}
                  {activity.type === 'verification' && '✅'}
                  {activity.type === 'dispute' && '⚠️'}
                  {activity.type === 'flag' && '🚩'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm truncate">{getActivityText(activity)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString(isTamil ? 'ta-IN' : 'en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </p>
                </div>
                {activity.link && (
                  <Link to={activity.link} className="text-blue-600 text-xs hover:underline flex-shrink-0">
                    {t.view}
                  </Link>
                )}
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <p className="text-center text-gray-500 py-4 text-sm">
                {isTamil ? 'சமீபத்திய செயல்பாடுகள் இல்லை' : 'No recent activities'}
              </p>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">{t.userGrowth}</h2>
          
          <div className="h-40 flex items-end gap-1">
            {userGrowth.slice(-14).map((day, index) => ( // Show last 14 days only
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                  style={{ height: `${(day.count / Math.max(...userGrowth.map(d => d.count), 1)) * 100}%` }}
                  title={`${new Date(day.date).toLocaleDateString()}: ${day.count} ${isTamil ? 'பயனர்கள்' : 'users'}`}
                ></div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {new Date(day.date).getDate()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-center text-xs text-gray-600">
            {t.totalNewUsers}: {userGrowth.reduce((sum, day) => sum + day.count, 0)}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">{t.systemHealth}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{t.database}</p>
              <p className="text-xs text-gray-500 truncate">{t.connected}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{t.storage}</p>
              <p className="text-xs text-gray-500 truncate">45% {t.used}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{t.api}</p>
              <p className="text-xs text-gray-500 truncate">99.9% {t.uptime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;