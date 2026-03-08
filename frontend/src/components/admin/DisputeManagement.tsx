/**
 * Dispute Management Component
 * Copy to: frontend/src/components/admin/DisputeManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface Dispute {
  id: number;
  dispute_id: string;
  title: string;
  dispute_type: string;
  status: string;
  raised_by_name: string;
  against_user_name: string;
  order_number: string;
  created_at: string;
}

const DisputeManagement: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('OPEN');

  useEffect(() => {
    fetchDisputes();
  }, [filter]);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/disputes/?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      setDisputes(response.data);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputeDetails = async (disputeId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/disputes/${disputeId}/`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      setSelectedDispute(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch dispute details:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedDispute) return;

    try {
      await axios.post(
        `http://localhost:8000/api/admin/disputes/${selectedDispute.id}/messages/`,
        { message: newMessage },
        { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
      );
      setNewMessage('');
      fetchDisputeDetails(selectedDispute.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const resolveDispute = async (resolution: string, action: string) => {
    if (!selectedDispute) return;

    try {
      await axios.post(
        `http://localhost:8000/api/admin/disputes/${selectedDispute.id}/resolve/`,
        { resolution, action },
        { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
      );
      fetchDisputes();
      setSelectedDispute(null);
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'OPEN': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800',
      'ESCALATED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dispute Management</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-2 mb-4">
              {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    filter === status ? 'bg-green-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {disputes.map(dispute => (
                <div
                  key={dispute.id}
                  onClick={() => fetchDisputeDetails(dispute.id)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedDispute?.id === dispute.id 
                      ? 'bg-green-50 border border-green-200' 
                      : 'hover:bg-gray-50 border'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-xs">{dispute.dispute_id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{dispute.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dispute.raised_by_name} vs {dispute.against_user_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dispute Details */}
        <div className="col-span-2">
          {selectedDispute ? (
            <div className="bg-white rounded-lg shadow">
              {/* Header */}
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">{selectedDispute.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Dispute #{selectedDispute.dispute_id} • {selectedDispute.dispute_type}
                </p>
              </div>

              {/* Info Grid */}
              <div className="p-4 border-b bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Raised By</p>
                    <p className="font-medium">{selectedDispute.raised_by_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Against</p>
                    <p className="font-medium">{selectedDispute.against_user_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order</p>
                    <p className="font-mono">{selectedDispute.order_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p>{new Date(selectedDispute.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm">{selectedDispute.description}</p>
              </div>

              {/* Messages */}
              <div className="p-4 h-96 overflow-y-auto border-b">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-4 ${msg.sender_name === 'Admin' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[70%] p-3 rounded-lg ${
                      msg.sender_name === 'Admin' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100'
                    }`}>
                      <p className="text-xs mb-1 opacity-75">{msg.sender_name}</p>
                      <p>{msg.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 input-field"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage} className="btn-primary">Send</button>
                </div>
              </div>

              {/* Resolution Actions */}
              {selectedDispute.status !== 'RESOLVED' && (
                <div className="p-4 border-t bg-gray-50">
                  <h3 className="font-medium mb-2">Resolve Dispute</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolveDispute('Refund issued to customer', 'refund')}
                      className="btn-primary text-sm"
                    >
                      Issue Refund
                    </button>
                    <button
                      onClick={() => resolveDispute('Warning issued to farmer', 'warning')}
                      className="btn-secondary text-sm"
                    >
                      Issue Warning
                    </button>
                    <button
                      onClick={() => resolveDispute('No action needed - false complaint', 'dismiss')}
                      className="btn-secondary text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p className="text-4xl mb-3">⚖️</p>
              <p>Select a dispute to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeManagement;