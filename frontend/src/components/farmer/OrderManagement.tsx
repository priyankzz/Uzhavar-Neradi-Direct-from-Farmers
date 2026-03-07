/**
 * Order Management Component
 * Copy to: frontend/src/components/farmer/OrderManagement.tsx
 */

import React, { useState, useEffect } from 'react';
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
  customer_name: string;
  customer_phone: string;
  order_type: string;
  status: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  delivery_address: string;
  delivery_instructions: string;
  created_at: string;
  scheduled_date: string | null;
  items: OrderItem[];
  delivery_partner_name: string | null;
}

interface DeliveryPartner {
  id: number;
  username: string;
  is_available: boolean;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, typeFilter]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPartners = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users/', {
        params: { role: 'DELIVERY', available: true },
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setDeliveryPartners(response.data);
    } catch (error) {
      console.error('Failed to fetch delivery partners:', error);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(order => order.order_type === typeFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/orders/${orderId}/update-status/`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedOrder || !selectedPartner) return;

    setUpdating(true);
    try {
      await axios.post(
        `http://localhost:8000/api/orders/${selectedOrder.id}/assign-delivery/`,
        { delivery_partner_id: selectedPartner },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setShowAssignModal(false);
      setSelectedPartner(null);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Failed to assign delivery:', error);
    } finally {
      setUpdating(false);
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

  const getNextStatusOptions = (currentStatus: string) => {
    const statusFlow: { [key: string]: string[] } = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['ASSIGNED', 'CANCELLED'],
      'ASSIGNED': ['PICKED_UP', 'CANCELLED'],
      'PICKED_UP': ['OUT_FOR_DELIVERY'],
      'OUT_FOR_DELIVERY': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELLED': []
    };
    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Types</option>
            <option value="NORMAL">Normal Orders</option>
            <option value="PREORDER">Preorders</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
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
                  <span className="ml-4 text-sm text-gray-500">
                    {order.order_type}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Customer Info */}
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm">{order.customer_phone}</p>
                </div>

                {/* Delivery Info */}
                <div>
                  <p className="text-sm text-gray-500">Delivery</p>
                  <p className="text-sm">{order.delivery_address}</p>
                  {order.delivery_instructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Note: {order.delivery_instructions}
                    </p>
                  )}
                  {order.delivery_partner_name && (
                    <p className="text-sm text-green-600 mt-1">
                      Partner: {order.delivery_partner_name}
                    </p>
                  )}
                </div>

                {/* Payment Info */}
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-medium">₹{order.total_amount}</p>
                  <p className="text-sm">
                    {order.payment_method} - {order.payment_status}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4 border-t pt-4">
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span>₹{item.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                {getNextStatusOptions(order.status).map((nextStatus) => (
                  <button
                    key={nextStatus}
                    onClick={() => handleStatusUpdate(order.id, nextStatus)}
                    className="btn-primary text-sm"
                  >
                    Mark as {nextStatus}
                  </button>
                ))}

                {order.status === 'CONFIRMED' && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowAssignModal(true);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Assign Delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>

      {/* Assign Delivery Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Assign Delivery Partner</h2>
            <p className="text-gray-600 mb-4">
              Order #{selectedOrder.order_number}
            </p>

            <select
              value={selectedPartner || ''}
              onChange={(e) => setSelectedPartner(Number(e.target.value))}
              className="input-field mb-4"
            >
              <option value="">Select Delivery Partner</option>
              {deliveryPartners.map(partner => (
                <option key={partner.id} value={partner.id}>
                  {partner.username} {partner.is_available ? '(Available)' : '(Busy)'}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleAssignDelivery}
                disabled={!selectedPartner || updating}
                className="btn-primary flex-1"
              >
                {updating ? 'Assigning...' : 'Assign'}
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedPartner(null);
                  setSelectedOrder(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;