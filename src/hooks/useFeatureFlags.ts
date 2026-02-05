/**
 * useFeatureFlags Hook
 *
 * React hook for checking feature availability and status in consumer projects.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getSharedFeaturesStatus,
  checkFeatureAvailability,
  isFeatureEnabled,
  subscribeToFeatureFlags,
  clearFeatureFlagsCache,
} from '../services/featureFlags';
import { isInitialized, getState } from '../firebase/config';
import type {
  FeatureId,
  FeatureAvailability,
  SharedFeaturesStatus,
  UseFeatureFlagsOptions,
  UseFeatureFlagsResult,
  ConsumerFeatureVersions,
} from '../types/featureFlags';

/**
 * Hook to fetch and monitor feature flags
 *
 * @param options - Hook options
 * @returns Feature flags status and utilities
 *
 * @example
 * ```tsx
 * const {
 *   status,
 *   loading,
 *   isFeatureAvailable,
 *   hasDeprecatedFeatures
 * } = useFeatureFlags();
 *
 * if (loading) return <Spinner />;
 *
 * if (!status?.operational) {
 *   return <MaintenancePage message={status?.maintenanceMessage} />;
 * }
 *
 * if (isFeatureAvailable('contactInfo')) {
 *   return <ContactInfo />;
 * }
 * ```
 */
export function useFeatureFlags(
  options: UseFeatureFlagsOptions = {}
): UseFeatureFlagsResult {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    autoFetch = true,
  } = options;

  const [status, setStatus] = useState<SharedFeaturesStatus | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Track mounted state to prevent state updates after unmount
  const mountedRef = useRef(true);

  // Get consumer versions from config if available
  const consumerVersions = useRef<ConsumerFeatureVersions | undefined>(
    getState().config?.featureVersions
  );

  // Fetch status
  const fetchStatus = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newStatus = await getSharedFeaturesStatus(consumerVersions.current);

      if (mountedRef.current) {
        setStatus(newStatus);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch feature flags';

      if (mountedRef.current) {
        setError(message);
        console.error('[shared-features] Error fetching feature flags:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchStatus();
    }
  }, [autoFetch, fetchStatus]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchStatus]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Check if a feature is available
  const checkFeatureAvailable = useCallback(
    (featureId: FeatureId): boolean => {
      // Quick check using cached data
      if (!status) return isFeatureEnabled(featureId);

      const availability = status.features[featureId];
      return availability?.available ?? false;
    },
    [status]
  );

  // Get feature availability details
  const getAvailability = useCallback(
    (featureId: FeatureId): FeatureAvailability | null => {
      if (!status) return null;
      return status.features[featureId] ?? null;
    },
    [status]
  );

  // Refetch with cache clear
  const refetch = useCallback(async () => {
    clearFeatureFlagsCache();
    await fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch,
    isFeatureAvailable: checkFeatureAvailable,
    getFeatureAvailability: getAvailability,
    hasDeprecatedFeatures: (status?.deprecatedFeatures.length ?? 0) > 0,
    hasUpgradeRequired: (status?.upgradeRequiredFeatures.length ?? 0) > 0,
  };
}

/**
 * Hook to check a single feature's availability
 *
 * @param featureId - The feature to check
 * @returns Feature availability and loading state
 *
 * @example
 * ```tsx
 * const { available, loading, deprecated } = useFeature('contactInfo');
 *
 * if (loading) return <Spinner />;
 * if (!available) return null;
 *
 * return <ContactInfo />;
 * ```
 */
