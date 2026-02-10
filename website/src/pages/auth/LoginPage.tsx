import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { APP_NAME } from '@/config/constants';
import { trackPageView, trackClick, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { loginWithGoogle } from '@/services/auth-service';
import { cn } from '@/lib/utils';

/**
 * Google "G" logo as an inline SVG for the sign-in button.
 * Renders the official four-color Google icon.
 */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading, isAdmin } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackPageView('/login', 'Login');
  }, []);

  /** Handles the Google sign-in flow and tracks the result. */
  async function handleGoogleSignIn() {
    setError(null);
    setSigningIn(true);
    trackClick('login_google_button', 'auth');

    try {
      await loginWithGoogle();
      trackEvent('login_success', { method: 'google' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(message);
      trackEvent('login_error', { method: 'google', error: message });
    } finally {
      setSigningIn(false);
    }
  }

  // Redirect authenticated users away from the login page.
  if (!loading && user) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 px-4 py-12">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent-100/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <Card className="overflow-hidden border-surface-200/80 shadow-xl">
          <CardContent className="flex flex-col items-center gap-8 p-8 sm:p-10">
            {/* Logo and branding */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <h1 className="font-display text-2xl font-bold tracking-tight text-surface-900">
                  {APP_NAME}
                </h1>
                <p className="mt-1 text-sm text-surface-500">Sign in to continue</p>
              </div>
            </motion.div>

            {/* Error alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="w-full"
              >
                <Alert variant="danger">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <AlertDescription>{error}</AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}

            {/* Loading state while Firebase resolves the initial auth check */}
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                <p className="text-sm text-surface-500">Checking authentication...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="w-full"
              >
                {/* Google sign-in button */}
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full gap-3 border-surface-300 text-surface-700',
                    'hover:border-surface-400 hover:bg-surface-50',
                    'active:bg-surface-100',
                  )}
                  onClick={handleGoogleSignIn}
                  disabled={signingIn}
                  loading={signingIn}
                >
                  {!signingIn && <GoogleLogo className="h-5 w-5" />}
                  {signingIn ? 'Signing in...' : 'Continue with Google'}
                </Button>

                {/* Divider */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-surface-200" />
                  <span className="text-xs text-surface-400">Secure authentication</span>
                  <div className="h-px flex-1 bg-surface-200" />
                </div>

                {/* Info text */}
                <p className="mt-4 text-center text-xs leading-relaxed text-surface-400">
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="text-brand-600 underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-brand-600 underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </motion.div>
            )}

            {/* Back to home link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-surface-500 transition-colors hover:text-brand-600"
              onClick={() => trackClick('login_back_home', 'auth')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
