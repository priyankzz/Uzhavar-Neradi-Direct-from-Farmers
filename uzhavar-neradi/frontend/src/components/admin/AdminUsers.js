import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../Button/Button';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: '', phone: '', is_approved: false });
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users/all/');
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    if (window.confirm(t('confirm_delete'))) {
      await api.delete(`/users/${id}/`);
      toast.success(t('user_deleted'));
      fetchUsers();
    }
  };

  const toggleApprove = async (user) => {
    await api.patch(`/users/${user.id}/`, { is_approved: !user.is_approved });
    toast.success(t('user_updated'));
    fetchUsers();
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      is_approved: user.is_approved
    });
  };

  const saveEdit = async () => {
    await api.patch(`/users/${editingUser.id}/`, editForm);
    toast.success(t('user_updated'));
    setEditingUser(null);
    fetchUsers();
  };

  const isCurrentAdmin = (user) => currentUser && user.id === currentUser.id;

  return (
    <div className="container mt-md">
      <h2>{t('user_management')}</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('username')}</th>
              <th>{t('email')}</th>
              <th>{t('role')}</th>
              <th>{t('approved')}</th>
              <th>{t('actions')}</th>
              <th>{t('edit')}</th>
              </tr>
            </thead>
          <tbody>
            {users.map(u => {
              const isSelf = isCurrentAdmin(u);
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={u.is_approved}
                      onChange={() => toggleApprove(u)}
                      disabled={isSelf}
                    />
                  </td>
                  <td>
                    {!isSelf && (
                      <Button variant="danger" onClick={() => deleteUser(u.id)}>
                        {t('delete')}
                      </Button>
                    )}
                  </td>
                  <td>
                    {!isSelf && (
                      <Button variant="accent" onClick={() => startEdit(u)}>
                        {t('edit')}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3>{t('edit_user')}</h3>
            <div className="form-group">
              <label>{t('username')}</label>
              <input
                value={editForm.username}
                onChange={e => setEditForm({...editForm, username: e.target.value})}
                className="input"
              />
            </div>
            <div className="form-group">
              <label>{t('email')}</label>
              <input
                value={editForm.email}
                onChange={e => setEditForm({...editForm, email: e.target.value})}
                className="input"
              />
            </div>
            <div className="form-group">
              <label>{t('role')}</label>
              <select
                value={editForm.role}
                onChange={e => setEditForm({...editForm, role: e.target.value})}
                className="input"
              >
                <option value="customer">{t('customer')}</option>
                <option value="farmer">{t('farmer')}</option>
                <option value="delivery">{t('delivery_partner')}</option>
                <option value="admin">{t('admin')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('phone')}</label>
              <input
                value={editForm.phone}
                onChange={e => setEditForm({...editForm, phone: e.target.value})}
                className="input"
              />
            </div>
            <div className="form-group">
              <label>{t('approved')}</label>
              <input
                type="checkbox"
                checked={editForm.is_approved}
                onChange={e => setEditForm({...editForm, is_approved: e.target.checked})}
              />
            </div>
            <div className="flex gap-sm justify-end">
              <Button variant="primary" onClick={saveEdit}>{t('save')}</Button>
              <Button variant="secondary" onClick={() => setEditingUser(null)}>{t('cancel')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;