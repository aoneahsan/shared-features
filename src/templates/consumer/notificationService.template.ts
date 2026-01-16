/**
 * Notification Service Template
 *
 * Copy this file to your project and customize:
 * 1. Update the import paths for your Firebase config
 * 2. Update the COLLECTION_PREFIX to match your project
 * 3. Implement any project-specific notification logic
 *
 * @example
 * // Copy to: src/services/notification.service.ts
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import type {
  UserNotification,
  NotificationPreferences,
  CreateUserNotificationInput,
  NotificationCategory,
  DEFAULT_NOTIFICATION_PREFERENCES,
  getNotificationCollections,
} from 'shared-features';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * IMPORTANT: Update this prefix to match your project
 * Examples: 'pp' for pregnancy-pal, 'zt' for ztools, etc.
 */
const COLLECTION_PREFIX = 'your_prefix';

/**
 * Get collection names for this project
 */
const COLLECTIONS = {
  NOTIFICATIONS: `${COLLECTION_PREFIX}_notifications`,
  PREFERENCES: `${COLLECTION_PREFIX}_notification_preferences`,
  PUSH_SUBSCRIPTIONS: `${COLLECTION_PREFIX}_push_subscriptions`,
} as const;

// Import your Firebase db instance
// import { db } from '@/config/firebase';
declare const db: any; // Replace with actual import

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert Firestore document to UserNotification
 */
function docToNotification(
  docId: string,
  data: Record<string, unknown>
): UserNotification {
  return {
    id: docId,
    userId: data.userId as string,
    title: data.title as string,
    message: data.message as string,
    type: data.type as UserNotification['type'],
    category: data.category as UserNotification['category'],
    source: data.source as UserNotification['source'],
    sourceId: data.sourceId as string | undefined,
    eventType: data.eventType as string | undefined,
    isRead: data.isRead as boolean,
    isImportant: data.isImportant as boolean | undefined,
    actionUrl: data.actionUrl as string | undefined,
    actionText: data.actionText as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    readAt: data.readAt
      ? (data.readAt as Timestamp).toDate()
      : undefined,
    expiresAt: data.expiresAt
      ? (data.expiresAt as Timestamp).toDate()
      : undefined,
    metadata: data.metadata as Record<string, unknown> | undefined,
  };
}

/**
 * Convert Firestore document to NotificationPreferences
 */
function docToPreferences(
  data: Record<string, unknown>
): NotificationPreferences {
  return {
    userId: data.userId as string,
    categories: data.categories as NotificationPreferences['categories'],
    quietHours: data.quietHours as NotificationPreferences['quietHours'],
    emailDigest: data.emailDigest as NotificationPreferences['emailDigest'],
    push: data.push as NotificationPreferences['push'],
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

// ============================================================================
// NOTIFICATION CRUD
// ============================================================================

/**
 * Create a new notification for a user
 */
export async function createNotification(
  input: CreateUserNotificationInput
): Promise<string> {
  const notificationData = {
    ...input,
    isRead: false,
    createdAt: serverTimestamp(),
    ...(input.expiresAt && { expiresAt: Timestamp.fromDate(input.expiresAt) }),
  };

  const docRef = await addDoc(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    notificationData
  );

  return docRef.id;
}

/**
 * Get all notifications for a user
 */
export async function getNotifications(
  userId: string,
  options: {
    limit?: number;
    category?: NotificationCategory;
    isRead?: boolean;
  } = {}
): Promise<UserNotification[]> {
  let q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  if (options.category) {
    q = query(q, where('category', '==', options.category));
  }

  if (options.isRead !== undefined) {
    q = query(q, where('isRead', '==', options.isRead));
  }

  if (options.limit) {
    q = query(q, limit(options.limit));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToNotification(d.id, d.data()));
}

/**
 * Get a single notification by ID
 */
export async function getNotificationById(
  notificationId: string
): Promise<UserNotification | null> {
  const docSnap = await getDoc(
    doc(db, COLLECTIONS.NOTIFICATIONS, notificationId)
  );

  if (!docSnap.exists()) return null;
  return docToNotification(docSnap.id, docSnap.data());
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), {
    isRead: true,
    readAt: serverTimestamp(),
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  const unreadQuery = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    where('isRead', '==', false)
  );

  const snapshot = await getDocs(unreadQuery);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  const now = serverTimestamp();

  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, { isRead: true, readAt: now });
  });

  await batch.commit();
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId));
}

