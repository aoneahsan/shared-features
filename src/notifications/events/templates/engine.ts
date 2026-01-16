/**
 * Template Engine
 *
 * Simple template interpolation for notification messages.
 * Supports {{variable}} syntax for dynamic content.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

// ============================================================================
// TYPES
// ============================================================================

export interface TemplateContext {
  [key: string]: string | number | boolean | undefined | null;
}

export interface InterpolateOptions {
  /** Whether to throw on missing variables (default: false) */
  strict?: boolean;
  /** Default value for missing variables (default: '') */
  defaultValue?: string;
  /** Custom formatters for values */
  formatters?: Record<string, (value: unknown) => string>;
}

// ============================================================================
// INTERPOLATION
// ============================================================================

/**
 * Interpolate template variables in a string
 *
 * @example
 * ```ts
 * interpolate('Hello, {{name}}!', { name: 'John' });
 * // => 'Hello, John!'
 *
 * interpolate('You have {{count}} items', { count: 5 });
 * // => 'You have 5 items'
 * ```
 */
export function interpolate(
  template: string,
  context: TemplateContext,
  options: InterpolateOptions = {}
): string {
  const { strict = false, defaultValue = '', formatters = {} } = options;

  // Match {{variable}} or {{variable|formatter}}
  const pattern = /\{\{([^}|]+)(?:\|([^}]+))?\}\}/g;

  return template.replace(pattern, (_match, variableName, formatterName) => {
    const trimmedName = variableName.trim();
    const value = context[trimmedName];

    // Handle missing values
    if (value === undefined || value === null) {
      if (strict) {
        throw new Error(`Missing template variable: ${trimmedName}`);
      }
      return defaultValue;
    }

    // Apply formatter if specified
    if (formatterName) {
      const formatter = formatters[formatterName.trim()];
      if (formatter) {
        return formatter(value);
      }
    }

    // Convert to string
    return String(value);
  });
}

/**
 * Extract all variable names from a template
 *
 * @example
 * ```ts
 * extractVariables('Hello, {{name}}! You have {{count}} items.');
 * // => ['name', 'count']
 * ```
 */
export function extractVariables(template: string): string[] {
  const pattern = /\{\{([^}|]+)(?:\|[^}]+)?\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = pattern.exec(template)) !== null) {
    const matchResult = match[1];
    if (matchResult) {
      const variableName = matchResult.trim();
      if (!variables.includes(variableName)) {
        variables.push(variableName);
      }
    }
  }

  return variables;
}

/**
 * Validate that all required variables are provided
 */
export function validateContext(
  template: string,
  context: TemplateContext
): { valid: boolean; missing: string[] } {
  const required = extractVariables(template);
  const missing = required.filter(
    (v) => context[v] === undefined || context[v] === null
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

// ============================================================================
// BUILT-IN FORMATTERS
// ============================================================================

export const defaultFormatters: Record<string, (value: unknown) => string> = {
  /**
   * Capitalize first letter
   */
  capitalize: (value) => {
    const str = String(value);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert to uppercase
   */
  upper: (value) => String(value).toUpperCase(),

  /**
   * Convert to lowercase
   */
  lower: (value) => String(value).toLowerCase(),

  /**
   * Format number with commas
   */
  number: (value) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return num.toLocaleString();
  },

  /**
   * Format as date
   */
  date: (value) => {
    const date = new Date(value as string | number);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString();
  },

  /**
   * Format as time
   */
  time: (value) => {
    const date = new Date(value as string | number);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleTimeString();
  },

  /**
   * Format as datetime
   */
  datetime: (value) => {
    const date = new Date(value as string | number);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  },

  /**
   * Truncate to 50 characters
   */
  truncate: (value) => {
    const str = String(value);
    return str.length > 50 ? str.substring(0, 47) + '...' : str;
  },

  /**
   * Join array with commas
   */
  list: (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  },
};

/**
 * Interpolate with default formatters
 */
export function interpolateWithFormatters(
  template: string,
  context: TemplateContext,
  options: Omit<InterpolateOptions, 'formatters'> & {
    customFormatters?: Record<string, (value: unknown) => string>;
  } = {}
): string {
  const { customFormatters = {}, ...restOptions } = options;

  return interpolate(template, context, {
    ...restOptions,
    formatters: { ...defaultFormatters, ...customFormatters },
  });
}
