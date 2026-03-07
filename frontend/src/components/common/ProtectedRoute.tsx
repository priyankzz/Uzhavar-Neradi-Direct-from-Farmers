/**
 * Protected Route Component
 * Copy to: frontend/src/components/common/ProtectedRoute.tsx
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string | string[];  // Required role(s)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  role 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (role) {
    const requiredRoles = Array.isArray(role) ? role : [role];
    
    if (!user || !requiredRoles.includes(user.role)) {
      // User doesn't have required role - redirect to home
      return <Navigate to="/" replace />;
    }
  }

  // Check if user is verified (except for admin)
  if (user && user.role !== 'ADMIN' && !user.is_verified) {
    // Redirect to verification page
    return <Navigate to="/verify-otp" state={{ email: user.email }} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default ProtectedRoute;