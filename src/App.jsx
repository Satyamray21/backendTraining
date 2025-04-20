import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import AdminDashboard from './components/AdminDashboard';  // New import for Admin Dashboard

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Admin Dashboard Route */}
    </Routes>
  );
}

export default App;
