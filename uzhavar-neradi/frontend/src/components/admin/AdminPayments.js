import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import Button from '../Button/Button';

const AdminPayments = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await api.get('/payments/admin/payments/');
    setPayments(res.data);
  };

  const confirmCOD = async (id) => {
    await api.patch(`/payments/admin/payments/${id}/confirm/`);
    fetchPayments();
  };

  return (
    <div className="container mt-md">
      <h2>{t('manage_payments')}</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>{t('order')}</th>
              <th>{t('method')}</th>
              <th>{t('amount')}</th>
              <th>{t('status')}</th>
              <th>{t('action')}</th>
              </tr>
            </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.order_id}</td>
                <td>{p.method}</td>
                <td>₹{p.amount}</td>
                <td>{p.status}</td>
                <td>
                  {p.method === 'cod' && p.status === 'pending' && (
                    <Button variant="primary" onClick={() => confirmCOD(p.id)}>
                      {t('confirm_cod')}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;