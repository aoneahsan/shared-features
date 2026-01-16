/**
 * AnnouncementModal Component
 *
 * A modal dialog for displaying important broadcast announcements.
 * Supports rich content with action buttons and dismissal.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useRef, useCallback } from 'react';
import { Box, Flex, Text, Heading, Button, Dialog } from '@radix-ui/themes';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  ExternalLink,
  Megaphone,
  Bell,
  Sparkles,
} from 'lucide-react';
import { isInitialized } from '../../firebase/config';
import type {
  AnnouncementModalProps,
  NotificationType,
} from '../../types/notifications';

// ============================================================================
// TYPE STYLING
// ============================================================================

const TYPE_CONFIG: Record<
  NotificationType,
  {
    icon: typeof Info;
    gradient: string;
    accentColor: string;
    iconBg: string;
  }
> = {
  info: {
    icon: Info,
    gradient: 'linear-gradient(135deg, var(--blue-3) 0%, var(--blue-2) 100%)',
    accentColor: 'var(--blue-9)',
    iconBg: 'var(--blue-4)',
  },
  success: {
    icon: CheckCircle,
    gradient: 'linear-gradient(135deg, var(--green-3) 0%, var(--green-2) 100%)',
    accentColor: 'var(--green-9)',
    iconBg: 'var(--green-4)',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'linear-gradient(135deg, var(--yellow-3) 0%, var(--yellow-2) 100%)',
    accentColor: 'var(--yellow-9)',
    iconBg: 'var(--yellow-4)',
  },
  error: {
    icon: AlertCircle,
    gradient: 'linear-gradient(135deg, var(--red-3) 0%, var(--red-2) 100%)',
    accentColor: 'var(--red-9)',
    iconBg: 'var(--red-4)',
  },
  reminder: {
    icon: Bell,
    gradient: 'linear-gradient(135deg, var(--orange-3) 0%, var(--orange-2) 100%)',
    accentColor: 'var(--orange-9)',
    iconBg: 'var(--orange-4)',
  },
  milestone: {
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, var(--violet-3) 0%, var(--violet-2) 100%)',
    accentColor: 'var(--violet-9)',
    iconBg: 'var(--violet-4)',
  },
  announcement: {
    icon: Megaphone,
    gradient: 'linear-gradient(135deg, var(--iris-3) 0%, var(--iris-2) 100%)',
    accentColor: 'var(--iris-9)',
    iconBg: 'var(--iris-4)',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * AnnouncementModal - Modal dialog for important announcements
 *
 * @example
 * ```tsx
 * const { broadcast, isOpen, close, handleAction } = useAnnouncementModal();
 *
 * return (
 *   <AnnouncementModal
 *     broadcast={broadcast}
 *     isOpen={isOpen}
 *     onClose={close}
 *     onActionClick={handleAction}
 *   />
 * );
 * ```
 */
export function AnnouncementModal({
  broadcast,
  isOpen,
  onClose,
  onActionClick,
}: AnnouncementModalProps) {
  const impressionTrackedRef = useRef(false);

  // Track impression when modal opens
  useEffect(() => {
    if (isOpen && broadcast && !impressionTrackedRef.current) {
      impressionTrackedRef.current = true;
      // Impression tracking is handled by the hook
    }
  }, [isOpen, broadcast]);

  // Handle action click
  const handleActionClick = useCallback(() => {
    onActionClick?.();
    if (broadcast?.actionUrl) {
      window.open(broadcast.actionUrl, '_blank');
    }
    onClose();
  }, [broadcast, onActionClick, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Don't render if not initialized or no broadcast
  if (!isInitialized() || !broadcast) {
    return null;
  }

  const typeConfig = TYPE_CONFIG[broadcast.type] || TYPE_CONFIG.announcement;
  const Icon = typeConfig.icon;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Content
        style={{
          maxWidth: 480,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Header with gradient background */}
        <Box
          style={{
            background: typeConfig.gradient,
            padding: 'var(--space-6)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          {broadcast.dismissible && (
            <Box
              style={{
                position: 'absolute',
                top: 'var(--space-3)',
                right: 'var(--space-3)',
              }}
            >
              <Dialog.Close>
                <Button variant="ghost" size="1" color="gray">
                  <X size={18} />
                </Button>
              </Dialog.Close>
            </Box>
          )}

          {/* Icon */}
          <Flex direction="column" align="center" gap="4">
            <Box
              style={{
                width: 72,
                height: 72,
                borderRadius: 'var(--radius-4)',
                background: typeConfig.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Icon size={36} color={typeConfig.accentColor} />
            </Box>

            {/* Title */}
            <Heading
              size="5"
              weight="bold"
              align="center"
              style={{ color: 'var(--gray-12)' }}
            >
              {broadcast.title}
            </Heading>
          </Flex>
        </Box>

        {/* Content */}
        <Box p="5">
          <Text
            as="p"
            size="3"
            align="center"
            style={{
              color: 'var(--gray-11)',
              lineHeight: 1.6,
            }}
          >
            {broadcast.message}
          </Text>

          {/* Important badge */}
          {broadcast.isImportant && (
            <Flex justify="center" mt="4">
              <Box
                style={{
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-2)',
                  background: typeConfig.iconBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                }}
              >
                <Sparkles size={12} color={typeConfig.accentColor} />
                <Text size="1" weight="medium" style={{ color: typeConfig.accentColor }}>
                  Important
                </Text>
              </Box>
            </Flex>
          )}
        </Box>

        {/* Actions */}
        <Flex
          gap="3"
          p="4"
          justify="center"
          style={{
            borderTop: '1px solid var(--gray-4)',
            background: 'var(--gray-2)',
          }}
        >
          {broadcast.actionUrl ? (
            <>
              <Dialog.Close>
                <Button variant="soft" color="gray" size="2">
                  Maybe Later
                </Button>
              </Dialog.Close>
              <Button
                size="2"
                onClick={handleActionClick}
                style={{
                  background: typeConfig.accentColor,
                }}
              >
                {broadcast.actionText || 'Learn More'}
                <ExternalLink size={14} />
              </Button>
            </>
          ) : (
            <Dialog.Close>
              <Button
                size="2"
                style={{
                  background: typeConfig.accentColor,
                  minWidth: 120,
                }}
              >
                Got It
              </Button>
            </Dialog.Close>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default AnnouncementModal;
