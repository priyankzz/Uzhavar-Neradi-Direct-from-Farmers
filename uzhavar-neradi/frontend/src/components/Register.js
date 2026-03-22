import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

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
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>{t('register')}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>{t('username')}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{t('email')}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{t('password')}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{t('phone')}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{t('role')}</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="customer">{t('customer')}</option>
            <option value="farmer">{t('farmer')}</option>
            <option value="delivery">{t('delivery_partner')}</option>
          </select>
        </div>
        <div>
          <label>{t('language')}</label>
          <select name="language" value={formData.language} onChange={handleChange}>
            <option value="ta">தமிழ்</option>
            <option value="en">English</option>
          </select>
        </div>

        {formData.role === 'farmer' && (
          <div>
            <label>Land Photo (required):</label>
            <input
              type="file"
              name="land_photo"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        {formData.role === 'delivery' && (
          <>
            <div>
              <label>Vehicle Photo (required):</label>
              <input
                type="file"
                name="vehicle_photo"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div>
              <label>License Photo (required):</label>
              <input
                type="file"
                name="license_photo"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? t('registering') : t('register')}
        </button>
      </form>
      <p>
        {t('already_have_account')} <a href="/login">{t('login')}</a>
      </p>
    </div>
  );
};

export default Register;