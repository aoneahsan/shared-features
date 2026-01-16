/**
 * NotificationBell Component Template
 *
 * Copy this file to your project and customize:
 * 1. Update the import paths
 * 2. Connect to your notification store
 * 3. Customize styling as needed
 *
 * @example
 * // Copy to: src/components/notifications/NotificationBell.tsx
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { Box, IconButton } from '@radix-ui/themes';
import { Bell } from 'lucide-react';
import type { NotificationBellProps } from 'shared-features';

// Import your notification store
// import { useNotificationBell } from '@/stores/notificationsStore';

/**
 * NotificationBell - Header bell icon with unread badge
 *
 * @example
 * ```tsx
 * <Header>
 *   <NotificationBell />
 * </Header>
 * ```
 */
export function NotificationBell({
  className,
  size = 20,
  showZeroBadge = false,
  onClick,
}: NotificationBellProps) {
  // Connect to your notification store
  // const { unreadCount, togglePanel } = useNotificationBell();
  const unreadCount = 5; // Placeholder
  const togglePanel = () => console.log('Toggle panel'); // Placeholder

  const handleClick = () => {
    onClick?.();
    togglePanel();
  };

  const displayCount = unreadCount > 99 ? '99+' : unreadCount;
  const showBadge = showZeroBadge || unreadCount > 0;

  return (
    <Box
      className={className}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <IconButton
        variant="ghost"
        size="2"
        onClick={handleClick}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        style={{ position: 'relative' }}
      >
        <Bell size={size} />

        {/* Unread badge */}
        {showBadge && (
          <Box
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              minWidth: 18,
              height: 18,
              padding: '0 4px',
              borderRadius: 9,
              background: 'var(--red-9)',
              color: 'white',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(25%, -25%)',
              boxShadow: '0 0 0 2px var(--color-background)',
              // Pulse animation for new notifications
              animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
            }}
          >
            {displayCount}
          </Box>
        )}
      </IconButton>

      {/* Pulse animation keyframes - add to your global CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: translate(25%, -25%) scale(1);
          }
          50% {
            transform: translate(25%, -25%) scale(1.1);
          }
        }
      `}</style>
    </Box>
  );
}

export default NotificationBell;
