/**
 * Large Panel Variants for Advertising
 *
 * 5 variants for large promotional panels (modals, sliders):
 * 1. Hero - Large icon + description + CTA
 * 2. Feature Grid - 2x2 grid of features
 * 3. Testimonial - Quote + product info
 * 4. Comparison - Before/After comparison
 * 5. Video - Animated preview + play button
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { Box, Flex, Text, Heading, Button, Card, Grid } from '@radix-ui/themes';
import { ExternalLink, Check, X, Play, Quote } from 'lucide-react';
import type { CampaignWithProduct, LargePanelProps } from '../../../types/campaigns';

/**
 * Helper to get display values from campaign
 */
function getDisplayValues(campaign: CampaignWithProduct) {
  const isCustomProduct = !campaign.product.icon64 && campaign.customIcon;

  return {
    displayTitle: campaign.customTitle || campaign.product.name,
    displayTagline: campaign.customTagline || campaign.product.tagline,
    displayDescription: campaign.customDescription || campaign.product.description,
    displayCta: campaign.customCta || 'Learn More',
    displayUrl: campaign.customCtaUrl || campaign.product.url,
    displayIcon64: campaign.customIcon || campaign.product.icon64 || '',
    displayIcon128: campaign.customIcon || campaign.product.icon128 || campaign.product.icon64 || '',
    displayColor: campaign.customProductColor || campaign.product.color || '#3B82F6',
    displayFeatures: campaign.customFeatures || campaign.product.features || [],
    isCustomProduct,
  };
}

// Default testimonial quotes (can be overridden by campaign data)
const DEFAULT_TESTIMONIALS: Record<string, string> = {
  'video-controls-plus':
    '"Finally, I have complete control over video playback. The keyboard shortcuts save me so much time!"',
  'ztools-web':
    '"300+ tools in one place. I use it daily for encoding, formatting, and data conversion tasks."',
  'ztools-extension': '"Quick access to all my favorite tools right from the browser. Super convenient!"',
  'pregnancy-pal-android':
    '"The weekly updates and kick counter are amazing. Best pregnancy tracking app!"',
  'pregnancy-pal-web':
    '"Love being able to access my pregnancy data from any device. The sync is seamless."',
  'lab-system-web': '"Streamlined our entire lab workflow. Sample tracking has never been easier."',
};

// Default comparison data (can be overridden by campaign data)
const DEFAULT_COMPARISONS: Record<string, { before: string[]; after: string[] }> = {
  'video-controls-plus': {
    before: ['Limited playback control', 'No keyboard shortcuts', 'Manual ad skipping', 'No speed control'],
    after: ['Full playback control', 'Custom shortcuts', 'Auto ad skip', '0.1x - 16x speed'],
  },
  'ztools-web': {
    before: ['Multiple websites', 'Scattered tools', 'No offline access', 'Ads everywhere'],
    after: ['One destination', '300+ tools', 'Works offline', 'Ad-free experience'],
  },
  'ztools-extension': {
    before: ['Open new tabs', 'Search for tools', 'Copy/paste repeatedly', 'Time wasted'],
    after: ['Instant access', 'Quick search', 'One-click actions', 'Time saved'],
  },
  'pregnancy-pal-android': {
    before: ['Paper tracking', 'Forget updates', 'Manual counting', 'Scattered info'],
    after: ['Digital diary', 'Weekly reminders', 'Auto tracking', 'All in one app'],
  },
  'pregnancy-pal-web': {
    before: ['Phone only', 'No backup', 'Limited access', 'Data silos'],
    after: ['Any device', 'Cloud sync', 'Always available', 'Unified data'],
  },
  'lab-system-web': {
    before: ['Paper records', 'Manual tracking', 'Error prone', 'Slow reports'],
    after: ['Digital records', 'Auto tracking', 'Accurate data', 'Instant reports'],
  },
};

/**
 * Variant 1: Hero - Large icon + description + CTA
 */
