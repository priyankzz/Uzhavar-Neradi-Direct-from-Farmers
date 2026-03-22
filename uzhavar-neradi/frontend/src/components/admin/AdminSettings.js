import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Button from '../Button/Button';

// Comprehensive list of system settings keys
const keyOptions = [
  { value: 'delivery_charge', label: 'Delivery Charge (₹)' },
  { value: 'min_order_amount', label: 'Minimum Order Amount (₹)' },
  { value: 'tax_percentage', label: 'Tax Percentage (%)' },
  { value: 'support_email', label: 'Support Email' },
  { value: 'otp_expiry', label: 'OTP Expiry (minutes)' },
  { value: 'upi_id', label: 'UPI ID' },
  { value: 'contact_phone', label: 'Contact Phone' },
  { value: 'enable_cod', label: 'Enable COD (true/false)' },
  { value: 'enable_upi', label: 'Enable UPI (true/false)' },
  { value: 'commission_percentage', label: 'Platform Commission (%)' },
  { value: 'max_delivery_distance', label: 'Max Delivery Distance (km)' },
  { value: 'free_delivery_threshold', label: 'Free Delivery Above (₹)' },
  { value: 'order_cancellation_time', label: 'Cancellation Time Limit (minutes)' },
  { value: 'max_products_per_order', label: 'Max Products Per Order' },
  { value: 'enable_preorders', label: 'Enable Pre‑orders (true/false)' },
  { value: 'default_language', label: 'Default Language (en/ta)' },
  { value: 'currency_symbol', label: 'Currency Symbol' },
  { value: 'admin_email', label: 'Admin Notification Email' },
  { value: 'sms_api_key', label: 'SMS API Key' },
  { value: 'google_maps_api_key', label: 'Google Maps API Key' },
  { value: 'weather_api_key', label: 'Weather API Key' },
  { value: 'ai_model_endpoint', label: 'AI Model Endpoint URL' },
  { value: 'session_timeout', label: 'Session Timeout (minutes)' },
  { value: 'max_login_attempts', label: 'Max Login Attempts' },
  { value: 'maintenance_mode', label: 'Maintenance Mode (true/false)' },
  { value: 'farmer_rejection_reasons', label: 'Farmer Rejection Reasons (JSON array)' },
  { value: 'delivery_rejection_reasons', label: 'Delivery Partner Rejection Reasons (JSON array)' },
  { value: 'customer_rejection_reasons', label: 'Customer Rejection Reasons (JSON array)' },
];

const AdminSettings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState([]);
  const [newKey, setNewKey] = useState(keyOptions[0].value);
  const [newValue, setNewValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await api.get('/admin/settings/');
    setSettings(res.data);
  };

  const addSetting = async () => {
    if (!newKey || !newValue) {
      toast.warn(t('fill_key_value'));
      return;
    }
    if (settings.some(s => s.key === newKey)) {
      toast.error(t('key_exists'));
      return;
    }
    await api.post('/admin/settings/', { key: newKey, value: newValue });
    setNewKey(keyOptions[0].value);
    setNewValue('');
    fetchSettings();
    toast.success(t('setting_added'));
  };

  const deleteSetting = async (id) => {
    if (window.confirm(t('delete_confirm'))) {
      await api.delete(`/admin/settings/${id}/`);
      fetchSettings();
      toast.success(t('setting_deleted'));
    }
  };

  const startEdit = (setting) => {
    setEditingId(setting.id);
    setEditKey(setting.key);
    setEditValue(setting.value);
  };

  const saveEdit = async () => {
    const existing = settings.find(s => s.key === editKey && s.id !== editingId);
    if (existing) {
      toast.error(t('key_exists'));
      return;
    }
    await api.patch(`/admin/settings/${editingId}/`, { key: editKey, value: editValue });
    setEditingId(null);
    fetchSettings();
    toast.success(t('setting_updated'));
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="container mt-md">
      <h2>{t('system_settings')}</h2>
      <div className="card mb-md">
        <div className="flex gap-sm">
          <select
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            className="input"
            style={{ width: 'auto' }}
          >
            {keyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t('value')}
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="input"
          />
          <Button variant="primary" onClick={addSetting}>
            {t('add')}
          </Button>
        </div>
      </div>

      <ul className="list-none p-0">
        {settings.map(s => (
          <li key={s.id} className="card mb-sm">
            {editingId === s.id ? (
              <div className="flex gap-sm">
                <select
                  value={editKey}
                  onChange={e => setEditKey(e.target.value)}
                  className="input"
                  style={{ width: 'auto' }}
                >
                  {keyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="input"
                />
                <Button variant="success" onClick={saveEdit}>{t('save')}</Button>
                <Button variant="secondary" onClick={cancelEdit}>{t('cancel')}</Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span><strong>{s.key}</strong>: {s.value}</span>
                <div className="flex gap-sm">
                  <Button variant="accent" onClick={() => startEdit(s)}>{t('edit')}</Button>
                  <Button variant="danger" onClick={() => deleteSetting(s.id)}>{t('delete')}</Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSettings;