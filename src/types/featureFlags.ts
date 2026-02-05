/**
 * Feature Flags Types
 *
 * Type definitions for the shared-features feature flags system.
 * Feature flags allow breaking changes to be versioned, enabling consumers
 * to upgrade at their own pace without breaking existing implementations.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import type { Timestamp } from 'firebase/firestore';

// ============================================================================
// FEATURE IDENTIFIERS
// ============================================================================

/**
 * All available features in shared-features
 */
export type FeatureId =
  | 'campaigns'
  | 'broadcasts'
  | 'contactInfo'
  | 'developerInfo'
  | 'socialLinks'
  | 'paymentOptions'
  | 'addressInfo'
  | 'services'
  | 'skills'
  | 'testimonials'
  | 'projects';

/**
 * Feature names for display
 */
export const FEATURE_NAMES: Record<FeatureId, string> = {
  campaigns: 'Advertising Campaigns',
  broadcasts: 'Broadcasts & Notifications',
  contactInfo: 'Contact Information',
  developerInfo: 'Developer Information',
  socialLinks: 'Social Links',
  paymentOptions: 'Payment Options',
  addressInfo: 'Address Information',
  services: 'Services',
  skills: 'Skills',
  testimonials: 'Testimonials',
  projects: 'Portfolio Projects',
};

// ============================================================================
// FEATURE CONFIGURATION
// ============================================================================

/**
 * Configuration for a single feature
 */
export interface FeatureConfig {
  /** Whether the feature is globally enabled */
  enabled: boolean;

  /** Current version of this feature's API */
  version: number;

  /** Minimum version required (older versions will get deprecation warnings) */
  minVersion: number;

  /** Maximum supported version */
  maxVersion: number;

  /** Optional deprecation message for older versions */
  deprecationMessage?: string;

  /** Whether this feature requires authentication */
  requiresAuth?: boolean;

  /** Platforms this feature is available on (empty = all) */
  availablePlatforms?: string[];

  /** Projects this feature is available for (empty = all) */
  availableProjects?: string[];
}

/**
 * All feature configurations stored in Firestore
 */
export type FeatureConfigs = Record<FeatureId, FeatureConfig>;

// ============================================================================
// FIRESTORE DOCUMENT
// ============================================================================

/**
 * Feature flags document stored in Firestore (zaions_feature_flags/main)
 */
export interface FeatureFlagsDocument {
  /** Document ID (always 'main') */
  id: string;

  /** Global kill switch - disables all shared-features */
  globalEnabled: boolean;

  /** Current global API version (e.g., 'v1', 'v2') */
  currentApiVersion: string;

  /** Supported API versions (for backwards compatibility) */
  supportedApiVersions: string[];

  /** Individual feature configurations */
  features: FeatureConfigs;

  /** Maintenance mode - shows maintenance message to users */
  maintenanceMode: boolean;

  /** Maintenance message to display */
  maintenanceMessage?: string;

  /** Expected maintenance end time */
  maintenanceEndTime?: Timestamp;

  /** Last updated timestamp */
  updatedAt: Timestamp;

  /** Who last updated the flags */
  updatedBy: string;
}

// ============================================================================
// CONSUMER CONFIGURATION
// ============================================================================

/**
 * Feature version preferences for a consumer project
 * Used during initialization to specify which versions to use
 */
export interface ConsumerFeatureVersions {
  /** Campaigns API version (default: latest) */
  campaigns?: number;

  /** Broadcasts API version (default: latest) */
  broadcasts?: number;

  /** Contact info API version (default: latest) */
  contactInfo?: number;

  /** Developer info API version (default: latest) */
  developerInfo?: number;

  /** Social links API version (default: latest) */
  socialLinks?: number;

  /** Payment options API version (default: latest) */
  paymentOptions?: number;

  /** Address info API version (default: latest) */
  addressInfo?: number;

  /** Services API version (default: latest) */
  services?: number;

  /** Skills API version (default: latest) */
  skills?: number;

  /** Testimonials API version (default: latest) */
  testimonials?: number;

  /** Projects API version (default: latest) */
  projects?: number;
}

// ============================================================================
// FEATURE CHECK RESULTS
// ============================================================================

/**
 * Result of checking if a feature is available
 */
export interface FeatureAvailability {
  /** Whether the feature is available for use */
  available: boolean;

