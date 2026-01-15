/**
 * AdPanel Component
 *
 * A simple ad panel component that displays a single campaign.
 * Can be placed in sidebars, footers, or other static locations.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useRef } from 'react';
import { Box, Flex, Text, Button, IconButton } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCampaign } from '../../hooks/useCampaigns';
import type { AdPanelProps } from '../../types/campaigns';

/**
 * AdPanel displays a single campaign in a compact panel format.
 *
 * @example
 * ```tsx
 * <AdPanel placement="sidebar_panel" variant="small_panel_2" />
 * ```
 */
export function AdPanel({
  placement,
  variant: _variant = 'small_panel_2',
  className,
}: AdPanelProps) {
  // TODO: variant will be used for different display styles in future variants
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

  if (loading || error || !campaign) {
    return null;
  }

  const handleClick = () => {
    recordClick(campaign);
    const url = campaign.customCtaUrl || campaign.product.url;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    recordClose(campaign);
    // Hide the panel (could use state or CSS)
  };

  const title = campaign.customTitle || campaign.product.name;
  const tagline = campaign.customTagline || campaign.product.tagline;
  const ctaText = campaign.customCta || 'Learn More';
  const color = campaign.customProductColor || campaign.product.color;

  return (
    <Box
      className={className}
      style={{
        border: `1px solid ${color}`,
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: `${color}10`,
        position: 'relative',
      }}
    >
      <IconButton
        size="1"
        variant="ghost"
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
        }}
      >
        <Cross2Icon />
      </IconButton>

      <Flex direction="column" gap="2">
        <Flex align="center" gap="2">
          {campaign.product.icon64 && (
            <Box
              dangerouslySetInnerHTML={{ __html: campaign.product.icon64 }}
              style={{ width: 32, height: 32 }}
            />
          )}
          <Text weight="bold" size="3" style={{ color }}>
            {title}
          </Text>
        </Flex>

        <Text size="2" color="gray">
          {tagline}
        </Text>

        <Button
          size="2"
          onClick={handleClick}
          style={{ backgroundColor: color }}
        >
          {ctaText}
        </Button>
      </Flex>
    </Box>
  );
}

export default AdPanel;
