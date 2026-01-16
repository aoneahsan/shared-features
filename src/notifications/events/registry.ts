/**
 * Event Registry
 *
 * Manages notification event definitions and provides a centralized
 * registry for all standard and custom events.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import type {
  NotificationEventDefinition,
  StandardEventType,
  NotificationCategory,
} from '../../types/notifications';

// ============================================================================
// STANDARD EVENT DEFINITIONS
// ============================================================================

/**
 * Standard event definitions with metadata
 */
export const STANDARD_EVENTS: Record<StandardEventType, NotificationEventDefinition> = {
  // Account Events
  ACCOUNT_CREATED: {
    type: 'ACCOUNT_CREATED',
    name: 'Account Created',
    description: 'Triggered when a new user account is created',
    category: 'account',
    notificationType: 'success',
    priority: 'high',
    variables: ['appName', 'userName', 'email'],
    defaultEnabled: true,
  },
  ACCOUNT_WELCOME: {
    type: 'ACCOUNT_WELCOME',
    name: 'Welcome Message',
    description: 'Sent to new users with getting started tips',
    category: 'account',
    notificationType: 'info',
    priority: 'normal',
    variables: ['appName', 'userName'],
    defaultEnabled: true,
  },
  NEW_DEVICE_SIGNIN: {
    type: 'NEW_DEVICE_SIGNIN',
    name: 'New Device Sign-in',
    description: 'Alerts user when account is accessed from a new device',
    category: 'account',
    notificationType: 'warning',
    priority: 'high',
    variables: ['deviceName', 'location', 'timestamp'],
    defaultEnabled: true,
  },
  PASSWORD_CHANGED: {
    type: 'PASSWORD_CHANGED',
    name: 'Password Changed',
    description: 'Confirms password change to user',
    category: 'account',
    notificationType: 'info',
    priority: 'high',
    variables: ['timestamp'],
    defaultEnabled: true,
  },
  PROFILE_UPDATED: {
    type: 'PROFILE_UPDATED',
    name: 'Profile Updated',
    description: 'Confirms profile changes to user',
    category: 'account',
    notificationType: 'success',
    priority: 'low',
    variables: ['changes'],
    defaultEnabled: true,
  },
  ACCOUNT_DELETED: {
    type: 'ACCOUNT_DELETED',
    name: 'Account Deleted',
    description: 'Confirms account deletion',
    category: 'account',
    notificationType: 'info',
    priority: 'high',
    variables: ['deletionDate'],
    defaultEnabled: true,
  },

  // Report Events
  DAILY_SUMMARY: {
    type: 'DAILY_SUMMARY',
    name: 'Daily Summary',
    description: 'Daily activity summary',
    category: 'report',
    notificationType: 'info',
    priority: 'low',
    variables: ['date', 'summary'],
    defaultEnabled: false,
  },
  WEEKLY_SUMMARY: {
    type: 'WEEKLY_SUMMARY',
    name: 'Weekly Summary',
    description: 'Weekly activity summary',
    category: 'report',
    notificationType: 'info',
    priority: 'normal',
    variables: ['weekStart', 'weekEnd', 'summary'],
    defaultEnabled: true,
  },
  MONTHLY_SUMMARY: {
    type: 'MONTHLY_SUMMARY',
    name: 'Monthly Summary',
    description: 'Monthly activity summary',
    category: 'report',
    notificationType: 'info',
    priority: 'normal',
    variables: ['monthName', 'year', 'summary'],
    defaultEnabled: true,
  },
  QUARTERLY_SUMMARY: {
    type: 'QUARTERLY_SUMMARY',
    name: 'Quarterly Summary',
    description: 'Quarterly activity review',
    category: 'report',
    notificationType: 'milestone',
    priority: 'normal',
    variables: ['quarter', 'year', 'summary'],
    defaultEnabled: true,
  },
  YEARLY_SUMMARY: {
    type: 'YEARLY_SUMMARY',
    name: 'Yearly Summary',
    description: 'Year-in-review summary',
    category: 'report',
    notificationType: 'milestone',
    priority: 'high',
    variables: ['year', 'summary'],
    defaultEnabled: true,
  },

  // Promotional Events
  APP_TIP: {
    type: 'APP_TIP',
    name: 'App Tip',
    description: 'Helpful tips about app features',
    category: 'promotional',
    notificationType: 'info',
    priority: 'low',
    variables: ['tipTitle', 'tipBody', 'tipUrl'],
    defaultEnabled: true,
  },
  HIDDEN_FEATURE: {
    type: 'HIDDEN_FEATURE',
    name: 'Hidden Feature',
    description: 'Reveals lesser-known features to users',
    category: 'promotional',
    notificationType: 'info',
    priority: 'low',
    variables: ['featureName', 'featureDescription', 'featureUrl'],
    defaultEnabled: true,
  },
  NEW_FEATURE_ANNOUNCEMENT: {
    type: 'NEW_FEATURE_ANNOUNCEMENT',
    name: 'New Feature Announcement',
    description: 'Announces new features to users',
    category: 'promotional',
    notificationType: 'announcement',
    priority: 'high',
    variables: ['featureName', 'featureDescription', 'featureUrl'],
    defaultEnabled: true,
  },
  HOLIDAY_GREETING: {
    type: 'HOLIDAY_GREETING',
    name: 'Holiday Greeting',
    description: 'Seasonal and holiday greetings',
    category: 'promotional',
    notificationType: 'info',
    priority: 'low',
    variables: ['holidayName', 'greetingMessage'],
    defaultEnabled: true,
  },

  // System Events
  SYSTEM_MAINTENANCE: {
    type: 'SYSTEM_MAINTENANCE',
    name: 'System Maintenance',
    description: 'Scheduled maintenance notifications',
    category: 'system',
    notificationType: 'warning',
    priority: 'high',
    variables: ['date', 'startTime', 'endTime', 'timezone', 'description'],
    defaultEnabled: true,
  },
  APP_UPDATE_AVAILABLE: {
    type: 'APP_UPDATE_AVAILABLE',
    name: 'App Update Available',
    description: 'New version available notification',
    category: 'system',
    notificationType: 'info',
    priority: 'normal',
    variables: ['version', 'releaseNotes'],
    defaultEnabled: true,
  },
  DATA_EXPORT_READY: {
    type: 'DATA_EXPORT_READY',
    name: 'Data Export Ready',
    description: 'User data export is ready for download',
    category: 'system',
    notificationType: 'success',
    priority: 'high',
    variables: ['downloadUrl', 'expiryHours'],
    defaultEnabled: true,
  },

  // Activity Events
  ITEM_CREATED: {
    type: 'ITEM_CREATED',
    name: 'Item Created',
    description: 'Generic item creation notification',
    category: 'activity',
    notificationType: 'success',
    priority: 'low',
    variables: ['entityType', 'entityName', 'entityId'],
    defaultEnabled: true,
  },
  ITEM_UPDATED: {
    type: 'ITEM_UPDATED',
    name: 'Item Updated',
    description: 'Generic item update notification',
    category: 'activity',
    notificationType: 'info',
    priority: 'low',
    variables: ['entityType', 'entityName', 'entityId', 'changes'],
    defaultEnabled: true,
  },
  ITEM_DELETED: {
    type: 'ITEM_DELETED',
    name: 'Item Deleted',
    description: 'Generic item deletion notification',
    category: 'activity',
    notificationType: 'info',
    priority: 'low',
    variables: ['entityType', 'entityName'],
    defaultEnabled: true,
  },
  BULK_OPERATION_COMPLETE: {
    type: 'BULK_OPERATION_COMPLETE',
    name: 'Bulk Operation Complete',
    description: 'Bulk operation completion notification',
    category: 'activity',
    notificationType: 'success',
    priority: 'normal',
    variables: ['operationType', 'successCount', 'totalCount', 'failedCount'],
    defaultEnabled: true,
  },
};

