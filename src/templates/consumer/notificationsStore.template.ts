/**
 * Notifications Store Template
 *
 * Copy this file to your project and customize:
 * 1. Update the import paths
 * 2. Update the collection prefix (e.g., 'pp' for pregnancy-pal)
 * 3. Customize any project-specific behavior
 *
 * @example
 * // Copy to: src/stores/notificationsStore.ts
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  UserNotification,
  NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from 'shared-features';

// Import your project's Firebase and notification service
// import { notificationService } from '@/services/notification.service';

// ============================================================================
// TYPES
// ============================================================================

type NotificationFilter = 'all' | 'unread';

interface NotificationsState {
  // Data
  notifications: UserNotification[];
  preferences: NotificationPreferences | null;
  unreadCount: number;

  // UI State
  isLoading: boolean;
  isOpen: boolean;
  filter: NotificationFilter;
  error: string | null;

  // Subscription
  unsubscribe: (() => void) | null;
}

interface NotificationsActions {
  // Initialization
  initializeNotifications: (userId: string) => Promise<void>;
  cleanup: () => void;

  // Notifications
  subscribeToNotifications: (userId: string) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;

  // Preferences
  loadPreferences: (userId: string) => Promise<void>;
  updatePreferences: (
    preferences: Partial<NotificationPreferences>
  ) => Promise<void>;

  // UI
  togglePanel: () => void;
  setFilter: (filter: NotificationFilter) => void;
  setError: (error: string | null) => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

// ============================================================================
// STORE
// ============================================================================

export const useNotificationsStore = create<NotificationsStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    notifications: [],
    preferences: null,
    unreadCount: 0,
    isLoading: false,
    isOpen: false,
    filter: 'all',
    error: null,
    unsubscribe: null,

    // Initialize notifications for a user
    initializeNotifications: async (userId: string) => {
      set({ isLoading: true, error: null });

      try {
        // Load preferences first
        await get().loadPreferences(userId);

        // Subscribe to real-time notifications
        get().subscribeToNotifications(userId);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to initialize';
        set({ error: message });
        console.error('[notifications] Initialization error:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    // Cleanup on logout/unmount
    cleanup: () => {
      const { unsubscribe } = get();
      if (unsubscribe) {
        unsubscribe();
      }
      set({
        notifications: [],
        preferences: null,
        unreadCount: 0,
        isOpen: false,
        filter: 'all',
        error: null,
        unsubscribe: null,
      });
    },

    // Subscribe to real-time notification updates
    subscribeToNotifications: (userId: string) => {
      // Clean up existing subscription
      const { unsubscribe: existingUnsub } = get();
      if (existingUnsub) {
        existingUnsub();
      }

      // TODO: Implement with your notification service
      // const unsubscribe = notificationService.subscribe(userId, (notifications) => {
      //   const unreadCount = notifications.filter((n) => !n.isRead).length;
      //   set({ notifications, unreadCount });
      // });
      // set({ unsubscribe });

      // Placeholder - replace with actual subscription
      console.log('[notifications] Would subscribe for user:', userId);
      set({ unsubscribe: () => {} });
    },

    // Mark single notification as read
    markAsRead: async (notificationId: string) => {
      const { notifications } = get();

      // Optimistic update
      set({
        notifications: notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        ),
        unreadCount: Math.max(0, get().unreadCount - 1),
      });

      try {
        // TODO: Implement with your notification service
        // await notificationService.markAsRead(notificationId);
        console.log('[notifications] Would mark as read:', notificationId);
      } catch (error) {
        // Revert on error
        set({ notifications });
        console.error('[notifications] Failed to mark as read:', error);
      }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
      const { notifications } = get();
      const now = new Date();

      // Optimistic update
      set({
        notifications: notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: n.readAt || now,
        })),
        unreadCount: 0,
      });

      try {
        // TODO: Implement with your notification service
        // await notificationService.markAllAsRead(userId);
        console.log('[notifications] Would mark all as read');
      } catch (error) {
        // Revert on error
        set({ notifications });
        console.error('[notifications] Failed to mark all as read:', error);
      }
    },

    // Delete a single notification
    deleteNotification: async (notificationId: string) => {
      const { notifications } = get();
      const notification = notifications.find((n) => n.id === notificationId);

      // Optimistic update
      set({
        notifications: notifications.filter((n) => n.id !== notificationId),
        unreadCount: notification && !notification.isRead
          ? Math.max(0, get().unreadCount - 1)
          : get().unreadCount,
      });

      try {
        // TODO: Implement with your notification service
        // await notificationService.delete(notificationId);
        console.log('[notifications] Would delete:', notificationId);
      } catch (error) {
        // Revert on error
        set({ notifications });
        console.error('[notifications] Failed to delete:', error);
      }
    },

    // Clear all notifications
    clearAll: async () => {
      const { notifications } = get();

      // Optimistic update
      set({ notifications: [], unreadCount: 0 });

      try {
        // TODO: Implement with your notification service
        // await notificationService.clearAll(userId);
        console.log('[notifications] Would clear all');
      } catch (error) {
        // Revert on error
        set({ notifications });
        console.error('[notifications] Failed to clear all:', error);
      }
    },

    // Load user preferences
    loadPreferences: async (userId: string) => {
      try {
        // TODO: Implement with your notification service
        // const preferences = await notificationService.getPreferences(userId);
        // set({ preferences: preferences || DEFAULT_NOTIFICATION_PREFERENCES });
        console.log('[notifications] Would load preferences for:', userId);
        set({ preferences: null }); // Replace with actual preferences
      } catch (error) {
        console.error('[notifications] Failed to load preferences:', error);
      }
    },

    // Update user preferences
    updatePreferences: async (updates: Partial<NotificationPreferences>) => {
      const { preferences } = get();
      if (!preferences) return;

      const updated = { ...preferences, ...updates, updatedAt: new Date() };

      // Optimistic update
      set({ preferences: updated });

      try {
        // TODO: Implement with your notification service
        // await notificationService.updatePreferences(preferences.userId, updates);
        console.log('[notifications] Would update preferences:', updates);
      } catch (error) {
        // Revert on error
        set({ preferences });
        console.error('[notifications] Failed to update preferences:', error);
      }
    },

    // Toggle notification panel
    togglePanel: () => {
      set((state) => ({ isOpen: !state.isOpen }));
    },

    // Set filter
    setFilter: (filter: NotificationFilter) => {
      set({ filter });
    },

    // Set error
    setError: (error: string | null) => {
      set({ error });
    },
  }))
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get filtered notifications based on current filter
 */
