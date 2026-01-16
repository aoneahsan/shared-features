/**
 * Periodic Reports System Template
 *
 * Client-side scheduling for periodic report notifications.
 * Since Firebase Functions are avoided (paid), this uses client-side checking.
 *
 * Copy this file to your project and customize:
 * 1. Update import paths
 * 2. Implement generateWeeklyReport, generateMonthlyReport, etc.
 * 3. Connect to your notification service
 *
 * @example
 * // Copy to: src/services/periodicReports.ts
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

// ============================================================================
// TYPES
// ============================================================================

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ReportConfig {
  /** User ID */
  userId: string;
  /** Enabled report frequencies */
  enabledReports: ReportFrequency[];
  /** Timezone for scheduling */
  timezone: string;
}

export interface ReportData {
  /** Report type */
  type: ReportFrequency;
  /** Report period start */
  periodStart: Date;
  /** Report period end */
  periodEnd: Date;
  /** Summary text for notification */
  summary: string;
  /** Full report URL (if applicable) */
  reportUrl?: string;
  /** Report metrics */
  metrics?: Record<string, number | string>;
}

export interface LastReportDates {
  daily?: Date;
  weekly?: Date;
  monthly?: Date;
  quarterly?: Date;
  yearly?: Date;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'periodic_reports_last_dates';

/**
 * Days of week for weekly reports (0 = Sunday, 1 = Monday)
 */
const WEEKLY_REPORT_DAY = 1; // Monday

/**
 * Day of month for monthly reports
 */
const MONTHLY_REPORT_DAY = 1;

/**
 * Months for quarterly reports (0-indexed)
 */
const QUARTERLY_REPORT_MONTHS = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct

/**
 * Month for yearly reports (0-indexed)
 */
const YEARLY_REPORT_MONTH = 0; // January

// ============================================================================
// STORAGE
// ============================================================================

/**
 * Get last report dates from storage
 */
async function getLastReportDates(userId: string): Promise<LastReportDates> {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    const result = await Preferences.get({ key: `${STORAGE_KEY}_${userId}` });
    if (result.value) {
      const data = JSON.parse(result.value);
      return {
        daily: data.daily ? new Date(data.daily) : undefined,
        weekly: data.weekly ? new Date(data.weekly) : undefined,
        monthly: data.monthly ? new Date(data.monthly) : undefined,
        quarterly: data.quarterly ? new Date(data.quarterly) : undefined,
        yearly: data.yearly ? new Date(data.yearly) : undefined,
      };
    }
  } catch {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          daily: data.daily ? new Date(data.daily) : undefined,
          weekly: data.weekly ? new Date(data.weekly) : undefined,
          monthly: data.monthly ? new Date(data.monthly) : undefined,
          quarterly: data.quarterly ? new Date(data.quarterly) : undefined,
          yearly: data.yearly ? new Date(data.yearly) : undefined,
        };
      }
    } catch {
      // Ignore
    }
  }
  return {};
}

/**
 * Save last report date to storage
 */
async function saveLastReportDate(
  userId: string,
  type: ReportFrequency,
  date: Date
): Promise<void> {
  const existing = await getLastReportDates(userId);
  const updated = {
    ...existing,
    [type]: date.toISOString(),
  };

  const serialized = JSON.stringify(updated);

  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key: `${STORAGE_KEY}_${userId}`, value: serialized });
  } catch {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, serialized);
    } catch {
      // Ignore
    }
  }
}

// ============================================================================
// DATE HELPERS
// ============================================================================

/**
 * Get start of day
 */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of week (Monday)
 */
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of month
 */
function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of quarter
 */
