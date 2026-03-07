/**
 * Header Component
 * Copy to: frontend/src/components/common/Header.tsx
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt={t('appName')}
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback if logo not found
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-xl font-bold">{t('appName')}</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-200 transition">
              {t('home')}
            </Link>
            <Link to="/products" className="hover:text-green-200 transition">
              {t('products')}
            </Link>
            
            {isAuthenticated && user && (
              <>
                {user.role === 'FARMER' && (
                  <Link to="/farmer" className="hover:text-green-200 transition">
                    {t('dashboard')}
                  </Link>
                )}
                {user.role === 'CUSTOMER' && (
                  <>
                    <Link to="/customer" className="hover:text-green-200 transition">
                      {t('dashboard')}
                    </Link>
                    <Link to="/cart" className="hover:text-green-200 transition">
                      🛒 {t('cart')}
                    </Link>
                  </>
                )}
                {user.role === 'DELIVERY' && (
                  <Link to="/delivery" className="hover:text-green-200 transition">
                    {t('dashboard')}
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="hover:text-green-200 transition">
                    {t('dashboard')}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;