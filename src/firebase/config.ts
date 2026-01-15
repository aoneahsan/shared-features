/**
 * Firebase Configuration Types
 *
 * Types and interfaces for configuring the shared-features Firebase connection.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

/**
 * Firebase configuration object
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

/**
 * Target platform for the consumer project
 */
export type ConsumerPlatform = 'web' | 'android' | 'ios' | 'extension';

/**
 * Configuration for initializing shared-features
 */
export interface SharedFeaturesConfig {
  /**
   * Firebase configuration for aoneahsan.com's Firebase project.
   * All values from environment variables.
   */
  firebaseConfig: FirebaseConfig;

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
