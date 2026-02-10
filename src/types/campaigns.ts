/**
 * Campaign/Advertising System Type Definitions
 *
 * Type definitions for the centralized advertising system including
 * Firestore document schemas, service interfaces, and UI types.
 *
 * Based on ZTools advertising system, adapted for cross-project use.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// PRODUCT TYPES
// ============================================================================

/**
 * Product type classification
 */
export type ProductType = 'extension' | 'android' | 'ios' | 'web';

/**
 * Product information for advertising
 */
export interface Product {
  /** Unique product identifier */
  id: string;
  /** Product display name */
  name: string;
  /** Short tagline (marketing slogan) */
  tagline: string;
  /** Longer description of the product */
  description: string;
  /** Product type classification */
  type: ProductType;
  /** URL to the product (store link or website) */
  url: string;
  /** Brand/theme color (hex) */
  color: string;
  /** Key features list (3-4 items) */
  features: string[];
  /** Inline SVG icon (64px) */
  icon64?: string;
  /** Inline SVG icon (128px) */
  icon128?: string;
  /** Chrome Web Store URL */
  chromeStoreUrl?: string;
  /** Google Play Store URL */
  playStoreUrl?: string;
  /** Apple App Store URL */
  appStoreUrl?: string;
  /** Web app URL */
  webUrl?: string;
  /** Whether the product is active */
  enabled: boolean;
  /** When the product was created */
  createdAt: Timestamp;
  /** When the product was last updated */
  updatedAt: Timestamp;
}

// ============================================================================
// CAMPAIGN TYPES
// ============================================================================

/**
 * Campaign status values
 */
export type CampaignStatus = 'active' | 'paused' | 'scheduled' | 'ended';

/**
 * Target platforms for campaigns
 */
export type TargetPlatform = 'web' | 'android' | 'ios' | 'extension';

/**
 * Target audience for campaigns
 */
export type TargetAudience = 'all' | 'authenticated' | 'anonymous';

/**
 * Placement options for ads
 */
export type AdPlacement =
  | 'popup_slider'
  | 'options_panel'
  | 'onetime_modal'
  | 'update_modal'
  | 'notification'
  | 'footer_slider'
  | 'sidebar_panel'
  | 'home_banner'
  | 'topbar_banner';

/**
 * Small panel variant styles
 */
export type SmallPanelVariant =
  | 'small_panel_1' // Minimal
  | 'small_panel_2' // Tagline
  | 'small_panel_3' // Features
  | 'small_panel_4' // Gradient
  | 'small_panel_5'; // Card

/**
 * Large slider variant styles
 */
export type LargePanelVariant =
  | 'large_slider_1' // Hero
  | 'large_slider_2' // Feature Grid
  | 'large_slider_3' // Testimonial
  | 'large_slider_4' // Comparison
  | 'large_slider_5'; // Video Placeholder

/**
 * All ad variant types
 */
export type AdVariant = SmallPanelVariant | LargePanelVariant;

/**
 * Advertising campaign document
 * Stored in: zaions_campaigns/{campaignId}
 */
export interface Campaign {
  /** Campaign document ID */
  id: string;
  /** Reference to product being promoted */
  productId: string;
  /** Campaign name (admin reference) */
  name: string;
  /** Current campaign status */
  status: CampaignStatus;

  // === TARGETING ===
  /** Platforms where this campaign should show */
  targetPlatforms: TargetPlatform[];
  /** Audience type to target */
  targetAudience: TargetAudience;
  /** Specific projects to target (empty = all projects) */
  targetProjects: string[];
  /** Don't show to users already using this product */
  excludeProductUsers: boolean;

  // === DISPLAY RULES ===
  /** Where the ad can be displayed */
  placements: AdPlacement[];
  /** Priority (1-100, higher = more important) */
  priority: number;
  /** Days between impressions for same user (default: 20) */
  frequencyDays: number;
  /** Maximum total impressions (null = unlimited) */
  maxImpressions: number | null;

  // === TIMELINE ===
  /** Campaign start date */
  startDate: Timestamp;
  /** Campaign end date (null = no end) */
  endDate: Timestamp | null;

