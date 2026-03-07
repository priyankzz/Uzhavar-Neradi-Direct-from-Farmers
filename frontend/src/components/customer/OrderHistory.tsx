/**
 * Order History Component
 * Copy to: frontend/src/components/customer/OrderHistory.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

interface Order {
  id: number;
  order_number: string;
  order_type: string;
  status: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  delivered_at: string | null;
  items: OrderItem[];
  farmer_name: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const ordersData = response.data.results || response.data;
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.farmer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
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

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by order number or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <span className="font-mono text-sm text-gray-500">
                      Order #{order.order_number}
                    </span>
                    <span className={`ml-4 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price_per_unit} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">₹{item.total_price}</p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-sm">
                      <span className="text-gray-500">Farmer:</span>{' '}
                      <span className="font-medium">{order.farmer_name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Payment:</span>{' '}
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_method} - {order.payment_status}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₹{order.total_amount}
                    </p>
                    <Link
                      to={`/track-order/${order.id}`}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      Track Order →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No orders found</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;