export function HeroVariant({
  campaign,
  onCTAClick,
  showIndicator,
  currentIndex,
  totalCount,
}: LargePanelProps) {
  const { displayTitle, displayTagline, displayDescription, displayCta, displayUrl, displayIcon128, displayColor } = getDisplayValues(campaign);

  return (
    <Flex direction="column" align="center" gap="4" p="5" style={{ textAlign: 'center' }}>
      {showIndicator && currentIndex !== undefined && totalCount !== undefined && (
        <Text size="1" color="gray" style={{ position: 'absolute', top: 16, right: 16 }}>
          {currentIndex + 1} / {totalCount}
        </Text>
      )}

      <Box
        style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-4)',
          background: `color-mix(in srgb, ${displayColor} 15%, transparent)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        dangerouslySetInnerHTML={{ __html: displayIcon128 }}
      />

      <Heading size="5" weight="bold">
        {displayTitle}
      </Heading>

      <Text size="3" color="gray">
        {displayTagline}
      </Text>

      <Text size="2" color="gray" style={{ maxWidth: 300, lineHeight: 1.6 }}>
        {displayDescription}
      </Text>

      <Button
        size="3"
        style={{ background: displayColor, marginTop: 'var(--space-2)' }}
        onClick={() => {
          onCTAClick?.();
          window.open(displayUrl, '_blank');
        }}
      >
        {displayCta}
        <ExternalLink size={16} />
      </Button>
    </Flex>
  );
}

/**
 * Variant 2: Feature Grid - 2x2 grid of features
 */
export function FeatureGridVariant({
  campaign,
  onCTAClick,
  showIndicator,
  currentIndex,
  totalCount,
}: LargePanelProps) {
  const { displayTitle, displayCta, displayUrl, displayIcon64, displayColor, displayFeatures } = getDisplayValues(campaign);
  const features = displayFeatures.slice(0, 4);

  return (
    <Flex direction="column" gap="4" p="5">
      {showIndicator && currentIndex !== undefined && totalCount !== undefined && (
        <Text size="1" color="gray" style={{ position: 'absolute', top: 16, right: 16 }}>
          {currentIndex + 1} / {totalCount}
        </Text>
      )}

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
          dangerouslySetInnerHTML={{ __html: displayIcon64 }}
        />
        <Heading size="4" weight="bold">
          {displayTitle}
        </Heading>
      </Flex>

      <Grid columns="2" gap="3">
        {features.map((feature, i) => (
          <Card key={i} size="1" style={{ background: 'var(--gray-a2)' }}>
            <Flex align="center" gap="2" p="2">
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: displayColor,
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </Flex>
              <Text size="2">{feature}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>

      <Button
        size="3"
        style={{ background: displayColor, width: '100%' }}
        onClick={() => {
          onCTAClick?.();
          window.open(displayUrl, '_blank');
        }}
      >
        {displayCta}
        <ExternalLink size={16} />
      </Button>
    </Flex>
  );
}

/**
 * Variant 3: Testimonial - Quote + product info
 */
export function TestimonialVariant({
  campaign,
  onCTAClick,
  showIndicator,
  currentIndex,
  totalCount,
}: LargePanelProps) {
  const { product } = campaign;
  const { displayTitle, displayTagline, displayCta, displayUrl, displayIcon64, displayColor } = getDisplayValues(campaign);
  const quote = DEFAULT_TESTIMONIALS[product.id] || '"An amazing tool that makes my work easier every day."';

  return (
    <Flex direction="column" gap="4" p="5" style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-3)' }}>
      {showIndicator && currentIndex !== undefined && totalCount !== undefined && (
        <Text size="1" color="gray" style={{ position: 'absolute', top: 16, right: 16 }}>
          {currentIndex + 1} / {totalCount}
        </Text>
      )}

      <Box style={{ position: 'relative', padding: 'var(--space-3)' }}>
        <Quote
          size={32}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.15,
            color: displayColor,
          }}
        />
        <Text size="3" style={{ fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6 }}>
          {quote}
        </Text>
        <Text size="2" color="gray" style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
          — Happy User
        </Text>
      </Box>

      <Card size="1">
        <Flex align="center" gap="3" p="3">
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
            dangerouslySetInnerHTML={{ __html: displayIcon64 }}
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
      </Card>

      <Button
        size="3"
        style={{ background: displayColor, width: '100%' }}
        onClick={() => {
          onCTAClick?.();
          window.open(displayUrl, '_blank');
        }}
      >
        {displayCta}
        <ExternalLink size={16} />
      </Button>
    </Flex>
  );
}

/**
 * Variant 4: Comparison - Before/After comparison
 */
export function ComparisonVariant({
  campaign,
  onCTAClick,
  showIndicator,
  currentIndex,
  totalCount,
}: LargePanelProps) {
  const { product } = campaign;
  const { displayTitle, displayCta, displayUrl, displayIcon64, displayColor } = getDisplayValues(campaign);
  const comparison = DEFAULT_COMPARISONS[product.id] || {
    before: ['Old way', 'Manual process', 'Time consuming', 'Limited features'],
    after: ['Better way', 'Automated', 'Fast & easy', 'Full features'],
  };

  return (
    <Flex direction="column" gap="4" p="5">
      {showIndicator && currentIndex !== undefined && totalCount !== undefined && (
        <Text size="1" color="gray" style={{ position: 'absolute', top: 16, right: 16 }}>
          {currentIndex + 1} / {totalCount}
        </Text>
      )}

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
          dangerouslySetInnerHTML={{ __html: displayIcon64 }}
        />
        <Heading size="4" weight="bold">
          {displayTitle}
        </Heading>
      </Flex>

      <Flex gap="3">
        <Box
          style={{
            flex: 1,
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-2)',
            background: 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <Text size="1" weight="bold" color="red" mb="2" style={{ textTransform: 'uppercase' }}>
            Before
          </Text>
          {comparison.before.map((item, i) => (
            <Flex key={i} align="center" gap="2" mb="1">
              <X size={12} color="var(--red-9)" />
              <Text size="1">{item}</Text>
            </Flex>
          ))}
        </Box>

        <Box
          style={{
            flex: 1,
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-2)',
            background: 'rgba(16, 185, 129, 0.1)',
          }}
        >
          <Text size="1" weight="bold" color="green" mb="2" style={{ textTransform: 'uppercase' }}>
            After
          </Text>
          {comparison.after.map((item, i) => (
            <Flex key={i} align="center" gap="2" mb="1">
              <Check size={12} color="var(--green-9)" />
              <Text size="1">{item}</Text>
            </Flex>
          ))}
        </Box>
      </Flex>

      <Button
        size="3"
        style={{ background: displayColor, width: '100%' }}
        onClick={() => {
          onCTAClick?.();
          window.open(displayUrl, '_blank');
        }}
      >
        {displayCta}
        <ExternalLink size={16} />
      </Button>
    </Flex>
  );
}

/**
 * Variant 5: Video - Animated preview + play button
 */
export function VideoVariant({
  campaign,
  onCTAClick,
  showIndicator,
  currentIndex,
  totalCount,
}: LargePanelProps) {
  const { displayTitle, displayTagline, displayCta, displayUrl, displayIcon128, displayColor } = getDisplayValues(campaign);

  return (
    <Flex direction="column" align="center" gap="4" p="5" style={{ textAlign: 'center' }}>
      {showIndicator && currentIndex !== undefined && totalCount !== undefined && (
        <Text size="1" color="gray" style={{ position: 'absolute', top: 16, right: 16 }}>
          {currentIndex + 1} / {totalCount}
        </Text>
      )}

      <Box
        style={{
          position: 'relative',
          width: 140,
          height: 140,
          borderRadius: 'var(--radius-4)',
          background: `linear-gradient(135deg, color-mix(in srgb, ${displayColor} 20%, transparent), color-mix(in srgb, ${displayColor} 40%, transparent))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            animation: 'shared-features-pulse 2s ease-in-out infinite',
          }}
          dangerouslySetInnerHTML={{ __html: displayIcon128 }}
        />
        <Flex
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onClick={() => {
            onCTAClick?.();
            window.open(displayUrl, '_blank');
          }}
        >
          <Play size={24} fill={displayColor} color={displayColor} />
        </Flex>
      </Box>

      <Heading size="5" weight="bold">
        {displayTitle}
      </Heading>

      <Text size="2" color="gray">
        {displayTagline}
      </Text>

      <Button
        size="3"
        style={{ background: displayColor, marginTop: 'var(--space-2)' }}
        onClick={() => {
          onCTAClick?.();
          window.open(displayUrl, '_blank');
        }}
      >
        {displayCta}
        <ExternalLink size={16} />
      </Button>

      <style>{`
        @keyframes shared-features-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </Flex>
  );
}

/**
 * Get variant component by name
 */
export const LARGE_PANEL_VARIANTS = {
  large_slider_1: HeroVariant,
  large_slider_2: FeatureGridVariant,
  large_slider_3: TestimonialVariant,
  large_slider_4: ComparisonVariant,
  large_slider_5: VideoVariant,
};

export type LargePanelVariantName = keyof typeof LARGE_PANEL_VARIANTS;

export function getLargePanelVariant(variantName: string) {
  return LARGE_PANEL_VARIANTS[variantName as LargePanelVariantName] || HeroVariant;
}
