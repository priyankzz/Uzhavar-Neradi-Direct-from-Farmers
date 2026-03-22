import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../Button/Button';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [remark, setRemark] = useState('');
  const [showRemark, setShowRemark] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/delivery/orders/');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      toast.error(t('failed_load_orders'));
    }
  };

  const updateStatus = async (orderId, newStatus, remarkText = '') => {
    setUpdating(orderId);
    try {
      await api.patch(`/orders/delivery/orders/${orderId}/update/`, {
        status: newStatus,
        remark: remarkText,
      });
      toast.success(t('status_updated'));
      fetchOrders();
      setShowRemark(null);
      setRemark('');
    } catch (err) {
      toast.error(err.response?.data?.error || t('update_failed'));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="container mt-md">
      <h2>{t('assigned_orders')}</h2>
      {orders.length === 0 ? (
        <p>{t('no_assigned_orders')}</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('customer')}</th>
                <th>{t('address')}</th>
                <th>{t('total')}</th>
                <th>{t('status')}</th>
                <th>{t('actions')}</th>
                </tr>
              </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.delivery_address}</td>
                  <td>₹{o.total_amount}</td>
                  <td>{o.status}</td>
                  <td>
                    {o.status === 'shipped' && (
                      <Button
                        variant="primary"
                        onClick={() => updateStatus(o.id, 'out_for_delivery')}
                        disabled={updating === o.id}
                      >
                        {t('out_for_delivery')}
                      </Button>
                    )}
                    {o.status === 'out_for_delivery' && (
                      <div className="flex gap-sm">
                        <Button
                          variant="success"
                          onClick={() => updateStatus(o.id, 'delivered')}
                          disabled={updating === o.id}
                        >
                          {t('delivered')}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setShowRemark(o.id)}
                        >
                          {t('not_delivered')}
                        </Button>
                      </div>
                    )}
                    {showRemark === o.id && (
                      <div className="card mt-sm" style={{ padding: 'var(--spacing-sm)' }}>
                        <textarea
                          placeholder={t('enter_remark')}
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          rows="2"
                          className="input"
                        />
                        <div className="flex gap-sm mt-sm">
                          <Button
                            variant="danger"
                            onClick={() => updateStatus(o.id, 'not_delivered', remark)}
                            disabled={updating === o.id}
                          >
                            {t('submit')}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setShowRemark(null)}
                          >
                            {t('cancel')}
                          </Button>
                        </div>
                      </div>
                    )}
                    {updating === o.id && <span className="ml-sm">{t('updating')}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryOrders;