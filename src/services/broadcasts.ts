/**
 * Broadcasts Service
 *
 * Handles fetching and displaying cross-project broadcast notifications
 * from the centralized aoneahsan.com Firebase backend.
 *
 * Broadcasts are created via the admin panel and displayed across all
 * consumer projects based on targeting rules.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getSharedFeaturesDb } from '../firebase/init';
import { getConfig, getState } from '../firebase/config';
import type {
  BroadcastNotification,
  BroadcastStatus,
  BroadcastVariant,
  NotificationPlatform,
  FetchBroadcastsOptions,
} from '../types/notifications';

// ============================================================================
// CONSTANTS
// ============================================================================

const COLLECTION_BROADCASTS = 'zaions_broadcasts';
const COLLECTION_BROADCAST_EVENTS = 'zaions_broadcast_events';
const LOCAL_STORAGE_KEY = 'shared_features_dismissed_broadcasts';

// Cache for broadcasts
interface BroadcastsCache {
  data: BroadcastNotification[];
  timestamp: number;
}
let broadcastsCache: BroadcastsCache | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes (shorter than campaigns)

// ============================================================================
// LOCAL DISMISSAL MANAGEMENT
// ============================================================================

/**
 * Get dismissed broadcast IDs from local storage
 */
async function getDismissedBroadcasts(): Promise<Set<string>> {
  try {
    // Try Capacitor Preferences first
    const { Preferences } = await import('@capacitor/preferences');
    const result = await Preferences.get({ key: LOCAL_STORAGE_KEY });
    if (result.value) {
      const data = JSON.parse(result.value);
      return new Set(data.dismissedIds || []);
    }
  } catch {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return new Set(data.dismissedIds || []);
      }
    } catch {
      // Ignore
    }
  }
  return new Set();
}

/**
 * Save dismissed broadcast ID to local storage
 */