/**
 * Clear all notifications for a user
 */
export async function clearAllNotifications(userId: string): Promise<void> {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
}

/**
 * Get unread count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    where('isRead', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

// ============================================================================
// REAL-TIME SUBSCRIPTION
// ============================================================================

/**
 * Subscribe to notifications for a user (real-time)
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: UserNotification[]) => void,
  options: { limit?: number } = {}
): Unsubscribe {
  let q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  if (options.limit) {
    q = query(q, limit(options.limit));
  }

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((d) =>
      docToNotification(d.id, d.data())
    );
    callback(notifications);
  });
}

// ============================================================================
// PREFERENCES
// ============================================================================

/**
 * Get notification preferences for a user
 */
export async function getPreferences(
  userId: string
): Promise<NotificationPreferences | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.PREFERENCES, userId));

  if (!docSnap.exists()) return null;
  return docToPreferences(docSnap.data());
}

/**
 * Create or update notification preferences
 */
export async function setPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  await setDoc(
    doc(db, COLLECTIONS.PREFERENCES, userId),
    {
      ...preferences,
      userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Update category preference
 */
export async function updateCategoryPreference(
  userId: string,
  category: NotificationCategory,
  preference: { inApp?: boolean; push?: boolean; email?: boolean }
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PREFERENCES, userId), {
    [`categories.${category}`]: preference,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================================
// PUSH SUBSCRIPTIONS
// ============================================================================

/**
 * Save push subscription (OneSignal player ID)
 */
export async function savePushSubscription(
  userId: string,
  playerId: string,
  platform: 'web' | 'android' | 'ios'
): Promise<void> {
  await setDoc(
    doc(db, COLLECTIONS.PUSH_SUBSCRIPTIONS, `${userId}_${platform}`),
    {
      userId,
      playerId,
      platform,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Also update preferences
  await updateDoc(doc(db, COLLECTIONS.PREFERENCES, userId), {
    'push.enabled': true,
    'push.playerId': playerId,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Remove push subscription
 */
export async function removePushSubscription(
  userId: string,
  platform: 'web' | 'android' | 'ios'
): Promise<void> {
  await deleteDoc(
    doc(db, COLLECTIONS.PUSH_SUBSCRIPTIONS, `${userId}_${platform}`)
  );

  // Update preferences
  await updateDoc(doc(db, COLLECTIONS.PREFERENCES, userId), {
    'push.enabled': false,
    'push.playerId': null,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Delete expired notifications
 */
export async function cleanupExpiredNotifications(
  userId: string
): Promise<number> {
  const now = Timestamp.now();

  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    where('expiresAt', '<=', now)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return 0;

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
  return snapshot.size;
}

/**
 * Delete all data for a user (for account deletion)
 */
export async function deleteAllUserData(userId: string): Promise<void> {
  // Delete notifications
  await clearAllNotifications(userId);

  // Delete preferences
  await deleteDoc(doc(db, COLLECTIONS.PREFERENCES, userId));

  // Delete push subscriptions
  const platforms: ('web' | 'android' | 'ios')[] = ['web', 'android', 'ios'];
  await Promise.all(
    platforms.map((platform) =>
      deleteDoc(
        doc(db, COLLECTIONS.PUSH_SUBSCRIPTIONS, `${userId}_${platform}`)
      ).catch(() => {}) // Ignore if doesn't exist
    )
  );
}

// ============================================================================
// EXPORT SERVICE OBJECT
// ============================================================================

export const notificationService = {
  // CRUD
  create: createNotification,
  getAll: getNotifications,
  getById: getNotificationById,
  markAsRead,
  markAllAsRead,
  delete: deleteNotification,
  clearAll: clearAllNotifications,
  getUnreadCount,

  // Subscription
  subscribe: subscribeToNotifications,

  // Preferences
  getPreferences,
  setPreferences,
  updateCategoryPreference,

  // Push
  savePushSubscription,
  removePushSubscription,

  // Cleanup
  cleanupExpired: cleanupExpiredNotifications,
  deleteAllUserData,
};

export default notificationService;
