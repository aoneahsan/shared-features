/**
 * AdCarousel Component
 *
 * A premium carousel slider for displaying ads after hero/title sections.
 * Height: 350px with rich content display.
 * Rotates through campaigns every 20 seconds by default.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Flex, Text, Button, Badge, Card, IconButton, Container } from '@radix-ui/themes';
import { ExternalLink, ChevronLeft, ChevronRight, Check, Star, Zap, ArrowRight } from 'lucide-react';
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
 * AdCarousel - Premium slider for after hero sections (350px height)
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
        }, 250);
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
  const displayDescription = product.description || displayTagline;

  const getProductTypeLabel = () => {
    switch (product.type) {
      case 'extension': return 'Browser Extension';
      case 'android': return 'Android App';
      case 'ios': return 'iOS App';
      case 'web': return 'Web App';
      default: return 'App';
    }
  };

  return (
    <Box
      className={className}
      style={{
        padding: '24px 0',
        ...style,
      }}
    >
      <Container size="4">
        <Card
          style={{
            background: `linear-gradient(145deg, var(--color-background) 0%, ${displayColor}08 100%)`,
            border: `1px solid ${displayColor}20`,
            borderRadius: 16,
            overflow: 'hidden',
            height: 350,
            position: 'relative',
          }}
        >
          {/* Decorative background elements */}
          <Box
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${displayColor}12 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${displayColor}08 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Progress bar at top */}
          {campaigns.length > 1 && (
            <Box style={{ height: 4, background: 'var(--gray-a3)', position: 'relative', zIndex: 2 }}>
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${displayColor} 0%, ${displayColor}cc 100%)`,
                  transition: 'width 50ms linear',
                  boxShadow: `0 0 12px ${displayColor}50`,
                }}
              />
            </Box>
          )}

          {/* Main content */}
          <Box style={{ height: 'calc(100% - 4px)', position: 'relative', zIndex: 1 }}>
            <Flex
              direction={{ initial: 'column', md: 'row' }}
              align="stretch"
              style={{ height: '100%' }}
            >
              {/* Left navigation arrow (desktop) */}
              {campaigns.length > 1 && (
                <Flex
                  align="center"
                  justify="center"
                  style={{ width: 60, flexShrink: 0 }}
                  display={{ initial: 'none', md: 'flex' }}
                >
                  <IconButton
                    size="3"
                    variant="ghost"
                    color="gray"
                    onClick={goToPrev}
                    style={{
                      cursor: 'pointer',
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'var(--gray-a3)',
                    }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={24} />
                  </IconButton>
                </Flex>
              )}

              {/* Content area */}
              <Flex
                direction={{ initial: 'column', md: 'row' }}
                align="center"
                gap={{ initial: '4', md: '6' }}
                p={{ initial: '4', md: '5' }}
                style={{
                  flex: 1,
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? 'translateX(-20px) scale(0.98)' : 'translateX(0) scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Icon/Logo */}
                <Flex
                  direction="column"
                  align="center"
                  gap="3"
                  style={{ flexShrink: 0 }}
                >
                  <Box
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 20,
                      background: `linear-gradient(145deg, ${displayColor}20 0%, ${displayColor}10 100%)`,
                      border: `2px solid ${displayColor}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 32px ${displayColor}20, inset 0 1px 0 ${displayColor}20`,
                    }}
                    dangerouslySetInnerHTML={{ __html: displayIcon }}
                  />
                  {/* Product type badge */}
                  <Badge
                    size="2"
                    style={{
                      background: `${displayColor}15`,
                      color: displayColor,
                      fontWeight: 600,
                      padding: '4px 12px',
                    }}
                  >
                    <Zap size={12} style={{ marginRight: 4 }} />
                    {getProductTypeLabel()}
                  </Badge>
                </Flex>

                {/* Text content */}
                <Flex
                  direction="column"
                  gap="3"
                  style={{ flex: 1, minWidth: 0, textAlign: 'left' }}
                >
                  {/* Title with star */}
                  <Flex align="center" gap="2" wrap="wrap">
                    <Text
                      size={{ initial: '5', md: '6' }}
                      weight="bold"
                      style={{ lineHeight: 1.2 }}
                    >
                      {displayTitle}
                    </Text>
                    <Flex
                      align="center"
                      gap="1"
                      style={{
                        background: `${displayColor}15`,
                        padding: '4px 8px',
                        borderRadius: 6,
                      }}
                    >
                      <Star size={12} fill={displayColor} color={displayColor} />
                      <Text size="1" weight="medium" style={{ color: displayColor }}>
                        Featured
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Tagline */}
                  <Text
                    size={{ initial: '2', md: '3' }}
                    color="gray"
                    style={{
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {displayDescription}
                  </Text>

                  {/* Features grid */}
                  {displayFeatures.length > 0 && (
                    <Flex
                      gap={{ initial: '2', md: '4' }}
                      wrap="wrap"
                      mt="1"
                    >
                      {displayFeatures.slice(0, 4).map((feature, i) => (
                        <Flex
                          key={i}
                          align="center"
                          gap="2"
                          style={{
                            background: 'var(--gray-a3)',
                            padding: '6px 12px',
                            borderRadius: 8,
                          }}
                        >
                          <Box
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 4,
                              background: `${displayColor}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={12} color={displayColor} strokeWidth={3} />
                          </Box>
                          <Text size="1" weight="medium">
                            {feature}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  )}

                  {/* CTA Section */}
                  <Flex
                    gap="3"
                    align="center"
                    mt={{ initial: '2', md: '3' }}
                    wrap="wrap"
                  >
                    <Button
                      size={{ initial: '2', md: '3' }}
                      onClick={() => handleClick(campaign)}
                      style={{
                        background: `linear-gradient(135deg, ${displayColor} 0%, ${displayColor}dd 100%)`,
                        color: 'white',
                        fontWeight: 600,
                        padding: '0 24px',
                        height: 44,
                        boxShadow: `0 4px 16px ${displayColor}40`,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {displayCta}
                        <ArrowRight size={18} />
                      </span>
                    </Button>
                    <Button
                      size={{ initial: '2', md: '3' }}
                      variant="ghost"
                      onClick={() => handleClick(campaign)}
                      style={{
                        color: displayColor,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        View Details
                        <ExternalLink size={14} />
                      </span>
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              {/* Right navigation arrow (desktop) */}
              {campaigns.length > 1 && (
                <Flex
                  align="center"
                  justify="center"
                  style={{ width: 60, flexShrink: 0 }}
                  display={{ initial: 'none', md: 'flex' }}
                >
                  <IconButton
                    size="3"
                    variant="ghost"
                    color="gray"
                    onClick={goToNext}
                    style={{
                      cursor: 'pointer',
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'var(--gray-a3)',
                    }}
                    aria-label="Next"
                  >
                    <ChevronRight size={24} />
                  </IconButton>
                </Flex>
              )}
            </Flex>

            {/* Bottom navigation */}
            {campaigns.length > 1 && (
              <Flex
                justify="center"
                align="center"
                gap="3"
                style={{
                  position: 'absolute',
                  bottom: 16,
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
                    <ChevronLeft size={16} />
                  </IconButton>
                </Box>

                {/* Slide indicators */}
                <Flex gap="2">
                  {campaigns.map((c, i) => (
                    <Box
                      key={i}
                      onClick={() => goToSlide(i)}
                      style={{
                        width: i === currentIndex ? 32 : 10,
                        height: 10,
                        borderRadius: 5,
                        background: i === currentIndex
                          ? `linear-gradient(90deg, ${c.product?.color || displayColor}, ${c.product?.color || displayColor}cc)`
                          : 'var(--gray-a4)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: i === currentIndex ? `0 2px 8px ${c.product?.color || displayColor}40` : 'none',
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
                    <ChevronRight size={16} />
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
