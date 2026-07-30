import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // Verify that the token exists and the user is an admin
  const isAuthenticatedAdmin = Boolean(token && adminUser?.role === 'admin');

  // If authenticated, render child components via <Outlet />; otherwise, redirect to /login
  return isAuthenticatedAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;