/**
 * Feature Flags Service
 *
 * Handles fetching and checking feature flags from the centralized
 * aoneahsan.com Firebase backend. Consumer projects use this to
 * determine which features are available and at what version.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getSharedFeaturesDb } from '../firebase/init';
import { getConfig } from '../firebase/config';
import type {
  FeatureId,
  FeatureConfig,
  FeatureFlagsDocument,
  FeatureAvailability,
  SharedFeaturesStatus,
  UpdateFeatureConfigInput,
  UpdateGlobalFlagsInput,
  ConsumerFeatureVersions,
} from '../types/featureFlags';
import {
  COLLECTION_FEATURE_FLAGS,
  FEATURE_FLAGS_DOC_ID,
  DEFAULT_FEATURE_FLAGS,
} from '../types/featureFlags';

// Re-export constants
export { COLLECTION_FEATURE_FLAGS, FEATURE_FLAGS_DOC_ID } from '../types/featureFlags';

// ============================================================================
// CACHE
// ============================================================================

interface FeatureFlagsCache {
  data: FeatureFlagsDocument | null;
  timestamp: number;
}

let flagsCache: FeatureFlagsCache | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes (shorter than campaigns for fresher data)

/**
 * Check if cache is valid
 */
function isCacheValid(): boolean {
  if (!flagsCache || !flagsCache.data) return false;
  return Date.now() - flagsCache.timestamp < CACHE_TTL_MS;
}

/**
 * Clear the feature flags cache
 */
export function clearFeatureFlagsCache(): void {
  flagsCache = null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert Firestore document to FeatureFlagsDocument
 */
function docToFeatureFlags(
  docId: string,
  data: Record<string, unknown>
): FeatureFlagsDocument {
  return {
    id: docId,
    globalEnabled: (data.globalEnabled as boolean) ?? true,
    currentApiVersion: (data.currentApiVersion as string) ?? 'v1',
    supportedApiVersions: (data.supportedApiVersions as string[]) ?? ['v1'],
    features: data.features as FeatureFlagsDocument['features'],
    maintenanceMode: (data.maintenanceMode as boolean) ?? false,
    maintenanceMessage: data.maintenanceMessage as string | undefined,
    maintenanceEndTime: data.maintenanceEndTime as Timestamp | undefined,
    updatedAt: data.updatedAt as Timestamp,
    updatedBy: data.updatedBy as string,
  };
}

/**
 * Get the consumer's requested version for a feature
 */
function getConsumerVersion(
  featureId: FeatureId,
  consumerVersions?: ConsumerFeatureVersions
): number | undefined {
  if (!consumerVersions) return undefined;
  return consumerVersions[featureId];
}

// ============================================================================
// FETCH FUNCTIONS
// ============================================================================

/**
 * Fetch feature flags from Firestore
 *
 * @param forceRefresh - Skip cache and fetch fresh data
 * @returns Feature flags document or null if not found
 */
export async function fetchFeatureFlags(
  forceRefresh = false
): Promise<FeatureFlagsDocument | null> {
  // Check cache first
  if (!forceRefresh && isCacheValid()) {
    return flagsCache!.data;
  }

  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COLLECTION_FEATURE_FLAGS, FEATURE_FLAGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Return default flags if document doesn't exist
      const config = getConfig();
      if (config.debug) {
        console.log(
          '[shared-features] Feature flags document not found, using defaults'
        );
      }

      // Create default document for first-time setup
      const defaultDoc: FeatureFlagsDocument = {
        ...DEFAULT_FEATURE_FLAGS,
        updatedAt: Timestamp.now(),
        updatedBy: 'system',
      } as FeatureFlagsDocument;

      flagsCache = {
        data: defaultDoc,
        timestamp: Date.now(),
      };

      return defaultDoc;
    }

    const flags = docToFeatureFlags(docSnap.id, docSnap.data());

    // Update cache
    flagsCache = {
      data: flags,
      timestamp: Date.now(),
    };

    const config = getConfig();
    if (config.debug) {
      console.log('[shared-features] Feature flags fetched:', {
        globalEnabled: flags.globalEnabled,
        maintenanceMode: flags.maintenanceMode,
        apiVersion: flags.currentApiVersion,
      });
    }

    return flags;
  } catch (error) {
    const config = getConfig();
    if (config.debug) {
      console.error('[shared-features] Error fetching feature flags:', error);
    }

    // Return cached data if available, even if stale
    if (flagsCache?.data) {
      return flagsCache.data;
    }

    return null;
  }
}

