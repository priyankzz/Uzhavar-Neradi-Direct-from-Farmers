import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import FarmerDashboard from './FarmerDashboard';
import CustomerDashboard from './CustomerDashboard';
import DeliveryDashboard from './DeliveryDashboard';
import { Navigate } from 'react-router-dom';

const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'farmer':
      return <FarmerDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    case 'delivery':
      return <DeliveryDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};

export default DashboardRouter;