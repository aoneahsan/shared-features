/**
 * Motion Service - Shared Features Website
 *
 * Device motion and orientation tracking using accelerometer and gyroscope.
 * Includes shake detection for quick actions.
 */

import { Capacitor } from '@capacitor/core';
import { Motion, type AccelListenerEvent, type OrientationListenerEvent } from '@capacitor/motion';

type AccelCallback = (event: AccelListenerEvent) => void;
type GyroCallback = (event: OrientationListenerEvent) => void;
type ShakeCallback = () => void;

const SHAKE_THRESHOLD = 25;
const SHAKE_TIMEOUT = 1000;

const accelListeners = new Map<string, AccelCallback>();
const gyroListeners = new Map<string, GyroCallback>();
const shakeListeners = new Map<string, ShakeCallback>();
let isListeningAccel = false;
let isListeningGyro = false;
let lastShakeTime = 0;

function detectShake(event: AccelListenerEvent): void {
  const { x, y, z } = event.acceleration || { x: 0, y: 0, z: 0 };
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  if (magnitude > SHAKE_THRESHOLD) {
    const now = Date.now();
    if (now - lastShakeTime > SHAKE_TIMEOUT) {
      lastShakeTime = now;
      shakeListeners.forEach((cb) => cb());
    }
  }
}

export function isMotionAvailable(): boolean {
  return Capacitor.isNativePlatform();
}

export async function requestMotionPermission(): Promise<boolean> {
  if (!isMotionAvailable()) return false;

  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> })
      .requestPermission === 'function'
  ) {
    try {
      const permission = await (
        DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }
      ).requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }
  return true;
}

export async function startAccelerometer(id: string, callback: AccelCallback): Promise<void> {
  if (!isMotionAvailable()) return;
  if (!(await requestMotionPermission())) return;

  accelListeners.set(id, callback);

  if (!isListeningAccel) {
    await Motion.addListener('accel', (event) => {
      accelListeners.forEach((cb) => cb(event));
      detectShake(event);
    });
    isListeningAccel = true;
  }
}

export async function stopAccelerometer(id: string): Promise<void> {
  accelListeners.delete(id);
  if (accelListeners.size === 0 && isListeningAccel) {
    await Motion.removeAllListeners();
    isListeningAccel = false;
    isListeningGyro = false;
  }
}

export async function startGyroscope(id: string, callback: GyroCallback): Promise<void> {
  if (!isMotionAvailable()) return;
  if (!(await requestMotionPermission())) return;

  gyroListeners.set(id, callback);

  if (!isListeningGyro) {
    await Motion.addListener('orientation', (event) => {
      gyroListeners.forEach((cb) => cb(event));
    });
    isListeningGyro = true;
  }
}

export async function stopGyroscope(id: string): Promise<void> {
  gyroListeners.delete(id);
  if (gyroListeners.size === 0 && isListeningGyro && accelListeners.size === 0) {
    await Motion.removeAllListeners();
    isListeningGyro = false;
    isListeningAccel = false;
  }
}

export async function onShake(id: string, callback: ShakeCallback): Promise<void> {
  if (!isMotionAvailable()) return;
  shakeListeners.set(id, callback);

  if (!isListeningAccel) {
    await startAccelerometer('__shake__', () => {});
  }
}

export function offShake(id: string): void {
  shakeListeners.delete(id);
  if (shakeListeners.size === 0 && accelListeners.has('__shake__')) {
    stopAccelerometer('__shake__');
  }
}

export async function cleanupMotion(): Promise<void> {
  accelListeners.clear();
  gyroListeners.clear();
  shakeListeners.clear();
  await Motion.removeAllListeners();
  isListeningAccel = false;
  isListeningGyro = false;
}
