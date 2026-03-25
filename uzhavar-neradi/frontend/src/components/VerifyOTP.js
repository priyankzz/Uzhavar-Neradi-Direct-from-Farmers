import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Button from './Button/Button';

const VerifyOTP = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/users/verify-otp/', { email, code });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || t('otp_verification_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="container mt-md text-center">
        <div className="alert alert-error">{t('no_email_provided')}</div>
      </div>
    );
  }

  return (
    <div className="container mt-md">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="text-center">{t('verify_otp')}</h2>
        {success && <div className="alert alert-success">{t('otp_verified_success')}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('otp_code')}</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength="6"
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
              {loading ? t('verifying') : t('verify')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;