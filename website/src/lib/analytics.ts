import { logEvent, type Analytics } from 'firebase/analytics';
import { initAnalytics } from '@/lib/firebase';

let analytics: Analytics | null = null;

export async function setupAnalytics() {
  analytics = await initAnalytics();
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${eventName}`, params);
  }
}

export function trackPageView(path: string, title: string) {
  trackEvent('page_view', { page_path: path, page_title: title });
}

export function trackClick(label: string, category?: string) {
  trackEvent('click', { label, category: category ?? 'general' });
}

export function trackCodeCopy(section: string) {
  trackEvent('code_copy', { section });
}

export function trackExternalLink(url: string, label: string) {
  trackEvent('external_link', { url, label });
}
