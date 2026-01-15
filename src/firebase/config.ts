/**
 * Firebase Configuration Types
 *
 * Types and interfaces for configuring the shared-features Firebase connection.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

/**
 * Non-secret Firebase identifiers for aoneahsan.com's Firebase project.
 * These are just domain names and IDs - NOT secrets.
 * The API key must be provided via environment variable.
 */
export const AONEAHSAN_FIREBASE_IDENTIFIERS = {
  authDomain: 'aiahsan.firebaseapp.com',
  projectId: 'aiahsan',
  storageBucket: 'aiahsan.firebasestorage.app',
  messagingSenderId: '553709271878',
  appId: '1:553709271878:web:fca28e9e529468399c8347',
} as const;

/**
 * Target platform for the consumer project
 */
export type ConsumerPlatform = 'web' | 'android' | 'ios' | 'extension';

/**
 * Configuration for initializing shared-features
 * Consumer projects only need to provide API key and their project info.
 */
export interface SharedFeaturesConfig {
  /**
   * Firebase API key for aoneahsan.com project.
   * Get from aoneahsan.com Firebase Console or ask admin.
   */
  apiKey: string;

  /**
   * Unique identifier for this project (e.g., 'ztools', '2fa-studio')
   */
  projectId: string;

  /**
   * Display name for this project (e.g., 'ZTools', '2FA Studio')
   */
  projectName: string;

  /**
   * Platform type for targeting
   */
  platform: ConsumerPlatform;

  /**
   * Whether to enable debug logging (default: false)
   */
  debug?: boolean;
}

/**
 * Internal state after initialization
 */
export interface SharedFeaturesState {
  /** Whether the package has been initialized */
  initialized: boolean;
  /** The active configuration */
  config: SharedFeaturesConfig | null;
  /** Unique device ID for anonymous tracking */
  deviceId: string | null;
}

/**
 * Singleton state
 */
let state: SharedFeaturesState = {
  initialized: false,
  config: null,
  deviceId: null,
};

/**
 * Get current state
 */
export function getState(): SharedFeaturesState {
  return state;
}

/**
 * Set state (internal use only)
 */
export function setState(newState: Partial<SharedFeaturesState>): void {
  state = { ...state, ...newState };
}

/**
 * Get configuration (throws if not initialized)
 */
export function getConfig(): SharedFeaturesConfig {
  if (!state.initialized || !state.config) {
    throw new Error(
      'shared-features has not been initialized. Call initSharedFeatures() first.'
    );
  }
  return state.config;
}

/**
 * Check if initialized
 */
export function isInitialized(): boolean {
  return state.initialized;
}
