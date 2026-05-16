import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * AdminRoute — sirf admin role wale hi andar ja sakte hain.
 * Koi bhi student ya instructor /admin/* hit kare to /dashboard pe redirect.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;
  if (!user)             return <Navigate to="/login"    replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
