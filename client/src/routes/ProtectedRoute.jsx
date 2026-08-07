import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-indigo-400">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium text-slate-300">Loading FixMate...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    // Determine login redirect based on route
    if (location.pathname.startsWith('/dashboard/worker')) {
      return <Navigate to="/login/worker" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith('/dashboard/admin')) {
      return <Navigate to="/login/admin" state={{ from: location }} replace />;
    }
    return <Navigate to="/login/customer" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role mismatch -> redirect to their appropriate dashboard or home
    if (user.role === 'customer') return <Navigate to="/dashboard/customer" replace />;
    if (user.role === 'worker') return <Navigate to="/dashboard/worker" replace />;
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
