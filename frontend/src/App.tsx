/**
 * Main App component
 * Copy to: frontend/src/App.tsx
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useLanguage } from './hooks/useLanguage';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OTPVerification from './components/auth/OTPVerification';


// Customer Pages
import CustomerDashboard from './components/customer/Dashboard';
import ProductBrowse from './components/products/ProductBrowse';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/customer/Cart';
import Checkout from './components/customer/Checkout';
import OrderHistory from './components/customer/OrderHistory';
import TrackOrder from './components/customer/TrackOrder';

// Farmer Pages
import FarmerDashboard from './components/farmer/Dashboard';
import ProductManagement from './components/farmer/ProductManagement';
import OrderManagement from './components/farmer/OrderManagement';
import DemandInsights from './components/farmer/DemandInsights';

// Delivery Pages
import DeliveryDashboard from './components/delivery/Dashboard';
import AssignedDeliveries from './components/delivery/AssignedDeliveries';

// Admin Pages
import AdminDashboard from './components/admin/Dashboard';
import UserVerification from './components/admin/UserVerification';
import LogoManagement from './components/admin/LogoManagement';
import CategoryManagement from './components/admin/CategoryManagement';
import FestivalManagement from './components/admin/FestivalManagement';
import Announcements from './components/admin/Announcements';
import AuditLogs from './components/admin/AuditLogs';
import DisputeManagement from './components/admin/DisputeManagement';
import MiddlemanMonitor from './components/admin/MiddlemanMonitor';
import About from './components/common/About';
import Contact from './components/common/Contact';
import FAQ from './components/common/FAQ';
import ShippingInfo from './components/common/ShippingInfo';
import ReturnsPolicy from './components/common/ReturnsPolicy';
import TermsAndConditions from './components/common/TermsAndConditions';
import PrivacyPolicy from './components/common/PrivacyPolicy';
import PaymentInfo from './components/farmer/PaymentInfo';

function App() {
  const { loading } = useAuth();
  const { t, language } = useLanguage();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${language === 'ta' ? 'font-tamil' : ''}`}>
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProductBrowse />} />
          <Route path="/products" element={<ProductBrowse />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />  // If Cart itself handles auth
          <Route path="/checkout" element={
            <ProtectedRoute role="CUSTOMER">
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute role="CUSTOMER">
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="/track-order/:id" element={
            <ProtectedRoute role="CUSTOMER">
              <TrackOrder />
            </ProtectedRoute>
          } />

          {/* Farmer Routes */}
          <Route path="/farmer" element={
            <ProtectedRoute role="FARMER">
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/farmer/products" element={
            <ProtectedRoute role="FARMER">
              <ProductManagement />
            </ProtectedRoute>
          } />
          <Route path="/farmer/orders" element={
            <ProtectedRoute role="FARMER">
              <OrderManagement />
            </ProtectedRoute>
          } />
          <Route path="/farmer/insights" element={
            <ProtectedRoute role="FARMER">
              <DemandInsights />
            </ProtectedRoute>
          } />
          <Route path="/farmer/payment-info" element={
            <ProtectedRoute role="FARMER">
              <PaymentInfo />
            </ProtectedRoute>
          } />
          
          {/* Delivery Routes */}
          <Route path="/delivery" element={
            <ProtectedRoute role="DELIVERY">
              <DeliveryDashboard />
            </ProtectedRoute>
          } />
          <Route path="/delivery/assignments" element={
            <ProtectedRoute role="DELIVERY">
              <AssignedDeliveries />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/verify" element={
            <ProtectedRoute role="ADMIN">
              <UserVerification />
            </ProtectedRoute>
          } />
          <Route path="/admin/logo" element={
            <ProtectedRoute role="ADMIN">
              <LogoManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute role="ADMIN">
              <CategoryManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/festivals" element={
            <ProtectedRoute role="ADMIN">
              <FestivalManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/announcements" element={
            <ProtectedRoute role="ADMIN">
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <ProtectedRoute role="ADMIN">
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="/admin/disputes" element={
            <ProtectedRoute role="ADMIN">
              <DisputeManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/middleman" element={
            <ProtectedRoute role="ADMIN">
              <MiddlemanMonitor />
            </ProtectedRoute>
          } />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/returns" element={<ReturnsPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;