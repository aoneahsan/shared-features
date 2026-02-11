/**
 * AdCarousel Component
 *
 * A compact carousel slider for displaying ads after hero/title sections.
 * Height: 200px max with content display.
 * Features: progress bar on top, dots navigation, pause on hover.
 * Rotates through campaigns every 20 seconds by default.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Flex, Text, Button, Card, IconButton, Container } from '@radix-ui/themes';
import { ExternalLink, ChevronLeft, ChevronRight, Check, Star, ArrowRight } from 'lucide-react';
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
 * AdCarousel - Compact slider for after hero sections (200px height)
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
  const [isPaused, setIsPaused] = useState(false);
  const trackedImpressions = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

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

  // Progress bar and auto-rotation (pauses on hover)
  useEffect(() => {
    if (campaigns.length <= 1) return;

    const progressInterval = 50;
    const steps = rotationInterval / progressInterval;

    timerRef.current = setInterval(() => {
      if (isPaused) return; // Skip updates when paused

      progressRef.current++;
      setProgress((progressRef.current / steps) * 100);

      if (progressRef.current >= steps) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % campaigns.length);
          setProgress(0);
          progressRef.current = 0;
          setTimeout(() => setIsAnimating(false), 50);
        }, 250);
      }
    }, progressInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [campaigns.length, rotationInterval, isPaused]);

  // Reset progress when slide changes manually
  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);
  }, [currentIndex]);

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
    }, 250);
  }, [campaigns.length, resetTimer]);

  const goToNext = useCallback(() => {
    resetTimer();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 250);
  }, [campaigns.length, resetTimer]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    resetTimer();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 250);
  }, [currentIndex, resetTimer]);

  // Hover handlers for pause functionality
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '16px 0',
        cursor: 'default',
        ...style,
      }}
    >
      <Container size="4">
        <Card
          style={{
            background: `linear-gradient(145deg, var(--color-background) 0%, ${displayColor}08 100%)`,
            border: `1px solid ${displayColor}20`,
            borderRadius: 12,
            overflow: 'hidden',
            height: 200,
            maxHeight: 200,
            position: 'relative',
          }}
        >
          {/* Decorative background element */}
          <Box
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${displayColor}12 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Progress bar at top */}
          <Box style={{ height: 3, background: 'var(--gray-a3)', position: 'relative', zIndex: 2 }}>
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${displayColor} 0%, ${displayColor}cc 100%)`,
                transition: 'width 50ms linear',
                boxShadow: `0 0 10px ${displayColor}50`,
              }}
            />
          </Box>

          {/* Main content */}
          <Box style={{ height: 'calc(100% - 3px)', position: 'relative', zIndex: 1 }}>
            <Flex
              align="center"
              style={{ height: '100%' }}
            >
              {/* Left navigation arrow (desktop) */}
              {campaigns.length > 1 && (
                <Flex
                  align="center"
                  justify="center"
                  style={{ width: 48, flexShrink: 0 }}
                  display={{ initial: 'none', md: 'flex' }}
                >
                  <IconButton
                    size="2"
                    variant="ghost"
                    color="gray"
                    onClick={goToPrev}
                    style={{
                      cursor: 'pointer',
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'var(--gray-a3)',
                    }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} />
                  </IconButton>
                </Flex>
              )}

              {/* Content area - horizontal layout */}
              <Flex
                align="center"
                gap={{ initial: '3', md: '4' }}
                px={{ initial: '3', md: '4' }}
                py="3"
                style={{
                  flex: 1,
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? 'translateX(-16px) scale(0.98)' : 'translateX(0) scale(1)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Icon/Logo - compact */}
                <Box
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    background: `linear-gradient(145deg, ${displayColor}20 0%, ${displayColor}10 100%)`,
                    border: `1.5px solid ${displayColor}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 4px 16px ${displayColor}15`,
                  }}
                  dangerouslySetInnerHTML={{ __html: displayIcon }}
                />

                {/* Text content - compact */}
                <Flex
                  direction="column"
                  gap="1"
                  style={{ flex: 1, minWidth: 0 }}
                >
                  {/* Title with featured badge */}
                  <Flex align="center" gap="2">
                    <Text
                      size={{ initial: '3', md: '4' }}
                      weight="bold"
                      style={{ lineHeight: 1.2 }}
                    >
                      {displayTitle}
                    </Text>
                    <Flex
                      align="center"
                      gap="1"
                      display={{ initial: 'none', sm: 'flex' }}
                      style={{
                        background: `${displayColor}15`,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      <Star size={10} fill={displayColor} color={displayColor} />
                      <Text size="1" weight="medium" style={{ color: displayColor, fontSize: 10 }}>
                        Featured
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Tagline - single line */}
                  <Text
                    size="2"
                    color="gray"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {displayTagline}
                  </Text>

                  {/* Features - horizontal, max 3 on desktop */}
                  {displayFeatures.length > 0 && (
                    <Flex
                      gap="2"
                      display={{ initial: 'none', md: 'flex' }}
                      style={{ marginTop: 4 }}
                    >
                      {displayFeatures.slice(0, 3).map((feature, i) => (
                        <Flex
                          key={i}
                          align="center"
                          gap="1"
                          style={{
                            background: 'var(--gray-a3)',
                            padding: '3px 8px',
                            borderRadius: 4,
                          }}
                        >
                          <Check size={10} color={displayColor} strokeWidth={3} />
                          <Text size="1" style={{ fontSize: 11 }}>
                            {feature}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  )}
                </Flex>

                {/* CTA Button - compact */}
                <Flex direction="column" gap="2" align="center" style={{ flexShrink: 0 }}>
                  <Button
                    size="2"
                    onClick={() => handleClick(campaign)}
                    style={{
                      background: `linear-gradient(135deg, ${displayColor} 0%, ${displayColor}dd 100%)`,
                      color: 'white',
                      fontWeight: 600,
                      padding: '0 16px',
                      height: 36,
                      boxShadow: `0 3px 12px ${displayColor}40`,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {displayCta}
                      <ArrowRight size={14} />
                    </span>
                  </Button>
                  <Button
                    size="1"
                    variant="ghost"
                    onClick={() => handleClick(campaign)}
                    style={{
                      color: displayColor,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontSize: 11,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Details
                      <ExternalLink size={11} />
                    </span>
                  </Button>
                </Flex>
              </Flex>

              {/* Right navigation arrow (desktop) */}
              {campaigns.length > 1 && (
                <Flex
                  align="center"
                  justify="center"
                  style={{ width: 48, flexShrink: 0 }}
                  display={{ initial: 'none', md: 'flex' }}
                >
                  <IconButton
                    size="2"
                    variant="ghost"
                    color="gray"
                    onClick={goToNext}
                    style={{
                      cursor: 'pointer',
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'var(--gray-a3)',
                    }}
                    aria-label="Next"
                  >
                    <ChevronRight size={20} />
                  </IconButton>
                </Flex>
              )}
            </Flex>

            {/* Bottom navigation - dots always visible */}
            {campaigns.length > 1 && (
              <Flex
                justify="center"
                align="center"
                gap="2"
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 0,
                  right: 0,
                }}
              >
                {/* Mobile arrows */}
                <Box display={{ initial: 'block', md: 'none' }}>
                  <IconButton
                    size="1"
                    variant="soft"
                    color="gray"
                    onClick={goToPrev}
                    style={{ cursor: 'pointer' }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={14} />
                  </IconButton>
                </Box>

                {/* Dot indicators */}
                <Flex gap="1">
                  {campaigns.map((c, i) => (
                    <Box
                      key={i}
                      onClick={() => goToSlide(i)}
                      style={{
                        width: i === currentIndex ? 20 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === currentIndex
                          ? `linear-gradient(90deg, ${c.product?.color || displayColor}, ${c.product?.color || displayColor}cc)`
                          : 'var(--gray-a4)',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: i === currentIndex ? `0 2px 6px ${c.product?.color || displayColor}40` : 'none',
                      }}
                    />
                  ))}
                </Flex>

                {/* Mobile arrows */}
                <Box display={{ initial: 'block', md: 'none' }}>
                  <IconButton
                    size="1"
                    variant="soft"
                    color="gray"
                    onClick={goToNext}
                    style={{ cursor: 'pointer' }}
                    aria-label="Next"
                  >
                    <ChevronRight size={14} />
                  </IconButton>
                </Box>
              </Flex>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

export default AdCarousel;
