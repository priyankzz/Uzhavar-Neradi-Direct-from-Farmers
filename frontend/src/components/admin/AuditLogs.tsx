/**
 * Audit Logs Component
 * Copy to: frontend/src/components/admin/AuditLogs.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

interface AuditLog {
  id: number;
  user_name: string;
  action_type: string;
  content_type: string;
  object_repr: string;
  changes: any;
  ip_address: string;
  timestamp: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/audit-logs/', {
        params: { action_type: filter !== 'ALL' ? filter : undefined },
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'VERIFY': 'bg-purple-100 text-purple-800',
      'REJECT': 'bg-orange-100 text-orange-800',
      'BAN': 'bg-red-100 text-red-800',
      'UNBAN': 'bg-green-100 text-green-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="VERIFY">Verify</option>
            <option value="REJECT">Reject</option>
            <option value="BAN">Ban</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getActionColor(log.action_type)}`}>
                    {log.action_type}
                  </span>
                  <span className="font-medium">{log.user_name}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{log.content_type}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{log.object_repr}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    {expandedLog === log.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            </div>

            {expandedLog === log.id && (
              <div className="p-4 border-t bg-gray-50">
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">IP Address</p>
                  <p className="font-mono text-sm">{log.ip_address || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Changes</p>
                  <pre className="bg-white p-3 rounded border text-sm overflow-auto">
                    {JSON.stringify(log.changes, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogs;