/**
 * Small Panel Variants for Advertising
 *
 * 5 variants for small promotional panels:
 * 1. Minimal - Icon + Name + Link
 * 2. Tagline - Icon + Name + Tagline + CTA
 * 3. Features - Icon + Name + Feature pills + CTA
 * 4. Gradient - Full gradient background
 * 5. Card - Elevated card with shadow
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { Box, Flex, Text, Button, Link, Card, Badge } from '@radix-ui/themes';
import { ExternalLink, Check, X, Sparkles } from 'lucide-react';
import type { CampaignWithProduct, SmallPanelProps } from '../../../types/campaigns';

/**
 * Helper to get display values from campaign
 */
function getDisplayValues(campaign: CampaignWithProduct) {
  const isCustomProduct = !campaign.product.icon64 && campaign.customIcon;

  return {
    displayTitle: campaign.customTitle || campaign.product.name,
    displayTagline: campaign.customTagline || campaign.product.tagline,
    displayCta: campaign.customCta || 'Learn More',
    displayUrl: campaign.customCtaUrl || campaign.product.url,
    displayIcon: campaign.customIcon || campaign.product.icon64 || '',
    displayColor: campaign.customProductColor || campaign.product.color || '#3B82F6',
    displayFeatures: campaign.customFeatures || campaign.product.features || [],
    isCustomProduct,
  };
}

/**
 * Variant 1: Minimal - Icon + Name + Link
 */
