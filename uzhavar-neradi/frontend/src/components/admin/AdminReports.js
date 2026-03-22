import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import PredictionsChart from '../PredictionsChart';

const AdminReports = () => {
  const { t } = useTranslation();
  const [sales, setSales] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchSalesReport();
    fetchTopProducts();
  }, []);

  const fetchSalesReport = async () => {
    const res = await api.get('/admin/reports/sales/');
    setSales(res.data);
  };

  const fetchTopProducts = async () => {
    const res = await api.get('/admin/reports/top-products/');
    setTopProducts(res.data);
  };

  return (
    <div className="container mt-md">
      <h2>{t('sales_report_last_30_days')}</h2>
      {sales && (
        <>
          <div className="flex gap-md mb-md">
            <div className="metric-card" style={{ flex: '1' }}>
              <h3>{t('total_sales')}</h3>
              <p>₹{sales.total_sales}</p>
            </div>
            <div className="metric-card" style={{ flex: '1' }}>
              <h3>{t('orders')}</h3>
              <p>{sales.order_count}</p>
            </div>
          </div>
          <div className="table-responsive" style={{ marginBottom: 'var(--spacing-md)' }}>
            <BarChart width={600} height={300} data={sales.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="var(--color-primary)" />
            </BarChart>
          </div>
        </>
      )}

      <h2>{t('top_10_products')}</h2>
      <ul className="list-none p-0">
        {topProducts.map(p => (
          <li key={p.product__name} className="card mb-sm">
            <strong>{p.product__name}</strong>: {p.total_quantity} {t('sold')}
          </li>
        ))}
      </ul>

      <h2>{t('ai_crop_predictions')}</h2>
      <PredictionsChart />
    </div>
  );
};

export default AdminReports;