/**
 * NotificationCard Component Template
 *
 * Copy this file to your project and customize:
 * 1. Update the import paths
 * 2. Customize styling as needed
 *
 * @example
 * // Copy to: src/components/notifications/NotificationCard.tsx
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useCallback } from 'react';
import { Box, Flex, Text, IconButton } from '@radix-ui/themes';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Bell,
  Sparkles,
  Megaphone,
  X,
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type {
  UserNotification,
  NotificationCardProps,
  NotificationType,
} from 'shared-features';

// ============================================================================
// ICON MAPPING
// ============================================================================

const TYPE_ICONS: Record<NotificationType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  reminder: Bell,
  milestone: Sparkles,
  announcement: Megaphone,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  info: 'var(--blue-9)',
  success: 'var(--green-9)',
  warning: 'var(--yellow-9)',
  error: 'var(--red-9)',
  reminder: 'var(--orange-9)',
  milestone: 'var(--violet-9)',
  announcement: 'var(--iris-9)',
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * NotificationCard - Individual notification item
 *
 * @example
 * ```tsx
 * <NotificationCard
 *   notification={notification}
 *   onClick={() => markAsRead(notification.id)}
 *   onDelete={() => deleteNotification(notification.id)}
 * />
 * ```
 */
export function NotificationCard({
  notification,
  onClick,
  onDelete,
  showDelete = true,
  showTimestamp = true,
}: NotificationCardProps) {
  const Icon = TYPE_ICONS[notification.type] || Info;
  const iconColor = TYPE_COLORS[notification.type] || 'var(--gray-9)';

  const handleClick = useCallback(() => {
    onClick?.();
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  }, [notification.actionUrl, onClick]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.();
    },
    [onDelete]
  );

  const timestamp = notification.createdAt instanceof Date
    ? notification.createdAt
    : new Date(notification.createdAt as any);

  return (
    <Box
      onClick={handleClick}
      style={{
        padding: 'var(--space-3)',
        background: notification.isRead
          ? 'transparent'
          : 'var(--accent-a2)',
        borderRadius: 'var(--radius-2)',
        cursor: notification.actionUrl ? 'pointer' : 'default',
        transition: 'background 0.2s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--gray-a3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = notification.isRead
          ? 'transparent'
          : 'var(--accent-a2)';
      }}
    >
      <Flex gap="3">
        {/* Icon */}
        <Box
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-2)',
            background: `color-mix(in srgb, ${iconColor} 15%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={18} color={iconColor} />
        </Box>

        {/* Content */}
        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Flex align="center" justify="between" gap="2">
            <Text
              size="2"
              weight={notification.isRead ? 'regular' : 'bold'}
              style={{
                color: 'var(--gray-12)',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {notification.title}
            </Text>

            {/* Delete button */}
            {showDelete && (
              <IconButton
                size="1"
                variant="ghost"
                color="gray"
                onClick={handleDelete}
                style={{ flexShrink: 0, opacity: 0.5 }}
              >
                <X size={14} />
              </IconButton>
            )}
          </Flex>

          <Text
            size="2"
            style={{
              color: 'var(--gray-11)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {notification.message}
          </Text>

          {/* Footer: Timestamp + Action */}
          <Flex align="center" justify="between" gap="2" mt="1">
            {showTimestamp && (
              <Text size="1" color="gray">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </Text>
            )}

            {notification.actionUrl && (
              <Flex
                align="center"
                gap="1"
                style={{ color: 'var(--accent-9)', fontSize: 12 }}
              >
                <Text size="1" weight="medium">
                  {notification.actionText || 'View'}
                </Text>
                <ExternalLink size={10} />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>

      {/* Unread indicator */}
      {!notification.isRead && (
        <Box
          style={{
            position: 'absolute',
            left: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--accent-9)',
          }}
        />
      )}
    </Box>
  );
}

export default NotificationCard;
