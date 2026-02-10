/**
 * AdCarousel Component
 *
 * A carousel slider for displaying ads after hero/title sections.
 * Rotates through campaigns every 20 seconds by default.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Flex, Text, Button, Badge, Card, IconButton } from '@radix-ui/themes';
import { ExternalLink, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCampaigns } from '../../hooks/useCampaigns';
import type { AdPlacement, CampaignWithProduct } from '../../types/campaigns';

export interface AdCarouselProps {
  /** Ad placement (defaults to home_banner) */
  placement?: AdPlacement;
  /** Rotation interval in ms (default: 20000 = 20 seconds) */
  rotationInterval?: number;
  /** Maximum number of campaigns to fetch */
  maxCampaigns?: number;
  /** Custom CSS class */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * AdCarousel - Slider for after hero sections
 *
 * @example
 * ```tsx
 * <AdCarousel />
 * <AdCarousel placement="home_banner" rotationInterval={15000} />
 * ```
 */
export function AdCarousel({
  placement = 'home_banner',
  rotationInterval = 20000,
  maxCampaigns = 5,
  className,
  style,
}: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const trackedImpressions = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Progress bar and auto-rotation
  useEffect(() => {
    if (campaigns.length <= 1) return;

    setProgress(0);
    const progressInterval = 50;
    const steps = rotationInterval / progressInterval;
    let currentStep = 0;

    timerRef.current = setInterval(() => {
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

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
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

  // Navigate to previous/next
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    resetTimer();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  }, [campaigns.length, resetTimer]);

  const goToNext = useCallback(() => {
    resetTimer();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  }, [campaigns.length, resetTimer]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    resetTimer();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  }, [currentIndex, resetTimer]);

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
    <Box className={className} style={{ padding: '16px 0', ...style }}>
      <Card
        style={{
          background: `linear-gradient(135deg, ${displayColor}08 0%, ${displayColor}15 100%)`,
          border: `1px solid ${displayColor}25`,
          overflow: 'hidden',
        }}
      >
        {/* Progress bar at top */}
        {campaigns.length > 1 && (
          <Box style={{ height: 3, background: 'var(--gray-a3)', position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress}%`,
                background: displayColor,
                transition: 'width 50ms linear',
              }}
            />
          </Box>
        )}

        <Box p={{ initial: '3', sm: '4' }}>
          <Flex
            direction={{ initial: 'column', sm: 'row' }}
            align="center"
            justify="between"
            gap="4"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateX(-10px)' : 'translateX(0)',
              transition: 'all 0.2s ease-out',
            }}
          >
            {/* Left arrow (desktop) */}
            {campaigns.length > 1 && (
              <Box display={{ initial: 'none', sm: 'block' }} style={{ flexShrink: 0 }}>
                <IconButton
                  size="2"
                  variant="ghost"
                  color="gray"
                  onClick={goToPrev}
                  style={{ cursor: 'pointer' }}
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </IconButton>
              </Box>
            )}

            {/* Content */}
            <Flex align="center" gap="4" style={{ flex: 1, minWidth: 0 }}>
              {/* Icon */}
              <Box
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: `${displayColor}18`,
                  border: `2px solid ${displayColor}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                dangerouslySetInnerHTML={{ __html: displayIcon }}
              />

              {/* Text content */}
              <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
                <Flex align="center" gap="2" wrap="wrap">
                  <Text size="4" weight="bold">
                    {displayTitle}
                  </Text>
                  <Badge
                    size="1"
                    style={{
                      background: `${displayColor}20`,
                      color: displayColor,
                      fontWeight: 600,
                    }}
                  >
                    {product.type === 'extension' ? 'Extension' : product.type === 'android' ? 'App' : 'Web'}
                  </Badge>
                </Flex>

                <Text size="2" color="gray" style={{ lineHeight: 1.4 }}>
                  {displayTagline}
                </Text>

                {/* Features (desktop) */}
                <Flex gap="3" mt="1" wrap="wrap" display={{ initial: 'none', md: 'flex' }}>
                  {displayFeatures.slice(0, 3).map((feature, i) => (
                    <Flex key={i} align="center" gap="1">
                      <Check size={14} color={displayColor} strokeWidth={2.5} />
                      <Text size="1" color="gray">
                        {feature}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>

              {/* CTA Button */}
              <Button
                size={{ initial: '2', sm: '3' }}
                onClick={() => handleClick(campaign)}
                style={{
                  background: displayColor,
                  color: 'white',
                  fontWeight: 600,
                  flexShrink: 0,
                  boxShadow: `0 2px 8px ${displayColor}40`,
                }}
              >
                {displayCta}
                <ExternalLink size={16} style={{ marginLeft: 6 }} />
              </Button>
            </Flex>

            {/* Right arrow (desktop) */}
            {campaigns.length > 1 && (
              <Box display={{ initial: 'none', sm: 'block' }} style={{ flexShrink: 0 }}>
                <IconButton
                  size="2"
                  variant="ghost"
                  color="gray"
                  onClick={goToNext}
                  style={{ cursor: 'pointer' }}
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </IconButton>
              </Box>
            )}
          </Flex>

          {/* Dots navigation */}
          {campaigns.length > 1 && (
            <Flex justify="center" gap="2" mt="3">
              {campaigns.map((c, i) => (
                <Box
                  key={i}
                  onClick={() => goToSlide(i)}
                  style={{
                    width: 32,
                    height: 4,
                    borderRadius: 2,
                    background: i === currentIndex ? (c.product?.color || displayColor) : 'var(--gray-a4)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export default AdCarousel;
