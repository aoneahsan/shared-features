/**
 * 4-platform analytics fan-out for shared-features website.
 *
 * Fans every event to:
 *   - Firebase Analytics (web SDK + @capacitor-firebase/analytics native plugin)
 *   - Microsoft Clarity (npm SDK, web only)
 *   - Amplitude (npm SDK, all platforms via WebView)
 *
 * Sentry is wired separately in lib/errorTracking.ts.
 */

import { logEvent, type Analytics } from 'firebase/analytics';
import Clarity from '@microsoft/clarity';
import * as amplitude from '@amplitude/analytics-browser';
import { Capacitor } from '@capacitor/core';
import { initAnalytics } from '@/lib/firebase';

const logger = {
  warn: (...args: unknown[]) => console.warn(...args),
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) console.debug(...args);
  },
};

let firebaseAnalytics: Analytics | null = null;
let clarityInitialized = false;
let amplitudeInitialized = false;
let nativePluginAttempted = false;
let nativePlugin:
  | typeof import('@capacitor-firebase/analytics').FirebaseAnalytics
  | null = null;

function getEnv(key: string): string | undefined {
  return (import.meta as { env?: Record<string, string | undefined> }).env?.[key];
}

async function ensureNativePlugin(): Promise<void> {
  if (nativePluginAttempted || typeof window === 'undefined') return;
  nativePluginAttempted = true;
  const platform = Capacitor.getPlatform();
  if (platform !== 'android' && platform !== 'ios') return;
  try {
    const mod = await import('@capacitor-firebase/analytics');
    nativePlugin = mod.FirebaseAnalytics;
    await mod.FirebaseAnalytics.setEnabled({ enabled: true });
  } catch (error) {
    logger.warn('[Analytics] Firebase native plugin init failed:', error);
    nativePlugin = null;
  }
}

export async function setupAnalytics(): Promise<void> {
  // Firebase web SDK
  try {
    firebaseAnalytics = await initAnalytics();
  } catch (error) {
    logger.warn('[Analytics] Firebase init failed:', error);
  }

  // Clarity
  const clarityId = getEnv('VITE_CLARITY_PROJECT_ID');
  if (clarityId && !clarityInitialized) {
    try {
      Clarity.init(clarityId);
      clarityInitialized = true;
    } catch (error) {
      logger.warn('[Analytics] Clarity init failed:', error);
    }
  }

  // Amplitude
  const ampKey = getEnv('VITE_AMPLITUDE_API_KEY');
  if (ampKey && !amplitudeInitialized) {
    try {
      void amplitude.init(ampKey, undefined, {
        defaultTracking: { sessions: false, pageViews: false, formInteractions: false, fileDownloads: false },
        autocapture: false,
        flushIntervalMillis: 5000,
        flushQueueSize: 100,
      });
      amplitudeInitialized = true;
    } catch (error) {
      logger.warn('[Analytics] Amplitude init failed:', error);
    }
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>): void {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, eventName, params);
    } catch (error) {
      logger.warn('[Analytics] Firebase event failed:', error);
    }
  }
  if (clarityInitialized) {
    try {
      Clarity.event(eventName);
      if (params) {
        for (const [k, v] of Object.entries(params)) Clarity.setTag(k, String(v));
      }
    } catch (error) {
      logger.warn('[Analytics] Clarity event failed:', error);
    }
  }
  if (amplitudeInitialized) {
    try {
      amplitude.track(eventName, params);
    } catch (error) {
      logger.warn('[Analytics] Amplitude event failed:', error);
    }
  }
  // Native Firebase plugin (Android/iOS)
  void ensureNativePlugin().then(() => {
    if (!nativePlugin) return;
    nativePlugin
      .logEvent({ name: eventName.slice(0, 40), params: (params ?? {}) as Record<string, string | number | boolean> })
      .catch((error: unknown) => logger.warn('[Analytics] Firebase native event failed:', error));
  });
  if (import.meta.env.DEV) {
    logger.debug(`[Analytics] ${eventName}`, params);
  }
}

export function trackPageView(path: string, title: string): void {
  trackEvent('page_view', { page_path: path, page_title: title });
}

export function trackClick(label: string, category?: string): void {
  trackEvent('click', { label, category: category ?? 'general' });
}

export function trackCodeCopy(section: string): void {
  trackEvent('code_copy', { section });
}

export function trackExternalLink(url: string, label: string): void {
  trackEvent('external_link', { url, label });
}
