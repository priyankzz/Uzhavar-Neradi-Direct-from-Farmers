import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Button from '../Button/Button';

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: '', phone: '', is_approved: false });

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
      fetchUsers();
      toast.success(t('user_deleted'));
    }
  };

  const toggleApprove = async (user) => {
    await api.patch(`/users/${user.id}/`, { is_approved: !user.is_approved });
    fetchUsers();
    toast.success(t('user_updated'));
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
    setEditingUser(null);
    fetchUsers();
    toast.success(t('user_updated'));
  };

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
              <th>{t('active')}</th>
              <th>{t('actions')}</th>
              <th>{t('edit')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <input type="checkbox" checked={u.is_approved} onChange={() => toggleApprove(u)} />
                </td>
                <td>{u.is_active ? t('yes') : t('no')}</td>
                <td>
                  <Button variant="danger" onClick={() => deleteUser(u.id)}>
                    {t('delete')}
                  </Button>
                </td>
                <td>
                  <Button variant="accent" onClick={() => startEdit(u)}>
                    {t('edit')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h3>{t('edit_user')}</h3>
            <div className="flex flex-col gap-sm">
              <div>
                <label>{t('username')}:</label>
                <input
                  className="input"
                  value={editForm.username}
                  onChange={e => setEditForm({...editForm, username: e.target.value})}
                />
              </div>
              <div>
                <label>{t('email')}:</label>
                <input
                  className="input"
                  value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div>
                <label>{t('role')}:</label>
                <select
                  className="input"
                  value={editForm.role}
                  onChange={e => setEditForm({...editForm, role: e.target.value})}
                >
                  <option value="customer">{t('customer')}</option>
                  <option value="farmer">{t('farmer')}</option>
                  <option value="delivery">{t('delivery_partner')}</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label>{t('phone')}:</label>
                <input
                  className="input"
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-sm">
                <label>{t('approved')}:</label>
                <input
                  type="checkbox"
                  checked={editForm.is_approved}
                  onChange={e => setEditForm({...editForm, is_approved: e.target.checked})}
                />
              </div>
              <div className="flex gap-sm justify-end">
                <Button variant="success" onClick={saveEdit}>{t('save')}</Button>
                <Button variant="secondary" onClick={() => setEditingUser(null)}>{t('cancel')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;