  // === CREATIVE ===
  /** UI variant to use */
  variant: AdVariant;
  /** Custom title (overrides product name) */
  customTitle?: string;
  /** Custom tagline (overrides product tagline) */
  customTagline?: string;
  /** Custom CTA button text */
  customCta?: string;
  /** Custom CTA button URL (overrides product URL) */
  customCtaUrl?: string;
  /** Custom description (overrides product description) */
  customDescription?: string;
  /** Custom product color for custom products/projects */
  customProductColor?: string;
  /** Custom icon SVG string (for custom products) */
  customIcon?: string;
  /** Custom features list (for custom products) */
  customFeatures?: string[];

  // === METRICS (Denormalized) ===
  /** Total number of impressions */
  totalImpressions: number;
  /** Total number of clicks */
  totalClicks: number;
  /** Total number of closes/dismissals */
  totalCloses: number;

  // === METADATA ===
  /** When campaign was created */
  createdAt: Timestamp;
  /** When campaign was last updated */
  updatedAt: Timestamp;
  /** Admin user ID who created */
  createdBy: string;
  /** Admin user ID who last updated */
  updatedBy?: string;
}

/**
 * Input for creating a new campaign
 */
export interface CreateCampaignInput {
  productId: string;
  name: string;
  status: CampaignStatus;
  targetPlatforms: TargetPlatform[];
  targetAudience: TargetAudience;
  targetProjects: string[];
  excludeProductUsers: boolean;
  placements: AdPlacement[];
  priority: number;
  frequencyDays: number;
  maxImpressions: number | null;
  startDate: Date;
  endDate: Date | null;
  variant: AdVariant;
  customTitle?: string;
  customTagline?: string;
  customCta?: string;
  customCtaUrl?: string;
  customDescription?: string;
  customProductColor?: string;
  customIcon?: string;
  customFeatures?: string[];
}

/**
 * Input for updating a campaign
 */
export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {
  id: string;
}

// ============================================================================
// IMPRESSION TYPES
// ============================================================================

/**
 * Types of ad interactions
 */
export type AdAction = 'impression' | 'click' | 'close' | 'notification_click';

/**
 * Ad impression/interaction event
 * Stored in: zaions_impressions/{impressionId}
 */
export interface Impression {
  /** Impression document ID */
  id: string;
  /** Campaign that generated this impression */
  campaignId: string;
  /** Product being advertised */
  productId: string;
  /** Project where impression occurred */
  projectId: string;

  /** User ID (null for anonymous) */
  userId: string | null;
  /** Device/browser fingerprint */
  deviceId: string;
  /** Platform where impression occurred */
  platform: TargetPlatform;
  /** Placement where ad was shown */
  placement: AdPlacement;

  /** Type of interaction */
  action: AdAction;
  /** When the interaction occurred */
  timestamp: Timestamp;

  /** UI variant that was displayed */
  variant: AdVariant;
  /** Session identifier */
  sessionId?: string;
}

/**
 * Input for recording an impression
 */
export interface RecordImpressionInput {
  campaignId: string;
  productId: string;
  placement: AdPlacement;
  action: AdAction;
  variant: AdVariant;
  sessionId?: string;
}

// ============================================================================
// AD HISTORY TYPES
// ============================================================================

/**
 * Local ad history entry (for frequency capping)
 */
export interface AdHistoryEntry {
  /** Campaign ID */
  campaignId: string;
  /** Product ID */
  productId: string;
  /** Last seen timestamp (Unix ms) */
  lastSeenAt: number;
  /** Impression count */
  impressionCount: number;
  /** Whether clicked */
  clicked: boolean;
  /** Whether closed */
  closed: boolean;
  /** Next eligible timestamp (Unix ms) */
  nextEligibleAt: number;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

/**
 * Options for fetching campaigns
 */
export interface FetchCampaignsOptions {
  /** Filter by placement */
  placement?: AdPlacement;
  /** Filter by status */
  status?: CampaignStatus;
  /** Filter by product */
  productId?: string;
  /** Maximum results */
  limit?: number;
}

/**
 * Campaign with resolved product data
 */
export interface CampaignWithProduct extends Campaign {
  /** Resolved product information */
  product: Product;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Campaign analytics summary
 */
export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  productId: string;
  productName: string;

  /** Total impressions */
  impressions: number;
  /** Total clicks */
  clicks: number;
  /** Total closes */
  closes: number;
  /** Click-through rate (clicks/impressions) */
  ctr: number;
  /** Close rate (closes/impressions) */
  closeRate: number;

  /** Breakdown by platform */
  byPlatform: Record<TargetPlatform, { impressions: number; clicks: number }>;
  /** Breakdown by placement */
  byPlacement: Record<AdPlacement, { impressions: number; clicks: number }>;
  /** Breakdown by project */
  byProject: Record<string, { impressions: number; clicks: number }>;
  /** Daily breakdown */
  byDate: Array<{
    date: string;
    impressions: number;
    clicks: number;
    closes: number;
  }>;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for small panel variant components
 */
export interface SmallPanelProps {
  /** Campaign with product data */
  campaign: CampaignWithProduct;
  /** Called when user clicks CTA */
  onCTAClick?: () => void;
  /** Called when user closes/dismisses the ad */
  onClose?: () => void;
}

/**
 * Props for large panel variant components
 */
export interface LargePanelProps {
  /** Campaign with product data */
  campaign: CampaignWithProduct;
  /** Called when user clicks CTA */
  onCTAClick?: () => void;
  /** Called when user closes/dismisses the ad */
  onClose?: () => void;
  /** Whether to show slide indicator */
  showIndicator?: boolean;
  /** Current slide index (for carousel) */
  currentIndex?: number;
  /** Total number of slides (for carousel) */
  totalCount?: number;
}

/**
 * Props for ad panel component
 */
export interface AdPanelProps {
  placement: AdPlacement;
  variant?: SmallPanelVariant;
  className?: string;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default frequency cap in days
 */
export const DEFAULT_FREQUENCY_DAYS = 20;

/**
 * Default campaign priority
 */
export const DEFAULT_CAMPAIGN_PRIORITY = 50;

/**
 * Variant display names
 */
export const VARIANT_NAMES: Record<AdVariant, string> = {
  small_panel_1: 'Minimal',
  small_panel_2: 'Tagline',
  small_panel_3: 'Features',
  small_panel_4: 'Gradient',
  small_panel_5: 'Card',
  large_slider_1: 'Hero',
  large_slider_2: 'Feature Grid',
  large_slider_3: 'Testimonial',
  large_slider_4: 'Comparison',
  large_slider_5: 'Video Placeholder',
};

/**
 * Placement display names
 */
export const PLACEMENT_NAMES: Record<AdPlacement, string> = {
  popup_slider: 'Extension Popup Slider',
  options_panel: 'Extension Options Panel',
  onetime_modal: 'One-Time Welcome Modal',
  update_modal: 'Update Announcement Modal',
  notification: 'Browser Notification',
  footer_slider: 'Web App Footer Slider',
  sidebar_panel: 'Web App Sidebar Panel',
  home_banner: 'Home Page Banner',
  topbar_banner: 'Topbar Banner (Dismissible)',
};

/**
 * Platform display names
 */
export const PLATFORM_NAMES: Record<TargetPlatform, string> = {
  web: 'Web App',
  android: 'Android App',
  ios: 'iOS App',
  extension: 'Browser Extension',
};

// ============================================================================
// FIREBASE COLLECTION NAMES
// ============================================================================

/**
 * Collection names for shared features
 */
export const COLLECTIONS = {
  CAMPAIGNS: 'zaions_campaigns',
  PRODUCTS: 'zaions_products',
  IMPRESSIONS: 'zaions_impressions',
  CONTACTS: 'zaions_contacts',
  FEATURE_REQUESTS: 'zaions_feature_requests',
  PAYMENT_OPTIONS: 'zaions_payment_options',
  SOCIAL_LINKS: 'zaions_social_links',
  DEVELOPER_INFO: 'zaions_developer_info',
} as const;
