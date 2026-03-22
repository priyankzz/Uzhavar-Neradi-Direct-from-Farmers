import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomerPurchaseChart = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch customer purchase stats from backend
    api.get('/orders/customer-stats/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>{t('your_purchases')}</h3>
      {data.length === 0 ? (
        <p>{t('no_purchases')}</p>
      ) : (
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="quantity"
            nameKey="product_name"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  );
};

export default CustomerPurchaseChart;