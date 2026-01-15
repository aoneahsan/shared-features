/**
 * AdSlider Component
 *
 * Small promotional slider panel for consumer apps.
 * Displays eligible ad campaigns using 5 small panel variants.
 *
 * Placement: Footer, sidebar, between sections
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useCallback, useRef } from 'react';
import { Box } from '@radix-ui/themes';
import { useCampaign } from '../../hooks/useCampaigns';
import { getSmallPanelVariant } from './variants/SmallPanelVariants';
import type { AdPlacement } from '../../types/campaigns';

export interface AdSliderProps {
  /** Ad placement (defaults to footer_slider) */
  placement?: AdPlacement;
  /** Custom CSS class */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * AdSlider - Small promotional panel
 *
 * @example
 * ```tsx
 * <AdSlider placement="footer_slider" />
 * <AdSlider placement="sidebar_panel" className="my-ad" />
 * ```
 */
export function AdSlider({
  placement = 'footer_slider',
  className,
  style,
}: AdSliderProps) {
  const hasTrackedImpression = useRef(false);

  const {
    campaign,
    loading,
    recordImpression,
    recordClick,
    recordClose,
  } = useCampaign({ placement });

  // Track impression on mount when campaign is available
  useEffect(() => {
    if (campaign && !hasTrackedImpression.current) {
      hasTrackedImpression.current = true;
      recordImpression(campaign);
    }
  }, [campaign, recordImpression]);

  // Handle CTA click
  const handleCTAClick = useCallback(() => {
    if (!campaign) return;
    recordClick(campaign);
  }, [campaign, recordClick]);

  // Handle close
  const handleClose = useCallback(() => {
    if (!campaign) return;
    recordClose(campaign);
  }, [campaign, recordClose]);

  // Don't render if loading or no campaign
  if (loading || !campaign) {
    return null;
  }

  // Get variant component
  const variantName = campaign.variant || 'small_panel_2';
  const VariantComponent = getSmallPanelVariant(variantName);

  return (
    <Box className={className} style={style}>
      <VariantComponent
        campaign={campaign}
        onCTAClick={handleCTAClick}
        onClose={handleClose}
      />
    </Box>
  );
}

export default AdSlider;
