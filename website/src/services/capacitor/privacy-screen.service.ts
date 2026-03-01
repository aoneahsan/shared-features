/**
 * Privacy Screen Service - Shared Features Website
 *
 * Protects sensitive data from screenshots and app switcher.
 */

import { Capacitor } from '@capacitor/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { Preferences } from '@capacitor/preferences';

const SF_PRIVACY_KEY = 'sf_privacy_screen_enabled';

let isEnabled = false;
let isInitialized = false;

export function isPrivacyScreenAvailable(): boolean {
  return Capacitor.isNativePlatform();
}

export async function initializePrivacyScreen(): Promise<void> {
  if (!isPrivacyScreenAvailable() || isInitialized) return;

  const { value } = await Preferences.get({ key: SF_PRIVACY_KEY });
  isEnabled = value === 'true';

  if (isEnabled) {
    await PrivacyScreen.enable();
  }

  isInitialized = true;
}

export async function enablePrivacyScreen(): Promise<void> {
  if (!isPrivacyScreenAvailable()) return;

  await PrivacyScreen.enable();
  await Preferences.set({ key: SF_PRIVACY_KEY, value: 'true' });
  isEnabled = true;
}

export async function disablePrivacyScreen(): Promise<void> {
  if (!isPrivacyScreenAvailable()) return;

  await PrivacyScreen.disable();
  await Preferences.set({ key: SF_PRIVACY_KEY, value: 'false' });
  isEnabled = false;
}

export async function togglePrivacyScreen(): Promise<boolean> {
  if (isEnabled) {
    await disablePrivacyScreen();
  } else {
    await enablePrivacyScreen();
  }
  return isEnabled;
}

export function isPrivacyEnabled(): boolean {
  return isEnabled;
}

export function getPrivacyScreenStatus(): { enabled: boolean; available: boolean } {
  return {
    enabled: isEnabled,
    available: isPrivacyScreenAvailable(),
  };
}
