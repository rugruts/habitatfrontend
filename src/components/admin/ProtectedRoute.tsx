import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/utils/adminAuthUtils';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Verifying access...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Redirect to login if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated and is admin, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
