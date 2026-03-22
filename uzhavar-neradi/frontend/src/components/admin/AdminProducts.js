import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import Button from '../Button/Button';

const AdminProducts = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get('/products/admin/products/');
    setProducts(res.data);
  };

  const approveProduct = async (id) => {
    await api.post(`/products/admin/products/${id}/approve/`);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm(t('delete_product_confirm'))) {
      await api.delete(`/products/admin/products/${id}/`);
      fetchProducts();
    }
  };

  return (
    <div className="container mt-md">
      <h2>{t('manage_products')}</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('farmer')}</th>
              <th>{t('price')}</th>
              <th>{t('approved')}</th>
              <th>{t('actions')}</th>
              </tr>
            </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.farmer_name}</td>
                <td>₹{p.price}</td>
                <td>{p.is_approved ? t('yes') : t('no')}</td>
                <td>
                  {!p.is_approved && (
                    <Button variant="success" onClick={() => approveProduct(p.id)}>
                      {t('approve')}
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => deleteProduct(p.id)}>
                    {t('delete')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;