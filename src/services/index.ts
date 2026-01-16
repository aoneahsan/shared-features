/**
 * Services Index
 *
 * Re-exports all services from the shared-features package.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

// Campaign/Ads Services
export {
  fetchCampaigns,
  fetchActiveCampaigns,
  getCampaignById,
  fetchProducts,
  getProductById,
  clearCampaignsCache,
  clearProductsCache,
} from './campaigns';

// Analytics Services
export {
  recordImpression,
  trackImpression,
  trackClick,
  trackClose,
  isEligibleForCampaign,
  getEligibleCampaignIds,
  getCampaignHistory,
} from './analytics';

// Broadcast Services
export {
  fetchBroadcasts,
  fetchActiveBroadcasts,
  fetchBroadcastsByVariant,
  getBroadcastById,
  subscribeToBroadcasts,
  recordBroadcastEvent,
  trackBroadcastImpression,
  trackBroadcastClick,
  trackBroadcastDismiss,
  isBroadcastDismissed,
  dismissBroadcast,
  clearDismissedBroadcasts,
  clearBroadcastsCache,
} from './broadcasts';

// Admin Notification Services
export {
  adminNotificationService,
  createBroadcast,
  updateBroadcast,
  deleteBroadcast,
  getAllBroadcasts,
  getBroadcastsByStatus,
  publishBroadcast,
  scheduleBroadcast,
  pauseBroadcast,
  endBroadcast,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAllTemplates,
  getTemplateById,
  getFirestoreTemplateByEventType,
  getBroadcastAnalytics,
  getOverallAnalytics,
} from './admin-notifications';
