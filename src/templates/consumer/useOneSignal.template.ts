/**
 * OneSignal Integration Hook Template
 *
 * Copy this file to your project and customize:
 * 1. Add your OneSignal App ID to environment variables
 * 2. Update import paths
 * 3. Connect to your notification service for saving subscriptions
 *
 * Required dependencies:
 * - react-onesignal (web)
 * - onesignal-cordova-plugin (mobile via Capacitor)
 *
 * @example
 * // Copy to: src/hooks/useOneSignal.ts
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

// ============================================================================
// TYPES
// ============================================================================

export interface OneSignalUser {
  playerId: string;
  pushToken?: string;
  isSubscribed: boolean;
}

export interface UseOneSignalReturn {
  /** Whether OneSignal is initialized */
  isInitialized: boolean;
  /** Whether push permission is granted */
  isPermissionGranted: boolean;
  /** Whether user is subscribed to push notifications */
  isSubscribed: boolean;
  /** OneSignal player ID */
  playerId: string | null;
  /** Request push notification permission */
  requestPermission: () => Promise<boolean>;
  /** Set external user ID for targeting */
  setUserId: (userId: string) => Promise<void>;
  /** Clear external user ID */
  clearUserId: () => Promise<void>;
  /** Set user tags for segmentation */
  setTags: (tags: Record<string, string>) => Promise<void>;
  /** Remove specific tags */
  removeTags: (tagKeys: string[]) => Promise<void>;
  /** Send a test notification (development only) */
  sendTestNotification: () => Promise<void>;
}

export interface UseOneSignalOptions {
  /** OneSignal App ID (from env var) */
  appId: string;
  /** Safari web ID for Safari support */
  safariWebId?: string;
  /** Whether to auto-prompt for permission */
  autoPrompt?: boolean;
  /** Callback when permission changes */
  onPermissionChange?: (granted: boolean) => void;
  /** Callback when subscription changes */
  onSubscriptionChange?: (subscribed: boolean, playerId: string | null) => void;
  /** Callback when notification is clicked */
  onNotificationClick?: (data: Record<string, unknown>) => void;
}

// ============================================================================
// PLATFORM DETECTION
// ============================================================================

const isWeb = Capacitor.getPlatform() === 'web';
const isAndroid = Capacitor.getPlatform() === 'android';
const isIOS = Capacitor.getPlatform() === 'ios';

// ============================================================================
// WEB IMPLEMENTATION
// ============================================================================

async function initOneSignalWeb(
  appId: string,
  safariWebId?: string
): Promise<void> {
  // Dynamically import react-onesignal for web
  const OneSignal = (await import('react-onesignal')).default;

  await OneSignal.init({
    appId,
    safari_web_id: safariWebId,
    allowLocalhostAsSecureOrigin: true,
    notifyButton: {
      enable: false, // We use our own bell
    },
  });
}

// ============================================================================
// MOBILE IMPLEMENTATION
// ============================================================================

