import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    const params = filter ? { payment_status: filter } : {};
    const res = await api.get('/orders/admin/orders/', { params });
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/admin/orders/${id}/`, { status });
    toast.success(t('order_status_updated'));
    fetchOrders();
  };

  return (
    <div className="mt-md" style={{ padding: '0 var(--spacing-md)' }}>
      <h2>{t('manage_orders')}</h2>
      <div className="flex items-center gap-sm mb-md">
        <label>{t('filter_by_payment_status')}:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input"
          style={{ width: 'auto' }}
        >
          <option value="">{t('all')}</option>
          <option value="pending">{t('pending')}</option>
          <option value="customer_marked">{t('customer_marked')}</option>
          <option value="paid">{t('paid')}</option>
          <option value="failed">{t('failed')}</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>{t('order_id')}</th>
              <th>{t('customer')}</th>
              <th>{t('farmer')}</th>
              <th>{t('total')}</th>
              <th>{t('order_status')}</th>
              <th>{t('payment_status')}</th>
              <th>{t('transaction_id')}</th>
              <th>{t('cancel_reason')}</th>
              <th>{t('cancelled_by')}</th>
              <th>{t('action')}</th>
              </tr>
            </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer_name}</td>
                <td>{o.farmer_name}</td>
                <td>₹{o.total_amount}</td>
                <td>{o.status}</td>
                <td>{o.payment_status}</td>
                <td>{o.transaction_id || '—'}</td>
                <td>{o.cancellation_reason || '—'}</td>
                <td>{o.cancelled_by_username || '—'}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="input"
                    style={{ width: 'auto', padding: '4px 8px' }}
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="confirmed">{t('confirmed')}</option>
                    <option value="shipped">{t('shipped')}</option>
                    <option value="delivered">{t('delivered')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;