async function saveDismissedBroadcast(broadcastId: string): Promise<void> {
  const dismissed = await getDismissedBroadcasts();
  dismissed.add(broadcastId);

  const serialized = JSON.stringify({
    dismissedIds: Array.from(dismissed),
    updatedAt: Date.now(),
  });

  try {
    // Try Capacitor Preferences first
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key: LOCAL_STORAGE_KEY, value: serialized });
  } catch {
    // Fallback to localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Check if a broadcast has been dismissed
 */
export async function isBroadcastDismissed(
  broadcastId: string
): Promise<boolean> {
  const dismissed = await getDismissedBroadcasts();
  return dismissed.has(broadcastId);
}

/**
 * Dismiss a broadcast (save locally)
 */
export async function dismissBroadcast(broadcastId: string): Promise<void> {
  await saveDismissedBroadcast(broadcastId);
}

/**
 * Clear all dismissed broadcasts (useful for testing)
 */
export async function clearDismissedBroadcasts(): Promise<void> {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.remove({ key: LOCAL_STORAGE_KEY });
  } catch {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if cache is valid
 */
function isCacheValid(): boolean {
  if (!broadcastsCache) return false;
  return Date.now() - broadcastsCache.timestamp < CACHE_TTL_MS;
}

/**
 * Convert Firestore document to BroadcastNotification
 */
function docToBroadcast(
  docId: string,
  data: Record<string, unknown>
): BroadcastNotification {
  return {
    id: docId,
    title: data.title as string,
    message: data.message as string,
    type: data.type as BroadcastNotification['type'],
    category: data.category as BroadcastNotification['category'],
    isRead: false, // Broadcasts don't have read state per-user
    isImportant: data.isImportant as boolean | undefined,
    actionUrl: data.actionUrl as string | undefined,
    actionText: data.actionText as string | undefined,
    createdAt: data.createdAt as Timestamp,
    metadata: data.metadata as Record<string, unknown> | undefined,
    targetProjects: (data.targetProjects as string[]) || [],
    targetPlatforms:
      (data.targetPlatforms as NotificationPlatform[]) || [],
    targetAudience:
      (data.targetAudience as BroadcastNotification['targetAudience']) || 'all',
    status: data.status as BroadcastStatus,
    startDate: data.startDate as Timestamp,
    endDate: data.endDate as Timestamp | null | undefined,
    priority: (data.priority as number) || 50,
    dismissible: data.dismissible !== false, // Default true
    variant: (data.variant as BroadcastVariant) || 'banner',
    impressions: (data.impressions as number) || 0,
    clicks: (data.clicks as number) || 0,
    createdBy: data.createdBy as string,
    updatedBy: data.updatedBy as string | undefined,
  };
}

// ============================================================================
// BROADCAST FETCHING
// ============================================================================

/**
 * Fetch broadcasts with optional filters
 */
export async function fetchBroadcasts(
  options: FetchBroadcastsOptions = {}
): Promise<BroadcastNotification[]> {
  const config = getConfig();
  const db = getSharedFeaturesDb();

  // Check cache first (only for unfiltered queries)
  if (
    !options.projectId &&
    !options.platform &&
    !options.variant &&
    !options.status &&
    isCacheValid()
  ) {
    return broadcastsCache!.data;
  }

  let q = query(collection(db, COLLECTION_BROADCASTS));

  // Apply status filter (default to active)
  const status = options.status || 'active';
  q = query(q, where('status', '==', status));

  // Order by priority descending
  q = query(q, orderBy('priority', 'desc'));

  if (options.limit) {
    const { limit: firestoreLimit } = await import('firebase/firestore');
    q = query(q, firestoreLimit(options.limit));
  }

  const snapshot = await getDocs(q);
  let broadcasts = snapshot.docs.map((d) => docToBroadcast(d.id, d.data()));

  // Client-side filtering for array fields
  const now = Timestamp.now();

  broadcasts = broadcasts.filter((b) => {
    // Date range check
    if (b.startDate && (b.startDate as Timestamp).toMillis() > now.toMillis()) {
      return false;
    }
    if (
      b.endDate &&
      (b.endDate as Timestamp).toMillis() < now.toMillis()
    ) {
      return false;
    }

    // Platform check
    const targetPlatform = options.platform || config.platform;
    if (
      b.targetPlatforms.length > 0 &&
      !b.targetPlatforms.includes(targetPlatform as NotificationPlatform)
    ) {
      return false;
    }

    // Project check
    const targetProject = options.projectId || config.projectId;
    if (
      b.targetProjects.length > 0 &&
      !b.targetProjects.includes(targetProject)
    ) {
      return false;
    }

    // Variant check
    if (options.variant && b.variant !== options.variant) {
      return false;
    }

    return true;
  });

  // Cache unfiltered results
  if (
    !options.projectId &&
    !options.platform &&
    !options.variant &&
    !options.status
  ) {
    broadcastsCache = {
      data: broadcasts,
      timestamp: Date.now(),
    };
  }

  return broadcasts;
}

/**
 * Fetch active broadcasts for display, excluding dismissed ones
 */
export async function fetchActiveBroadcasts(
  options: Omit<FetchBroadcastsOptions, 'status'> = {}
): Promise<BroadcastNotification[]> {
  const broadcasts = await fetchBroadcasts({ ...options, status: 'active' });
  const dismissed = await getDismissedBroadcasts();

  return broadcasts.filter((b) => !dismissed.has(b.id));
}

/**
 * Fetch broadcasts by variant type
 */
export async function fetchBroadcastsByVariant(
  variant: BroadcastVariant
): Promise<BroadcastNotification[]> {
  return fetchActiveBroadcasts({ variant });
}

/**
 * Get a single broadcast by ID
 */
export async function getBroadcastById(
  broadcastId: string
): Promise<BroadcastNotification | null> {
  const db = getSharedFeaturesDb();
  const docSnap = await getDoc(doc(db, COLLECTION_BROADCASTS, broadcastId));

  if (!docSnap.exists()) return null;
  return docToBroadcast(docSnap.id, docSnap.data());
}

// ============================================================================
// REAL-TIME SUBSCRIPTION
// ============================================================================

/**
 * Subscribe to broadcast updates in real-time
 */
export function subscribeToBroadcasts(
  callback: (broadcasts: BroadcastNotification[]) => void,
  options: FetchBroadcastsOptions = {}
): Unsubscribe {
  const config = getConfig();
  const db = getSharedFeaturesDb();

  let q = query(
    collection(db, COLLECTION_BROADCASTS),
    where('status', '==', 'active'),
    orderBy('priority', 'desc')
  );

  return onSnapshot(
    q,
    async (snapshot) => {
      let broadcasts = snapshot.docs.map((d) =>
        docToBroadcast(d.id, d.data())
      );

      // Client-side filtering
      const now = Timestamp.now();
      const dismissed = await getDismissedBroadcasts();

      broadcasts = broadcasts.filter((b) => {
        // Skip dismissed
        if (dismissed.has(b.id)) return false;

        // Date range check
        if (
          b.startDate &&
          (b.startDate as Timestamp).toMillis() > now.toMillis()
        ) {
          return false;
        }
        if (
          b.endDate &&
          (b.endDate as Timestamp).toMillis() < now.toMillis()
        ) {
          return false;
        }

        // Platform check
        const targetPlatform = options.platform || config.platform;
        if (
          b.targetPlatforms.length > 0 &&
          !b.targetPlatforms.includes(targetPlatform as NotificationPlatform)
        ) {
          return false;
        }

        // Project check
        const targetProject = options.projectId || config.projectId;
        if (
          b.targetProjects.length > 0 &&
          !b.targetProjects.includes(targetProject)
        ) {
          return false;
        }

        // Variant check
        if (options.variant && b.variant !== options.variant) {
          return false;
        }

        return true;
      });

      callback(broadcasts);
    },
    (error) => {
      const debug = config.debug;
      if (debug) {
        console.error('[shared-features] Broadcast subscription error:', error);
      }
    }
  );
}

// ============================================================================
// BROADCAST ANALYTICS
// ============================================================================

/**
 * Record a broadcast event (impression, click, dismiss)
 */
export async function recordBroadcastEvent(
  broadcastId: string,
  action: 'impression' | 'click' | 'dismiss'
): Promise<void> {
  const config = getConfig();
  const state = getState();
  const db = getSharedFeaturesDb();

  const eventData = {
    broadcastId,
    projectId: config.projectId,
    platform: config.platform,
    deviceId: state.deviceId || 'unknown',
    action,
    timestamp: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, COLLECTION_BROADCAST_EVENTS), eventData);

    if (config.debug) {
      console.log('[shared-features] Recorded broadcast event:', eventData);
    }
  } catch (error) {
    if (config.debug) {
      console.error(
        '[shared-features] Failed to record broadcast event:',
        error
      );
    }
    // Don't throw - we don't want analytics failures to break the UI
  }
}

/**
 * Track broadcast impression
 */
export async function trackBroadcastImpression(
  broadcastId: string
): Promise<void> {
  await recordBroadcastEvent(broadcastId, 'impression');
}

/**
 * Track broadcast click
 */
export async function trackBroadcastClick(broadcastId: string): Promise<void> {
  await recordBroadcastEvent(broadcastId, 'click');
}

/**
 * Track broadcast dismiss
 */
export async function trackBroadcastDismiss(
  broadcastId: string
): Promise<void> {
  await recordBroadcastEvent(broadcastId, 'dismiss');
  await dismissBroadcast(broadcastId);
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Clear the broadcasts cache
 */
export function clearBroadcastsCache(): void {
  broadcastsCache = null;
}