/**
 * Subscribe to real-time feature flag updates
 *
 * @param callback - Function to call when flags change
 * @returns Unsubscribe function
 */
export function subscribeToFeatureFlags(
  callback: (flags: FeatureFlagsDocument | null) => void
): Unsubscribe {
  const db = getSharedFeaturesDb();
  const docRef = doc(db, COLLECTION_FEATURE_FLAGS, FEATURE_FLAGS_DOC_ID);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(null);
        return;
      }

      const flags = docToFeatureFlags(docSnap.id, docSnap.data());

      // Update cache
      flagsCache = {
        data: flags,
        timestamp: Date.now(),
      };

      callback(flags);
    },
    (error) => {
      const config = getConfig();
      if (config.debug) {
        console.error(
          '[shared-features] Error subscribing to feature flags:',
          error
        );
      }
      callback(null);
    }
  );
}

// ============================================================================
// FEATURE AVAILABILITY CHECKS
// ============================================================================

/**
 * Check if a specific feature is available
 *
 * @param featureId - The feature to check
 * @param consumerVersions - Optional consumer version preferences
 * @returns Availability details
 */
export async function checkFeatureAvailability(
  featureId: FeatureId,
  consumerVersions?: ConsumerFeatureVersions
): Promise<FeatureAvailability> {
  const flags = await fetchFeatureFlags();
  const config = getConfig();

  // Default unavailable response
  const unavailable: FeatureAvailability = {
    available: false,
    enabled: false,
    version: 1,
    deprecated: false,
    upgradeRequired: false,
    unavailableReason: 'Feature flags not loaded',
  };

  if (!flags) {
    return unavailable;
  }

  // Check global enabled
  if (!flags.globalEnabled) {
    return {
      ...unavailable,
      unavailableReason: 'shared-features is globally disabled',
    };
  }

  // Check maintenance mode
  if (flags.maintenanceMode) {
    return {
      ...unavailable,
      unavailableReason: flags.maintenanceMessage || 'Maintenance in progress',
    };
  }

  // Get feature config
  const featureConfig = flags.features[featureId];
  if (!featureConfig) {
    return {
      ...unavailable,
      unavailableReason: `Feature '${featureId}' not found in configuration`,
    };
  }

  // Check if feature is enabled
  if (!featureConfig.enabled) {
    return {
      ...unavailable,
      version: featureConfig.version,
      unavailableReason: `Feature '${featureId}' is not enabled`,
    };
  }

  // Check platform availability
  if (
    featureConfig.availablePlatforms &&
    featureConfig.availablePlatforms.length > 0
  ) {
    if (!featureConfig.availablePlatforms.includes(config.platform)) {
      return {
        ...unavailable,
        version: featureConfig.version,
        unavailableReason: `Feature '${featureId}' is not available on platform '${config.platform}'`,
      };
    }
  }

  // Check project availability
  if (
    featureConfig.availableProjects &&
    featureConfig.availableProjects.length > 0
  ) {
    if (!featureConfig.availableProjects.includes(config.projectId)) {
      return {
        ...unavailable,
        version: featureConfig.version,
        unavailableReason: `Feature '${featureId}' is not available for project '${config.projectId}'`,
      };
    }
  }

  // Check consumer version compatibility
  const consumerVersion = getConsumerVersion(featureId, consumerVersions);
  const currentVersion = featureConfig.version;
  const minVersion = featureConfig.minVersion;
  const maxVersion = featureConfig.maxVersion;

  let deprecated = false;
  let deprecationWarning: string | undefined;
  let upgradeRequired = false;
  let upgradeMessage: string | undefined;

  if (consumerVersion !== undefined) {
    // Consumer specified a version
    if (consumerVersion < minVersion) {
      // Version too old, upgrade required
      upgradeRequired = true;
      upgradeMessage = `Feature '${featureId}' requires minimum version ${minVersion}, but consumer is using version ${consumerVersion}. Please upgrade.`;
    } else if (consumerVersion < currentVersion) {
      // Version is older but still supported
      deprecated = true;
      deprecationWarning =
        featureConfig.deprecationMessage ||
        `Feature '${featureId}' version ${consumerVersion} is deprecated. Current version is ${currentVersion}.`;
    } else if (consumerVersion > maxVersion) {
      // Version too new (edge case)
      return {
        ...unavailable,
        version: currentVersion,
        unavailableReason: `Feature '${featureId}' version ${consumerVersion} is not yet supported. Maximum supported version is ${maxVersion}.`,
      };
    }
  }

  // Feature is available
  return {
    available: !upgradeRequired,
    enabled: true,
    version: currentVersion,
    deprecated,
    deprecationWarning,
    upgradeRequired,
    upgradeMessage,
  };
}

