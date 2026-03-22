import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const AdminApprovalPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const res = await api.get('/admin/pending-users/');
    setPendingUsers(res.data);
  };

  const approveUser = async userId => {
    await api.post(`/admin/approve-user/${userId}/`);
    fetchPending();
  };

  return (
    <div>
      <h2>{t('Pending Approvals')}</h2>
      <ul>
        {pendingUsers.map(user => (
          <li key={user.id}>
            {user.username} - {user.role}
            <button onClick={() => approveUser(user.id)}>{t('Approve')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminApprovalPanel;