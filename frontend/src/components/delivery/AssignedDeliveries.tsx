/**
 * Assigned Deliveries Component - Complete Bilingual
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
  
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Tamil translations
  const t = {
    pageTitle: isTamil ? 'ஒதுக்கப்பட்ட விநியோகங்கள்' : 'Assigned Deliveries',
    allDeliveries: isTamil ? 'அனைத்து விநியோகங்கள்' : 'All Deliveries',
    pending: isTamil ? 'நிலுவையில்' : 'Pending',
    accepted: isTamil ? 'ஏற்றுக்கொள்ளப்பட்டது' : 'Accepted',
    pickedUp: isTamil ? 'எடுக்கப்பட்டது' : 'Picked Up',
    outForDelivery: isTamil ? 'விநியோகத்திற்கு' : 'Out for Delivery',
    delivered: isTamil ? 'விநியோகிக்கப்பட்டது' : 'Delivered',
    rejected: isTamil ? 'நிராகரிக்கப்பட்டது' : 'Rejected',
    enableLocation: isTamil ? 'சிறந்த விநியோக கண்காணிப்புக்கு இருப்பிடப் பகிர்வை இயக்கவும்' : 'Enable location sharing for better delivery tracking',
    orderNo: isTamil ? 'ஆர்டர் எண்' : 'Order #',
    assigned: isTamil ? 'ஒதுக்கப்பட்டது' : 'Assigned',
    customerDetails: isTamil ? 'வாடிக்கையாளர் விவரங்கள்' : 'Customer Details',
    deliveryDetails: isTamil ? 'விநியோக விவரங்கள்' : 'Delivery Details',
    note: isTamil ? 'குறிப்பு' : 'Note',
    eta: isTamil ? 'மதிப்பிடப்பட்ட நேரம்' : 'ETA',
    items: isTamil ? 'பொருட்கள்' : 'Items',
    quantity: isTamil ? 'அளவு' : 'Quantity',
    total: isTamil ? 'மொத்தம்' : 'Total',
    acceptDelivery: isTamil ? 'விநியோகத்தை ஏற்க' : 'Accept Delivery',
    reject: isTamil ? 'நிராகரி' : 'Reject',
    provideReason: isTamil ? 'நிராகரிப்பதற்கான காரணத்தைக் கூறவும்:' : 'Please provide reason for rejection:',
    markAs: isTamil ? 'என குறிக்கவும்' : 'Mark as',
    navigate: isTamil ? 'வழிசெலுத்தல்' : 'Navigate',
    viewTracking: isTamil ? 'கண்காணிப்பைக் காண்க' : 'View Tracking',
    rejectionReason: isTamil ? 'நிராகரிப்புக்கான காரணம்' : 'Rejection Reason',
    noDeliveries: isTamil ? 'விநியோகங்கள் எதுவும் இல்லை' : 'No deliveries found',
    checkBack: isTamil ? 'புதிய பணிகளுக்கு பின்னர் மீண்டும் சரிபார்க்கவும்' : 'Check back later for new assignments',
    updateStatus: isTamil ? 'விநியோக நிலையைப் புதுப்பிக்கவும்' : 'Update Delivery Status',
    newStatus: isTamil ? 'புதிய நிலை' : 'New Status',
    notes: isTamil ? 'குறிப்புகள் (விரும்பினால்)' : 'Notes (Optional)',
    addNotes: isTamil ? 'இந்த விநியோகம் பற்றிய குறிப்புகளைச் சேர்க்கவும்...' : 'Add any notes about this delivery...',
    locationUpdate: isTamil ? '📍 இருப்பிடம் இந்த நிலையுடன் புதுப்பிக்கப்படும்' : '📍 Location will be updated with this status',
    updating: isTamil ? 'புதுப்பிக்கிறது...' : 'Updating...',
    cancel: isTamil ? 'ரத்து செய்' : 'Cancel',
    confirmReject: isTamil ? 'நிராகரிப்பை உறுதிப்படுத்தவும்' : 'Confirm Reject'
  };

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
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
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
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
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
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
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
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
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

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': isTamil ? 'நிலுவையில்' : 'Pending',
      'ACCEPTED': isTamil ? 'ஏற்றுக்கொள்ளப்பட்டது' : 'Accepted',
      'PICKED_UP': isTamil ? 'எடுக்கப்பட்டது' : 'Picked Up',
      'OUT_FOR_DELIVERY': isTamil ? 'விநியோகத்திற்கு' : 'Out for Delivery',
      'DELIVERED': isTamil ? 'விநியோகிக்கப்பட்டது' : 'Delivered',
      'REJECTED': isTamil ? 'நிராகரிக்கப்பட்டது' : 'Rejected'
    };
    return statusMap[status] || status;
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
        <h1 className="text-2xl font-bold">{t.pageTitle}</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="ALL">{t.allDeliveries}</option>
            <option value="PENDING">{t.pending}</option>
            <option value="ACCEPTED">{t.accepted}</option>
            <option value="PICKED_UP">{t.pickedUp}</option>
            <option value="OUT_FOR_DELIVERY">{t.outForDelivery}</option>
            <option value="DELIVERED">{t.delivered}</option>
            <option value="REJECTED">{t.rejected}</option>
          </select>
        </div>
      </div>

      {/* Location Status */}
      {!currentLocation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            ⚠️ {t.enableLocation}
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
                    {t.orderNo} {assignment.order.order_number}
                  </span>
                  <span className={`ml-4 px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                    {getStatusText(assignment.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {t.assigned}: {new Date(assignment.assigned_at).toLocaleString(isTamil ? 'ta-IN' : 'en-IN')}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-2">{t.customerDetails}</h3>
                  <p className="text-gray-700">{assignment.order.customer_name}</p>
                  <p className="text-sm text-gray-600">📞 {assignment.order.customer_phone}</p>
                </div>

                {/* Delivery Info */}
                <div>
                  <h3 className="font-semibold mb-2">{t.deliveryDetails}</h3>
                  <p className="text-sm text-gray-700">{assignment.order.delivery_address}</p>
                  {assignment.order.delivery_instructions && (
                    <p className="text-sm text-gray-500 mt-1">
                      {t.note}: {assignment.order.delivery_instructions}
                    </p>
                  )}
                  {assignment.estimated_delivery_time && (
                    <p className="text-sm text-blue-600 mt-1">
                      {t.eta}: {new Date(assignment.estimated_delivery_time).toLocaleString(isTamil ? 'ta-IN' : 'en-IN')}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">{t.items}</h3>
                <div className="bg-gray-50 p-3 rounded">
                  {assignment.order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product_name}</span>
                      <span>{t.quantity}: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex justify-end mb-4">
                <p className="text-lg font-bold text-green-600">
                  {t.total}: ₹{assignment.order.total_amount}
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
                      {t.acceptDelivery}
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt(t.provideReason);
                        if (reason) handleReject(assignment.id, reason);
                      }}
                      className="btn-danger"
                    >
                      {t.reject}
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
                    {t.markAs} {getStatusText(status)}
                  </button>
                ))}

                <button
                  onClick={() => openInGoogleMaps(assignment.order.delivery_address)}
                  className="btn-secondary"
                >
                  🗺️ {t.navigate}
                </button>

                <Link
                  to={`/track-order/${assignment.order.id}`}
                  className="btn-secondary"
                  target="_blank"
                >
                  👁️ {t.viewTracking}
                </Link>
              </div>

              {/* Rejection Reason (if any) */}
              {assignment.status === 'REJECTED' && assignment.rejection_reason && (
                <div className="mt-4 p-3 bg-red-50 rounded">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">{t.rejectionReason}:</span> {assignment.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="text-6xl mb-4">🚚</p>
            <p className="text-xl mb-2">{t.noDeliveries}</p>
            <p className="text-sm">{t.checkBack}</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{t.updateStatus}</h2>
            
            <p className="text-gray-600 mb-4">
              {t.orderNo} {selectedAssignment.order.order_number}
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">{t.newStatus}</label>
              <input
                type="text"
                value={getStatusText(newStatus)}
                readOnly
                className="input-field bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">{t.notes}</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder={t.addNotes}
                rows={3}
                className="input-field"
              />
            </div>

            {currentLocation && (
              <div className="mb-4 p-3 bg-green-50 rounded">
                <p className="text-sm text-green-700">
                  {t.locationUpdate}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="btn-primary flex-1"
              >
                {updating ? t.updating : t.updateStatus}
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
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedDeliveries;