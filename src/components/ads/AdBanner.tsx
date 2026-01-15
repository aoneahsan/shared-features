/**
 * AdBanner Component (Permanent)
 *
 * A sleek, modern advertising banner that showcases products.
 * Clean design with smooth animations and auto-rotation.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Flex, Text, Button, Badge } from '@radix-ui/themes';
import { ExternalLink, Sparkles, Check } from 'lucide-react';
import { useCampaigns } from '../../hooks/useCampaigns';
import type { AdPlacement, CampaignWithProduct } from '../../types/campaigns';

export interface AdBannerProps {
  /** Ad placement (defaults to home_banner) */
  placement?: AdPlacement;
  /** Rotation interval in ms (default: 10000 = 10 seconds) */
  rotationInterval?: number;
  /** Maximum number of campaigns to fetch */
  maxCampaigns?: number;
  /** Custom CSS class */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * AdBanner - Permanent promotional banner with rotation
 *
 * @example
 * ```tsx
 * <AdBanner />
 * <AdBanner placement="home_banner" rotationInterval={5000} />
 * ```
 */
export function AdBanner({
  placement = 'home_banner',
  rotationInterval = 10000,
  maxCampaigns = 5,
  className,
  style,
}: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const trackedImpressions = useRef<Set<string>>(new Set());

  const {
    campaigns,
    loading,
    recordImpression,
    recordClick,
  } = useCampaigns({ placement, maxCampaigns });

  // Track impression for current campaign
  useEffect(() => {
    if (campaigns.length === 0) return;
    const campaign = campaigns[currentIndex];
    if (!campaign || trackedImpressions.current.has(campaign.id)) return;

    trackedImpressions.current.add(campaign.id);
    recordImpression(campaign);
  }, [currentIndex, campaigns, recordImpression]);

  // Progress bar animation
  useEffect(() => {
    if (campaigns.length <= 1) return;

    setProgress(0);
    const progressInterval = 50;
    const steps = rotationInterval / progressInterval;
    let currentStep = 0;

    const progressTimer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % campaigns.length);
          setProgress(0);
          currentStep = 0;
          setTimeout(() => setIsAnimating(false), 50);
        }, 200);
      }
    }, progressInterval);

    return () => clearInterval(progressTimer);
  }, [campaigns.length, rotationInterval, currentIndex]);

  // Handle click
  const handleClick = useCallback(
    (campaign: CampaignWithProduct) => {
      recordClick(campaign);
      const targetUrl = campaign.customCtaUrl || campaign.product.url;
      window.open(targetUrl, '_blank');
    },
    [recordClick]
  );

  // Go to specific slide
  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setProgress(0);
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  }, [currentIndex]);

  if (loading || campaigns.length === 0) return null;

  const campaign = campaigns[currentIndex];
  if (!campaign) return null;

  const { product } = campaign;
  const displayTitle = campaign.customTitle || product.name;
  const displayTagline = campaign.customTagline || product.tagline;
  const displayCta = campaign.customCta || 'Learn More';
  const displayColor = campaign.customProductColor || product.color || '#3B82F6';
  const displayIcon = campaign.customIcon || product.icon64 || '';
  const displayFeatures = campaign.customFeatures || product.features || [];

  return (
    <Box
      className={className}
      style={{
        background: 'var(--color-background)',
        borderBottom: '1px solid var(--gray-a4)',
        position: 'relative',
        ...style,
      }}
    >
      {/* Colored accent bar */}
      <Box style={{ height: 3, background: displayColor }} />

      {/* Main content wrapper */}
      <Box
        style={{
          background: `linear-gradient(90deg, ${displayColor}08 0%, ${displayColor}12 50%, ${displayColor}08 100%)`,
        }}
      >
        {/* Label */}
        <Flex align="center" justify="center" gap="2" py="2">
          <Sparkles size={12} color={displayColor} />
          <Text
            size="1"
            weight="medium"
            style={{
              color: displayColor,
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Discover Our Products
          </Text>
          <Sparkles size={12} color={displayColor} />
        </Flex>

        {/* Content */}
        <Box px="4" py="3">
          <Flex
            direction={{ initial: 'column', sm: 'row' }}
            align="center"
            justify="between"
            gap={{ initial: '3', sm: '4' }}
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateX(-10px)' : 'translateX(0)',
              transition: 'all 0.2s ease-out',
            }}
          >
            {/* Left: Product Info */}
            <Flex align="center" gap="3" style={{ flex: 1, minWidth: 0 }}>
              {/* Icon */}
              <Box
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: `${displayColor}15`,
                  border: `1.5px solid ${displayColor}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                dangerouslySetInnerHTML={{ __html: displayIcon }}
              />

              {/* Text */}
              <Flex direction="column" gap="0" style={{ minWidth: 0 }}>
                <Flex align="center" gap="2">
                  <Text size="3" weight="bold">
                    {displayTitle}
                  </Text>
                  <Badge
                    size="1"
                    style={{
                      background: `${displayColor}18`,
                      color: displayColor,
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                    }}
                  >
                    {product.type === 'extension' ? 'Extension' : product.type === 'android' ? 'App' : 'Web'}
                  </Badge>
                </Flex>

                <Text
                  size="2"
                  color="gray"
                  style={{
                    marginTop: 4,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {displayTagline}
                </Text>

                {/* Features - Desktop */}
                <Flex gap="4" mt="2" display={{ initial: 'none', md: 'flex' }}>
                  {displayFeatures.slice(0, 3).map((feature, i) => (
                    <Flex key={i} align="center" gap="1">
                      <Check size={12} color={displayColor} strokeWidth={3} />
                      <Text size="2" style={{ color: 'var(--gray-10)' }}>
                        {feature}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Flex>

            {/* Right: CTA Button */}
            <Flex align="center" style={{ flexShrink: 0 }}>
              <Button
                size="2"
                onClick={() => handleClick(campaign)}
                style={{
                  background: displayColor,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '0 20px',
                  height: 38,
                  boxShadow: `0 2px 8px ${displayColor}40`,
                }}
              >
                {displayCta}
                <ExternalLink size={14} style={{ marginLeft: 6 }} />
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Progress dots with progress bar */}
        {campaigns.length > 1 && (
          <Flex justify="center" align="center" gap="2" py="3">
            {campaigns.map((c, i) => (
              <Box
                key={i}
                onClick={() => goToSlide(i)}
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--gray-a4)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Progress fill */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%',
                    background: c.product?.color || displayColor,
                    borderRadius: 2,
                    transition: i === currentIndex ? 'none' : 'width 0.3s ease',
                  }}
                />
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
}

export default AdBanner;
