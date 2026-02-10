import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Route guard that restricts access to admin users only.
 * Shows a full-page loading spinner while the auth state is being determined.
 * Redirects unauthenticated users to login, and non-admin users to the dashboard.
 */
export function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-200 border-t-accent-500" />
          <p className="text-sm font-medium text-surface-500">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