export function MinimalVariant({ campaign, onCTAClick, onClose }: SmallPanelProps) {
  const { displayTitle, displayCta, displayUrl, displayIcon, displayColor } = getDisplayValues(campaign);

  return (
    <Card size="1">
      <Flex align="center" justify="between" gap="3" p="2">
        <Flex align="center" gap="3">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-2)',
              background: `color-mix(in srgb, ${displayColor} 15%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            dangerouslySetInnerHTML={{ __html: displayIcon }}
          />
          <Text size="2" weight="medium">
            {displayTitle}
          </Text>
        </Flex>
        <Flex align="center" gap="2">
          <Link
            href={displayUrl}
            target="_blank"
            onClick={onCTAClick}
            style={{ textDecoration: 'none' }}
          >
            <Flex align="center" gap="1">
              <Text size="2" color="blue">
                {displayCta}
              </Text>
              <ExternalLink size={14} />
            </Flex>
          </Link>
          <Button variant="ghost" size="1" color="gray" onClick={onClose}>
            <X size={14} />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

/**
 * Variant 2: Tagline - Icon + Name + Tagline + CTA Button
 */
export function TaglineVariant({ campaign, onCTAClick, onClose }: SmallPanelProps) {
  const { displayTitle, displayTagline, displayCta, displayUrl, displayIcon, displayColor } = getDisplayValues(campaign);

  return (
    <Card size="1">
      <Flex align="center" justify="between" gap="3" p="3">
        <Flex align="center" gap="3">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-2)',
              background: `color-mix(in srgb, ${displayColor} 15%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            dangerouslySetInnerHTML={{ __html: displayIcon }}
          />
          <Box>
            <Text size="2" weight="bold">
              {displayTitle}
            </Text>
            <Text size="1" color="gray">
              {displayTagline}
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="2">
          <Button
            size="1"
            style={{ background: displayColor }}
            onClick={() => {
              onCTAClick?.();
              window.open(displayUrl, '_blank');
            }}
          >
            {displayCta}
          </Button>
          <Button variant="ghost" size="1" color="gray" onClick={onClose}>
            <X size={14} />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

/**
 * Variant 3: Features - Icon + Name + Feature pills + CTA
 */
export function FeaturesVariant({ campaign, onCTAClick, onClose }: SmallPanelProps) {
  const { displayTitle, displayCta, displayUrl, displayIcon, displayColor, displayFeatures } = getDisplayValues(campaign);
  const features = displayFeatures.slice(0, 2);

  return (
    <Card size="1">
      <Flex align="center" justify="between" gap="3" p="3">
        <Flex align="center" gap="3">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-2)',
              background: `color-mix(in srgb, ${displayColor} 15%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            dangerouslySetInnerHTML={{ __html: displayIcon }}
          />
          <Box>
            <Text size="2" weight="bold" mb="1">
              {displayTitle}
            </Text>
            <Flex gap="1" wrap="wrap">
              {features.map((feature, i) => (
                <Badge key={i} size="1" variant="soft" color="gray">
                  <Check size={10} style={{ marginRight: 2 }} />
                  {feature}
                </Badge>
              ))}
            </Flex>
          </Box>
        </Flex>
        <Flex align="center" gap="2">
          <Button
            size="1"
            style={{ background: displayColor }}
            onClick={() => {
              onCTAClick?.();
              window.open(displayUrl, '_blank');
            }}
          >
            {displayCta}
          </Button>
          <Button variant="ghost" size="1" color="gray" onClick={onClose}>
            <X size={14} />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

/**
 * Variant 4: Gradient - Full gradient background
 */
export function GradientVariant({ campaign, onCTAClick, onClose }: SmallPanelProps) {
  const { displayTitle, displayTagline, displayCta, displayUrl, displayIcon, displayColor } = getDisplayValues(campaign);

  return (
    <Box
      style={{
        background: `linear-gradient(135deg, ${displayColor} 0%, color-mix(in srgb, ${displayColor} 80%, black) 100%)`,
        borderRadius: 'var(--radius-3)',
        padding: 'var(--space-3)',
        color: 'white',
      }}
    >
      <Flex align="center" justify="between" gap="3">
        <Flex align="center" gap="3">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-2)',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              dangerouslySetInnerHTML={{ __html: displayIcon }}
              style={{
                color: 'white',
              }}
            />
          </Box>
          <Box>
            <Text size="2" weight="bold" style={{ color: 'white' }}>
              {displayTitle}
            </Text>
            <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {displayTagline}
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="2">
          <Button
            size="1"
            variant="soft"
            style={{
              background: 'white',
              color: displayColor,
            }}
            onClick={() => {
              onCTAClick?.();
              window.open(displayUrl, '_blank');
            }}
          >
            {displayCta}
          </Button>
          <Button
            variant="ghost"
            size="1"
            onClick={onClose}
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            <X size={14} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

/**
 * Variant 5: Card - Elevated card with shadow and animation
 */
export function CardVariant({ campaign, onCTAClick, onClose }: SmallPanelProps) {
  const { displayTitle, displayTagline, displayCta, displayUrl, displayIcon, displayColor } = getDisplayValues(campaign);

  return (
    <Card
      size="2"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        border: `1px solid ${displayColor}20`,
      }}
    >
      <Flex direction="column" gap="3" p="1">
        <Flex align="center" justify="between">
          <Flex align="center" gap="1">
            <Sparkles size={14} color={displayColor} />
            <Text size="1" color="gray" weight="medium">
              RECOMMENDED
            </Text>
          </Flex>
          <Button variant="ghost" size="1" color="gray" onClick={onClose}>
            <X size={14} />
          </Button>
        </Flex>

        <Flex align="center" gap="3">
          <Box
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-3)',
              background: `color-mix(in srgb, ${displayColor} 15%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            dangerouslySetInnerHTML={{ __html: displayIcon }}
          />
          <Box style={{ flex: 1 }}>
            <Text size="2" weight="bold">
              {displayTitle}
            </Text>
            <Text size="1" color="gray">
              {displayTagline}
            </Text>
          </Box>
        </Flex>

        <Button
          size="2"
          style={{ background: displayColor, width: '100%' }}
          onClick={() => {
            onCTAClick?.();
            window.open(displayUrl, '_blank');
          }}
        >
          {displayCta}
          <ExternalLink size={14} />
        </Button>
      </Flex>
    </Card>
  );
}

/**
 * Get variant component by name
 */
export const SMALL_PANEL_VARIANTS = {
  small_panel_1: MinimalVariant,
  small_panel_2: TaglineVariant,
  small_panel_3: FeaturesVariant,
  small_panel_4: GradientVariant,
  small_panel_5: CardVariant,
};

export type SmallPanelVariantName = keyof typeof SMALL_PANEL_VARIANTS;

export function getSmallPanelVariant(variantName: string) {
  return SMALL_PANEL_VARIANTS[variantName as SmallPanelVariantName] || TaglineVariant;
}
