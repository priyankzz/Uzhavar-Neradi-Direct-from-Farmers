import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h2>{t('login')}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{t('login')}</button>
      </form>
    </div>
  );
};

export default Login;