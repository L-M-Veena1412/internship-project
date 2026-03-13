import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

const AdminRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
