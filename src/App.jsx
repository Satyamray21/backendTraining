// In App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element = {<Dashboard />}/>
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
}

export default App;
