/**
 * App Shortcuts Service - Shared Features Website
 *
 * Home screen long-press shortcuts for quick actions.
 * Maximum 4 shortcuts supported.
 */

import { Capacitor } from '@capacitor/core';
import { AppShortcuts } from '@capawesome/capacitor-app-shortcuts';
import type { Shortcut, SetOptions } from '@capawesome/capacitor-app-shortcuts';
import { Preferences } from '@capacitor/preferences';

export interface SFShortcut {
  id: string;
  label: string;
  description?: string;
  data: Record<string, unknown>;
  rank: number;
}

const SF_SHORTCUTS_KEY = 'sf_app_shortcuts';

let shortcuts: SFShortcut[] = [];
let clickHandler: ((shortcutId: string, data: Record<string, unknown>) => void) | null = null;
let isInitialized = false;

export function isAppShortcutsAvailable(): boolean {
  return Capacitor.isNativePlatform();
}

export async function initializeAppShortcuts(): Promise<void> {
  if (!isAppShortcutsAvailable() || isInitialized) return;

  await AppShortcuts.addListener('click', async (event) => {
    if (clickHandler) {
      const shortcut = shortcuts.find((s) => s.id === event.shortcutId);
      clickHandler(event.shortcutId, shortcut?.data || {});
    }
  });

  await loadShortcuts();
  await syncShortcuts();
  isInitialized = true;
}

export function setShortcutClickHandler(
  handler: (shortcutId: string, data: Record<string, unknown>) => void
): void {
  clickHandler = handler;
}

export async function addShortcut(shortcut: Omit<SFShortcut, 'rank'>): Promise<boolean> {
  if (!isAppShortcutsAvailable()) return false;
  if (shortcuts.length >= 4) return false;
  if (shortcuts.some((s) => s.id === shortcut.id)) return false;

  shortcuts.push({ ...shortcut, rank: shortcuts.length });
  await saveShortcuts();
  await syncShortcuts();
  return true;
}

export async function updateShortcut(
  id: string,
  updates: Partial<Pick<SFShortcut, 'label' | 'description' | 'data'>>
): Promise<boolean> {
  const current = shortcuts.find((s) => s.id === id);
  if (!current) return false;

  if (updates.label !== undefined) current.label = updates.label;
  if (updates.description !== undefined) current.description = updates.description;
  if (updates.data !== undefined) current.data = updates.data;

  await saveShortcuts();
  await syncShortcuts();
  return true;
}

export async function removeShortcut(id: string): Promise<void> {
  shortcuts = shortcuts.filter((s) => s.id !== id);
  shortcuts.forEach((s, i) => (s.rank = i));
  await saveShortcuts();
  await syncShortcuts();
}

export function getShortcuts(): SFShortcut[] {
  return [...shortcuts];
}

export async function clearShortcuts(): Promise<void> {
  shortcuts = [];
  await saveShortcuts();
  await AppShortcuts.clear();
}

export async function setDefaultShortcuts(): Promise<void> {
  if (!isAppShortcutsAvailable()) return;

  await clearShortcuts();

  const defaultShortcuts: Omit<SFShortcut, 'rank'>[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'View admin dashboard',
      data: { route: '/dashboard' },
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      description: 'Manage campaigns',
      data: { route: '/dashboard/campaigns' },
    },
    {
      id: 'docs',
      label: 'Documentation',
      description: 'Read the docs',
      data: { route: '/docs' },
    },
    {
      id: 'support',
      label: 'Support',
      description: 'Get help',
      data: { route: '/contact' },
    },
  ];

  for (const shortcut of defaultShortcuts) {
    await addShortcut(shortcut);
  }
}

async function loadShortcuts(): Promise<void> {
  const { value } = await Preferences.get({ key: SF_SHORTCUTS_KEY });
  if (value) {
    shortcuts = JSON.parse(value);
  }
}

async function saveShortcuts(): Promise<void> {
  await Preferences.set({
    key: SF_SHORTCUTS_KEY,
    value: JSON.stringify(shortcuts),
  });
}

async function syncShortcuts(): Promise<void> {
  if (!isAppShortcutsAvailable()) return;

  const nativeShortcuts: Shortcut[] = shortcuts.map((s) => ({
    id: s.id,
    title: s.label,
    description: s.description,
  }));

  const options: SetOptions = { shortcuts: nativeShortcuts };
  await AppShortcuts.set(options);
}
