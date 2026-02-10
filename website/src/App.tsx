import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { setupAnalytics } from '@/lib/analytics';
import { router } from '@/router';

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <p className="font-display text-sm font-medium text-surface-500">Loading Shared Features...</p>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    setupAnalytics();
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}
