/**
 * AdModal Component
 *
 * One-time promotional modal for consumer apps.
 * Displays on first visit to promote products.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { Box, Flex, Text, Heading, Button, Dialog, Checkbox } from '@radix-ui/themes';
import { ExternalLink, X, Gift } from 'lucide-react';
import { useCampaign, useOneTimeAdModal } from '../../hooks/useCampaigns';
import type { AdPlacement } from '../../types/campaigns';
import { getConfig, isInitialized } from '../../firebase/config';

export interface AdModalProps {
  /** Ad placement (defaults to onetime_modal) */
  placement?: AdPlacement;
  /** Callback when modal closes */
  onClose?: () => void;
  /** Custom welcome title (when no campaign) */
  welcomeTitle?: string;
  /** Custom welcome description (when no campaign) */
  welcomeDescription?: string;
}

/**
 * AdModal - One-time promotional modal
 *
 * @example
 * ```tsx
 * <AdModal />
 * <AdModal
 *   placement="onetime_modal"
 *   welcomeTitle="Welcome to My App!"
 *   welcomeDescription="Discover amazing features..."
 * />
 * ```
 */
export function AdModal({
  placement = 'onetime_modal',
  onClose,
  welcomeTitle,
  welcomeDescription,
}: AdModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const hasTrackedImpression = useRef(false);

  const { shouldShow, markAsShown } = useOneTimeAdModal();

  const {
    campaign,
    loading,
    recordImpression,
    recordClick,
    recordClose,
  } = useCampaign({ placement });

  // Track impression when modal shows
  useEffect(() => {
    if (shouldShow && campaign && !hasTrackedImpression.current) {
      hasTrackedImpression.current = true;
      recordImpression(campaign);
    }
  }, [shouldShow, campaign, recordImpression]);

  // Handle CTA click
  const handleCTAClick = useCallback(() => {
    if (!campaign) return;
    recordClick(campaign);
    const targetUrl = campaign.customCtaUrl || campaign.product.url;
    window.open(targetUrl, '_blank');
  }, [campaign, recordClick]);

  // Handle close
  const handleClose = useCallback(() => {
    if (campaign) {
      recordClose(campaign);
    }
    markAsShown();
    onClose?.();
  }, [campaign, recordClose, markAsShown, onClose]);

  // Don't render if shared-features not initialized
  if (!isInitialized()) {
    return null;
  }

  // Don't show if not eligible or loading
  if (!shouldShow || loading) {
    return null;
  }

  // Show welcome modal without campaign
  if (!campaign) {
    const config = getConfig();
    const defaultTitle = welcomeTitle || `Welcome to ${config.projectName}!`;
    const defaultDesc = welcomeDescription || 'Discover amazing features and tools at your fingertips.';

    return (
      <Dialog.Root open={true} onOpenChange={(open) => !open && handleClose()}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>
            <Flex align="center" gap="2">
              <Gift size={24} />
              {defaultTitle}
            </Flex>
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {defaultDesc}
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Start Exploring
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  const { product } = campaign;
  const displayTitle = campaign.customTitle || product.name;
  const displayTagline = campaign.customTagline || product.tagline;
  const displayDescription = campaign.customDescription || product.description;
  const displayCta = campaign.customCta || 'Learn More';
  const displayIcon = campaign.customIcon || product.icon128 || product.icon64 || '';
  const displayColor = campaign.customProductColor || product.color || '#3B82F6';
  const displayFeatures = campaign.customFeatures || product.features || [];

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Flex justify="end" mb="2">
          <Dialog.Close>
            <Button variant="ghost" size="1" color="gray">
              <X size={16} />
            </Button>
          </Dialog.Close>
        </Flex>

        <Flex direction="column" align="center" gap="4" p="4" style={{ textAlign: 'center' }}>
          <Box
            style={{
              width: 96,
              height: 96,
              borderRadius: 'var(--radius-4)',
              background: `color-mix(in srgb, ${displayColor} 15%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            dangerouslySetInnerHTML={{ __html: displayIcon }}
          />

          <Box>
            <Heading size="5" weight="bold" mb="2">
              {displayTitle}
            </Heading>
            <Text size="3" color="gray">
              {displayTagline}
            </Text>
          </Box>

          <Text size="2" color="gray" style={{ maxWidth: 350, lineHeight: 1.6 }}>
            {displayDescription}
          </Text>

          <Flex wrap="wrap" gap="2" justify="center">
            {displayFeatures.slice(0, 4).map((feature, i) => (
              <Box
                key={i}
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-2)',
                  background: 'var(--gray-a3)',
                  fontSize: 'var(--font-size-1)',
                }}
              >
                {feature}
              </Box>
            ))}
          </Flex>

          <Button
            size="3"
            style={{ background: displayColor, marginTop: 'var(--space-2)' }}
            onClick={handleCTAClick}
          >
            {displayCta}
            <ExternalLink size={16} />
          </Button>

          <Flex align="center" gap="2" mt="2">
            <Checkbox
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <Text size="1" color="gray">
              Don&apos;t show this again
            </Text>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default AdModal;
