import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PredictionsChart from '../PredictionsChart';
import FarmerSalesChart from './FarmerSalesChart';
import Button from '../Button/Button';

const FarmerHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/orders/farmer/stats/');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-md text-center">{t('loading')}</div>;

  return (
    <div className="container mt-md">
      <h2>{t('farmer_overview')}</h2>

      {/* Key Metrics Cards */}
      <div className="flex gap-md wrap" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="metric-card">
          <h3>{t('products')}</h3>
          <p>{stats.total_products}</p>
          <small>{t('pending_approval')}: {stats.pending_products}</small>
        </div>
        <div className="metric-card">
          <h3>{t('orders')}</h3>
          <p>{stats.total_orders}</p>
          <small>{t('pending')}: {stats.pending_orders} | {t('completed')}: {stats.completed_orders}</small>
        </div>
        <div className="metric-card">
          <h3>{t('earnings')}</h3>
          <p>₹{stats.earnings}</p>
        </div>
      </div>

      {/* AI Predictions */}
      <section className="mb-lg">
        <h3>{t('ai_predictions')}</h3>
        <PredictionsChart />
      </section>

      {/* Actual Sales Chart */}
      <section className="mb-lg">
        <h3>{t('your_top_selling_products')}</h3>
        <FarmerSalesChart />
      </section>

      {/* Quick Actions */}
      <section>
        <h3>{t('quick_actions')}</h3>
        <div className="flex gap-md wrap">
          <Button variant="primary" onClick={() => navigate('/farmer/add-product')}>
            {t('add_product')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/farmer/products')}>
            {t('manage_products')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/farmer/orders')}>
            {t('view_orders')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/farmer/profile')}>
            {t('update_profile')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FarmerHome;