export const useFilteredNotifications = () => {
  return useNotificationsStore((state) => {
    if (state.filter === 'unread') {
      return state.notifications.filter((n) => !n.isRead);
    }
    return state.notifications;
  });
};

/**
 * Get notifications by category
 */
export const useNotificationsByCategory = (category: string) => {
  return useNotificationsStore((state) =>
    state.notifications.filter((n) => n.category === category)
  );
};

/**
 * Check if there are any unread notifications
 */
export const useHasUnreadNotifications = () => {
  return useNotificationsStore((state) => state.unreadCount > 0);
};

// ============================================================================
// HOOKS FOR COMPONENTS
// ============================================================================

/**
 * Hook for notification bell component
 */
export function useNotificationBell() {
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const isOpen = useNotificationsStore((state) => state.isOpen);
  const togglePanel = useNotificationsStore((state) => state.togglePanel);

  return { unreadCount, isOpen, togglePanel };
}

/**
 * Hook for notification panel component
 */
export function useNotificationPanel() {
  const notifications = useFilteredNotifications();
  const isOpen = useNotificationsStore((state) => state.isOpen);
  const isLoading = useNotificationsStore((state) => state.isLoading);
  const filter = useNotificationsStore((state) => state.filter);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const togglePanel = useNotificationsStore((state) => state.togglePanel);
  const setFilter = useNotificationsStore((state) => state.setFilter);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationsStore(
    (state) => state.deleteNotification
  );
  const clearAll = useNotificationsStore((state) => state.clearAll);

  return {
    notifications,
    isOpen,
    isLoading,
    filter,
    unreadCount,
    togglePanel,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}
