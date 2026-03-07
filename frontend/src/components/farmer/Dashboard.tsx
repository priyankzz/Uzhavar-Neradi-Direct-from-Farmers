/**
 * Farmer Dashboard Component - Bilingual
 * Copy to: frontend/src/components/farmer/Dashboard.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface TopProduct {
  id: number;
  name: string;
  quantity_sold: number;
  revenue: number;
}

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Tamil translations
  const t = {
    welcome: isTamil ? 'மீண்டும் வரவேற்கிறோம்' : 'Welcome back',
    manageFarm: isTamil 
      ? 'உங்கள் பொருட்களை நிர்வகிக்கவும், ஆர்டர்களை கண்காணிக்கவும், தேவை நுண்ணறிவுகளைப் பார்க்கவும்.' 
      : 'Manage your products, track orders, and view demand insights here.',
    totalProducts: isTamil ? 'மொத்த பொருட்கள்' : 'Total Products',
    totalOrders: isTamil ? 'மொத்த ஆர்டர்கள்' : 'Total Orders',
    pending: isTamil ? 'நிலுவையில்' : 'Pending',
    totalRevenue: isTamil ? 'மொத்த வருவாய்' : 'Total Revenue',
    todayOrders: isTamil ? 'இன்றைய ஆர்டர்கள்' : 'Today\'s Orders',
    todayRevenue: isTamil ? 'இன்றைய வருவாய்' : 'Today\'s Revenue',
    addProduct: isTamil ? 'பொருள் சேர்க்க' : 'Add Product',
    addProductDesc: isTamil ? 'வாடிக்கையாளர்களுக்கு புதிய பொருட்களை பட்டியலிடுங்கள்' : 'List new products for customers',
    manageOrders: isTamil ? 'ஆர்டர்களை நிர்வகிக்க' : 'Manage Orders',
    manageOrdersDesc: isTamil ? 'ஆர்டர் நிலையைப் பார்க்கவும் புதுப்பிக்கவும்' : 'View and update order status',
    demandInsights: isTamil ? 'தேவை நுண்ணறிவுகள்' : 'Demand Insights',
    demandInsightsDesc: isTamil ? 'AI-இயங்கும் தேவை கணிப்புகள்' : 'AI-powered demand predictions',
    recentOrders: isTamil ? 'சமீபத்திய ஆர்டர்கள்' : 'Recent Orders',
    viewAll: isTamil ? 'அனைத்தையும் காண்க' : 'View All',
    topProducts: isTamil ? 'சிறந்த விற்பனையாகும் பொருட்கள்' : 'Top Selling Products',
    unitsSold: isTamil ? 'அலகுகள் விற்கப்பட்டன' : 'units sold',
    noOrders: isTamil ? 'இதுவரை ஆர்டர்கள் இல்லை' : 'No orders yet',
    noSales: isTamil ? 'இதுவரை விற்பனை தரவு இல்லை' : 'No sales data yet',
    viewAnalytics: isTamil ? 'விரிவான பகுப்பாய்வைக் காண்க' : 'View Detailed Analytics',
    updateStatus: isTamil ? 'நிலையைப் புதுப்பிக்க' : 'Update Status'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsResponse = await axios.get('http://localhost:8000/api/products/', {
        params: { farmer: user?.id },
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const ordersResponse = await axios.get('http://localhost:8000/api/orders/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const products = productsResponse.data.results || productsResponse.data;
      const orders = ordersResponse.data.results || ordersResponse.data;

      const today = new Date().toDateString();
      const todayOrders = orders.filter((o: any) => 
        new Date(o.created_at).toDateString() === today
      );

      const totalRevenue = orders
        .filter((o: any) => o.status === 'DELIVERED')
        .reduce((sum: number, o: any) => sum + o.total_amount, 0);

      const todayRevenue = todayOrders
        .filter((o: any) => o.status === 'DELIVERED')
        .reduce((sum: number, o: any) => sum + o.total_amount, 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o: any) => o.status === 'PENDING').length,
        totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue
      });

      setRecentOrders(orders.slice(0, 5));

      const productSales: { [key: string]: TopProduct } = {};
      orders.forEach((order: any) => {
        if (order.items) {
          order.items.forEach((item: any) => {
            if (!productSales[item.product_name]) {
              productSales[item.product_name] = {
                id: item.product_id,
                name: item.product_name,
                quantity_sold: 0,
                revenue: 0
              };
            }
            productSales[item.product_name].quantity_sold += item.quantity;
            productSales[item.product_name].revenue += item.total_price;
          });
        }
      });

      setTopProducts(Object.values(productSales).slice(0, 5));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': isTamil ? 'நிலுவையில்' : 'Pending',
      'CONFIRMED': isTamil ? 'உறுதி செய்யப்பட்டது' : 'Confirmed',
      'ASSIGNED': isTamil ? 'ஒதுக்கப்பட்டது' : 'Assigned',
      'PICKED_UP': isTamil ? 'எடுக்கப்பட்டது' : 'Picked Up',
      'OUT_FOR_DELIVERY': isTamil ? 'விநியோகத்திற்கு' : 'Out for Delivery',
      'DELIVERED': isTamil ? 'விநியோகிக்கப்பட்டது' : 'Delivered',
      'CANCELLED': isTamil ? 'ரத்து செய்யப்பட்டது' : 'Cancelled'
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
          {t.welcome}, {user?.username}! 🌾
        </h1>
        <p className="text-green-100">{t.manageFarm}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📦</div>
          <div className="text-xl font-bold">{stats.totalProducts}</div>
          <div className="text-xs text-gray-600">{t.totalProducts}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-xl font-bold">{stats.totalOrders}</div>
          <div className="text-xs text-gray-600">{t.totalOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">⏳</div>
          <div className="text-xl font-bold">{stats.pendingOrders}</div>
          <div className="text-xs text-gray-600">{t.pending}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xl font-bold">₹{stats.totalRevenue}</div>
          <div className="text-xs text-gray-600">{t.totalRevenue}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xl font-bold">{stats.todayOrders}</div>
          <div className="text-xs text-gray-600">{t.todayOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">💵</div>
          <div className="text-xl font-bold">₹{stats.todayRevenue}</div>
          <div className="text-xs text-gray-600">{t.todayRevenue}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/farmer/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">➕</div>
          <div>
            <h3 className="font-semibold text-lg">{t.addProduct}</h3>
            <p className="text-gray-600 text-sm">{t.addProductDesc}</p>
          </div>
        </Link>

        <Link to="/farmer/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📋</div>
          <div>
            <h3 className="font-semibold text-lg">{t.manageOrders}</h3>
            <p className="text-gray-600 text-sm">{t.manageOrdersDesc}</p>
          </div>
        </Link>

        <Link to="/farmer/insights" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📊</div>
          <div>
            <h3 className="font-semibold text-lg">{t.demandInsights}</h3>
            <p className="text-gray-600 text-sm">{t.demandInsightsDesc}</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t.recentOrders}</h2>
            <Link to="/farmer/orders" className="text-green-600 hover:text-green-700 text-sm">
              {t.viewAll} →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-sm">{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">₹{order.total_amount}</span>
                    <Link 
                      to={`/farmer/orders/${order.id}`}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      {t.updateStatus}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">{t.noOrders}</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t.topProducts}</h2>
          
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.quantity_sold} {t.unitsSold}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">{t.noSales}</p>
          )}

          <div className="mt-4 pt-4 border-t">
            <Link 
              to="/farmer/insights" 
              className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center"
            >
              {t.viewAnalytics} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;