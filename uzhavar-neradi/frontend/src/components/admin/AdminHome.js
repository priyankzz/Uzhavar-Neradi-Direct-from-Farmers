import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import PredictionsChart from '../PredictionsChart';


const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard-stats/');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    await api.post(`/admin/approve-user/${userId}/`);
    fetchStats();
  };

  if (loading) return <div className="text-center mt-lg">{t('loading')}</div>;

  return (
    <div className="container mt-md">
      
      <h2>{t('admin_dashboard_overview')}</h2>

      {/* Key Metrics Cards */}
      <div className="flex wrap gap-md mb-lg">
        <div className="metric-card">
          <h3>{t('total_users')}</h3>
          <p className="metric-value">{stats.total_users}</p>
          <small>
            {t('farmers')}: {stats.total_farmers} | {t('customers')}: {stats.total_customers} | {t('delivery')}: {stats.total_delivery}
          </small>
        </div>
        <div className="metric-card">
          <h3>{t('pending_approvals')}</h3>
          <p className="metric-value">{stats.pending_approvals}</p>
          <small>{t('products')}: {stats.pending_products}</small>
        </div>
        <div className="metric-card">
          <h3>{t('orders_today')}</h3>
          <p className="metric-value">{stats.orders_today}</p>
          <small>{t('revenue')}: ₹{stats.revenue_today}</small>
        </div>
      </div>

      {/* Recent Pending Users */}
      <section className="mb-lg">
        <h3>{t('recent_pending_users')}</h3>
        {stats.recent_pending_users.length === 0 ? (
          <p>{t('no_pending_users')}</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('username')}</th>
                  <th>{t('email')}</th>
                  <th>{t('role')}</th>
                  <th>{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_pending_users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <Button variant="primary" onClick={() => approveUser(u.id)}>
                        {t('approve')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Orders */}
      <section className="mb-lg">
        <h3>{t('recent_orders')}</h3>
        {stats.recent_orders.length === 0 ? (
          <p>{t('no_recent_orders')}</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('order_id')}</th>
                  <th>{t('customer')}</th>
                  <th>{t('farmer')}</th>
                  <th>{t('total')}</th>
                  <th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.farmer}</td>
                    <td>₹{o.total}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* AI Prediction Summary */}
      <section className="mb-lg">
        <h3>{t('top_ai_crop_predictions')}</h3>
        {stats.top_predictions.length === 0 ? (
          <p>{t('no_predictions')}</p>
        ) : (
          <ul>
            {stats.top_predictions.map((p, idx) => (
              <li key={idx}>
                {p.crop} – {t('demand')}: {p.demand}, {t('profit')}: {p.profit}%
              </li>
            ))}
          </ul>
        )}
        <Button variant="accent" onClick={() => navigate('/admin/reports')}>
          {t('view_full_predictions')}
        </Button>
      </section>

      {/* Quick Actions */}
      <section>
        <h3>{t('quick_actions')}</h3>
        <div className="flex gap-sm">
          <Button variant="primary" onClick={() => navigate('/admin/users')}>
            {t('manage_users')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/products')}>
            {t('manage_products')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/orders')}>
            {t('view_orders')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/settings')}>
            {t('system_settings')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;