/**
 * BroadcastBanner Component
 *
 * A sleek, dismissible banner for displaying broadcast notifications.
 * Supports different notification types with appropriate styling.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useRef, useCallback } from 'react';
import { Box, Flex, Text, Button, IconButton } from '@radix-ui/themes';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  ExternalLink,
  Megaphone,
} from 'lucide-react';
import { isInitialized } from '../../firebase/config';
import type {
  BroadcastNotification,
  BroadcastBannerProps,
  NotificationType,
} from '../../types/notifications';

// ============================================================================
// TYPE STYLING
// ============================================================================

const TYPE_STYLES: Record<
  NotificationType,
  {
    icon: typeof Info;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  }
> = {
  info: {
    icon: Info,
    bgColor: 'var(--blue-2)',
    borderColor: 'var(--blue-6)',
    textColor: 'var(--blue-11)',
    iconColor: 'var(--blue-9)',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'var(--green-2)',
    borderColor: 'var(--green-6)',
    textColor: 'var(--green-11)',
    iconColor: 'var(--green-9)',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'var(--yellow-2)',
    borderColor: 'var(--yellow-6)',
    textColor: 'var(--yellow-11)',
    iconColor: 'var(--yellow-9)',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'var(--red-2)',
    borderColor: 'var(--red-6)',
    textColor: 'var(--red-11)',
    iconColor: 'var(--red-9)',
  },
  reminder: {
    icon: AlertTriangle,
    bgColor: 'var(--orange-2)',
    borderColor: 'var(--orange-6)',
    textColor: 'var(--orange-11)',
    iconColor: 'var(--orange-9)',
  },
  milestone: {
    icon: CheckCircle,
    bgColor: 'var(--violet-2)',
    borderColor: 'var(--violet-6)',
    textColor: 'var(--violet-11)',
    iconColor: 'var(--violet-9)',
  },
  announcement: {
    icon: Megaphone,
    bgColor: 'var(--iris-2)',
    borderColor: 'var(--iris-6)',
    textColor: 'var(--iris-11)',
    iconColor: 'var(--iris-9)',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * BroadcastBanner - Dismissible notification banner
 *
 * @example
 * ```tsx
 * const { broadcasts, dismissBroadcast, trackClick } = useBannerBroadcasts();
 *
 * return (
 *   <div>
 *     {broadcasts.map(broadcast => (
 *       <BroadcastBanner
 *         key={broadcast.id}
 *         broadcast={broadcast}
 *         onDismiss={() => dismissBroadcast(broadcast.id)}
 *         onActionClick={() => trackClick(broadcast.id)}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function BroadcastBanner({
  broadcast,
  onActionClick,
  onDismiss,
  className,
}: BroadcastBannerProps) {
  const impressionTrackedRef = useRef(false);

  // Track impression on mount
  useEffect(() => {
    if (!impressionTrackedRef.current) {
      impressionTrackedRef.current = true;
      // Impression tracking is handled by the hook
    }
  }, []);

  // Handle action click
  const handleActionClick = useCallback(() => {
    onActionClick?.();
    if (broadcast.actionUrl) {
      window.open(broadcast.actionUrl, '_blank');
    }
  }, [broadcast.actionUrl, onActionClick]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  // Don't render if not initialized
  if (!isInitialized()) {
    return null;
  }

  const typeStyle = TYPE_STYLES[broadcast.type] || TYPE_STYLES.info;
  const Icon = typeStyle.icon;

  return (
    <Box
      className={className}
      style={{
        background: typeStyle.bgColor,
        borderBottom: `1px solid ${typeStyle.borderColor}`,
        position: 'relative',
      }}
    >
      {/* Accent bar */}
      <Box
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: typeStyle.iconColor,
        }}
      />

      <Flex
        align="center"
        justify="between"
        gap="3"
        py="3"
        px="4"
        style={{ paddingLeft: 20 }}
      >
        {/* Left: Icon + Content */}
        <Flex align="center" gap="3" style={{ flex: 1, minWidth: 0 }}>
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `color-mix(in srgb, ${typeStyle.iconColor} 15%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={typeStyle.iconColor} />
          </Box>

          <Flex direction="column" gap="0" style={{ minWidth: 0 }}>
            <Text
              size="2"
              weight="bold"
              style={{
                color: typeStyle.textColor,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {broadcast.title}
            </Text>
            <Text
              size="2"
              style={{
                color: 'var(--gray-11)',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {broadcast.message}
            </Text>
          </Flex>
        </Flex>

        {/* Right: Action + Dismiss */}
        <Flex align="center" gap="2" style={{ flexShrink: 0 }}>
          {broadcast.actionUrl && (
            <Button
              size="1"
              variant="soft"
              onClick={handleActionClick}
              style={{
                background: `color-mix(in srgb, ${typeStyle.iconColor} 15%, transparent)`,
                color: typeStyle.iconColor,
              }}
            >
              {broadcast.actionText || 'Learn More'}
              <ExternalLink size={12} />
            </Button>
          )}

          {broadcast.dismissible && (
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              onClick={handleDismiss}
              style={{ opacity: 0.7 }}
            >
              <X size={16} />
            </IconButton>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

// ============================================================================
// MULTIPLE BANNERS COMPONENT
// ============================================================================

export interface BroadcastBannersProps {
  /** List of broadcasts to display */
  broadcasts: BroadcastNotification[];
  /** Called when a broadcast is dismissed */
  onDismiss?: (broadcastId: string) => void;
  /** Called when action is clicked */
  onActionClick?: (broadcastId: string) => void;
  /** Maximum number of banners to show */
  maxBanners?: number;
  /** Custom CSS class */
  className?: string;
}

/**
 * BroadcastBanners - Display multiple broadcast banners stacked
 *
 * @example
 * ```tsx
 * const { broadcasts, dismissBroadcast, trackClick } = useBannerBroadcasts();
 *
 * return (
 *   <BroadcastBanners
 *     broadcasts={broadcasts}
 *     onDismiss={dismissBroadcast}
 *     onActionClick={trackClick}
 *     maxBanners={3}
 *   />
 * );
 * ```
 */
export function BroadcastBanners({
  broadcasts,
  onDismiss,
  onActionClick,
  maxBanners = 3,
  className,
}: BroadcastBannersProps) {
  const displayBroadcasts = broadcasts.slice(0, maxBanners);

  if (displayBroadcasts.length === 0) {
    return null;
  }

  return (
    <Box className={className}>
      {displayBroadcasts.map((broadcast) => (
        <BroadcastBanner
          key={broadcast.id}
          broadcast={broadcast}
          onDismiss={() => onDismiss?.(broadcast.id)}
          onActionClick={() => onActionClick?.(broadcast.id)}
        />
      ))}
    </Box>
  );
}

export default BroadcastBanner;
