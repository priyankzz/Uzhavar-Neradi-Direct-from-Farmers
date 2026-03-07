/**
 * Assigned Deliveries Component
 * Copy to: frontend/src/components/delivery/AssignedDeliveries.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface DeliveryAssignment {
  id: number;
  order: {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    delivery_instructions: string;
    total_amount: number;
    items: Array<{
      product_name: string;
      quantity: number;
    }>;
  };
  status: string;
  assigned_at: string;
  estimated_delivery_time: string;
  rejection_reason?: string;
}

interface Location {
  lat: number;
  lng: number;
}

const AssignedDeliveries: React.FC = () => {
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAssignment, setSelectedAssignment] = useState<DeliveryAssignment | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [updating, setUpdating] = useState(false);
  
  const { t } = useLanguage();

  useEffect(() => {
    fetchAssignments();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, statusFilter]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/orders/delivery/assignments/',
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setAssignments(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
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
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  const filterAssignments = () => {
    if (statusFilter === 'ALL') {
      setFilteredAssignments(assignments);
    } else {
      setFilteredAssignments(assignments.filter(a => a.status === statusFilter));
    }
  };

  const handleAccept = async (assignmentId: number) => {
    try {
      await axios.post(
        `http://localhost:8000/api/orders/delivery/${assignmentId}/update-status/`,
        { status: 'ACCEPTED' },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchAssignments();
    } catch (error) {
      console.error('Failed to accept delivery:', error);
    }
  };

  const handleReject = async (assignmentId: number, reason: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/orders/delivery/${assignmentId}/update-status/`,
        { 
          status: 'REJECTED',
          reason: reason 
        },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchAssignments();
    } catch (error) {
      console.error('Failed to reject delivery:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedAssignment || !newStatus) return;

    setUpdating(true);
    try {
      await axios.post(
        `http://localhost:8000/api/orders/delivery/${selectedAssignment.id}/update-status/`,
        { 
          status: newStatus,
          notes: statusNote,
          latitude: currentLocation?.lat,
          longitude: currentLocation?.lng
        },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setShowStatusModal(false);
      setSelectedAssignment(null);
      setNewStatus('');
      setStatusNote('');
      fetchAssignments();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatusOptions = (currentStatus: string) => {
    const statusFlow: { [key: string]: string[] } = {
      'PENDING': ['ACCEPTED', 'REJECTED'],
      'ACCEPTED': ['PICKED_UP'],
      'PICKED_UP': ['OUT_FOR_DELIVERY'],
      'OUT_FOR_DELIVERY': ['DELIVERED']
    };
    return statusFlow[currentStatus] || [];
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

  const openInGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assigned Deliveries</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="ALL">All Deliveries</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Location Status */}
      {!currentLocation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            ⚠️ Enable location sharing for better delivery tracking
          </p>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <span className="font-mono text-sm text-gray-500">
                    Order #{assignment.order.order_number}
                  </span>
                  <span className={`ml-4 px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Assigned: {new Date(assignment.assigned_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-2">Customer Details</h3>
                  <p className="text-gray-700">{assignment.order.customer_name}</p>
                  <p className="text-sm text-gray-600">📞 {assignment.order.customer_phone}</p>
                </div>

                {/* Delivery Info */}
                <div>
                  <h3 className="font-semibold mb-2">Delivery Details</h3>
                  <p className="text-sm text-gray-700">{assignment.order.delivery_address}</p>
                  {assignment.order.delivery_instructions && (
                    <p className="text-sm text-gray-500 mt-1">
                      Note: {assignment.order.delivery_instructions}
                    </p>
                  )}
                  {assignment.estimated_delivery_time && (
                    <p className="text-sm text-blue-600 mt-1">
                      ETA: {new Date(assignment.estimated_delivery_time).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="bg-gray-50 p-3 rounded">
                  {assignment.order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product_name}</span>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex justify-end mb-4">
                <p className="text-lg font-bold text-green-600">
                  Total: ₹{assignment.order.total_amount}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {assignment.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleAccept(assignment.id)}
                      className="btn-primary"
                    >
                      Accept Delivery
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide reason for rejection:');
                        if (reason) handleReject(assignment.id, reason);
                      }}
                      className="btn-danger"
                    >
                      Reject
                    </button>
                  </>
                )}

                {getNextStatusOptions(assignment.status).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setNewStatus(status);
                      setShowStatusModal(true);
                    }}
                    className="btn-primary"
                  >
                    Mark as {status}
                  </button>
                ))}

                <button
                  onClick={() => openInGoogleMaps(assignment.order.delivery_address)}
                  className="btn-secondary"
                >
                  🗺️ Navigate
                </button>

                <Link
                  to={`/track-order/${assignment.order.id}`}
                  className="btn-secondary"
                  target="_blank"
                >
                  👁️ View Tracking
                </Link>
              </div>

              {/* Rejection Reason (if any) */}
              {assignment.status === 'REJECTED' && assignment.rejection_reason && (
                <div className="mt-4 p-3 bg-red-50 rounded">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">Rejection Reason:</span> {assignment.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-6xl mb-4">🚚</p>
            <p className="text-xl mb-2">No deliveries found</p>
            <p className="text-sm">Check back later for new assignments</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Update Delivery Status</h2>
            
            <p className="text-gray-600 mb-4">
              Order #{selectedAssignment.order.order_number}
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">New Status</label>
              <input
                type="text"
                value={newStatus}
                readOnly
                className="input-field bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add any notes about this delivery..."
                rows={3}
                className="input-field"
              />
            </div>

            {currentLocation && (
              <div className="mb-4 p-3 bg-green-50 rounded">
                <p className="text-sm text-green-700">
                  📍 Location will be updated with this status
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="btn-primary flex-1"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedAssignment(null);
                  setNewStatus('');
                  setStatusNote('');
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

export default AssignedDeliveries;