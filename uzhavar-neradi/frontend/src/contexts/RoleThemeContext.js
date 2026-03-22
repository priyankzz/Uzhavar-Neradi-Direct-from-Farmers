import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleThemeContext = createContext();

export const useRoleTheme = () => useContext(RoleThemeContext);

export const RoleThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const role = user?.role || 'customer';

  const roleColors = {
    admin: 'var(--color-admin)',
    farmer: 'var(--color-farmer)',
    customer: 'var(--color-customer)',
    delivery: 'var(--color-delivery)',
  };

  const accentColor = roleColors[role] || roleColors.customer;

  return (
    <RoleThemeContext.Provider value={{ role, accentColor }}>
      {children}
    </RoleThemeContext.Provider>
  );
};