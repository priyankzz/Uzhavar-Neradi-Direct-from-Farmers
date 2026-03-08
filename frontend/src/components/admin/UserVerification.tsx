/**
 * User Verification Component
 * Copy to: frontend/src/components/admin/UserVerification.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface VerificationRequest {
  id: number;
  user_id: number;
  username: string;
  email: string;
  farm_name: string;
  farm_address: string;
  farm_size: number;
  farming_type: string;
  submitted_at: string;
  documents: Array<{
    type: string;
    url: string;
  }>;
}

const UserVerification: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filter, setFilter] = useState('PENDING');
  
  const { t } = useLanguage();

  useEffect(() => {
    fetchVerificationRequests();
  }, [filter]);

  const fetchVerificationRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/verifications/', {
        params: { status: filter },
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setProcessingId(requestId);
    try {
      await axios.post(
        `http://localhost:8000/api/admin/verifications/${requestId}/approve/`,
        {},
        {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        }
      );
      
      // Remove from list
      setRequests(requests.filter(r => r.id !== requestId));
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to approve request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    setProcessingId(selectedRequest.id);
    try {
      await axios.post(
        `http://localhost:8000/api/admin/verifications/${selectedRequest.id}/reject/`,
        { reason: rejectionReason },
        {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        }
      );
      
      // Remove from list
      setRequests(requests.filter(r => r.id !== selectedRequest.id));
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const openDocument = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Verification</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests List */}
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition hover:shadow-md ${
                  selectedRequest?.id === request.id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{request.farm_name}</h3>
                    <p className="text-sm text-gray-600">{request.username}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(request.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="truncate">{request.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Farm Size</p>
                    <p>{request.farm_size} acres</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p className="text-4xl mb-3">📋</p>
              <p>No {filter.toLowerCase()} verification requests</p>
            </div>
          )}
        </div>

        {/* Request Details */}
        {selectedRequest && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Verification Details</h2>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Basic Information</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <p><span className="text-gray-500">Username:</span> {selectedRequest.username}</p>
                  <p><span className="text-gray-500">Email:</span> {selectedRequest.email}</p>
                  <p><span className="text-gray-500">Farm Name:</span> {selectedRequest.farm_name}</p>
                  <p><span className="text-gray-500">Farm Address:</span> {selectedRequest.farm_address}</p>
                  <p><span className="text-gray-500">Farm Size:</span> {selectedRequest.farm_size} acres</p>
                  <p><span className="text-gray-500">Farming Type:</span> {selectedRequest.farming_type}</p>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Documents</h3>
                <div className="space-y-2">
                  {selectedRequest.documents.map((doc, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <span>{doc.type}</span>
                      {doc.url ? (
                        <button
                          onClick={() => openDocument(doc.url)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Document →
                        </button>
                      ) : (
                        <span className="text-red-600">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {filter === 'PENDING' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={processingId === selectedRequest.id}
                    className="btn-primary flex-1"
                  >
                    {processingId === selectedRequest.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={processingId === selectedRequest.id}
                    className="btn-danger flex-1"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Reject Verification</h2>
            
            <p className="text-gray-600 mb-4">
              Rejecting verification for <span className="font-semibold">{selectedRequest.farm_name}</span>
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Reason for Rejection</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="input-field"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={!rejectionReason || processingId === selectedRequest.id}
                className="btn-danger flex-1"
              >
                {processingId === selectedRequest.id ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
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

export default UserVerification;