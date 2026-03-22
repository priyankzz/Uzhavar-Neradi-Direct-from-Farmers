import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import DashboardRouter from './components/DashboardRouter';
import AdminDashboard from './components/AdminDashboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import Header from './components/Header';
import FarmerDashboard from './components/FarmerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import { CartProvider } from './contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import DeliveryDashboard from './components/DeliveryDashboard';
import 'react-toastify/dist/ReactToastify.css';
import { useRoleTheme } from './contexts/RoleThemeContext';
import { RoleThemeProvider } from './contexts/RoleThemeContext';

// Private route wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Role-based route wrapper
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  return allowedRoles.includes(user?.role) ? children : <Navigate to="/dashboard" />;
};
function AppContent() {
  useRoleTheme();
  return <Routes>...</Routes>;
}

function App() {
  return (
    <AuthProvider>
        <CartProvider>
              <RoleThemeProvider>
      <BrowserRouter>
                <AppContent />
        <Header />
        {/* <LanguageSwitcher />*/}
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/dashboard/*" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
          <Route path="/admin/*" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          } />
          <Route path="/farmer/*" element={
  <PrivateRoute>
    <RoleRoute allowedRoles={['farmer']}>
      <FarmerDashboard />
    </RoleRoute>
  </PrivateRoute>
} />
<Route path="/customer/*" element={
  <PrivateRoute>
    <RoleRoute allowedRoles={['customer']}>
  <CustomerDashboard />
  </RoleRoute>
  </PrivateRoute>
  }/>
  <Route path="/delivery/*" element={
  <PrivateRoute>
    <RoleRoute allowedRoles={['delivery']}>
      <DeliveryDashboard />
    </RoleRoute>
  </PrivateRoute>
} />
          <Route path="*" element={<Navigate to="/dashboard" />} />

          <Route path="/" element={
            <PrivateRoute>

              <DashboardRouter />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
      </RoleThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;