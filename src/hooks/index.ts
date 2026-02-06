/**
 * Hooks Index
 *
 * Re-exports all React hooks from the shared-features package.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

// Campaign Hooks
export {
  useCampaigns,
  useCampaign,
  useOneTimeAdModal,
  useUpdateAdModal,
} from './useCampaigns';
export type { UseCampaignsOptions, UseCampaignsResult } from './useCampaigns';

// Broadcast Hooks
export {
  useBroadcasts,
  useBannerBroadcasts,
  useModalBroadcasts,
  useToastBroadcasts,
  useBellBroadcasts,
  useSingleBroadcast,
  useAnnouncementModal,
} from './useBroadcasts';
export type {
  UseBroadcastsOptions,
  UseSingleBroadcastReturn,
  UseAnnouncementModalReturn,
} from './useBroadcasts';

// Feature Flags Hooks
export {
  useFeatureFlags,
  useFeature,
  useFeatureFlagsSubscription,
  useSharedFeaturesOperational,
  useFeatureGate,
} from './useFeatureFlags';

// Common Features Hooks
export {
  useContactInfo,
  useDeveloperInfo,
  useAddressInfo,
  useSocialLinks,
  usePaymentOptions,
  useServices,
  useSkills,
  useTestimonials,
  useProjects,
  useProject,
} from './useCommonFeatures';
