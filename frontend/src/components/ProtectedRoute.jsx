import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute
 * - studentOnly={true} hone pe admin/instructor ko /admin pe bhej do
 * - warna sirf login check karo
 */
const ProtectedRoute = ({ children, studentOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;
  if (!user)   return <Navigate to="/login" replace />;

  // Admin ya instructor student dashboard pe nahi jayenge
  if (studentOnly && (user.role === 'admin' || user.role === 'instructor')) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
