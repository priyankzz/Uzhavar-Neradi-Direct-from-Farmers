import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../Button/Button';

const FarmerProducts = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/farmer/products/');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t('failed_load_products'));
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm(t('delete_confirm_product'))) {
      try {
        await api.delete(`/products/farmer/products/${id}/`);
        toast.success(t('product_deleted'));
        fetchProducts();
      } catch (err) {
        toast.error(t('error_deleting_product'));
      }
    }
  };

  return (
    <div className="container mt-md">
      <div className="flex justify-between items-center mb-md">
        <h2>{t('my_products')}</h2>
        <Link to="/farmer/add-product" className="btn btn-primary">
          {t('add_new_product')}
        </Link>
      </div>
      {products.length === 0 ? (
        <p>{t('no_products_yet')}</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('price')}</th>
                <th>{t('stock')}</th>
                <th>{t('approved')}</th>
                <th>{t('actions')}</th>
                </tr>
              </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.is_approved ? t('yes') : t('pending')}</td>
                  <td>
                    <div className="flex gap-sm">
                      <Link to={`/farmer/edit-product/${p.id}`} className="btn btn-accent btn-sm">
                        {t('edit')}
                      </Link>
                      <Button variant="danger" onClick={() => deleteProduct(p.id)} className="btn-sm">
                        {t('delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmerProducts;