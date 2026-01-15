/**
 * Analytics Service
 *
 * Handles recording impressions, clicks, and other ad interactions
 * from consumer projects to the centralized aoneahsan.com Firebase.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getSharedFeaturesDb } from '../firebase/init';
import { getConfig, getState } from '../firebase/config';
import type {
  AdAction,
  AdPlacement,
  AdVariant,
  RecordImpressionInput,
  AdHistoryEntry,
} from '../types/campaigns';

// ============================================================================
// CONSTANTS
// ============================================================================

const COLLECTION_IMPRESSIONS = 'zaions_impressions';
const LOCAL_STORAGE_KEY = 'shared_features_ad_history';

// ============================================================================
// LOCAL HISTORY MANAGEMENT
// ============================================================================

/**
 * Get ad history from local storage
 */
async function getLocalAdHistory(): Promise<Record<string, AdHistoryEntry>> {
  try {
    // Try Capacitor Preferences first
    const { Preferences } = await import('@capacitor/preferences');
    const result = await Preferences.get({ key: LOCAL_STORAGE_KEY });
    if (result.value) {
      return JSON.parse(result.value);
    }
  } catch {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
  }
  return {};
}

/**
 * Save ad history to local storage
 */
async function saveLocalAdHistory(
  history: Record<string, AdHistoryEntry>
): Promise<void> {
  const serialized = JSON.stringify(history);

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
 * Update local ad history for a campaign
 */
async function updateLocalHistory(
  campaignId: string,
  productId: string,
  action: AdAction,
  frequencyDays: number
): Promise<void> {
  const history = await getLocalAdHistory();
  const now = Date.now();
  const nextEligibleAt = now + frequencyDays * 24 * 60 * 60 * 1000;

  const existing = history[campaignId];

  if (existing) {
    history[campaignId] = {
      ...existing,
      lastSeenAt: now,
      impressionCount:
        action === 'impression'
          ? existing.impressionCount + 1
          : existing.impressionCount,
      clicked: existing.clicked || action === 'click',
      closed: existing.closed || action === 'close',
      nextEligibleAt:
        action === 'impression' ? nextEligibleAt : existing.nextEligibleAt,
    };
  } else {
    history[campaignId] = {
      campaignId,
      productId,
      lastSeenAt: now,
      impressionCount: action === 'impression' ? 1 : 0,
      clicked: action === 'click',
      closed: action === 'close',
      nextEligibleAt,
    };
  }

  await saveLocalAdHistory(history);
}

// ============================================================================
// ELIGIBILITY CHECKING
// ============================================================================

/**
 * Check if user is eligible to see a campaign (based on frequency capping)
 */
export async function isEligibleForCampaign(
  campaignId: string,
  _frequencyDays: number = 20
): Promise<boolean> {
  // Note: _frequencyDays kept for API consistency; eligibility uses stored nextEligibleAt
  const history = await getLocalAdHistory();
  const entry = history[campaignId];

  if (!entry) return true;

  return Date.now() >= entry.nextEligibleAt;
}

/**
 * Get all campaigns the user is currently eligible to see
 */
export async function getEligibleCampaignIds(): Promise<string[]> {
  const history = await getLocalAdHistory();
  const now = Date.now();

  return Object.entries(history)
    .filter(([, entry]) => now >= entry.nextEligibleAt)
    .map(([campaignId]) => campaignId);
}

/**
 * Get local ad history for a campaign
 */
export async function getCampaignHistory(
  campaignId: string
): Promise<AdHistoryEntry | null> {
  const history = await getLocalAdHistory();
  return history[campaignId] || null;
}

// ============================================================================
// IMPRESSION RECORDING
// ============================================================================

/**
 * Record an ad impression, click, or close
 *
 * This sends the event to the centralized Firebase and updates local history.
 */
export async function recordImpression(
  input: RecordImpressionInput,
  frequencyDays: number = 20
): Promise<void> {
  const config = getConfig();
  const state = getState();
  const db = getSharedFeaturesDb();

  const impressionData = {
    campaignId: input.campaignId,
    productId: input.productId,
    projectId: config.projectId,
    userId: null, // Consumer projects don't authenticate with aoneahsan.com
    deviceId: state.deviceId || 'unknown',
    platform: config.platform,
    placement: input.placement,
    action: input.action,
    variant: input.variant,
    timestamp: serverTimestamp(),
    ...(input.sessionId && { sessionId: input.sessionId }),
  };

  try {
    // Record to centralized Firebase
    await addDoc(collection(db, COLLECTION_IMPRESSIONS), impressionData);

    if (config.debug) {
      console.log('[shared-features] Recorded impression:', impressionData);
    }
  } catch (error) {
    if (config.debug) {
      console.error('[shared-features] Failed to record impression:', error);
    }
    // Don't throw - we don't want analytics failures to break the UI
  }

  // Update local history for frequency capping
  await updateLocalHistory(
    input.campaignId,
    input.productId,
    input.action,
    frequencyDays
  );
}

/**
 * Convenience function to record an impression
 */
export async function trackImpression(
  campaignId: string,
  productId: string,
  placement: AdPlacement,
  variant: AdVariant,
  frequencyDays?: number
): Promise<void> {
  await recordImpression(
    {
      campaignId,
      productId,
      placement,
      action: 'impression',
      variant,
    },
    frequencyDays
  );
}

/**
 * Convenience function to record a click
 */
export async function trackClick(
  campaignId: string,
  productId: string,
  placement: AdPlacement,
  variant: AdVariant
): Promise<void> {
  await recordImpression({
    campaignId,
    productId,
    placement,
    action: 'click',
    variant,
  });
}

/**
 * Convenience function to record a close/dismiss
 */
export async function trackClose(
  campaignId: string,
  productId: string,
  placement: AdPlacement,
  variant: AdVariant
): Promise<void> {
  await recordImpression({
    campaignId,
    productId,
    placement,
    action: 'close',
    variant,
  });
}
