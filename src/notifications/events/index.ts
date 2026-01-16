/**
 * Notification Events Index
 *
 * Exports all event system components.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

// Template Engine
export {
  interpolate,
  interpolateWithFormatters,
  extractVariables,
  validateContext,
  defaultFormatters,
} from './templates/engine';
export type { TemplateContext, InterpolateOptions } from './templates/engine';

// Standard Templates
export {
  ACCOUNT_TEMPLATES,
  REPORT_TEMPLATES,
  PROMOTIONAL_TEMPLATES,
  SYSTEM_TEMPLATES,
  ACTIVITY_TEMPLATES,
  ALL_STANDARD_TEMPLATES,
  getTemplateByEventType,
  getTemplatesByCategory,
  getEnabledTemplates,
} from './templates/standard';

// Event Registry
export {
  STANDARD_EVENTS,
  eventRegistry,
  getEventDefinition,
  getEventsByCategory,
  registerCustomEvent,
  getAllEventTypes,
} from './registry';

// Hook
export {
  useNotificationEvents,
} from './useNotificationEvents';
export type { UseNotificationEventsOptions } from './useNotificationEvents';
