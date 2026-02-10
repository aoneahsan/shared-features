/**
 * TopbarAdBanner Component
 *
 * A compact, 100px max height promotional banner for the very top of the site.
 * Displays ads in a carousel with 20 second rotation.
 * Dismissible per session.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Flex, Text, Button, IconButton } from '@radix-ui/themes';
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
 * TopbarAdBanner - Compact carousel banner for top of site
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
  const trackedImpressions = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Handle dismiss
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

  // Auto-rotation
  useEffect(() => {
    if (campaigns.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % campaigns.length);
        setTimeout(() => setIsAnimating(false), 50);
      }, 200);
    }, rotationInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [campaigns.length, rotationInterval]);

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
  const goToPrev = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  }, [campaigns.length]);

  const goToNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  }, [campaigns.length]);

  if (loading || campaigns.length === 0 || isDismissed) return null;

  const campaign = campaigns[currentIndex];
  if (!campaign) return null;

  const { product } = campaign;
  const displayTitle = campaign.customTitle || product.name;
  const displayTagline = campaign.customTagline || product.tagline;
  const displayCta = campaign.customCta || 'Learn More';
  const displayColor = campaign.customProductColor || product.color || '#3B82F6';
  const displayIcon = campaign.customIcon || product.icon64 || '';

  return (
    <Box
      className={className}
      style={{
        background: `linear-gradient(90deg, ${displayColor}10 0%, ${displayColor}18 50%, ${displayColor}10 100%)`,
        borderBottom: `2px solid ${displayColor}40`,
        position: 'relative',
        maxHeight: 100,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Accent line at top */}
      <Box style={{ height: 2, background: displayColor }} />

      {/* Main content */}
      <Flex
        align="center"
        justify="between"
        gap="3"
        px={{ initial: '3', sm: '4' }}
        py="2"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(-5px)' : 'translateY(0)',
          transition: 'all 0.2s ease-out',
          minHeight: 50,
          maxHeight: 70,
        }}
      >
        {/* Left: Navigation arrows (desktop) */}
        {campaigns.length > 1 && (
          <Flex gap="1" display={{ initial: 'none', sm: 'flex' }}>
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              onClick={goToPrev}
              style={{ cursor: 'pointer' }}
              aria-label="Previous ad"
            >
              <ChevronLeft size={16} />
            </IconButton>
          </Flex>
        )}

        {/* Center: Product Info */}
        <Flex align="center" gap="3" style={{ flex: 1, minWidth: 0 }}>
          {/* Icon */}
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: `${displayColor}20`,
              border: `1px solid ${displayColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            dangerouslySetInnerHTML={{ __html: displayIcon }}
          />

          {/* Text */}
          <Flex direction="column" gap="0" style={{ minWidth: 0, flex: 1 }}>
            <Text size="2" weight="bold" style={{ lineHeight: 1.2 }}>
              {displayTitle}
            </Text>
            <Text
              size="1"
              color="gray"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {displayTagline}
            </Text>
          </Flex>

          {/* CTA Button */}
          <Button
            size="1"
            onClick={() => handleClick(campaign)}
            style={{
              background: displayColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '12px',
              padding: '0 12px',
              height: 28,
              flexShrink: 0,
            }}
          >
            {displayCta}
            <ExternalLink size={12} style={{ marginLeft: 4 }} />
          </Button>
        </Flex>

        {/* Right: Navigation + Dismiss */}
        <Flex gap="1" align="center">
          {campaigns.length > 1 && (
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              onClick={goToNext}
              style={{ cursor: 'pointer' }}
              aria-label="Next ad"
              display={{ initial: 'none', sm: 'flex' }}
            >
              <ChevronRight size={16} />
            </IconButton>
          )}
          <IconButton
            size="1"
            variant="ghost"
            color="gray"
            onClick={handleDismiss}
            style={{ cursor: 'pointer' }}
            aria-label="Close banner"
          >
            <X size={16} />
          </IconButton>
        </Flex>
      </Flex>

      {/* Progress dots (mobile) */}
      {campaigns.length > 1 && (
        <Flex justify="center" gap="1" pb="1" display={{ initial: 'flex', sm: 'none' }}>
          {campaigns.map((_, i) => (
            <Box
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === currentIndex ? displayColor : 'var(--gray-a5)',
                transition: 'background 0.2s ease',
              }}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
}

export default TopbarAdBanner;
