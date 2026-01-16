/**
 * PushPermissionPrompt Component Template
 *
 * A modal that explains push notification benefits and requests permission.
 * Should be shown after a "value moment" in the app, not immediately.
 *
 * Copy this file to your project and customize:
 * 1. Update import paths
 * 2. Customize the benefits list for your app
 * 3. Connect to your OneSignal hook
 *
 * @example
 * // Copy to: src/components/notifications/PushPermissionPrompt.tsx
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useState, useCallback } from 'react';
import { Box, Flex, Text, Heading, Button, Dialog } from '@radix-ui/themes';
import { Bell, Zap, Shield, Sparkles, X } from 'lucide-react';

// Import your OneSignal hook
// import { useOneSignal } from '@/hooks/useOneSignal';

// ============================================================================
// TYPES
// ============================================================================

export interface PushPermissionPromptProps {
  /** Whether the prompt is open */
  isOpen: boolean;
  /** Called when prompt is closed */
  onClose: () => void;
  /** Called when user accepts */
  onAccept?: () => void;
  /** Called when user declines */
  onDecline?: () => void;
  /** App name for display */
  appName?: string;
  /** Custom benefits list */
  benefits?: Array<{
    icon: typeof Bell;
    title: string;
    description: string;
  }>;
}

// ============================================================================
// DEFAULT BENEFITS
// ============================================================================

const DEFAULT_BENEFITS = [
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get notified instantly about important changes',
  },
  {
    icon: Sparkles,
    title: 'Tips & Features',
    description: 'Discover new features and productivity tips',
  },
  {
    icon: Shield,
    title: 'Security Alerts',
    description: 'Stay informed about account activity',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * PushPermissionPrompt - Request push notification permission
 *
 * @example
 * ```tsx
 * const [showPrompt, setShowPrompt] = useState(false);
 * const { requestPermission, isPermissionGranted } = useOneSignal({...});
 *
 * // Show prompt after user completes first task
 * useEffect(() => {
 *   if (hasCompletedFirstTask && !isPermissionGranted) {
 *     setShowPrompt(true);
 *   }
 * }, [hasCompletedFirstTask, isPermissionGranted]);
 *
 * return (
 *   <PushPermissionPrompt
 *     isOpen={showPrompt}
 *     onClose={() => setShowPrompt(false)}
 *     onAccept={async () => {
 *       await requestPermission();
 *       setShowPrompt(false);
 *     }}
 *   />
 * );
 * ```
 */
export function PushPermissionPrompt({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  appName = 'the app',
  benefits = DEFAULT_BENEFITS,
}: PushPermissionPromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = useCallback(async () => {
    setIsLoading(true);
    try {
      await onAccept?.();
    } finally {
      setIsLoading(false);
      onClose();
    }
  }, [onAccept, onClose]);

  const handleDecline = useCallback(() => {
    onDecline?.();
    onClose();
  }, [onDecline, onClose]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content
        style={{
          maxWidth: 420,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          style={{
            background: 'linear-gradient(135deg, var(--accent-3) 0%, var(--accent-2) 100%)',
            padding: 'var(--space-6)',
            textAlign: 'center',
          }}
        >
          {/* Close button */}
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

          {/* Icon */}
          <Box
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--accent-9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)',
              boxShadow: '0 8px 24px var(--accent-a6)',
            }}
          >
            <Bell size={36} color="white" />
          </Box>

          <Heading size="5" weight="bold" style={{ color: 'var(--gray-12)' }}>
            Stay in the Loop!
          </Heading>

          <Text
            size="2"
            style={{
              color: 'var(--gray-11)',
              marginTop: 'var(--space-2)',
              display: 'block',
            }}
          >
            Enable notifications to get the most out of {appName}
          </Text>
        </Box>

        {/* Benefits */}
        <Box p="4">
          <Flex direction="column" gap="3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Flex key={index} gap="3" align="start">
                  <Box
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-2)',
                      background: 'var(--gray-a3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="var(--accent-9)" />
                  </Box>
                  <Box>
                    <Text size="2" weight="medium">
                      {benefit.title}
                    </Text>
                    <Text size="2" color="gray" style={{ display: 'block' }}>
                      {benefit.description}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Box>

        {/* Actions */}
        <Flex
          direction="column"
          gap="2"
          p="4"
          style={{
            borderTop: '1px solid var(--gray-4)',
            background: 'var(--gray-2)',
          }}
        >
          <Button
            size="3"
            onClick={handleAccept}
            disabled={isLoading}
            style={{
              background: 'var(--accent-9)',
              width: '100%',
            }}
          >
            {isLoading ? 'Enabling...' : 'Enable Notifications'}
          </Button>

          <Button
            size="2"
            variant="ghost"
            color="gray"
            onClick={handleDecline}
            disabled={isLoading}
          >
            Maybe Later
          </Button>
        </Flex>

        {/* Footer note */}
        <Box
          p="3"
          style={{
            background: 'var(--gray-2)',
            borderTop: '1px solid var(--gray-4)',
            textAlign: 'center',
          }}
        >
          <Text size="1" color="gray">
            You can change this anytime in Settings
          </Text>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default PushPermissionPrompt;
