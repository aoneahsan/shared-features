import { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureError } from '@/lib/errorTracking';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Top-level React error boundary. Forwards render-phase crashes to
 * Sentry via captureError() and renders a minimal fallback so the page
 * does not white-screen. Mounted in main.tsx around the app root.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureError(error, { component_stack: info.componentStack ?? '' });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-md text-center">
            <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
            <p className="mb-4 text-sm text-surface-600">
              An unexpected error occurred. The team has been notified — please reload to continue.
            </p>
            <button
              type="button"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
