import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userRole, isLoggedIn } = useUserRole();

  // If not logged in, allow access to Index page (for guests)
  if (!isLoggedIn) {
    return <>{children}</>;
  }

  // If logged in as employer, redirect to discover
  if (userRole === 'employer') {
    return <Navigate to="/discover" replace />;
  }

  // If logged in as freelancer, redirect to browse-jobs
  if (userRole === 'freelancer') {
    return <Navigate to="/browse-jobs" replace />;
  }

  // Fallback - allow access
  return <>{children}</>;
};