  /** Whether the feature is enabled globally */
  enabled: boolean;

  /** Current feature version */
  version: number;

  /** Whether the consumer's version is deprecated */
  deprecated: boolean;

  /** Deprecation warning message if applicable */
  deprecationWarning?: string;

  /** Reason why feature is unavailable (if not available) */
  unavailableReason?: string;

  /** Whether an upgrade is required */
  upgradeRequired: boolean;

  /** Message about available upgrade */
  upgradeMessage?: string;
}

/**
 * Overall status of shared-features for a consumer
 */
export interface SharedFeaturesStatus {
  /** Whether shared-features is operational */
  operational: boolean;

  /** Whether in maintenance mode */
  maintenanceMode: boolean;

  /** Maintenance message if applicable */
  maintenanceMessage?: string;

  /** Global API version */
  apiVersion: string;

  /** Individual feature availabilities */
  features: Record<FeatureId, FeatureAvailability>;

  /** List of deprecated features being used */
  deprecatedFeatures: FeatureId[];

  /** List of features requiring upgrade */
  upgradeRequiredFeatures: FeatureId[];

  /** When status was last fetched */
  fetchedAt: Date;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

/**
 * Input for updating a feature's configuration
 */
export interface UpdateFeatureConfigInput {
  featureId: FeatureId;
  enabled?: boolean;
  version?: number;
  minVersion?: number;
  maxVersion?: number;
  deprecationMessage?: string;
  requiresAuth?: boolean;
  availablePlatforms?: string[];
  availableProjects?: string[];
}

/**
 * Input for updating global flags
 */
export interface UpdateGlobalFlagsInput {
  globalEnabled?: boolean;
  currentApiVersion?: string;
  supportedApiVersions?: string[];
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  maintenanceEndTime?: Date | null;
}

// ============================================================================
// HOOK OPTIONS AND RESULTS
// ============================================================================

/**
 * Options for useFeatureFlags hook
 */
export interface UseFeatureFlagsOptions {
  /** Whether to auto-refresh flags periodically */
  autoRefresh?: boolean;

  /** Refresh interval in milliseconds (default: 5 minutes) */
  refreshInterval?: number;

  /** Whether to fetch immediately on mount (default: true) */
  autoFetch?: boolean;
}

/**
 * Result of useFeatureFlags hook
 */
export interface UseFeatureFlagsResult {
  /** Overall status of shared-features */
  status: SharedFeaturesStatus | null;

  /** Whether flags are being fetched */
  loading: boolean;

  /** Error message if fetch failed */
  error: string | null;

  /** Refetch feature flags */
  refetch: () => Promise<void>;

  /** Check if a specific feature is available */
  isFeatureAvailable: (featureId: FeatureId) => boolean;

  /** Get availability details for a feature */
  getFeatureAvailability: (featureId: FeatureId) => FeatureAvailability | null;

  /** Check if any features are deprecated */
  hasDeprecatedFeatures: boolean;

  /** Check if any features require upgrade */
  hasUpgradeRequired: boolean;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default feature configuration for new features
 */
export const DEFAULT_FEATURE_CONFIG: FeatureConfig = {
  enabled: false,
  version: 1,
  minVersion: 1,
  maxVersion: 1,
};

/**
 * Default feature flags document
 */
export const DEFAULT_FEATURE_FLAGS: Omit<
  FeatureFlagsDocument,
  'updatedAt' | 'updatedBy'
> = {
  id: 'main',
  globalEnabled: true,
  currentApiVersion: 'v1',
  supportedApiVersions: ['v1'],
  maintenanceMode: false,
  features: {
    campaigns: {
      enabled: true,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    broadcasts: {
      enabled: true,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    contactInfo: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    developerInfo: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    socialLinks: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    paymentOptions: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    addressInfo: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    services: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    skills: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    testimonials: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
    projects: {
      enabled: false,
      version: 1,
      minVersion: 1,
      maxVersion: 1,
    },
  },
};

// ============================================================================
// COLLECTION NAME
// ============================================================================

/**
 * Firestore collection name for feature flags
 */
export const COLLECTION_FEATURE_FLAGS = 'zaions_feature_flags';

/**
 * Document ID for the main feature flags document
 */
export const FEATURE_FLAGS_DOC_ID = 'main';
