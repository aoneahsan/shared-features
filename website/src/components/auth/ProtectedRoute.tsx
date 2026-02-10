import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Route guard that restricts access to authenticated users only.
 * Shows a full-page loading spinner while the auth state is being determined.
 * Redirects unauthenticated users to the login page.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
          <p className="text-sm font-medium text-surface-500">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
