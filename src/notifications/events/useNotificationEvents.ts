/**
 * useNotificationEvents Hook
 *
 * React hook for triggering notification events.
 * Used by consumer projects to create notifications from standard events.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useCallback } from 'react';
import { getEventDefinition } from './registry';
import { getTemplateByEventType } from './templates/standard';
import { interpolate } from './templates/engine';
import type {
  NotificationEventPayload,
  CreateUserNotificationInput,
  UseNotificationEventsReturn,
} from '../../types/notifications';

// ============================================================================
// TYPES
// ============================================================================

export interface UseNotificationEventsOptions {
  /** App name for templates */
  appName: string;
  /** User ID for notifications */
  userId?: string;
  /** Callback to create notification in project's Firebase */
  onCreateNotification: (input: CreateUserNotificationInput) => Promise<string>;
  /** Whether to log events (debug mode) */
  debug?: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to trigger notification events
 *
 * @example
 * ```tsx
 * const { trigger, triggerAccountCreated } = useNotificationEvents({
 *   appName: 'My App',
 *   userId: currentUser?.id,
 *   onCreateNotification: notificationService.create,
 * });
 *
 * // On user signup
 * await triggerAccountCreated({ userName: 'John', email: 'john@example.com' });
 *
 * // Generic trigger
 * await trigger({
 *   type: 'ITEM_CREATED',
 *   userId: currentUser.id,
 *   data: { entityType: 'Task', entityName: 'My Task' },
 * });
 * ```
 */
export function useNotificationEvents(
  options: UseNotificationEventsOptions
): UseNotificationEventsReturn {
  const { appName, userId, onCreateNotification, debug = false } = options;

  /**
   * Process an event and create a notification
   */
  const processEvent = useCallback(
    async (payload: NotificationEventPayload): Promise<void> => {
      const { type, userId: payloadUserId, data, titleOverride, messageOverride, actionUrl, actionText, metadata } = payload;

      const targetUserId = payloadUserId || userId;
      if (!targetUserId) {
        if (debug) {
          console.warn('[notification-events] No userId provided for event:', type);
        }
        return;
      }

      // Get event definition
      const eventDef = getEventDefinition(type);
      if (!eventDef) {
        if (debug) {
          console.warn('[notification-events] Unknown event type:', type);
        }
        return;
      }

      // Get template
      const template = getTemplateByEventType(type);

      // Build context for interpolation
      const context = {
        appName,
        ...data,
      };

      // Determine title and message
      let title: string;
      let message: string;

      if (titleOverride) {
        title = titleOverride;
      } else if (template) {
        title = interpolate(template.title, context);
      } else {
        title = eventDef.name;
      }

      if (messageOverride) {
        message = messageOverride;
      } else if (template) {
        message = interpolate(template.message, context);
      } else {
        message = `${eventDef.description}`;
      }

      // Build notification input
      const notificationInput: CreateUserNotificationInput = {
        userId: targetUserId,
        title,
        message,
        type: template?.type || eventDef.notificationType,
        category: eventDef.category,
        source: 'event',
        eventType: type,
        isImportant: template?.isImportant,
        actionUrl: actionUrl || (template?.actionUrl ? interpolate(template.actionUrl, context) : undefined),
        actionText: actionText || template?.actionText,
        metadata: {
          ...metadata,
          eventData: data,
        },
      };

      if (debug) {
        console.log('[notification-events] Creating notification:', notificationInput);
      }

      // Create the notification
      await onCreateNotification(notificationInput);
    },
    [appName, userId, onCreateNotification, debug]
  );

  /**
   * Main trigger function
   */
  const trigger = useCallback(
    async (payload: NotificationEventPayload): Promise<void> => {
      await processEvent(payload);
    },
    [processEvent]
  );

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  const triggerAccountCreated = useCallback(
    async (data: { userName: string; email: string }): Promise<void> => {
      if (!userId) return;
      await trigger({
        type: 'ACCOUNT_CREATED',
        userId,
        data,
      });
    },
    [userId, trigger]
  );

  const triggerNewDeviceSignin = useCallback(
    async (data: { deviceName: string; location?: string }): Promise<void> => {
      if (!userId) return;
      await trigger({
        type: 'NEW_DEVICE_SIGNIN',
        userId,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
      });
    },
    [userId, trigger]
  );

  const triggerPasswordChanged = useCallback(async (): Promise<void> => {
    if (!userId) return;
    await trigger({
      type: 'PASSWORD_CHANGED',
      userId,
      data: {
        timestamp: new Date().toLocaleString(),
      },
    });
  }, [userId, trigger]);

  const triggerProfileUpdated = useCallback(
    async (data: { changes: string[] }): Promise<void> => {
      if (!userId) return;
      await trigger({
        type: 'PROFILE_UPDATED',
        userId,
        data: {
          changes: data.changes.join(', '),
        },
      });
    },
    [userId, trigger]
  );

  const triggerCrudEvent = useCallback(
    async (data: {
      action: 'created' | 'updated' | 'deleted';
      entityType: string;
      entityName: string;
    }): Promise<void> => {
      if (!userId) return;

      const eventTypeMap = {
        created: 'ITEM_CREATED',
        updated: 'ITEM_UPDATED',
        deleted: 'ITEM_DELETED',
      } as const;

      await trigger({
        type: eventTypeMap[data.action],
        userId,
        data: {
          entityType: data.entityType,
          entityName: data.entityName,
        },
      });
    },
    [userId, trigger]
  );

  const triggerAppTip = useCallback(
    async (data: { tipId: string; title: string; body: string }): Promise<void> => {
      if (!userId) return;
      await trigger({
        type: 'APP_TIP',
        userId,
        data: {
          tipTitle: data.title,
          tipBody: data.body,
        },
        metadata: {
          tipId: data.tipId,
        },
      });
    },
    [userId, trigger]
  );

  return {
    trigger,
    triggerAccountCreated,
    triggerNewDeviceSignin,
    triggerPasswordChanged,
    triggerProfileUpdated,
    triggerCrudEvent,
    triggerAppTip,
  };
}

export default useNotificationEvents;
