/**
 * Centralized Logger for shared-features website.
 *
 * Single switch for console verbosity in BOTH dev and production.
 * App code MUST use this `logger` instead of calling `console.*` directly —
 * the level filter is the only knob for what reaches the console.
 *
 *   Default level: 'warn'  → only warn + error are visible.
 *   Set 'info' or 'debug'  → log / info / debug start firing too.
 *
 * Where the level comes from (first match wins):
 *   1. localStorage['sharedfeatures:logLevel']  (runtime override)
 *   2. import.meta.env.VITE_LOG_LEVEL            (build-time default)
 *   3. 'warn'                                    (fallback)
 *
 * Toggle from devtools without rebuilding:
 *   __setLogLevel('debug' | 'info' | 'warn' | 'error' | 'silent')
 *   __getLogLevel()
 *
 * The logger also patches console.log/info/debug/trace so any stray
 * third-party / legacy callsites also respect the level. console.warn
 * and console.error are never patched.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

const STORAGE_KEY = 'sharedfeatures:logLevel';
const VALID_LEVELS: ReadonlyArray<LogLevel> = ['debug', 'info', 'warn', 'error', 'silent'];

function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === 'string' && (VALID_LEVELS as readonly string[]).includes(value);
}

function readStoredLevel(): LogLevel | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isLogLevel(raw) ? raw : null;
  } catch {
    return null;
  }
}

function readEnvLevel(): LogLevel | null {
  const raw = import.meta.env.VITE_LOG_LEVEL;
  return isLogLevel(raw) ? raw : null;
}

function resolveInitialLevel(): LogLevel {
  if (import.meta.env.MODE === 'test') return 'silent';
  return readStoredLevel() ?? readEnvLevel() ?? 'warn';
}

const NATIVE = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
  trace: console.trace.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  table: console.table.bind(console),
  time: console.time.bind(console),
  timeEnd: console.timeEnd.bind(console),
  group: console.group.bind(console),
  groupCollapsed: console.groupCollapsed.bind(console),
  groupEnd: console.groupEnd.bind(console),
};

type PatchedConsoleMethod = 'log' | 'info' | 'debug' | 'trace';

const NOOP = () => {};

const METHOD_MIN_LEVEL: Record<PatchedConsoleMethod, LogLevel> = {
  log: 'info',
  info: 'info',
  debug: 'debug',
  trace: 'debug',
};

function applyConsolePatch(level: LogLevel): void {
  const numeric = LEVEL_ORDER[level];
  (Object.keys(METHOD_MIN_LEVEL) as PatchedConsoleMethod[]).forEach((method) => {
    const required = LEVEL_ORDER[METHOD_MIN_LEVEL[method]];
    console[method] = numeric <= required ? NATIVE[method] : NOOP;
  });
}

class Logger {
  private level: LogLevel = resolveInitialLevel();
  private isTest = import.meta.env.MODE === 'test';

  constructor() {
    applyConsolePatch(this.level);
  }

  setLevel(level: LogLevel): void {
    if (!isLogLevel(level)) return;
    this.level = level;
    applyConsolePatch(level);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, level);
      }
    } catch {
      // localStorage unavailable — non-fatal.
    }
  }

  getLevel(): LogLevel {
    return this.level;
  }

  private allow(level: Exclude<LogLevel, 'silent'>): boolean {
    if (this.isTest) return false;
    return LEVEL_ORDER[level] >= LEVEL_ORDER[this.level];
  }

  log(...args: unknown[]): void {
    if (this.allow('info')) NATIVE.log(...args);
  }

  info(...args: unknown[]): void {
    if (this.allow('info')) NATIVE.info(...args);
  }

  debug(...args: unknown[]): void {
    if (this.allow('debug')) NATIVE.debug(...args);
  }

  trace(...args: unknown[]): void {
    if (this.allow('debug')) NATIVE.trace(...args);
  }

  warn(...args: unknown[]): void {
    if (this.allow('warn')) NATIVE.warn(...args);
  }

  error(...args: unknown[]): void {
    if (this.allow('error')) NATIVE.error(...args);
  }

  table(data: unknown, columns?: string[]): void {
    if (this.allow('info')) NATIVE.table(data, columns);
  }

  time(label?: string): void {
    if (this.allow('debug')) NATIVE.time(label);
  }

  timeEnd(label?: string): void {
    if (this.allow('debug')) NATIVE.timeEnd(label);
  }

  group(...args: unknown[]): void {
    if (this.allow('info')) NATIVE.group(...args);
  }

  groupCollapsed(...args: unknown[]): void {
    if (this.allow('info')) NATIVE.groupCollapsed(...args);
  }

  groupEnd(): void {
    if (this.allow('info')) NATIVE.groupEnd();
  }

  assert(condition: unknown, ...args: unknown[]): void {
    if (!condition) this.error('Assertion failed:', ...args);
  }
}

export const logger = new Logger();

declare global {
  interface Window {
    __setLogLevel?: (level: LogLevel) => void;
    __getLogLevel?: () => LogLevel;
  }
}

if (typeof window !== 'undefined') {
  window.__setLogLevel = (level: LogLevel) => logger.setLevel(level);
  window.__getLogLevel = () => logger.getLevel();
}
