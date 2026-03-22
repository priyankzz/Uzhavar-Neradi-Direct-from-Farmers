import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import Button from '../Button/Button';

const AdminDeliveries = () => {
  const { t } = useTranslation();
  const [deliveries, setDeliveries] = useState([]);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    fetchDeliveries();
    fetchUnassignedOrders();
    fetchDeliveryPartners();
  }, []);

  const fetchDeliveries = async () => {
    const res = await api.get('/delivery/admin/deliveries/');
    setDeliveries(res.data);
  };

  const fetchUnassignedOrders = async () => {
    const res = await api.get('/delivery/unassigned-orders/');
    setUnassignedOrders(res.data);
  };

  const fetchDeliveryPartners = async () => {
    const res = await api.get('/delivery/partners/');
    setDeliveryPartners(res.data);
  };

  const assignPartner = async (orderId, partnerId) => {
    await api.post('/delivery/admin/assign/', {
      order_id: orderId,
      delivery_partner_id: partnerId
    });
    fetchDeliveries();
    fetchUnassignedOrders();
    setShowDropdown(null);
  };

  const markDelivered = async (deliveryId) => {
    await api.patch(`/delivery/admin/deliveries/${deliveryId}/complete/`);
    fetchDeliveries();
  };

  return (
    <div className="container mt-md">
      <h2>{t('unassigned_orders')}</h2>
      {unassignedOrders.length === 0 ? (
        <p>{t('no_orders_ready')}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>{t('order_id')}</th>
              <th>{t('customer')}</th>
              <th>{t('address')}</th>
              <th>{t('total')}</th>
              <th>{t('actions')}</th>
              </tr>
            </thead>
          <tbody>
            {unassignedOrders.map(order => (
              <tr key={order.id}>
                 <td>{order.id}</td>
                 <td>{order.customer_name}</td>
                 <td>{order.delivery_address}</td>
                 <td>₹{order.total_amount}</td>
                 <td>
                   <Button variant="primary" onClick={() => setShowDropdown(order.id)}>
                     {t('assign_delivery_partner')}
                   </Button>
                   {showDropdown === order.id && (
                     <select
                       onChange={(e) => assignPartner(order.id, e.target.value)}
                       defaultValue=""
                       className="ml-sm"
                     >
                       <option value="" disabled>{t('select_partner')}</option>
                       {deliveryPartners.map(p => (
                         <option key={p.id} value={p.id}>
                           {p.username}
                         </option>
                       ))}
                     </select>
                   )}
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>{t('existing_deliveries')}</h2>
      {deliveries.length === 0 ? (
        <p>{t('no_delivery_assignments')}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>{t('order')}</th>
              <th>{t('customer')}</th>
              <th>{t('partner')}</th>
              <th>{t('assigned')}</th>
              <th>{t('delivered')}</th>
              <th>{t('actions')}</th>
            </tr>
            </thead>
          <tbody>
            {deliveries.map(d => (
              <tr key={d.id}>
                 <td>{d.order_id}</td>
                 <td>{d.customer}</td>
                 <td>{d.delivery_partner_name || t('not_assigned')}</td>
                 <td>{d.assigned_at}</td>
                 <td>{d.delivered_at || t('pending')}</td>
                 <td>
                   {d.delivery_partner && !d.delivered_at &&
                     <Button variant="primary" onClick={() => markDelivered(d.id)}>
                       {t('mark_delivered')}
                     </Button>
                   }
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDeliveries;