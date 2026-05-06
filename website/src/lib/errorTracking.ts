/**
 * Sentry-backed error tracking for the shared-features website.
 *
 * Init is gated by VITE_SENTRY_DSN — without a DSN the module silently
 * no-ops. Sentry's default integrations also catch global window.onerror
 * and unhandled promise rejections, so no extra wiring is needed.
 */

import * as Sentry from '@sentry/react';

let sentryInitialized = false;

function getEnv(key: string): string | undefined {
  return (import.meta as { env?: Record<string, string | undefined> }).env?.[key];
}

export function initializeErrorTracking(): void {
  if (sentryInitialized) return;
  const dsn = getEnv('VITE_SENTRY_DSN');
  if (!dsn) return;
  try {
    Sentry.init({
      dsn,
      environment: getEnv('VITE_APP_ENV') || (import.meta.env.PROD ? 'production' : 'development'),
      integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
    sentryInitialized = true;
  } catch (error) {
    console.warn('[errorTracking] Sentry init failed:', error);
  }
}

export function captureError(error: unknown, context?: Record<string, string | number | boolean>): void {
  const normalised = error instanceof Error ? error : new Error(String(error));
  if (sentryInitialized) {
    Sentry.withScope((scope) => {
      if (context) {
        for (const [k, v] of Object.entries(context)) scope.setTag(k, String(v));
      }
      Sentry.captureException(normalised);
    });
  }
  console.error('[errorTracking]', normalised.message, context);
}
