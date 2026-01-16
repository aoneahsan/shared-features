/**
 * NotificationPanel Component Template
 *
 * Copy this file to your project and customize:
 * 1. Update the import paths
 * 2. Connect to your notification store
 * 3. Customize styling as needed
 *
 * @example
 * // Copy to: src/components/notifications/NotificationPanel.tsx
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { Box, Flex, Text, Button, ScrollArea, DropdownMenu, Tabs } from '@radix-ui/themes';
import { Bell, Check, Trash2, MoreHorizontal } from 'lucide-react';
import type { NotificationPanelProps, UserNotification } from 'shared-features';

// Import your components and store
// import { NotificationCard } from './NotificationCard';
// import { useNotificationPanel } from '@/stores/notificationsStore';

// ============================================================================
// PLACEHOLDER NOTIFICATION CARD
// ============================================================================

// Replace this with your actual NotificationCard import
function NotificationCard({
  notification,
  onClick,
  onDelete,
}: {
  notification: UserNotification;
  onClick?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Box
      p="3"
      style={{
        background: notification.isRead ? 'transparent' : 'var(--accent-a2)',
        borderRadius: 'var(--radius-2)',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Text size="2" weight={notification.isRead ? 'regular' : 'bold'}>
        {notification.title}
      </Text>
      <Text size="2" color="gray">
        {notification.message}
      </Text>
    </Box>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function NotificationEmptyState() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="3"
      py="8"
      style={{ textAlign: 'center' }}
    >
      <Box
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--gray-a3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bell size={28} color="var(--gray-8)" />
      </Box>
      <Box>
        <Text size="3" weight="medium" color="gray">
          No notifications yet
        </Text>
        <Text size="2" color="gray" style={{ marginTop: 4 }}>
          We&apos;ll notify you when something important happens
        </Text>
      </Box>
    </Flex>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * NotificationPanel - Dropdown/drawer panel showing notifications
 *
 * @example
 * ```tsx
 * const { isOpen, togglePanel } = useNotificationPanel();
 *
 * <DropdownMenu.Root open={isOpen} onOpenChange={togglePanel}>
 *   <DropdownMenu.Trigger>
 *     <NotificationBell />
 *   </DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <NotificationPanel
 *       isOpen={isOpen}
 *       onClose={togglePanel}
 *     />
 *   </DropdownMenu.Content>
 * </DropdownMenu.Root>
 * ```
 */
export function NotificationPanel({
  isOpen,
  onClose,
  maxHeight = '400px',
  showFilters = true,
  emptyStateComponent,
}: NotificationPanelProps) {
  // Connect to your notification store
  // const {
  //   notifications,
  //   isLoading,
  //   filter,
  //   unreadCount,
  //   setFilter,
  //   markAsRead,
  //   markAllAsRead,
  //   deleteNotification,
  //   clearAll,
  // } = useNotificationPanel();

  // Placeholder data
  const notifications: UserNotification[] = [];
  const isLoading = false;
  const filter: 'all' | 'unread' = 'all';
  const unreadCount = 0;
  const setFilter = (f: 'all' | 'unread') => console.log('Set filter:', f);
  const markAsRead = (id: string) => console.log('Mark as read:', id);
  const markAllAsRead = () => console.log('Mark all as read');
  const deleteNotification = (id: string) => console.log('Delete:', id);
  const clearAll = () => console.log('Clear all');

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  if (!isOpen) return null;

  return (
    <Box
      style={{
        width: 360,
        maxWidth: '100vw',
        background: 'var(--color-background)',
        borderRadius: 'var(--radius-3)',
        boxShadow: 'var(--shadow-5)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Flex
        align="center"
        justify="between"
        p="3"
        style={{ borderBottom: '1px solid var(--gray-4)' }}
      >
        <Flex align="center" gap="2">
          <Text size="3" weight="bold">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Box
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-2)',
                background: 'var(--accent-3)',
                color: 'var(--accent-11)',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {unreadCount} new
            </Box>
          )}
        </Flex>

        {/* Actions menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size="1" color="gray">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size="1">
            <DropdownMenu.Item onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check size={14} />
              Mark all as read
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              color="red"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 size={14} />
              Clear all
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>

      {/* Filter tabs */}
      {showFilters && (
        <Tabs.Root value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
          <Tabs.List size="1" style={{ padding: '0 var(--space-3)' }}>
            <Tabs.Trigger value="all">
              All ({notifications.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="unread">
              Unread ({unreadCount})
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      )}

      {/* Content */}
      <ScrollArea style={{ maxHeight }}>
        <Box p="2">
          {isLoading ? (
            <Flex align="center" justify="center" py="6">
              <Text size="2" color="gray">
                Loading...
              </Text>
            </Flex>
          ) : filteredNotifications.length === 0 ? (
            emptyStateComponent || <NotificationEmptyState />
          ) : (
            <Flex direction="column" gap="1">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </Flex>
          )}
        </Box>
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <Flex
          justify="center"
          p="3"
          style={{ borderTop: '1px solid var(--gray-4)' }}
        >
          <Button
            variant="ghost"
            size="1"
            onClick={() => {
              onClose();
              // Navigate to notifications page
              // router.push('/notifications');
            }}
          >
            View All Notifications
          </Button>
        </Flex>
      )}
    </Box>
  );
}

export default NotificationPanel;
