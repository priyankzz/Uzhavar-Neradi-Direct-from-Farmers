/**
 * Middleman Monitor Component
 * Copy to: frontend/src/components/admin/MiddlemanMonitor.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface Flag {
  id: number;
  user_id: number;
  username: string;
  email: string;
  flag_type: string;
  status: string;
  description: string;
  created_at: string;
  evidence_data: any;
}

const MiddlemanMonitor: React.FC = () => {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [suspiciousUsers, setSuspiciousUsers] = useState<any[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchFlags();
    fetchSuspiciousUsers();
  }, [filter]);

  const fetchFlags = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/middleman/flags/?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setFlags(response.data);
    } catch (error) {
      console.error('Failed to fetch flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuspiciousUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/middleman/suspicious/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSuspiciousUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch suspicious users:', error);
    }
  };

  const resolveFlag = async (flagId: number, action: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/admin/middleman/flags/${flagId}/resolve/`,
        { action, notes: resolutionNotes },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setSelectedFlag(null);
      setResolutionNotes('');
      fetchFlags();
      fetchSuspiciousUsers();
    } catch (error) {
      console.error('Failed to resolve flag:', error);
    }
  };

  const getFlagTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'BULK_PURCHASE': 'bg-orange-100 text-orange-800',
      'RESELLER_PATTERN': 'bg-red-100 text-red-800',
      'MULTIPLE_ACCOUNTS': 'bg-purple-100 text-purple-800',
      'UNUSUAL_ORDERING': 'bg-yellow-100 text-yellow-800',
      'PRICE_GOUGING': 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Middleman Monitor</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending Flags</p>
          <p className="text-2xl font-bold">{flags.filter(f => f.status === 'PENDING').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Under Investigation</p>
          <p className="text-2xl font-bold">{flags.filter(f => f.status === 'INVESTIGATING').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold">{flags.filter(f => f.status === 'CONFIRMED').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Suspicious Users</p>
          <p className="text-2xl font-bold">{suspiciousUsers.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Flags List */}
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-2 mb-4">
              {['PENDING', 'INVESTIGATING', 'CONFIRMED'].map(status => (
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

            <div className="space-y-3">
              {flags.map(flag => (
                <div
                  key={flag.id}
                  onClick={() => setSelectedFlag(flag)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedFlag?.id === flag.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getFlagTypeColor(flag.flag_type)}`}>
                      {flag.flag_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(flag.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium">{flag.username}</p>
                  <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flag Details */}
        <div>
          {selectedFlag ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Flag Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium">{selectedFlag.username}</p>
                  <p className="text-sm">{selectedFlag.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Flag Type</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getFlagTypeColor(selectedFlag.flag_type)}`}>
                    {selectedFlag.flag_type}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="mt-1">{selectedFlag.description}</p>
                </div>

                {selectedFlag.evidence_data && (
                  <div>
                    <p className="text-sm text-gray-500">Evidence</p>
                    <pre className="mt-1 p-3 bg-gray-50 rounded text-xs overflow-auto">
                      {JSON.stringify(selectedFlag.evidence_data, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Resolution Notes</p>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Add notes about your investigation..."
                    rows={3}
                    className="input-field mt-1"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => resolveFlag(selectedFlag.id, 'confirm')}
                    className="btn-danger flex-1"
                  >
                    Confirm & Ban User
                  </button>
                  <button
                    onClick={() => resolveFlag(selectedFlag.id, 'false_alarm')}
                    className="btn-secondary flex-1"
                  >
                    False Alarm
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p className="text-4xl mb-3">🚩</p>
              <p>Select a flag to investigate</p>
            </div>
          )}
        </div>
      </div>

      {/* Suspicious Users Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Suspicious Users</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Flag Count</th>
                <th className="px-4 py-3 text-left">Recent Flags</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suspiciousUsers.map(user => (
                <tr key={user.user_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-red-600">{user.flag_count}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {user.recent_flags?.map((flag: any, idx: number) => (
                        <span key={idx} className={`inline-block px-2 py-0.5 rounded-full text-xs mr-1 ${getFlagTypeColor(flag.type)}`}>
                          {flag.type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Ban User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MiddlemanMonitor;