/**
 * Standard Notification Templates
 *
 * Pre-defined templates for common notification events.
 * These can be customized or overridden by consumer projects.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import type {
  NotificationTemplate,
  StandardEventType,
  NotificationCategory,
} from '../../../types/notifications';

// ============================================================================
// ACCOUNT EVENT TEMPLATES
// ============================================================================

export const ACCOUNT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl_account_created',
    name: 'Account Created',
    eventType: 'ACCOUNT_CREATED',
    category: 'account',
    title: 'Welcome to {{appName}}!',
    message:
      'Hi {{userName}}, your account has been created successfully. Start exploring all the features we have to offer.',
    variables: ['appName', 'userName'],
    type: 'success',
    isImportant: true,
    actionUrl: '/getting-started',
    actionText: 'Get Started',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_account_welcome',
    name: 'Welcome Message',
    eventType: 'ACCOUNT_WELCOME',
    category: 'account',
    title: 'Tips to get started with {{appName}}',
    message:
      'Here are some tips to help you get the most out of {{appName}}. Check out our quick start guide!',
    variables: ['appName'],
    type: 'info',
    isImportant: false,
    actionUrl: '/help/quick-start',
    actionText: 'Quick Start Guide',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_new_device_signin',
    name: 'New Device Sign-in',
    eventType: 'NEW_DEVICE_SIGNIN',
    category: 'account',
    title: 'New Sign-in Detected',
    message:
      'Your account was accessed from a new device: {{deviceName}}{{#location}} in {{location}}{{/location}}. If this wasn\'t you, please secure your account.',
    variables: ['deviceName', 'location'],
    type: 'warning',
    isImportant: true,
    actionUrl: '/settings/security',
    actionText: 'Review Activity',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_password_changed',
    name: 'Password Changed',
    eventType: 'PASSWORD_CHANGED',
    category: 'account',
    title: 'Password Changed Successfully',
    message:
      'Your password was changed on {{timestamp}}. If you didn\'t make this change, please contact support immediately.',
    variables: ['timestamp'],
    type: 'info',
    isImportant: true,
    actionUrl: '/settings/security',
    actionText: 'Security Settings',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_profile_updated',
    name: 'Profile Updated',
    eventType: 'PROFILE_UPDATED',
    category: 'account',
    title: 'Profile Updated',
    message: 'Your profile has been updated: {{changes}}.',
    variables: ['changes'],
    type: 'success',
    isImportant: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// REPORT EVENT TEMPLATES
// ============================================================================

export const REPORT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl_weekly_summary',
    name: 'Weekly Summary',
    eventType: 'WEEKLY_SUMMARY',
    category: 'report',
    title: 'Your Weekly Summary',
    message:
      'Here\'s your activity summary for the week of {{weekStart}}: {{summary}}',
    variables: ['weekStart', 'summary'],
    type: 'info',
    isImportant: false,
    actionUrl: '/reports/weekly',
    actionText: 'View Full Report',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_monthly_summary',
    name: 'Monthly Summary',
    eventType: 'MONTHLY_SUMMARY',
    category: 'report',
    title: 'Your Monthly Summary',
    message:
      'Your activity summary for {{monthName}} is ready. {{summary}}',
    variables: ['monthName', 'summary'],
    type: 'info',
    isImportant: false,
    actionUrl: '/reports/monthly',
    actionText: 'View Full Report',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_quarterly_summary',
    name: 'Quarterly Summary',
    eventType: 'QUARTERLY_SUMMARY',
    category: 'report',
    title: 'Your Quarterly Review',
    message:
      'Your Q{{quarter}} {{year}} summary is ready. See how you\'ve progressed!',
    variables: ['quarter', 'year'],
    type: 'milestone',
    isImportant: true,
    actionUrl: '/reports/quarterly',
    actionText: 'View Report',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_yearly_summary',
    name: 'Yearly Summary',
    eventType: 'YEARLY_SUMMARY',
    category: 'report',
    title: 'Your Year in Review',
    message:
      'Congratulations on another great year! Your {{year}} summary is ready.',
    variables: ['year'],
    type: 'milestone',
    isImportant: true,
    actionUrl: '/reports/yearly',
    actionText: 'View Year in Review',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// PROMOTIONAL EVENT TEMPLATES
// ============================================================================

export const PROMOTIONAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl_app_tip',
    name: 'App Tip',
    eventType: 'APP_TIP',
    category: 'promotional',
    title: 'Tip: {{tipTitle}}',
    message: '{{tipBody}}',
    variables: ['tipTitle', 'tipBody'],
    type: 'info',
    isImportant: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_hidden_feature',
    name: 'Hidden Feature',
    eventType: 'HIDDEN_FEATURE',
    category: 'promotional',
    title: 'Did you know?',
    message: '{{featureDescription}}',
    variables: ['featureName', 'featureDescription'],
    type: 'info',
    isImportant: false,
    actionUrl: '{{featureUrl}}',
    actionText: 'Try it now',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_new_feature',
    name: 'New Feature Announcement',
    eventType: 'NEW_FEATURE_ANNOUNCEMENT',
    category: 'promotional',
    title: 'New Feature: {{featureName}}',
    message: '{{featureDescription}}',
    variables: ['featureName', 'featureDescription'],
    type: 'announcement',
    isImportant: true,
    actionUrl: '{{featureUrl}}',
    actionText: 'Check it out',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_holiday_greeting',
    name: 'Holiday Greeting',
    eventType: 'HOLIDAY_GREETING',
    category: 'promotional',
    title: 'Happy {{holidayName}}!',
    message: '{{greetingMessage}}',
    variables: ['holidayName', 'greetingMessage'],
    type: 'info',
    isImportant: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// SYSTEM EVENT TEMPLATES
// ============================================================================

export const SYSTEM_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl_system_maintenance',
    name: 'System Maintenance',
    eventType: 'SYSTEM_MAINTENANCE',
    category: 'system',
    title: 'Scheduled Maintenance',
    message:
      'We\'ll be performing maintenance on {{date}} from {{startTime}} to {{endTime}} ({{timezone}}). Some features may be unavailable.',
    variables: ['date', 'startTime', 'endTime', 'timezone'],
    type: 'warning',
    isImportant: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_app_update',
    name: 'App Update Available',
    eventType: 'APP_UPDATE_AVAILABLE',
    category: 'system',
    title: 'Update Available',
    message:
      'A new version ({{version}}) is available with improvements and bug fixes.',
    variables: ['version'],
    type: 'info',
    isImportant: false,
    actionUrl: '/update',
    actionText: 'Update Now',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_data_export_ready',
    name: 'Data Export Ready',
    eventType: 'DATA_EXPORT_READY',
    category: 'system',
    title: 'Your Data Export is Ready',
    message:
      'Your requested data export is ready for download. The link will expire in {{expiryHours}} hours.',
    variables: ['expiryHours'],
    type: 'success',
    isImportant: true,
    actionUrl: '{{downloadUrl}}',
    actionText: 'Download',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// ACTIVITY EVENT TEMPLATES
// ============================================================================

export const ACTIVITY_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl_item_created',
    name: 'Item Created',
    eventType: 'ITEM_CREATED',
    category: 'activity',
    title: '{{entityType}} Created',
    message: 'Your {{entityType}} "{{entityName}}" has been created successfully.',
    variables: ['entityType', 'entityName'],
    type: 'success',
    isImportant: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_item_updated',
    name: 'Item Updated',
    eventType: 'ITEM_UPDATED',
    category: 'activity',
    title: '{{entityType}} Updated',
    message: 'Your {{entityType}} "{{entityName}}" has been updated.',
    variables: ['entityType', 'entityName'],
    type: 'info',
    isImportant: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_item_deleted',
    name: 'Item Deleted',
    eventType: 'ITEM_DELETED',
    category: 'activity',
    title: '{{entityType}} Deleted',
    message: 'Your {{entityType}} "{{entityName}}" has been deleted.',
    variables: ['entityType', 'entityName'],
    type: 'info',
    isImportant: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl_bulk_operation',
    name: 'Bulk Operation Complete',
    eventType: 'BULK_OPERATION_COMPLETE',
    category: 'activity',
    title: 'Bulk Operation Complete',
    message:
      'Successfully processed {{successCount}} of {{totalCount}} items. {{#failedCount}}{{failedCount}} items failed.{{/failedCount}}',
    variables: ['successCount', 'totalCount', 'failedCount'],
    type: 'success',
    isImportant: false,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// ALL TEMPLATES
// ============================================================================

export const ALL_STANDARD_TEMPLATES: NotificationTemplate[] = [
  ...ACCOUNT_TEMPLATES,
  ...REPORT_TEMPLATES,
  ...PROMOTIONAL_TEMPLATES,
  ...SYSTEM_TEMPLATES,
  ...ACTIVITY_TEMPLATES,
];

/**
 * Get template by event type
 */
export function getTemplateByEventType(
  eventType: StandardEventType | string
): NotificationTemplate | undefined {
  return ALL_STANDARD_TEMPLATES.find((t) => t.eventType === eventType);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: NotificationCategory
): NotificationTemplate[] {
  return ALL_STANDARD_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Get all enabled templates
 */
export function getEnabledTemplates(): NotificationTemplate[] {
  return ALL_STANDARD_TEMPLATES.filter((t) => t.enabled);
}
