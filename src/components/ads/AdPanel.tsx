/**
 * AdPanel Component
 *
 * A simple ad panel component that displays a single campaign.
 * Can be placed in sidebars, footers, or other static locations.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useCallback, useRef } from 'react';
import { Box } from '@radix-ui/themes';
import { useCampaign } from '../../hooks/useCampaigns';
import { getSmallPanelVariant } from './variants/SmallPanelVariants';
import type { AdPanelProps } from '../../types/campaigns';

/**
 * AdPanel displays a single campaign in a compact panel format.
 *
 * The `variant` prop selects which of the five small-panel layouts to render
 * (`small_panel_1`…`small_panel_5`). When omitted, the campaign's own
 * `variant` (set in the admin panel) is honored, falling back to
 * `small_panel_2` (Tagline). This mirrors how `AdSlider` resolves variants,
 * so explicit and admin-driven variants stay consistent.
 *
 * @example
 * ```tsx
 * <AdPanel placement="sidebar_panel" variant="small_panel_2" />
 * ```
 */
export function AdPanel({
  placement,
  variant,
  className,
}: AdPanelProps) {
  const { campaign, loading, error, recordImpression, recordClick, recordClose } =
    useCampaign({ placement });

  const hasRecordedImpression = useRef(false);

  // Record impression when campaign is first displayed
  useEffect(() => {
    if (campaign && !hasRecordedImpression.current) {
      hasRecordedImpression.current = true;
      recordImpression(campaign);
    }
  }, [campaign, recordImpression]);

  // Record click on CTA (the variant component opens the URL itself).
  const handleCTAClick = useCallback(() => {
    if (!campaign) return;
    recordClick(campaign);
  }, [campaign, recordClick]);

  const handleClose = useCallback(() => {
    if (!campaign) return;
    recordClose(campaign);
  }, [campaign, recordClose]);

  if (loading || error || !campaign) {
    return null;
  }

  // Explicit prop wins; otherwise honor the admin-configured campaign variant.
  const variantName = variant || campaign.variant || 'small_panel_2';
  const VariantComponent = getSmallPanelVariant(variantName);

  return (
    <Box className={className}>
      <VariantComponent
        campaign={campaign}
        onCTAClick={handleCTAClick}
        onClose={handleClose}
      />
    </Box>
  );
}

export default AdPanel;
