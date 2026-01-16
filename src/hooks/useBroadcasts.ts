/**
 * useBroadcasts Hook
 *
 * React hook for fetching and displaying broadcast notifications in consumer projects.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchActiveBroadcasts,
  subscribeToBroadcasts,
  trackBroadcastImpression,
  trackBroadcastClick,
  trackBroadcastDismiss,
  clearBroadcastsCache,
} from '../services/broadcasts';
import { isInitialized } from '../firebase/config';
import type {
  BroadcastNotification,
  BroadcastVariant,
  NotificationPlatform,
  UseBroadcastsReturn,
} from '../types/notifications';

// ============================================================================
// TYPES
// ============================================================================

export interface UseBroadcastsOptions {
  /** Filter by variant type */
  variant?: BroadcastVariant;
  /** Override platform detection */
  platform?: NotificationPlatform;
  /** Maximum number of broadcasts to return */
  maxBroadcasts?: number;
  /** Whether to auto-fetch on mount (default: true) */
  autoFetch?: boolean;
  /** Whether to subscribe to real-time updates (default: false) */
  realtime?: boolean;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook to fetch and manage broadcast notifications
 *
 * @example
 * ```tsx
 * const { broadcasts, isLoading, dismissBroadcast, trackClick } = useBroadcasts({
 *   variant: 'banner',
 *   maxBroadcasts: 3,
 * });
 *
 * return (
 *   <div>
 *     {broadcasts.map(broadcast => (
 *       <BroadcastBanner
 *         key={broadcast.id}
 *         broadcast={broadcast}
 *         onDismiss={() => dismissBroadcast(broadcast.id)}
 *         onActionClick={() => trackClick(broadcast.id)}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useBroadcasts(
  options: UseBroadcastsOptions = {}
): UseBroadcastsReturn {
  const {
    variant,
    platform,
    maxBroadcasts = 10,
    autoFetch = true,
    realtime = false,
  } = options;

  const [broadcasts, setBroadcasts] = useState<BroadcastNotification[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const dismissedIdsRef = useRef<Set<string>>(new Set());
  const impressionTrackedRef = useRef<Set<string>>(new Set());

  // Fetch broadcasts
  const fetchBroadcastsData = useCallback(async () => {
    if (!isInitialized()) {
      setError(new Error('shared-features not initialized'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allBroadcasts = await fetchActiveBroadcasts({
        variant,
        platform,
      });

      // Filter out locally dismissed and limit count
      const filteredBroadcasts = allBroadcasts
        .filter((b) => !dismissedIdsRef.current.has(b.id))
        .slice(0, maxBroadcasts);

      setBroadcasts(filteredBroadcasts);
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error('Failed to fetch broadcasts');
      setError(errorObj);
      console.error('[shared-features] Error fetching broadcasts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [variant, platform, maxBroadcasts]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchBroadcastsData();
    }
  }, [autoFetch, fetchBroadcastsData]);

  // Real-time subscription
  useEffect(() => {
    if (!realtime || !isInitialized()) return;

    const unsubscribe = subscribeToBroadcasts(
      (newBroadcasts) => {
        // Filter and limit
        const filtered = newBroadcasts
          .filter((b) => !dismissedIdsRef.current.has(b.id))
          .filter((b) => !variant || b.variant === variant)
          .slice(0, maxBroadcasts);

        setBroadcasts(filtered);
        setIsLoading(false);
      },
      { variant, platform }
    );

    return () => {
      unsubscribe();
    };
  }, [realtime, variant, platform, maxBroadcasts]);

  // Dismiss broadcast
  const handleDismissBroadcast = useCallback((broadcastId: string) => {
    // Update local state immediately
    dismissedIdsRef.current.add(broadcastId);
    setBroadcasts((prev) => prev.filter((b) => b.id !== broadcastId));

    // Track dismiss and persist
    trackBroadcastDismiss(broadcastId).catch((err) => {
      console.error('[shared-features] Failed to track dismiss:', err);
    });
  }, []);

  // Track impression
  const handleTrackImpression = useCallback((broadcastId: string) => {
    // Only track once per session
    if (impressionTrackedRef.current.has(broadcastId)) return;
    impressionTrackedRef.current.add(broadcastId);

    trackBroadcastImpression(broadcastId).catch((err) => {
      console.error('[shared-features] Failed to track impression:', err);
    });
  }, []);

  // Track click
  const handleTrackClick = useCallback((broadcastId: string) => {
    trackBroadcastClick(broadcastId).catch((err) => {
      console.error('[shared-features] Failed to track click:', err);
    });
  }, []);

  // Check if dismissed
  const checkIsDismissed = useCallback((broadcastId: string) => {
    return dismissedIdsRef.current.has(broadcastId);
  }, []);

  // Refresh broadcasts
  const handleRefresh = useCallback(async () => {
    clearBroadcastsCache();
    await fetchBroadcastsData();
  }, [fetchBroadcastsData]);

  return {
    broadcasts,
    isLoading,
    error,
    dismissBroadcast: handleDismissBroadcast,
    trackImpression: handleTrackImpression,
    trackClick: handleTrackClick,
    isDismissed: checkIsDismissed,
    refresh: handleRefresh,
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook specifically for banner broadcasts
 */
export function useBannerBroadcasts(
  options: Omit<UseBroadcastsOptions, 'variant'> = {}
) {
  return useBroadcasts({ ...options, variant: 'banner' });
}

/**
 * Hook specifically for modal broadcasts
 */
export function useModalBroadcasts(
  options: Omit<UseBroadcastsOptions, 'variant'> = {}
) {
  return useBroadcasts({ ...options, variant: 'modal', maxBroadcasts: 1 });
}

/**
 * Hook specifically for toast broadcasts
 */
export function useToastBroadcasts(
  options: Omit<UseBroadcastsOptions, 'variant'> = {}
) {
  return useBroadcasts({ ...options, variant: 'toast' });
}

/**
 * Hook specifically for bell/notification center broadcasts
 */
export function useBellBroadcasts(
  options: Omit<UseBroadcastsOptions, 'variant'> = {}
) {
  return useBroadcasts({ ...options, variant: 'bell' });
}

// ============================================================================
// SINGLE BROADCAST HOOK
// ============================================================================

export interface UseSingleBroadcastReturn {
  /** The broadcast (first matching one) */
  broadcast: BroadcastNotification | null;
  /** Whether loading */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Dismiss the broadcast */
  dismiss: () => void;
  /** Track impression */
  trackImpression: () => void;
  /** Track click */
  trackClick: () => void;
  /** Whether broadcast was dismissed */
  isDismissed: boolean;
}

/**
 * Hook to get a single broadcast (convenience wrapper)
 *
 * @example
 * ```tsx
 * const { broadcast, dismiss, trackClick } = useSingleBroadcast({ variant: 'modal' });
 *
 * if (!broadcast) return null;
 *
 * return (
 *   <AnnouncementModal
 *     broadcast={broadcast}
 *     onClose={dismiss}
 *     onActionClick={trackClick}
 *   />
 * );
 * ```
 */
export function useSingleBroadcast(
  options: Omit<UseBroadcastsOptions, 'maxBroadcasts'> = {}
): UseSingleBroadcastReturn {
  const result = useBroadcasts({ ...options, maxBroadcasts: 1 });
  const broadcast = result.broadcasts[0] || null;

  return {
    broadcast,
    isLoading: result.isLoading,
    error: result.error,
    dismiss: () => broadcast && result.dismissBroadcast(broadcast.id),
    trackImpression: () => broadcast && result.trackImpression(broadcast.id),
    trackClick: () => broadcast && result.trackClick(broadcast.id),
    isDismissed: broadcast ? result.isDismissed(broadcast.id) : false,
  };
}

// ============================================================================
// ANNOUNCEMENT MODAL HOOK
// ============================================================================

export interface UseAnnouncementModalReturn {
  /** The modal broadcast to display */
  broadcast: BroadcastNotification | null;
  /** Whether the modal should be shown */
  isOpen: boolean;
  /** Close the modal */
  close: () => void;
  /** Handle action button click */
  handleAction: () => void;
}

/**
 * Hook for managing announcement modal display
 * Automatically tracks impressions and handles dismissal
 *
 * @example
 * ```tsx
 * const { broadcast, isOpen, close, handleAction } = useAnnouncementModal();
 *
 * return (
 *   <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
 *     <DialogContent>
 *       <h2>{broadcast?.title}</h2>
 *       <p>{broadcast?.message}</p>
 *       {broadcast?.actionUrl && (
 *         <Button onClick={handleAction}>{broadcast.actionText || 'Learn More'}</Button>
 *       )}
 *     </DialogContent>
 *   </Dialog>
 * );
 * ```
 */
export function useAnnouncementModal(): UseAnnouncementModalReturn {
  const { broadcast, dismiss, trackImpression, trackClick } = useSingleBroadcast({
    variant: 'modal',
  });

  const [isOpen, setIsOpen] = useState(false);
  const impressionTrackedRef = useRef(false);

  // Show modal when broadcast is available
  useEffect(() => {
    if (broadcast && !impressionTrackedRef.current) {
      setIsOpen(true);
      trackImpression();
      impressionTrackedRef.current = true;
    }
  }, [broadcast, trackImpression]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    dismiss();
  }, [dismiss]);

  const handleAction = useCallback(() => {
    trackClick();
    if (broadcast?.actionUrl) {
      window.open(broadcast.actionUrl, '_blank');
    }
    handleClose();
  }, [broadcast, trackClick, handleClose]);

  return {
    broadcast,
    isOpen,
    close: handleClose,
    handleAction,
  };
}
