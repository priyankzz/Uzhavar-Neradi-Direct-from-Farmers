/**
 * Farmer Dashboard Component
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
  const { t } = useLanguage();
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products count
      const productsResponse = await axios.get('http://localhost:8000/api/products/', {
        params: { farmer: user?.id },
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Fetch orders
      const ordersResponse = await axios.get('http://localhost:8000/api/orders/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const products = productsResponse.data.results || productsResponse.data;
      const orders = ordersResponse.data.results || ordersResponse.data;

      // Calculate stats
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

      // Set recent orders
      setRecentOrders(orders.slice(0, 5));

      // Calculate top products
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
          Welcome back, {user?.username}! 🌾
        </h1>
        <p className="text-green-100">
          Manage your products, track orders, and view demand insights here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📦</div>
          <div className="text-xl font-bold">{stats.totalProducts}</div>
          <div className="text-xs text-gray-600">Total Products</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-xl font-bold">{stats.totalOrders}</div>
          <div className="text-xs text-gray-600">Total Orders</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">⏳</div>
          <div className="text-xl font-bold">{stats.pendingOrders}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xl font-bold">₹{stats.totalRevenue}</div>
          <div className="text-xs text-gray-600">Total Revenue</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xl font-bold">{stats.todayOrders}</div>
          <div className="text-xs text-gray-600">Today's Orders</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">💵</div>
          <div className="text-xl font-bold">₹{stats.todayRevenue}</div>
          <div className="text-xs text-gray-600">Today's Revenue</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/farmer/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">➕</div>
          <div>
            <h3 className="font-semibold text-lg">Add Product</h3>
            <p className="text-gray-600 text-sm">List new products for customers</p>
          </div>
        </Link>

        <Link to="/farmer/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📋</div>
          <div>
            <h3 className="font-semibold text-lg">Manage Orders</h3>
            <p className="text-gray-600 text-sm">View and update order status</p>
          </div>
        </Link>

        <Link to="/farmer/insights" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📊</div>
          <div>
            <h3 className="font-semibold text-lg">Demand Insights</h3>
            <p className="text-gray-600 text-sm">AI-powered demand predictions</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/farmer/orders" className="text-green-600 hover:text-green-700 text-sm">
              View All →
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
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">₹{order.total_amount}</span>
                    <Link 
                      to={`/farmer/orders/${order.id}`}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      Update Status
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No orders yet</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.quantity_sold} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No sales data yet</p>
          )}

          <div className="mt-4 pt-4 border-t">
            <Link 
              to="/farmer/insights" 
              className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center"
            >
              View Detailed Analytics →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;