async function initOneSignalMobile(appId: string): Promise<void> {
  // OneSignal Capacitor plugin should be configured in capacitor.config.ts
  // This is a placeholder - actual implementation depends on plugin used
  console.log('[onesignal] Mobile initialization with appId:', appId);

  // For Capacitor, you may use:
  // - @onesignal/onesignal-cordova-plugin
  // - native configuration in android/ios folders

  // Example with cordova plugin:
  // const OneSignal = (window as any).plugins?.OneSignal;
  // if (OneSignal) {
  //   OneSignal.setAppId(appId);
  // }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for OneSignal push notification integration
 *
 * @example
 * ```tsx
 * const {
 *   isSubscribed,
 *   isPermissionGranted,
 *   requestPermission,
 *   setUserId,
 *   setTags,
 * } = useOneSignal({
 *   appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
 *   safariWebId: import.meta.env.VITE_ONESIGNAL_SAFARI_WEB_ID,
 *   onNotificationClick: (data) => {
 *     // Handle notification click
 *     if (data.url) {
 *       router.push(data.url);
 *     }
 *   },
 * });
 *
 * // When user logs in
 * useEffect(() => {
 *   if (user) {
 *     setUserId(user.id);
 *     setTags({
 *       userId: user.id,
 *       plan: user.plan,
 *     });
 *   }
 * }, [user]);
 * ```
 */
export function useOneSignal(options: UseOneSignalOptions): UseOneSignalReturn {
  const {
    appId,
    safariWebId,
    autoPrompt = false,
    onPermissionChange,
    onSubscriptionChange,
    onNotificationClick,
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const initPromiseRef = useRef<Promise<void> | null>(null);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    if (!appId) {
      console.warn('[onesignal] No appId provided');
      return;
    }

    if (initPromiseRef.current) {
      return; // Already initializing
    }

    const init = async () => {
      try {
        if (isWeb) {
          await initOneSignalWeb(appId, safariWebId);
        } else {
          await initOneSignalMobile(appId);
        }

        setIsInitialized(true);

        // Check initial state
        await checkPermissionState();
        await checkSubscriptionState();

        // Setup listeners
        setupListeners();

        console.log('[onesignal] Initialized successfully');
      } catch (error) {
        console.error('[onesignal] Initialization failed:', error);
      }
    };

    initPromiseRef.current = init();
  }, [appId, safariWebId]);

  // ============================================================================
  // STATE CHECKING
  // ============================================================================

  const checkPermissionState = async () => {
    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;
      const permission = await OneSignal.Notifications.permission;
      setIsPermissionGranted(permission);
      return permission;
    }
    // Mobile - check via plugin
    return false;
  };

  const checkSubscriptionState = async () => {
    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;
      const subscribed = await OneSignal.User.PushSubscription.optedIn;
      const id = await OneSignal.User.PushSubscription.id;
      setIsSubscribed(subscribed || false);
      setPlayerId(id || null);
      return { subscribed: subscribed || false, playerId: id || null };
    }
    // Mobile - check via plugin
    return { subscribed: false, playerId: null };
  };

  // ============================================================================
  // LISTENERS
  // ============================================================================

  const setupListeners = async () => {
    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;

      // Permission change
      OneSignal.Notifications.addEventListener('permissionChange', (granted: boolean) => {
        setIsPermissionGranted(granted);
        onPermissionChange?.(granted);
      });

      // Subscription change
      OneSignal.User.PushSubscription.addEventListener('change', async () => {
        const { subscribed, playerId } = await checkSubscriptionState();
        onSubscriptionChange?.(subscribed, playerId);
      });

      // Notification click
      OneSignal.Notifications.addEventListener('click', (event: any) => {
        const data = event.notification?.additionalData || {};
        onNotificationClick?.(data);
      });
    }
  };

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isInitialized) {
      console.warn('[onesignal] Not initialized');
      return false;
    }

    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;
      await OneSignal.Notifications.requestPermission();
      return await checkPermissionState();
    }

    // Mobile implementation
    return false;
  }, [isInitialized]);

  const setUserId = useCallback(async (userId: string): Promise<void> => {
    if (!isInitialized) return;

    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;
      await OneSignal.login(userId);
    }
  }, [isInitialized]);

  const clearUserId = useCallback(async (): Promise<void> => {
    if (!isInitialized) return;

    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;
      await OneSignal.logout();
    }
  }, [isInitialized]);

  const setTags = useCallback(async (tags: Record<string, string>): Promise<void> => {
    if (!isInitialized) return;

    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;
      await OneSignal.User.addTags(tags);
    }
  }, [isInitialized]);

  const removeTags = useCallback(async (tagKeys: string[]): Promise<void> => {
    if (!isInitialized) return;

    if (isWeb) {
      const OneSignal = (await import('react-onesignal')).default;
      await OneSignal.User.removeTags(tagKeys);
    }
  }, [isInitialized]);

  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!isInitialized || !playerId) {
      console.warn('[onesignal] Cannot send test - not initialized or no playerId');
      return;
    }

    // Note: Sending notifications requires server-side API call
    // This is just for demonstration
    console.log('[onesignal] Would send test notification to:', playerId);
  }, [isInitialized, playerId]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    isInitialized,
    isPermissionGranted,
    isSubscribed,
    playerId,
    requestPermission,
    setUserId,
    clearUserId,
    setTags,
    removeTags,
    sendTestNotification,
  };
}

export default useOneSignal;
