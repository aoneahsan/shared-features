/**
 * Firebase Initialization
 *
 * Initialize a secondary Firebase app for connecting to aoneahsan.com's
 * Firebase project from consumer projects.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import {
  SharedFeaturesConfig,
  setState,
  getState,
  isInitialized,
} from './config';

const SHARED_FEATURES_APP_NAME = 'shared-features';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

/**
 * Generate a unique device ID for anonymous tracking
 */
function generateDeviceId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `device_${timestamp}_${randomPart}`;
}

/**
 * Get or create device ID from storage
 */
async function getOrCreateDeviceId(): Promise<string> {
  const STORAGE_KEY = 'shared_features_device_id';

  try {
    // Try Capacitor Preferences first
    const { Preferences } = await import('@capacitor/preferences');
    const result = await Preferences.get({ key: STORAGE_KEY });
    if (result.value) {
      return result.value;
    }
    const newId = generateDeviceId();
    await Preferences.set({ key: STORAGE_KEY, value: newId });
    return newId;
  } catch {
    // Fallback to localStorage for web
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return stored;
      }
      const newId = generateDeviceId();
      localStorage.setItem(STORAGE_KEY, newId);
      return newId;
    } catch {
      // If all storage fails, generate ephemeral ID
      return generateDeviceId();
    }
  }
}

/**
 * Initialize shared-features with the given configuration.
 *
 * This creates a secondary Firebase app connection to aoneahsan.com's
 * Firebase project, separate from the consumer project's own Firebase.
 *
 * @param config - Configuration object
 * @returns Initialized state object
 *
 * @example
 * ```typescript
 * import { initSharedFeatures } from 'shared-features';
 *
 * const sharedFeatures = initSharedFeatures({
 *   firebaseConfig: {
 *     apiKey: import.meta.env.VITE_ZAIONS_FIREBASE_API_KEY,
 *     authDomain: 'aoneahsan-portfolio.firebaseapp.com',
 *     projectId: 'aoneahsan-portfolio',
 *   },
 *   projectId: 'ztools',
 *   projectName: 'ZTools',
 *   platform: 'web',
 * });
 * ```
 */
export async function initSharedFeatures(
  config: SharedFeaturesConfig
): Promise<{ app: FirebaseApp; db: Firestore; auth: Auth }> {
  // Return existing instance if already initialized with same config
  if (isInitialized() && firebaseApp && firestoreDb && firebaseAuth) {
    const currentConfig = getState().config;
    if (
      currentConfig &&
      currentConfig.firebaseConfig.projectId === config.firebaseConfig.projectId
    ) {
      return { app: firebaseApp, db: firestoreDb, auth: firebaseAuth };
    }
  }

  // Check if app already exists
  const existingApps = getApps();
  const existingApp = existingApps.find(
    (app) => app.name === SHARED_FEATURES_APP_NAME
  );

  if (existingApp) {
    firebaseApp = existingApp;
  } else {
    // Initialize new Firebase app with unique name
    firebaseApp = initializeApp(
      config.firebaseConfig,
      SHARED_FEATURES_APP_NAME
    );
  }

  // Get Firestore and Auth instances
  firestoreDb = getFirestore(firebaseApp);
  firebaseAuth = getAuth(firebaseApp);

  // Get or create device ID
  const deviceId = await getOrCreateDeviceId();

  // Update state
  setState({
    initialized: true,
    config,
    deviceId,
  });

  if (config.debug) {
    console.log('[shared-features] Initialized:', {
      projectId: config.projectId,
      projectName: config.projectName,
      platform: config.platform,
      deviceId,
    });
  }

  return { app: firebaseApp, db: firestoreDb, auth: firebaseAuth };
}

/**
 * Get the shared-features Firebase app instance.
 * Throws if not initialized.
 */
export function getSharedFeaturesApp(): FirebaseApp {
  if (!firebaseApp) {
    throw new Error(
      'shared-features has not been initialized. Call initSharedFeatures() first.'
    );
  }
  return firebaseApp;
}

/**
 * Get the shared-features Firestore instance.
 * Throws if not initialized.
 */
export function getSharedFeaturesDb(): Firestore {
  if (!firestoreDb) {
    throw new Error(
      'shared-features has not been initialized. Call initSharedFeatures() first.'
    );
  }
  return firestoreDb;
}

/**
 * Get the shared-features Auth instance.
 * Throws if not initialized.
 */
export function getSharedFeaturesAuth(): Auth {
  if (!firebaseAuth) {
    throw new Error(
      'shared-features has not been initialized. Call initSharedFeatures() first.'
    );
  }
  return firebaseAuth;
}

/**
 * Get the device ID for anonymous tracking.
 * Returns null if not initialized.
 */
export function getDeviceId(): string | null {
  return getState().deviceId;
}
