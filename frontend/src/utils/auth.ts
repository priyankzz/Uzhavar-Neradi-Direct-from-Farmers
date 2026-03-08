/**
 * Auth utilities for multi-tab support
 * Copy to: frontend/src/utils/auth.ts
 */

// Use sessionStorage for tab-specific tokens
const TOKEN_KEY = 'token';

export const getToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};

export const getAuthHeader = (): { Authorization?: string } => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getCurrentUser = (): any => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const getUserId = (): number | null => {
  const user = getCurrentUser();
  return user?.user_id || null;
};