/**
 * Quick check if a feature is available (cached)
 *
 * @param featureId - The feature to check
 * @returns true if feature is available
 */
export function isFeatureEnabled(featureId: FeatureId): boolean {
  // Use cached data for quick checks
  if (!flagsCache?.data) return false;

  const flags = flagsCache.data;

  if (!flags.globalEnabled || flags.maintenanceMode) return false;

  const featureConfig = flags.features[featureId];
  if (!featureConfig || !featureConfig.enabled) return false;

  // Quick platform/project check
  const config = getConfig();

  if (
    featureConfig.availablePlatforms &&
    featureConfig.availablePlatforms.length > 0
  ) {
    if (!featureConfig.availablePlatforms.includes(config.platform)) {
      return false;
    }
  }

  if (
    featureConfig.availableProjects &&
    featureConfig.availableProjects.length > 0
  ) {
    if (!featureConfig.availableProjects.includes(config.projectId)) {
      return false;
    }
  }

  return true;
}

/**
 * Get the current version of a feature
 *
 * @param featureId - The feature to check
 * @returns Current version number or 0 if not available
 */
export function getFeatureVersion(featureId: FeatureId): number {
  if (!flagsCache?.data) return 0;
  return flagsCache.data.features[featureId]?.version ?? 0;
}

// ============================================================================
// STATUS FUNCTIONS
// ============================================================================

/**
 * Get overall status of shared-features for the current consumer
 *
 * @param consumerVersions - Optional consumer version preferences
 * @returns Complete status object
 */
