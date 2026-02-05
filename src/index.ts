/**
 * shared-features
 *
 * Centralized common features for Zaions projects.
 * All data is managed from aoneahsan.com admin panel.
 *
 * Features:
 * - Feature Flags (version management, feature toggles)
 * - Advertising campaigns (cross-promotion)
 * - Products catalog
 * - In-App Notifications (broadcasts, events, templates)
 * - Common Features:
 *   - Contact Info
 *   - Developer Info
 *   - Social Links
 *   - Address Info
 *   - Payment Options
 *   - Services
 *   - Skills
 *   - Testimonials
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

// ============================================================================
// NOTIFICATIONS (Event System)
// ============================================================================

export * from './notifications';
