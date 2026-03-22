import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Button from '../Button/Button';

const PendingApprovals = () => {
  const { t } = useTranslation();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [remarkText, setRemarkText] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentRole, setCurrentRole] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
    fetchRejectionReasons();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pending-users/');
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t('failed_load_pending'));
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectionReasons = async () => {
    try {
      const res = await api.get('/admin/settings/');
      const reasonsMap = {};
      res.data.forEach(setting => {
        if (setting.key === 'farmer_rejection_reasons') {
          reasonsMap.farmer = JSON.parse(setting.value);
        } else if (setting.key === 'delivery_rejection_reasons') {
          reasonsMap.delivery = JSON.parse(setting.value);
        } else if (setting.key === 'customer_rejection_reasons') {
          reasonsMap.customer = JSON.parse(setting.value);
        }
      });
      setRejectionReasons(reasonsMap);
    } catch (err) {
      console.error(err);
    }
  };

  const approveUser = async (userId) => {
    try {
      await api.post(`/admin/approve-user/${userId}/`);
      toast.success(t('user_approved'));
      fetchPending();
    } catch (err) {
      toast.error(t('approve_failed'));
    }
  };

  const openRejectModal = (userId, role) => {
    setCurrentUserId(userId);
    setCurrentRole(role);
    setSelectedReason('');
    setRemarkText('');
    setShowRejectModal(true);
  };

  const rejectUser = async () => {
    const remark = selectedReason === 'Other' ? remarkText : selectedReason;
    if (!remark) {
      toast.warn(t('rejection_reason_required'));
      return;
    }
    try {
      await api.post(`/admin/reject-user/${currentUserId}/`, { remark });
      toast.success(t('user_rejected'));
      setShowRejectModal(false);
      fetchPending();
    } catch (err) {
      toast.error(t('reject_failed'));
    }
  };

  const renderDocuments = (user) => {
    return (
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        {user.land_photo && (
          <a href={user.land_photo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            {t('view_land_photo')}
          </a>
        )}
        {user.vehicle_photo && (
          <a href={user.vehicle_photo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            {t('view_vehicle_photo')}
          </a>
        )}
        {user.license_photo && (
          <a href={user.license_photo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            {t('view_license_photo')}
          </a>
        )}
      </div>
    );
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'farmer': return t('farmer');
      case 'delivery': return t('delivery_partner');
      case 'customer': return t('customer');
      default: return role;
    }
  };

  if (loading) return <div className="container mt-md">{t('loading')}</div>;

  return (
    <div className="container mt-md">
      <h2>{t('pending_approvals')}</h2>
      {pendingUsers.length === 0 ? (
        <p>{t('no_pending_users')}</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t('username')}</th>
                <th>{t('email')}</th>
                <th>{t('phone')}</th>
                <th>{t('role')}</th>
                <th>{t('documents')}</th>
                <th>{t('actions')}</th>
                </tr>
              </thead>
            <tbody>
              {pendingUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{getRoleDisplay(user.role)}</td>
                  <td>{renderDocuments(user)}</td>
                  <td>
                    <div className="flex gap-sm">
                      <Button variant="success" onClick={() => approveUser(user.id)}>
                        {t('approve')}
                      </Button>
                      <Button variant="danger" onClick={() => openRejectModal(user.id, user.role)}>
                        {t('reject')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3>{t('reject_user', { role: getRoleDisplay(currentRole) })}</h3>
            <div className="mb-md">
              <label>{t('select_reason')}</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="input"
              >
                <option value="">-- {t('choose')} --</option>
                {rejectionReasons[currentRole]?.map((reason, idx) => (
                  <option key={idx} value={reason}>{reason}</option>
                ))}
                <option value="Other">{t('other')}</option>
              </select>
            </div>
            {selectedReason === 'Other' && (
              <div className="mb-md">
                <label>{t('remark')}</label>
                <textarea
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  className="input"
                  rows="3"
                />
              </div>
            )}
            <div className="flex gap-sm justify-end">
              <Button variant="primary" onClick={rejectUser}>{t('send_rejection')}</Button>
              <Button variant="secondary" onClick={() => setShowRejectModal(false)}>{t('cancel')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;