/**
 * Type Definitions Index
 *
 * Re-exports all type definitions from the shared-features package.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

// Campaign/Advertising Types
export * from './campaigns';

// Notification Types
export * from './notifications';

// Feature Flags Types
export * from './featureFlags';

// Common Features Types
export * from './commonFeatures';

// Firebase Config Types
export type {
  FirebaseConfig,
  ConsumerPlatform,
  ConsumerFeatureVersions,
  SharedFeaturesConfig,
  SharedFeaturesState,
} from '../firebase/config';
