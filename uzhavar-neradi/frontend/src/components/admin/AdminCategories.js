import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import Card from '../Card/Card';
import Button from '../Button/Button';

const AdminCategories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNameTa, setNewNameTa] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNameTa, setEditNameTa] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get('/products/admin/categories/');
    setCategories(res.data);
  };

  const addCategory = async () => {
    if (!newName) return;
    await api.post('/products/admin/categories/', { name: newName, name_ta: newNameTa });
    setNewName('');
    setNewNameTa('');
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (window.confirm(t('delete_confirm'))) {
      await api.delete(`/products/admin/categories/${id}/`);
      fetchCategories();
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditNameTa(cat.name_ta || '');
  };

  const saveEdit = async () => {
    await api.patch(`/products/admin/categories/${editingId}/`, { name: editName, name_ta: editNameTa });
    setEditingId(null);
    fetchCategories();
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="container mt-md">
      <h2>{t('manage_categories')}</h2>
      <div className="card mb-md">
        <div className="flex gap-sm">
          <input
            className="input"
            placeholder={t('category_name_en')}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="input"
            placeholder={t('category_name_ta')}
            value={newNameTa}
            onChange={(e) => setNewNameTa(e.target.value)}
          />
          <Button variant="primary" onClick={addCategory}>
            {t('add_category')}
          </Button>
        </div>
      </div>
      <ul className="list-none p-0">
        {categories.map(cat => (
          <li key={cat.id} className="card mb-sm flex justify-between items-center">
            {editingId === cat.id ? (
              <div className="flex gap-sm w-full">
                <input
                  className="input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <input
                  className="input"
                  value={editNameTa}
                  onChange={e => setEditNameTa(e.target.value)}
                />
                <Button variant="success" onClick={saveEdit}>
                  {t('save')}
                </Button>
                <Button variant="secondary" onClick={cancelEdit}>
                  {t('cancel')}
                </Button>
              </div>
            ) : (
              <>
                <span>
                  <strong>{cat.name}</strong> {cat.name_ta && `(${cat.name_ta})`}
                </span>
                <div className="flex gap-sm">
                  <Button variant="accent" onClick={() => startEdit(cat)}>
                    {t('edit')}
                  </Button>
                  <Button variant="danger" onClick={() => deleteCategory(cat.id)}>
                    {t('delete')}
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategories;