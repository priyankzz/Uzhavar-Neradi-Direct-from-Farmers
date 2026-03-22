import React from 'react';
import { Link, Routes, Route, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminUsers from './admin/AdminUsers';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminPayments from './admin/AdminPayments';
import AdminDeliveries from './admin/AdminDeliveries';
import AdminReports from './admin/AdminReports';
import AdminSettings from './admin/AdminSettings';
import AdminHome from './admin/AdminHome';
import AdminCategories from './admin/AdminCategories';
import PendingApprovals from './admin/PendingApprovals';

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-role admin">
      <h1>{t('admin_dashboard')}</h1>
      <nav className="flex gap-md wrap" style={{ flexWrap: 'wrap' }}>
        <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        {t('home')}
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('users')}
        </NavLink>
        <NavLink to="/admin/pending" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('pending_approvals')}
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('products')}
        </NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('categories')}
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('orders')}
        </NavLink>
        <NavLink to="/admin/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('payments')}
        </NavLink>
        <NavLink to="/admin/deliveries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('deliveries')}
        </NavLink>
        <NavLink to="/admin/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('reports')}
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('settings')}
        </NavLink>
      </nav>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="deliveries" element={<AdminDeliveries />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="pending" element={<PendingApprovals />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;