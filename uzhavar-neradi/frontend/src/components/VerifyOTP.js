import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

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
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <div>{t('no_email_provided')}</div>;
  }

  return (
    <div className="verify-otp-container">
      <h2>{t('verify_otp')}</h2>
      {success && <div className="success">{t('otp_verified_success')}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('otp_code')}</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength="6"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? t('verifying') : t('verify')}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;