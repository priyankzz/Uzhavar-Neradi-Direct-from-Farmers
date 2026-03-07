/**
 * Register Component
 * Copy to: frontend/src/components/auth/Register.tsx
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'CUSTOMER',
    phone: ''
  });
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/verify-otp', { state: { email: formData.email } });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">{t('register')}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t('role')}</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="CUSTOMER">{t('customer')}</option>
              <option value="FARMER">{t('farmer')}</option>
              <option value="DELIVERY">{t('delivery')}</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t('phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t('password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
              minLength={8}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">{t('confirmPassword')}</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? '...' : t('registerNow')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('login')}{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              {t('loginNow')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;