import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const FarmerAddProduct = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    name_ta: '',
    description: '',
    description_ta: '',
    price: '',
    stock: '',
    category: '',
    is_preorder: false,
    preorder_available_until: '',
    preorder_max_quantity: '',
    delivery_options: { pickup: true, drop: false, delivery: false },
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/admin/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t('failed_load_categories'));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDeliveryOption = (key) => {
    setForm({
      ...form,
      delivery_options: { ...form.delivery_options, [key]: !form.delivery_options[key] },
    });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (let key in form) {
      if (key === 'delivery_options') {
        formData.append(key, JSON.stringify(form[key]));
      } else if (key === 'image') {
        if (form.image) formData.append('image', form.image);
      } else {
        formData.append(key, form[key]);
      }
    }
    try {
      await api.post('/products/farmer/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(t('product_submitted'));
      navigate('/farmer/products');
    } catch (err) {
      toast.error(t('error_adding_product'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-md">
      <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2>{t('add_new_product')}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>{t('product_name_en')}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label>{t('product_name_ta')}</label>
            <input
              name="name_ta"
              value={form.name_ta}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>{t('description_en')}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="input"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>{t('description_ta')}</label>
            <textarea
              name="description_ta"
              value={form.description_ta}
              onChange={handleChange}
              className="input"
              rows="3"
            />
          </div>
          <div className="flex gap-md">
            <div className="form-group flex-1">
              <label>{t('price')}</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div className="form-group flex-1">
              <label>{t('stock')}</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('category')}</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">{t('select_category')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                name="is_preorder"
                checked={form.is_preorder}
                onChange={handleChange}
              />
              {t('pre_order')}
            </label>
          </div>
          {form.is_preorder && (
            <>
              <div className="form-group">
                <label>{t('available_until')}</label>
                <input
                  type="date"
                  name="preorder_available_until"
                  value={form.preorder_available_until}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="form-group">
                <label>{t('preorder_max_quantity')}</label>
                <input
                  type="number"
                  name="preorder_max_quantity"
                  value={form.preorder_max_quantity}
                  onChange={handleChange}
                  className="input"
                  placeholder={t('preorder_max_placeholder')}
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label>{t('delivery_options')}</label>
            <div className="flex gap-md">
              <label className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  checked={form.delivery_options.pickup}
                  onChange={() => handleDeliveryOption('pickup')}
                />
                {t('pickup')}
              </label>
              <label className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  checked={form.delivery_options.drop}
                  onChange={() => handleDeliveryOption('drop')}
                />
                {t('farmer_drop')}
              </label>
              <label className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  checked={form.delivery_options.delivery}
                  onChange={() => handleDeliveryOption('delivery')}
                />
                {t('delivery_partner')}
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>{t('product_image')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? t('submitting') : t('add_product')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerAddProduct;