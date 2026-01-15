/**
 * useCampaigns Hook
 *
 * React hook for fetching and displaying campaigns in consumer projects.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchActiveCampaigns, clearCampaignsCache } from '../services/campaigns';
import {
  trackImpression,
  trackClick,
  trackClose,
  isEligibleForCampaign,
} from '../services/analytics';
import { isInitialized } from '../firebase/config';
import type {
  CampaignWithProduct,
  AdPlacement,
  SmallPanelVariant,
  LargePanelVariant,
} from '../types/campaigns';

export interface UseCampaignsOptions {
  /** Placement to fetch campaigns for */
  placement: AdPlacement;
  /** Maximum number of campaigns to fetch */
  maxCampaigns?: number;
  /** Whether to auto-fetch on mount (default: true) */
  autoFetch?: boolean;
  /** Default variant for small placements */
  defaultSmallVariant?: SmallPanelVariant;
  /** Default variant for large placements */
  defaultLargeVariant?: LargePanelVariant;
}

export interface UseCampaignsResult {
  /** List of eligible campaigns with product data */
  campaigns: CampaignWithProduct[];
  /** Single campaign (first eligible) - convenience accessor */
  campaign: CampaignWithProduct | null;
  /** Whether campaigns are being fetched */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Refetch campaigns */
  refetch: () => Promise<void>;
  /** Record impression for a campaign */
  recordImpression: (campaign: CampaignWithProduct) => Promise<void>;
  /** Record click for a campaign */
  recordClick: (campaign: CampaignWithProduct) => Promise<void>;
  /** Record close/dismiss for a campaign */
  recordClose: (campaign: CampaignWithProduct) => Promise<void>;
}

/**
 * Hook to fetch and manage campaigns for a specific placement
 *
 * @example
 * ```tsx
 * const { campaigns, loading, recordImpression, recordClick } = useCampaigns({
 *   placement: 'footer_slider',
 *   maxCampaigns: 5,
 * });
 *
 * if (loading) return <Spinner />;
 *
 * return (
 *   <AdSlider
 *     campaigns={campaigns}
 *     onImpression={recordImpression}
 *     onClick={recordClick}
 *   />
 * );
 * ```
 */
export function useCampaigns(options: UseCampaignsOptions): UseCampaignsResult {
  const {
    placement,
    maxCampaigns = 5,
    autoFetch = true,
    defaultSmallVariant = 'small_panel_2',
    defaultLargeVariant: _defaultLargeVariant = 'large_slider_1',
  } = options;
  // Note: _defaultLargeVariant reserved for large variant components

  const [campaigns, setCampaigns] = useState<CampaignWithProduct[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allCampaigns = await fetchActiveCampaigns(placement);

      // Filter by frequency capping
      const eligibleCampaigns: CampaignWithProduct[] = [];

      for (const campaign of allCampaigns) {
        const eligible = await isEligibleForCampaign(
          campaign.id,
          campaign.frequencyDays
        );
        if (eligible) {
          eligibleCampaigns.push(campaign);
          if (eligibleCampaigns.length >= maxCampaigns) break;
        }
      }

      setCampaigns(eligibleCampaigns);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(message);
      console.error('[shared-features] Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [placement, maxCampaigns]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchCampaigns();
    }
  }, [autoFetch, fetchCampaigns]);

  // Record impression
  const handleRecordImpression = useCallback(
    async (campaign: CampaignWithProduct) => {
      const variant = campaign.variant.startsWith('small_')
        ? campaign.variant
        : campaign.variant.startsWith('large_')
          ? campaign.variant
          : defaultSmallVariant;

      await trackImpression(
        campaign.id,
        campaign.productId,
        placement,
        variant,
        campaign.frequencyDays
      );
    },
    [placement, defaultSmallVariant]
  );

  // Record click
  const handleRecordClick = useCallback(
    async (campaign: CampaignWithProduct) => {
      const variant = campaign.variant;
      await trackClick(campaign.id, campaign.productId, placement, variant);
    },
    [placement]
  );

  // Record close
  const handleRecordClose = useCallback(
    async (campaign: CampaignWithProduct) => {
      const variant = campaign.variant;
      await trackClose(campaign.id, campaign.productId, placement, variant);
    },
    [placement]
  );

  // Refetch with cache clear
  const refetch = useCallback(async () => {
    clearCampaignsCache();
    await fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    campaign: campaigns[0] || null,
    loading,
    error,
    refetch,
    recordImpression: handleRecordImpression,
    recordClick: handleRecordClick,
    recordClose: handleRecordClose,
  };
}

/**
 * Hook to fetch a single campaign for a placement
 * Convenience wrapper around useCampaigns
 */
export function useCampaign(options: Omit<UseCampaignsOptions, 'maxCampaigns'>) {
  return useCampaigns({ ...options, maxCampaigns: 1 });
}

// Storage keys for modal hooks
const STORAGE_KEYS = {
  oneTimeShown: 'shared_features_onetime_ad_shown',
  appVersion: 'shared_features_app_version',
} as const;

/**
 * Hook to manage one-time ad modal visibility
 * Shows modal on first visit, then remembers user has seen it
 *
 * @example
 * ```tsx
 * const { shouldShow, markAsShown } = useOneTimeAdModal();
 *
 * if (shouldShow) {
 *   return <AdModal onClose={markAsShown} />;
 * }
 * ```
 */
export function useOneTimeAdModal() {
  const [hasShown, setHasShown] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if modal has been shown before
    const hasSeenModal = localStorage.getItem(STORAGE_KEYS.oneTimeShown);
    if (!hasSeenModal) {
      setShouldShow(true);
    }
  }, []);

  const markAsShown = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.oneTimeShown, 'true');
    setHasShown(true);
    setShouldShow(false);
  }, []);

  return {
    /** Whether the modal should be displayed */
    shouldShow: shouldShow && !hasShown,
    /** Mark the modal as shown (call when user dismisses) */
    markAsShown,
  };
}

/**
 * Hook to manage update ad modal visibility
 * Shows modal when app version changes
 *
 * @param currentVersion - Current app version (defaults to VITE_APP_VERSION env var or '1.0.0')
 *
 * @example
 * ```tsx
 * const { shouldShow, currentVersion, markAsShown } = useUpdateAdModal();
 *
 * if (shouldShow) {
 *   return <AdUpdateModal version={currentVersion} onClose={markAsShown} />;
 * }
 * ```
 */
export function useUpdateAdModal(currentVersion?: string) {
  const version = currentVersion || import.meta.env.VITE_APP_VERSION || '1.0.0';
  const [shouldShow, setShouldShow] = useState(false);
  const [previousVersion, setPreviousVersion] = useState<string | null>(null);

  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.appVersion);

    if (!storedVersion) {
      // First time user - store version but don't show update modal
      localStorage.setItem(STORAGE_KEYS.appVersion, version);
    } else if (storedVersion !== version) {
      // Version changed - show update modal
      setShouldShow(true);
      setPreviousVersion(storedVersion);
    }
  }, [version]);

  const markAsShown = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.appVersion, version);
    setShouldShow(false);
  }, [version]);

  return {
    /** Whether the modal should be displayed */
    shouldShow,
    /** Previous app version (before update) */
    previousVersion,
    /** Current app version */
    currentVersion: version,
    /** Mark the modal as shown (call when user dismisses) */
    markAsShown,
  };
}
