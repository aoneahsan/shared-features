/**
 * Centralized logger for the shared-features package.
 *
 * Consumers can change verbosity at runtime via:
 *   - localStorage['shared-features:logLevel'] = 'debug' | 'info' | 'warn' | 'error' | 'silent'
 *   - window.__setSharedFeaturesLogLevel('debug')
 *   - logger.setLevel('debug')
 *
 * Default level is `warn` in BOTH dev and production — only warnings and errors
 * are visible by default, so the package never spams the consumer's console.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

const STORAGE_KEY = 'shared-features:logLevel';
const DEFAULT_LEVEL: LogLevel = 'warn';

let currentLevel: LogLevel = DEFAULT_LEVEL;

function readStoredLevel(): LogLevel | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (raw && raw in LEVEL_ORDER) return raw as LogLevel;
  } catch {
    // localStorage may be blocked; fall through.
  }
  return null;
}

const stored = readStoredLevel();
if (stored) currentLevel = stored;

function enabled(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[currentLevel];
}

function setLevel(level: LogLevel): void {
  currentLevel = level;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage?.setItem(STORAGE_KEY, level);
    } catch {
      // localStorage may be blocked.
    }
  }
}

function getLevel(): LogLevel {
  return currentLevel;
}

export const logger = {
  setLevel,
  getLevel,
  debug: (...args: unknown[]): void => {
    if (enabled('debug')) console.debug(...args);
  },
  info: (...args: unknown[]): void => {
    if (enabled('info')) console.info(...args);
  },
  log: (...args: unknown[]): void => {
    if (enabled('info')) console.log(...args);
  },
  trace: (...args: unknown[]): void => {
    if (enabled('debug')) console.trace(...args);
  },
  warn: (...args: unknown[]): void => {
    if (enabled('warn')) console.warn(...args);
  },
  error: (...args: unknown[]): void => {
    if (enabled('error')) console.error(...args);
  },
  table: (data: unknown, columns?: string[]): void => {
    if (enabled('info')) console.table(data, columns);
  },
  time: (label?: string): void => {
    if (enabled('debug')) console.time(label);
  },
  timeEnd: (label?: string): void => {
    if (enabled('debug')) console.timeEnd(label);
  },
  group: (...args: unknown[]): void => {
    if (enabled('info')) console.group(...args);
  },
  groupCollapsed: (...args: unknown[]): void => {
    if (enabled('info')) console.groupCollapsed(...args);
  },
  groupEnd: (): void => {
    if (enabled('info')) console.groupEnd();
  },
};

if (typeof window !== 'undefined') {
  (window as unknown as { __setSharedFeaturesLogLevel?: (l: LogLevel) => void }).__setSharedFeaturesLogLevel = setLevel;
  (window as unknown as { __getSharedFeaturesLogLevel?: () => LogLevel }).__getSharedFeaturesLogLevel = getLevel;
}
