/**
 * shared-features
 *
 * Centralized common features for Zaions projects.
 * All data is managed from aoneahsan.com admin panel.
 *
 * Features:
 * - Advertising campaigns (cross-promotion)
 * - Products catalog
 * - Contact forms (coming soon)
 * - Feature requests (coming soon)
 * - Payment options (coming soon)
 * - Social links (coming soon)
 * - Developer info (coming soon)
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 * @license MIT
 */

// ============================================================================
// INITIALIZATION
// ============================================================================

export {
  initSharedFeatures,
  getSharedFeaturesApp,
  getSharedFeaturesDb,
  getSharedFeaturesAuth,
  getDeviceId,
} from './firebase/init';

export {
  getConfig,
  isInitialized,
} from './firebase/config';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';

// ============================================================================
// SERVICES
// ============================================================================

export * from './services';

// ============================================================================
// HOOKS
// ============================================================================

export * from './hooks';

// ============================================================================
// COMPONENTS
// ============================================================================

export * from './components';