function startOfQuarter(date: Date): Date {
  const d = new Date(date);
  const quarter = Math.floor(d.getMonth() / 3);
  d.setMonth(quarter * 3);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of year
 */
function startOfYear(date: Date): Date {
  const d = new Date(date);
  d.setMonth(0);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// ============================================================================
// REPORT DUE CHECKING
// ============================================================================

/**
 * Check if a report is due
 */
function isReportDue(
  lastReportDate: Date | undefined,
  type: ReportFrequency,
  now: Date
): boolean {
  // If never sent, it's due
  if (!lastReportDate) {
    return true;
  }

  switch (type) {
    case 'daily': {
      // Due if last report was before today
      return !isSameDay(lastReportDate, now);
    }

    case 'weekly': {
      // Due if it's the report day and we haven't sent this week
      const thisWeekStart = startOfWeek(now);
      return (
        now.getDay() === WEEKLY_REPORT_DAY &&
        lastReportDate < thisWeekStart
      );
    }

    case 'monthly': {
      // Due if it's the report day and we haven't sent this month
      const thisMonthStart = startOfMonth(now);
      return (
        now.getDate() === MONTHLY_REPORT_DAY &&
        lastReportDate < thisMonthStart
      );
    }

    case 'quarterly': {
      // Due if it's the first of a quarter month and we haven't sent this quarter
      const thisQuarterStart = startOfQuarter(now);
      return (
        QUARTERLY_REPORT_MONTHS.includes(now.getMonth()) &&
        now.getDate() === 1 &&
        lastReportDate < thisQuarterStart
      );
    }

    case 'yearly': {
      // Due if it's the first of the year and we haven't sent this year
      const thisYearStart = startOfYear(now);
      return (
        now.getMonth() === YEARLY_REPORT_MONTH &&
        now.getDate() === 1 &&
        lastReportDate < thisYearStart
      );
    }

    default:
      return false;
  }
}

/**
 * Get the period for a report type
 */
function getReportPeriod(
  type: ReportFrequency,
  now: Date
): { start: Date; end: Date } {
  switch (type) {
    case 'daily': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: startOfDay(yesterday),
        end: startOfDay(now),
      };
    }

    case 'weekly': {
      const lastWeekStart = startOfWeek(now);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const lastWeekEnd = startOfWeek(now);
      return { start: lastWeekStart, end: lastWeekEnd };
    }

    case 'monthly': {
      const lastMonthEnd = startOfMonth(now);
      const lastMonthStart = new Date(lastMonthEnd);
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      return { start: lastMonthStart, end: lastMonthEnd };
    }

    case 'quarterly': {
      const lastQuarterEnd = startOfQuarter(now);
      const lastQuarterStart = new Date(lastQuarterEnd);
      lastQuarterStart.setMonth(lastQuarterStart.getMonth() - 3);
      return { start: lastQuarterStart, end: lastQuarterEnd };
    }

    case 'yearly': {
      const lastYearEnd = startOfYear(now);
      const lastYearStart = new Date(lastYearEnd);
      lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
      return { start: lastYearStart, end: lastYearEnd };
    }

    default:
      return { start: now, end: now };
  }
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Check for pending reports and generate them
 *
 * Call this on app open and after significant user activity.
 *
 * @example
 * ```ts
 * // In your App component or auth handler
 * useEffect(() => {
 *   if (user) {
 *     checkPendingReports({
 *       userId: user.id,
 *       enabledReports: ['weekly', 'monthly'],
 *       timezone: user.timezone || 'UTC',
 *     });
 *   }
 * }, [user]);
 * ```
 */
export async function checkPendingReports(
  config: ReportConfig,
  handlers: {
    generateReport: (type: ReportFrequency, period: { start: Date; end: Date }) => Promise<ReportData>;
    createNotification: (report: ReportData) => Promise<void>;
  }
): Promise<void> {
  const { userId, enabledReports } = config;
  const now = new Date();

  // Get last report dates
  const lastDates = await getLastReportDates(userId);

  // Check each enabled report type
  for (const reportType of enabledReports) {
    const lastDate = lastDates[reportType];

    if (isReportDue(lastDate, reportType, now)) {
      try {
        // Get report period
        const period = getReportPeriod(reportType, now);

        // Generate report
        const reportData = await handlers.generateReport(reportType, period);

        // Create notification
        await handlers.createNotification(reportData);

        // Save last report date
        await saveLastReportDate(userId, reportType, now);

        console.log(`[periodic-reports] Generated ${reportType} report for user:`, userId);
      } catch (error) {
        console.error(`[periodic-reports] Failed to generate ${reportType} report:`, error);
      }
    }
  }
}

/**
 * Get the next report date for a type
 */
export function getNextReportDate(type: ReportFrequency, now: Date = new Date()): Date {
  const next = new Date(now);

  switch (type) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      break;

    case 'weekly':
      // Next Monday
      const daysUntilMonday = (8 - next.getDay()) % 7 || 7;
      next.setDate(next.getDate() + daysUntilMonday);
      next.setHours(0, 0, 0, 0);
      break;

    case 'monthly':
      // First of next month
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
      next.setHours(0, 0, 0, 0);
      break;

    case 'quarterly':
      // First of next quarter
      const currentQuarter = Math.floor(next.getMonth() / 3);
      const nextQuarter = (currentQuarter + 1) % 4;
      const nextYear = nextQuarter === 0 ? next.getFullYear() + 1 : next.getFullYear();
      next.setFullYear(nextYear);
      next.setMonth(nextQuarter * 3);
      next.setDate(1);
      next.setHours(0, 0, 0, 0);
      break;

    case 'yearly':
      // January 1st of next year
      next.setFullYear(next.getFullYear() + 1);
      next.setMonth(0);
      next.setDate(1);
      next.setHours(0, 0, 0, 0);
      break;
  }

  return next;
}

// ============================================================================
// EXAMPLE REPORT GENERATORS
// ============================================================================

/**
 * Example weekly report generator
 * Implement this based on your app's data model
 */
export async function generateWeeklyReportExample(
  userId: string,
  period: { start: Date; end: Date }
): Promise<ReportData> {
  // TODO: Implement based on your app's data
  // This is just an example structure

  // Example: Fetch user activity for the period
  // const activities = await fetchUserActivities(userId, period.start, period.end);

  const summary = `Your activity for the week of ${period.start.toLocaleDateString()}`;

  return {
    type: 'weekly',
    periodStart: period.start,
    periodEnd: period.end,
    summary,
    reportUrl: '/reports/weekly',
    metrics: {
      // Example metrics - customize for your app
      itemsCreated: 0,
      tasksCompleted: 0,
      activeTime: '0h 0m',
    },
  };
}

/**
 * Example monthly report generator
 */
export async function generateMonthlyReportExample(
  userId: string,
  period: { start: Date; end: Date }
): Promise<ReportData> {
  const monthName = period.start.toLocaleDateString('en-US', { month: 'long' });

  return {
    type: 'monthly',
    periodStart: period.start,
    periodEnd: period.end,
    summary: `Your ${monthName} activity summary is ready`,
    reportUrl: '/reports/monthly',
    metrics: {
      // Customize for your app
    },
  };
}

export default {
  checkPendingReports,
  getNextReportDate,
  getLastReportDates,
  isReportDue,
};
