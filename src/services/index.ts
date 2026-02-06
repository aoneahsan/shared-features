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

// Feature Flags Services
export {
  fetchFeatureFlags,
  subscribeToFeatureFlags,
  checkFeatureAvailability,
  isFeatureEnabled,
  getFeatureVersion,
  getSharedFeaturesStatus,
  updateFeatureConfig,
  updateGlobalFlags,
  initializeFeatureFlags,
  clearFeatureFlagsCache,
  COLLECTION_FEATURE_FLAGS,
  FEATURE_FLAGS_DOC_ID,
} from './featureFlags';

// Common Features Services
export {
  // Contact Info
  fetchContactInfo,
  subscribeToContactInfo,
  clearContactInfoCache,
  // Developer Info
  fetchDeveloperInfo,
  subscribeToDeveloperInfo,
  clearDeveloperInfoCache,
  // Address Info
  fetchAddressInfo,
  clearAddressInfoCache,
  // Social Links
  fetchSocialLinks,
  clearSocialLinksCache,
  // Payment Options
  fetchPaymentOptions,
  clearPaymentOptionsCache,
  // Services
  fetchServices,
  clearServicesCache,
  // Skills
  fetchSkills,
  clearSkillsCache,
  // Testimonials
  fetchTestimonials,
  clearTestimonialsCache,
  // Projects
  fetchProjects,
  fetchProjectBySlug,
  clearProjectsCache,
  // Clear all
  clearAllCommonFeaturesCache,
} from './commonFeatures';

// Admin Common Features Services
export {
  // Contact Info Admin
  saveContactInfo,
  updateContactInfo,
  type ContactInfoInput,
  // Developer Info Admin
  saveDeveloperInfo,
  updateDeveloperInfo,
  type DeveloperInfoInput,
  // Address Info Admin
  saveAddressInfo,
  updateAddressInfo,
  type AddressInfoInput,
  // Social Links Admin
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  type SocialLinkInput,
  // Payment Options Admin
  createPaymentOption,
  updatePaymentOption,
  deletePaymentOption,
  type PaymentOptionInput,
  // Services Admin
  createService,
  updateService,
  deleteService,
  type ServiceInput,
  // Skills Admin
  createSkill,
  updateSkill,
  deleteSkill,
  type SkillInput,
  // Testimonials Admin
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialInput,
  // Projects Admin
  createProject,
  updateProject,
  deleteProject,
  type ProjectInput,
} from './admin-commonFeatures';
