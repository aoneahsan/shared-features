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
