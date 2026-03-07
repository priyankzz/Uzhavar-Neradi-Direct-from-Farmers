/**
 * Announcements Component
 * Copy to: frontend/src/components/admin/Announcements.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface Announcement {
  id: number;
  title: string;
  title_ta: string;
  content: string;
  content_ta: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  target_roles: string[];
  is_public: boolean;
  publish_from: string;
  publish_until: string | null;
  is_active: boolean;
  created_by_name: string;
  created_at: string;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    title_ta: '',
    content: '',
    content_ta: '',
    priority: 'MEDIUM',
    target_roles: [],
    is_public: true,
    publish_from: new Date().toISOString().slice(0, 16),
    publish_until: '',
    is_active: true
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/announcements/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleRoleChange = (role: string) => {
    const currentRoles = formData.target_roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setFormData({ ...formData, target_roles: newRoles });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAnnouncement) {
        await axios.put(
          `http://localhost:8000/api/admin/announcements/${editingAnnouncement.id}/`,
          formData,
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/admin/announcements/',
          formData,
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        );
      }
      
      fetchAnnouncements();
      resetForm();
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/admin/announcements/${id}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_ta: '',
      content: '',
      content_ta: '',
      priority: 'MEDIUM',
      target_roles: [],
      is_public: true,
      publish_from: new Date().toISOString().slice(0, 16),
      publish_until: '',
      is_active: true
    });
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Title (English) *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Title (Tamil)</label>
                <input
                  type="text"
                  name="title_ta"
                  value={formData.title_ta}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Content (English) *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Content (Tamil)</label>
              <textarea
                name="content_ta"
                value={formData.content_ta}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Publish From *</label>
                <input
                  type="datetime-local"
                  name="publish_from"
                  value={formData.publish_from}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Publish Until</label>
                <input
                  type="datetime-local"
                  name="publish_until"
                  value={formData.publish_until || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="flex items-center ml-6">
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Public
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Target Roles</label>
              <div className="flex gap-4">
                {['FARMER', 'CUSTOMER', 'DELIVERY'].map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.target_roles?.includes(role)}
                      onChange={() => handleRoleChange(role)}
                      className="mr-2"
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="btn-primary px-8">
                {editingAnnouncement ? 'Update' : 'Publish'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary px-8">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map(announcement => (
          <div key={announcement.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  {!announcement.is_active && (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-200">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{announcement.content}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingAnnouncement(announcement);
                    setFormData(announcement);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By: {announcement.created_by_name}</span>
              <span>•</span>
              <span>Publish: {new Date(announcement.publish_from).toLocaleString()}</span>
              {announcement.publish_until && (
                <>
                  <span>•</span>
                  <span>Until: {new Date(announcement.publish_until).toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;