export async function getSharedFeaturesStatus(
  consumerVersions?: ConsumerFeatureVersions
): Promise<SharedFeaturesStatus> {
  const flags = await fetchFeatureFlags();

  const defaultStatus: SharedFeaturesStatus = {
    operational: false,
    maintenanceMode: false,
    apiVersion: 'v1',
    features: {} as Record<FeatureId, FeatureAvailability>,
    deprecatedFeatures: [],
    upgradeRequiredFeatures: [],
    fetchedAt: new Date(),
  };

  if (!flags) {
    return defaultStatus;
  }

  // Check all features
  const featureIds: FeatureId[] = [
    'campaigns',
    'broadcasts',
    'contactInfo',
    'developerInfo',
    'socialLinks',
    'paymentOptions',
    'addressInfo',
    'services',
    'skills',
    'testimonials',
    'projects',
  ];

  const features: Record<FeatureId, FeatureAvailability> = {} as Record<
    FeatureId,
    FeatureAvailability
  >;
  const deprecatedFeatures: FeatureId[] = [];
  const upgradeRequiredFeatures: FeatureId[] = [];

  for (const featureId of featureIds) {
    const availability = await checkFeatureAvailability(
      featureId,
      consumerVersions
    );
    features[featureId] = availability;

    if (availability.deprecated) {
      deprecatedFeatures.push(featureId);
    }

    if (availability.upgradeRequired) {
      upgradeRequiredFeatures.push(featureId);
    }
  }

  return {
    operational: flags.globalEnabled && !flags.maintenanceMode,
    maintenanceMode: flags.maintenanceMode,
    maintenanceMessage: flags.maintenanceMessage,
    apiVersion: flags.currentApiVersion,
    features,
    deprecatedFeatures,
    upgradeRequiredFeatures,
    fetchedAt: new Date(),
  };
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

/**
 * Update a feature's configuration (admin only)
 *
 * @param input - Feature configuration updates
 * @param adminEmail - Email of admin making the change
 */
export async function updateFeatureConfig(
  input: UpdateFeatureConfigInput,
  adminEmail: string
): Promise<void> {
  const db = getSharedFeaturesDb();
  const docRef = doc(db, COLLECTION_FEATURE_FLAGS, FEATURE_FLAGS_DOC_ID);

  // Fetch current document
  const docSnap = await getDoc(docRef);
  let currentFlags: FeatureFlagsDocument;

  if (!docSnap.exists()) {
    // Create with defaults
    currentFlags = {
      ...DEFAULT_FEATURE_FLAGS,
      updatedAt: Timestamp.now(),
      updatedBy: adminEmail,
    } as FeatureFlagsDocument;
  } else {
    currentFlags = docToFeatureFlags(docSnap.id, docSnap.data());
  }

  // Update the specific feature
  const featureConfig = currentFlags.features[input.featureId];
  const updatedFeature: FeatureConfig = {
    enabled: input.enabled ?? featureConfig.enabled,
    version: input.version ?? featureConfig.version,
    minVersion: input.minVersion ?? featureConfig.minVersion,
    maxVersion: input.maxVersion ?? featureConfig.maxVersion,
    deprecationMessage: input.deprecationMessage ?? featureConfig.deprecationMessage,
    requiresAuth: input.requiresAuth ?? featureConfig.requiresAuth,
    availablePlatforms: input.availablePlatforms ?? featureConfig.availablePlatforms,
    availableProjects: input.availableProjects ?? featureConfig.availableProjects,
  };

  // Update document
  await setDoc(
    docRef,
    {
      ...currentFlags,
      features: {
        ...currentFlags.features,
        [input.featureId]: updatedFeature,
      },
      updatedAt: Timestamp.now(),
      updatedBy: adminEmail,
    },
    { merge: true }
  );

  // Clear cache
  clearFeatureFlagsCache();
}

/**
 * Update global flags (admin only)
 *
 * @param input - Global flag updates
 * @param adminEmail - Email of admin making the change
 */
export async function updateGlobalFlags(
  input: UpdateGlobalFlagsInput,
  adminEmail: string
): Promise<void> {
  const db = getSharedFeaturesDb();
  const docRef = doc(db, COLLECTION_FEATURE_FLAGS, FEATURE_FLAGS_DOC_ID);

  const updateData: Record<string, unknown> = {
    updatedAt: Timestamp.now(),
    updatedBy: adminEmail,
  };

  if (input.globalEnabled !== undefined) {
    updateData.globalEnabled = input.globalEnabled;
  }

  if (input.currentApiVersion !== undefined) {
    updateData.currentApiVersion = input.currentApiVersion;
  }

  if (input.supportedApiVersions !== undefined) {
    updateData.supportedApiVersions = input.supportedApiVersions;
  }

  if (input.maintenanceMode !== undefined) {
    updateData.maintenanceMode = input.maintenanceMode;
  }

  if (input.maintenanceMessage !== undefined) {
    updateData.maintenanceMessage = input.maintenanceMessage;
  }

  if (input.maintenanceEndTime !== undefined) {
    updateData.maintenanceEndTime = input.maintenanceEndTime
      ? Timestamp.fromDate(input.maintenanceEndTime)
      : null;
  }

  await setDoc(docRef, updateData, { merge: true });

  // Clear cache
  clearFeatureFlagsCache();
}

/**
 * Initialize feature flags document with defaults (admin only)
 *
 * @param adminEmail - Email of admin creating the document
 */
export async function initializeFeatureFlags(
  adminEmail: string
): Promise<void> {
  const db = getSharedFeaturesDb();
  const docRef = doc(db, COLLECTION_FEATURE_FLAGS, FEATURE_FLAGS_DOC_ID);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    throw new Error('Feature flags document already exists');
  }

  await setDoc(docRef, {
    ...DEFAULT_FEATURE_FLAGS,
    updatedAt: Timestamp.now(),
    updatedBy: adminEmail,
  });

  // Clear cache
  clearFeatureFlagsCache();
}