export function useFeature(featureId: FeatureId) {
  const [availability, setAvailability] = useState<FeatureAvailability | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkFeature = async () => {
      if (!isInitialized()) {
        setLoading(false);
        return;
      }

      try {
        const consumerVersions = getState().config?.featureVersions;
        const result = await checkFeatureAvailability(
          featureId,
          consumerVersions
        );

        if (mounted) {
          setAvailability(result);
        }
      } catch (err) {
        console.error(
          `[shared-features] Error checking feature '${featureId}':`,
          err
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFeature();

    return () => {
      mounted = false;
    };
  }, [featureId]);

  return {
    /** Whether the feature is available */
    available: availability?.available ?? false,
    /** Whether the check is in progress */
    loading,
    /** Full availability details */
    availability,
    /** Whether the feature is enabled (but might need upgrade) */
    enabled: availability?.enabled ?? false,
    /** Whether using a deprecated version */
    deprecated: availability?.deprecated ?? false,
    /** Whether an upgrade is required */
    upgradeRequired: availability?.upgradeRequired ?? false,
    /** Deprecation warning if applicable */
    deprecationWarning: availability?.deprecationWarning,
    /** Reason feature is unavailable */
    unavailableReason: availability?.unavailableReason,
  };
}

/**
 * Hook to subscribe to real-time feature flag updates
 *
 * @param callback - Function to call when flags change
 *
 * @example
 * ```tsx
 * useFeatureFlagsSubscription((flags) => {
 *   if (flags?.maintenanceMode) {
 *     showMaintenanceBanner();
 *   }
 * });
 * ```
 */
export function useFeatureFlagsSubscription(
  callback: (status: SharedFeaturesStatus | null) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!isInitialized()) return;

    const consumerVersions = getState().config?.featureVersions;

    const unsubscribe = subscribeToFeatureFlags(async (flags) => {
      if (!flags) {
        callbackRef.current(null);
        return;
      }

      // Get full status with current flags
      const status = await getSharedFeaturesStatus(consumerVersions);
      callbackRef.current(status);
    });

    return () => unsubscribe();
  }, []);
}

/**
 * Hook to check if shared-features is operational
 *
 * @returns Whether shared-features is operational
 *
 * @example
 * ```tsx
 * const { operational, maintenanceMessage } = useSharedFeaturesOperational();
 *
 * if (!operational) {
 *   return <MaintenancePage message={maintenanceMessage} />;
 * }
 * ```
 */
export function useSharedFeaturesOperational() {
  const { status, loading } = useFeatureFlags({ autoFetch: true });

  return {
    /** Whether shared-features is operational */
    operational: status?.operational ?? false,
    /** Whether check is in progress */
    loading,
    /** Maintenance message if in maintenance mode */
    maintenanceMessage: status?.maintenanceMessage,
    /** Whether in maintenance mode */
    maintenanceMode: status?.maintenanceMode ?? false,
    /** Current API version */
    apiVersion: status?.apiVersion ?? 'v1',
  };
}

/**
 * Hook for conditional rendering based on feature availability
 *
 * @param featureId - The feature to check
 * @returns Object with show/hide helpers
 *
 * @example
 * ```tsx
 * const { shouldRender, FallbackOrChildren } = useFeatureGate('contactInfo');
 *
 * return (
 *   <FallbackOrChildren fallback={<OldContactInfo />}>
 *     <NewContactInfo />
 *   </FallbackOrChildren>
 * );
 * ```
 */
export function useFeatureGate(featureId: FeatureId) {
  const { available, loading, deprecated, deprecationWarning } =
    useFeature(featureId);

  // Log deprecation warning in development
  useEffect(() => {
    if (deprecated && deprecationWarning) {
      console.warn(`[shared-features] ${deprecationWarning}`);
    }
  }, [deprecated, deprecationWarning]);

  return {
    /** Whether the feature should be rendered */
    shouldRender: available,
    /** Whether still checking availability */
    loading,
    /** Whether using deprecated version */
    deprecated,
    /** Component that renders children if available, fallback otherwise */
    FallbackOrChildren: useCallback(
      ({
        children,
        fallback = null,
      }: {
        children: React.ReactNode;
        fallback?: React.ReactNode;
      }) => {
        if (loading) return null;
        return available ? children : fallback;
      },
      [available, loading]
    ),
  };
}
