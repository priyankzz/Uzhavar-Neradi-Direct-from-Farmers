import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import Button from './Button/Button';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    language: 'ta',
    land_photo: null,
    vehicle_photo: null,
    license_photo: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }

    try {
      await api.post('/users/register/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/verify-otp', { state: { email: formData.email } });
      toast.success(t('registration_success'));
    } catch (err) {
      const msg = err.response?.data?.detail || t('registration_failed');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-md">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="text-center">{t('register')}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>{t('username')}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label>{t('phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label>{t('role')}</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
            >
              <option value="customer">{t('customer')}</option>
              <option value="farmer">{t('farmer')}</option>
              <option value="delivery">{t('delivery_partner')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('language')}</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="input"
            >
              <option value="ta">தமிழ்</option>
              <option value="en">English</option>
            </select>
          </div>

          {formData.role === 'farmer' && (
            <div className="form-group">
              <label>{t('land_photo')} *</label>
              <input
                type="file"
                name="land_photo"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="input"
              />
            </div>
          )}

          {formData.role === 'delivery' && (
            <>
              <div className="form-group">
                <label>{t('vehicle_photo')} *</label>
                <input
                  type="file"
                  name="vehicle_photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="input"
                />
              </div>
              <div className="form-group">
                <label>{t('license_photo')} *</label>
                <input
                  type="file"
                  name="license_photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="input"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? t('registering') : t('register')}
            </Button>
          </div>
        </form>
        <p className="text-center mt-md">
          {t('already_have_account')}{' '}
          <a href="/login" className="link">{t('login')}</a>
        </p>
      </div>
    </div>
  );
};

export default Register;