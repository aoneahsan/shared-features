/**
 * TopbarAdBanner Component
 *
 * A compact, 60px max height promotional banner for the very top of the site.
 * Displays ads in a carousel with 20 second rotation.
 * Features: progress bar on top, dots navigation, pause on hover.
 * Dismissible per session with smooth animations.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Flex, Text, Button, IconButton, Container } from '@radix-ui/themes';
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCampaigns } from '../../hooks/useCampaigns';
import type { AdPlacement, CampaignWithProduct } from '../../types/campaigns';

// Storage key for dismissed banners
const DISMISSED_TOPBAR_KEY = 'sf_topbar_dismissed';

export interface TopbarAdBannerProps {
  /** Ad placement (defaults to topbar_banner) */
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
 * TopbarAdBanner - Compact carousel banner for top of site (60px max)
 *
 * @example
 * ```tsx
 * <TopbarAdBanner />
 * <TopbarAdBanner rotationInterval={15000} />
 * ```
 */
export function TopbarAdBanner({
  placement = 'topbar_banner',
  rotationInterval = 20000,
  maxCampaigns = 5,
  className,
  style,
}: TopbarAdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackedImpressions = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  // Check if banner was dismissed this session
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(DISMISSED_TOPBAR_KEY);
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Handle dismiss with animation
  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_TOPBAR_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
  }, []);

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
        }, 200);
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

  if (loading || campaigns.length === 0 || isDismissed) return null;

  const campaign = campaigns[currentIndex];
  if (!campaign) return null;

  const { product } = campaign;
  const displayTitle = campaign.customTitle || product.name;
  const displayTagline = campaign.customTagline || product.tagline;
  const displayCta = campaign.customCta || 'Learn More';
  const displayColor = campaign.customProductColor || product.color || '#3B82F6';
  const displayIcon = campaign.customIcon || product.icon64 || '';

  // Hover handlers for pause functionality
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  return (
    <Box
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: `linear-gradient(135deg, ${displayColor}12 0%, ${displayColor}08 50%, ${displayColor}12 100%)`,
        borderBottom: `1px solid ${displayColor}30`,
        position: 'relative',
        height: 60,
        maxHeight: 60,
        overflow: 'hidden',
        cursor: 'default',
        ...style,
      }}
    >
      {/* Animated gradient background */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${displayColor}15 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Progress bar at top */}
      <Box style={{ height: 3, background: 'var(--gray-a3)', position: 'relative', zIndex: 1 }}>
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${displayColor}, ${displayColor}cc)`,
            transition: 'width 50ms linear',
            boxShadow: `0 0 10px ${displayColor}60`,
          }}
        />
      </Box>

      {/* Main content container */}
      <Container size="4" style={{ height: 'calc(100% - 3px)' }}>
        <Flex
          align="center"
          justify="between"
          gap={{ initial: '2', sm: '3' }}
          style={{
            height: '100%',
            padding: '0 12px',
          }}
        >
          {/* Left: Navigation arrows (desktop) */}
          {campaigns.length > 1 && (
            <Box display={{ initial: 'none', md: 'block' }} style={{ flexShrink: 0 }}>
              <IconButton
                size="1"
                variant="ghost"
                color="gray"
                onClick={goToPrev}
                style={{ cursor: 'pointer' }}
                aria-label="Previous ad"
              >
                <ChevronLeft size={14} />
              </IconButton>
            </Box>
          )}

          {/* Center: Product Info */}
          <Flex
            align="center"
            gap={{ initial: '2', sm: '3' }}
            style={{
              flex: 1,
              minWidth: 0,
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Icon - smaller for 60px height */}
            <Box
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${displayColor}25 0%, ${displayColor}15 100%)`,
                border: `1px solid ${displayColor}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 2px 6px ${displayColor}20`,
              }}
              dangerouslySetInnerHTML={{ __html: displayIcon }}
            />

            {/* Text - single line */}
            <Flex align="center" gap="2" style={{ minWidth: 0, flex: 1 }}>
              <Text size="2" weight="bold" style={{ whiteSpace: 'nowrap' }}>
                {displayTitle}
              </Text>
              <Box display={{ initial: 'none', sm: 'block' }} style={{ minWidth: 0, flex: 1 }}>
                <Text
                  size="1"
                  color="gray"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  {displayTagline}
                </Text>
              </Box>
            </Flex>

            {/* CTA Button - compact */}
            <Button
              size="1"
              onClick={() => handleClick(campaign)}
              style={{
                background: `linear-gradient(135deg, ${displayColor} 0%, ${displayColor}dd 100%)`,
                color: 'white',
                fontWeight: 600,
                fontSize: '12px',
                padding: '0 12px',
                height: 28,
                flexShrink: 0,
                boxShadow: `0 2px 6px ${displayColor}40`,
                border: 'none',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {displayCta}
                <ExternalLink size={11} />
              </span>
            </Button>
          </Flex>

          {/* Right: Dots + Navigation + Dismiss */}
          <Flex gap="1" align="center" style={{ flexShrink: 0 }}>
            {campaigns.length > 1 && (
              <>
                {/* Dot indicators - always visible */}
                <Flex gap="1" mx="1">
                  {campaigns.map((_, i) => (
                    <Box
                      key={i}
                      style={{
                        width: i === currentIndex ? 14 : 6,
                        height: 6,
                        borderRadius: 3,
                        background: i === currentIndex ? displayColor : 'var(--gray-a5)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => {
                        resetTimer();
                        setCurrentIndex(i);
                      }}
                    />
                  ))}
                </Flex>
                <Box display={{ initial: 'none', md: 'block' }}>
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={goToNext}
                    style={{ cursor: 'pointer' }}
                    aria-label="Next ad"
                  >
                    <ChevronRight size={14} />
                  </IconButton>
                </Box>
              </>
            )}
            <IconButton
              size="1"
              variant="soft"
              color="gray"
              onClick={handleDismiss}
              style={{ cursor: 'pointer', marginLeft: 2 }}
              aria-label="Close banner"
            >
              <X size={12} />
            </IconButton>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default TopbarAdBanner;
