import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { initializeErrorTracking } from '@/lib/errorTracking';
import { trackPageView } from '@/lib/analytics';
import { router } from '@/router';
import '@/index.css';

// Wire Sentry before render so first-paint errors land in the dashboard.
// Clarity + Amplitude initialise lazily inside setupAnalytics() called
// from App.tsx mount.
initializeErrorTracking();

// Subscribe to react-router-dom router state so every navigation fires
// trackPageView() across all 4 platforms.
router.subscribe((state) => {
  if (state.navigation.state !== 'idle') return;
  trackPageView(
    state.location.pathname + state.location.search,
    typeof document !== 'undefined' ? document.title : state.location.pathname,
  );
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
