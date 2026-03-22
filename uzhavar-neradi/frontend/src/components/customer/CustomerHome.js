import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CustomerPurchaseChart from '../CustomerPurchaseChart';
import Button from '../Button/Button';

const CustomerHome = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/orders/customer/stats/'),
        api.get('/orders/customer/orders/?limit=5')
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-md">{t('loading')}</div>;

  return (
    <div className="container mt-md">
      <h2>{t('customer_overview')}</h2>

      {/* Key Metrics Cards */}
      <div className="flex gap-md mb-md" style={{ flexWrap: 'wrap' }}>
        <div className="metric-card">
          <h3>{t('total_orders')}</h3>
          <p>{stats?.total_orders || 0}</p>
        </div>
        <div className="metric-card">
          <h3>{t('total_spent')}</h3>
          <p>₹{stats?.total_spent || 0}</p>
        </div>
        <div className="metric-card">
          <h3>{t('pending_orders')}</h3>
          <p>{stats?.pending_orders || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="mb-md">
        <h3>{t('recent_orders')}</h3>
        {recentOrders.length === 0 ? (
          <p>{t('no_recent_orders')}</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('date')}</th>
                  <th>{t('farmer')}</th>
                  <th>{t('total')}</th>
                  <th>{t('status')}</th>
                  </tr>
                </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                     <td>{o.id}</td>
                     <td>{new Date(o.order_date).toLocaleDateString()}</td>
                     <td>{o.farmer_name}</td>
                     <td>₹{o.total_amount}</td>
                     <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Your Purchase Chart */}
      <section className="mb-md">
        <h3>{t('your_purchases')}</h3>
        <CustomerPurchaseChart />
      </section>

      {/* Quick Actions */}
      <section>
        <h3>{t('quick_actions')}</h3>
        <div className="flex gap-sm">
          <Button variant="primary" onClick={() => navigate('/customer/browse')}>
            {t('browse_products')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/customer/orders')}>
            {t('view_all_orders')}
          </Button>
          <Button variant="accent" onClick={() => navigate('/customer/profile')}>
            {t('edit_profile')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CustomerHome;