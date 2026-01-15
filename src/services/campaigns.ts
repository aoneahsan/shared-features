/**
 * Campaigns Service
 *
 * Handles fetching and displaying advertising campaigns from the
 * centralized aoneahsan.com Firebase backend.
 *
 * Consumer projects only need read access - all campaign management
 * is done through the aoneahsan.com admin panel.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
} from 'firebase/firestore';
import { getSharedFeaturesDb } from '../firebase/init';
import { getConfig } from '../firebase/config';
import type {
  Campaign,
  CampaignWithProduct,
  Product,
  AdPlacement,
  CampaignStatus,
  FetchCampaignsOptions,
} from '../types/campaigns';

// ============================================================================
// CONSTANTS
// ============================================================================

const COLLECTION_CAMPAIGNS = 'zaions_campaigns';
const COLLECTION_PRODUCTS = 'zaions_products';

// Cache for campaigns
interface CampaignsCache {
  data: Campaign[];
  timestamp: number;
}
let campaignsCache: CampaignsCache | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Products cache
let productsCache: Map<string, Product> | null = null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if cache is valid
 */
function isCacheValid(): boolean {
  if (!campaignsCache) return false;
  return Date.now() - campaignsCache.timestamp < CACHE_TTL_MS;
}

/**
 * Convert Firestore document to Campaign
 */
function docToCampaign(
  docId: string,
  data: Record<string, unknown>
): Campaign {
  return {
    id: docId,
    productId: data.productId as string,
    name: data.name as string,
    status: data.status as CampaignStatus,
    targetPlatforms: data.targetPlatforms as Campaign['targetPlatforms'],
    targetAudience: data.targetAudience as Campaign['targetAudience'],
    targetProjects: (data.targetProjects as string[]) || [],
    excludeProductUsers: data.excludeProductUsers as boolean,
    placements: data.placements as AdPlacement[],
    priority: data.priority as number,
    frequencyDays: data.frequencyDays as number,
    maxImpressions: data.maxImpressions as number | null,
    startDate: data.startDate as Timestamp,
    endDate: data.endDate as Timestamp | null,
    variant: data.variant as Campaign['variant'],
    customTitle: data.customTitle as string | undefined,
    customTagline: data.customTagline as string | undefined,
    customCta: data.customCta as string | undefined,
    customCtaUrl: data.customCtaUrl as string | undefined,
    customDescription: data.customDescription as string | undefined,
    customProductColor: data.customProductColor as string | undefined,
    customIcon: data.customIcon as string | undefined,
    customFeatures: data.customFeatures as string[] | undefined,
    totalImpressions: data.totalImpressions as number,
    totalClicks: data.totalClicks as number,
    totalCloses: data.totalCloses as number,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
    createdBy: data.createdBy as string,
    updatedBy: data.updatedBy as string | undefined,
  };
}

/**
 * Convert Firestore document to Product
 */
function docToProduct(docId: string, data: Record<string, unknown>): Product {
  return {
    id: docId,
    name: data.name as string,
    tagline: data.tagline as string,
    description: data.description as string,
    type: data.type as Product['type'],
    url: data.url as string,
    color: data.color as string,
    features: (data.features as string[]) || [],
    icon64: data.icon64 as string | undefined,
    icon128: data.icon128 as string | undefined,
    chromeStoreUrl: data.chromeStoreUrl as string | undefined,
    playStoreUrl: data.playStoreUrl as string | undefined,
    appStoreUrl: data.appStoreUrl as string | undefined,
    webUrl: data.webUrl as string | undefined,
    enabled: data.enabled as boolean,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
  };
}

// ============================================================================
// PRODUCTS
// ============================================================================

/**
 * Fetch all products from Firestore
 */
export async function fetchProducts(): Promise<Product[]> {
  const db = getSharedFeaturesDb();
  const snapshot = await getDocs(collection(db, COLLECTION_PRODUCTS));
  const products = snapshot.docs.map((d) => docToProduct(d.id, d.data()));

  // Update cache
  productsCache = new Map(products.map((p) => [p.id, p]));

  return products;
}

/**
 * Get a product by ID (uses cache if available)
 */
export async function getProductById(
  productId: string
): Promise<Product | null> {
  // Check cache first
  if (productsCache?.has(productId)) {
    return productsCache.get(productId) || null;
  }

  // Fetch from Firestore
  const db = getSharedFeaturesDb();
  const docSnap = await getDoc(doc(db, COLLECTION_PRODUCTS, productId));

  if (!docSnap.exists()) return null;

  const product = docToProduct(docSnap.id, docSnap.data());

  // Add to cache
  if (!productsCache) productsCache = new Map();
  productsCache.set(productId, product);

  return product;
}

// ============================================================================
// CAMPAIGNS
// ============================================================================

/**
 * Fetch campaigns with optional filters
 */
export async function fetchCampaigns(
  options: FetchCampaignsOptions = {}
): Promise<Campaign[]> {
  const config = getConfig();
  const db = getSharedFeaturesDb();

  // Check cache first (only for unfiltered queries)
  if (
    !options.placement &&
    !options.status &&
    !options.productId &&
    isCacheValid()
  ) {
    return campaignsCache!.data;
  }

  let q = query(collection(db, COLLECTION_CAMPAIGNS));

  // Apply filters
  if (options.status) {
    q = query(q, where('status', '==', options.status));
  }

  if (options.productId) {
    q = query(q, where('productId', '==', options.productId));
  }

  q = query(q, orderBy('priority', 'desc'));

  if (options.limit) {
    q = query(q, firestoreLimit(options.limit));
  }

  const snapshot = await getDocs(q);
  let campaigns = snapshot.docs.map((d) => docToCampaign(d.id, d.data()));

  // Client-side filtering for array fields
  if (options.placement) {
    campaigns = campaigns.filter((c) =>
      c.placements.includes(options.placement!)
    );
  }

  // Filter by target platform (from config)
  campaigns = campaigns.filter(
    (c) =>
      c.targetPlatforms.includes(config.platform) ||
      c.targetPlatforms.length === 0
  );

  // Filter by target projects (empty = all projects)
  campaigns = campaigns.filter(
    (c) =>
      c.targetProjects.length === 0 ||
      c.targetProjects.includes(config.projectId)
  );

  // Cache unfiltered results
  if (!options.placement && !options.status && !options.productId) {
    campaignsCache = {
      data: campaigns,
      timestamp: Date.now(),
    };
  }

  return campaigns;
}

/**
 * Fetch active campaigns for a specific placement
 * Returns campaigns with resolved product data
 */
export async function fetchActiveCampaigns(
  placement: AdPlacement
): Promise<CampaignWithProduct[]> {
  const now = Timestamp.now();

  const campaigns = await fetchCampaigns({ status: 'active' });

  // Ensure products are loaded
  if (!productsCache || productsCache.size === 0) {
    await fetchProducts();
  }

  // Filter by placement and date range
  const eligible = campaigns.filter((c) => {
    // Placement check
    if (!c.placements.includes(placement)) return false;

    // Date range check
    if (c.startDate.toMillis() > now.toMillis()) return false;
    if (c.endDate && c.endDate.toMillis() < now.toMillis()) return false;

    // Max impressions check
    if (c.maxImpressions !== null && c.totalImpressions >= c.maxImpressions)
      return false;

    return true;
  });

  // Resolve products
  const result: CampaignWithProduct[] = [];

  for (const campaign of eligible) {
    const product = await getProductById(campaign.productId);
    if (product && product.enabled) {
      result.push({ ...campaign, product });
    }
  }

  return result;
}

/**
 * Get a single campaign by ID
 */
export async function getCampaignById(
  campaignId: string
): Promise<Campaign | null> {
  const db = getSharedFeaturesDb();
  const docSnap = await getDoc(doc(db, COLLECTION_CAMPAIGNS, campaignId));

  if (!docSnap.exists()) return null;
  return docToCampaign(docSnap.id, docSnap.data());
}

/**
 * Clear the campaigns cache (useful for manual refresh)
 */
export function clearCampaignsCache(): void {
  campaignsCache = null;
}

/**
 * Clear the products cache
 */
export function clearProductsCache(): void {
  productsCache = null;
}