// ============================================================================
// REGISTRY CLASS
// ============================================================================

/**
 * Event registry for managing notification events
 */
class EventRegistry {
  private events: Map<string, NotificationEventDefinition> = new Map();
  private customEvents: Map<string, NotificationEventDefinition> = new Map();

  constructor() {
    // Register all standard events
    Object.values(STANDARD_EVENTS).forEach((event) => {
      this.events.set(event.type, event);
    });
  }

  /**
   * Register a custom event
   */
  register(event: NotificationEventDefinition): void {
    this.customEvents.set(event.type, event);
    this.events.set(event.type, event);
  }

  /**
   * Unregister a custom event
   */
  unregister(eventType: string): boolean {
    if (this.customEvents.has(eventType)) {
      this.customEvents.delete(eventType);
      this.events.delete(eventType);
      return true;
    }
    return false;
  }

  /**
   * Get event definition by type
   */
  get(eventType: string): NotificationEventDefinition | undefined {
    return this.events.get(eventType);
  }

  /**
   * Check if event type exists
   */
  has(eventType: string): boolean {
    return this.events.has(eventType);
  }

  /**
   * Get all events
   */
  getAll(): NotificationEventDefinition[] {
    return Array.from(this.events.values());
  }

  /**
   * Get events by category
   */
  getByCategory(category: NotificationCategory): NotificationEventDefinition[] {
    return this.getAll().filter((e) => e.category === category);
  }

  /**
   * Get all custom events
   */
  getCustomEvents(): NotificationEventDefinition[] {
    return Array.from(this.customEvents.values());
  }

  /**
   * Get all standard events
   */
  getStandardEvents(): NotificationEventDefinition[] {
    return Object.values(STANDARD_EVENTS);
  }

  /**
   * Check if event type is standard
   */
  isStandardEvent(eventType: string): boolean {
    return eventType in STANDARD_EVENTS;
  }

  /**
   * Reset registry to standard events only
   */
  reset(): void {
    this.customEvents.clear();
    this.events.clear();
    Object.values(STANDARD_EVENTS).forEach((event) => {
      this.events.set(event.type, event);
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Global event registry instance
 */
export const eventRegistry = new EventRegistry();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get event definition
 */
export function getEventDefinition(
  eventType: StandardEventType | string
): NotificationEventDefinition | undefined {
  return eventRegistry.get(eventType);
}

/**
 * Get events by category
 */
export function getEventsByCategory(
  category: NotificationCategory
): NotificationEventDefinition[] {
  return eventRegistry.getByCategory(category);
}

/**
 * Register a custom event
 */
export function registerCustomEvent(
  event: NotificationEventDefinition
): void {
  eventRegistry.register(event);
}

/**
 * Get all event types
 */
export function getAllEventTypes(): string[] {
  return eventRegistry.getAll().map((e) => e.type);
}
