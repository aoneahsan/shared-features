/**
 * Capacitor Services - Shared Features Website
 *
 * Central export for all Capacitor native functionality services.
 */

// Motion Service
export {
  isMotionAvailable,
  requestMotionPermission,
  startAccelerometer,
  stopAccelerometer,
  startGyroscope,
  stopGyroscope,
  onShake,
  offShake,
  cleanupMotion,
} from './motion.service';

// Privacy Screen Service
export {
  isPrivacyScreenAvailable,
  initializePrivacyScreen,
  enablePrivacyScreen,
  disablePrivacyScreen,
  togglePrivacyScreen,
  isPrivacyEnabled,
  getPrivacyScreenStatus,
} from './privacy-screen.service';

// App Shortcuts Service
export {
  isAppShortcutsAvailable,
  initializeAppShortcuts,
  setShortcutClickHandler,
  addShortcut,
  updateShortcut,
  removeShortcut,
  getShortcuts,
  clearShortcuts,
  setDefaultShortcuts,
} from './app-shortcuts.service';

export type { SFShortcut } from './app-shortcuts.service';
