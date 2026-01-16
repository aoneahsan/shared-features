/**
 * Admin Notifications Service
 *
 * Service for managing broadcasts and templates from the admin panel.
 * Used in aoneahsan.com admin panel to manage cross-project notifications.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getSharedFeaturesDb } from '../firebase/init';
import type {
  BroadcastNotification,
  BroadcastStatus,
  CreateBroadcastInput,
  UpdateBroadcastInput,
  NotificationTemplate,
  CreateTemplateInput,
  BroadcastAnalytics,
  NotificationAnalytics,
} from '../types/notifications';

// ============================================================================
// CONSTANTS
// ============================================================================

const COLLECTION_BROADCASTS = 'zaions_broadcasts';
const COLLECTION_TEMPLATES = 'zaions_notification_templates';
const COLLECTION_BROADCAST_EVENTS = 'zaions_broadcast_events';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert Firestore document to BroadcastNotification
 */
function docToBroadcast(
  docId: string,
  data: Record<string, unknown>
): BroadcastNotification {
  return {
    id: docId,
    title: data.title as string,
    message: data.message as string,
    type: data.type as BroadcastNotification['type'],
    category: data.category as BroadcastNotification['category'],
    isRead: false,
    isImportant: data.isImportant as boolean | undefined,
    actionUrl: data.actionUrl as string | undefined,
    actionText: data.actionText as string | undefined,
    createdAt: data.createdAt as Timestamp,
    metadata: data.metadata as Record<string, unknown> | undefined,
    targetProjects: (data.targetProjects as string[]) || [],
    targetPlatforms: (data.targetPlatforms as BroadcastNotification['targetPlatforms']) || [],
    targetAudience: (data.targetAudience as BroadcastNotification['targetAudience']) || 'all',
    status: data.status as BroadcastStatus,
    startDate: data.startDate as Timestamp,
    endDate: data.endDate as Timestamp | null | undefined,
    priority: (data.priority as number) || 50,
    dismissible: data.dismissible !== false,
    variant: (data.variant as BroadcastNotification['variant']) || 'banner',
    impressions: (data.impressions as number) || 0,
    clicks: (data.clicks as number) || 0,
    createdBy: data.createdBy as string,
    updatedBy: data.updatedBy as string | undefined,
  };
}

/**
 * Convert Firestore document to NotificationTemplate
 */
function docToTemplate(
  docId: string,
  data: Record<string, unknown>
): NotificationTemplate {
  return {
    id: docId,
    name: data.name as string,
    eventType: data.eventType as string,
    category: data.category as NotificationTemplate['category'],
    title: data.title as string,
    message: data.message as string,
    variables: (data.variables as string[]) || [],
    type: data.type as NotificationTemplate['type'],
    isImportant: data.isImportant as boolean,
    actionUrl: data.actionUrl as string | undefined,
    actionText: data.actionText as string | undefined,
    enabled: data.enabled !== false,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

// ============================================================================
// BROADCAST CRUD
// ============================================================================

/**
 * Create a new broadcast
 */
export async function createBroadcast(
  input: CreateBroadcastInput,
  adminUserId: string
): Promise<string> {
  const db = getSharedFeaturesDb();

  const broadcastData = {
    ...input,
    status: 'draft' as BroadcastStatus,
    isRead: false,
    impressions: 0,
    clicks: 0,
    createdBy: adminUserId,
    createdAt: serverTimestamp(),
    startDate: Timestamp.fromDate(input.startDate),
    endDate: input.endDate ? Timestamp.fromDate(input.endDate) : null,
  };

  const docRef = await addDoc(
    collection(db, COLLECTION_BROADCASTS),
    broadcastData
  );

  return docRef.id;
}

/**
 * Update an existing broadcast
 */
export async function updateBroadcast(
  input: UpdateBroadcastInput,
  adminUserId: string
): Promise<void> {
  const db = getSharedFeaturesDb();

  const updateData: Record<string, unknown> = {
    ...input,
    updatedBy: adminUserId,
    updatedAt: serverTimestamp(),
  };

  // Convert dates if provided
  if (input.startDate) {
    updateData.startDate = Timestamp.fromDate(input.startDate);
  }
  if (input.endDate !== undefined) {
    updateData.endDate = input.endDate ? Timestamp.fromDate(input.endDate) : null;
  }

  // Remove id from update data
  delete updateData.id;

  await updateDoc(doc(db, COLLECTION_BROADCASTS, input.id), updateData);
}

/**
 * Delete a broadcast
 */
export async function deleteBroadcast(broadcastId: string): Promise<void> {
  const db = getSharedFeaturesDb();
  await deleteDoc(doc(db, COLLECTION_BROADCASTS, broadcastId));
}

/**
 * Get all broadcasts (for admin listing)
 */
export async function getAllBroadcasts(): Promise<BroadcastNotification[]> {
  const db = getSharedFeaturesDb();

  const q = query(
    collection(db, COLLECTION_BROADCASTS),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToBroadcast(d.id, d.data()));
}

/**
 * Get broadcasts by status
 */
export async function getBroadcastsByStatus(
  status: BroadcastStatus
): Promise<BroadcastNotification[]> {
  const db = getSharedFeaturesDb();

  const q = query(
    collection(db, COLLECTION_BROADCASTS),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToBroadcast(d.id, d.data()));
}

/**
 * Get a single broadcast by ID
 */
export async function getBroadcastById(
  broadcastId: string
): Promise<BroadcastNotification | null> {
  const db = getSharedFeaturesDb();
  const docSnap = await getDoc(doc(db, COLLECTION_BROADCASTS, broadcastId));

  if (!docSnap.exists()) return null;
  return docToBroadcast(docSnap.id, docSnap.data());
}

// ============================================================================
// BROADCAST STATUS MANAGEMENT
// ============================================================================

/**
 * Publish a draft broadcast (set to active)
 */
export async function publishBroadcast(
  broadcastId: string,
  adminUserId: string
): Promise<void> {
  const db = getSharedFeaturesDb();

  await updateDoc(doc(db, COLLECTION_BROADCASTS, broadcastId), {
    status: 'active',
    updatedBy: adminUserId,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Schedule a broadcast for later
 */
export async function scheduleBroadcast(
  broadcastId: string,
  scheduledDate: Date,
  adminUserId: string
): Promise<void> {
  const db = getSharedFeaturesDb();

  await updateDoc(doc(db, COLLECTION_BROADCASTS, broadcastId), {
    status: 'scheduled',
    startDate: Timestamp.fromDate(scheduledDate),
    updatedBy: adminUserId,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Pause an active broadcast
 */
export async function pauseBroadcast(
  broadcastId: string,
  adminUserId: string
): Promise<void> {
  const db = getSharedFeaturesDb();

  await updateDoc(doc(db, COLLECTION_BROADCASTS, broadcastId), {
    status: 'draft', // Move back to draft
    updatedBy: adminUserId,
    updatedAt: serverTimestamp(),
  });
}

/**
 * End a broadcast
 */
export async function endBroadcast(
  broadcastId: string,
  adminUserId: string
): Promise<void> {
  const db = getSharedFeaturesDb();

  await updateDoc(doc(db, COLLECTION_BROADCASTS, broadcastId), {
    status: 'ended',
    endDate: serverTimestamp(),
    updatedBy: adminUserId,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================================
// TEMPLATE CRUD
// ============================================================================

/**
 * Create a new template
 */
export async function createTemplate(
  input: CreateTemplateInput
): Promise<string> {
  const db = getSharedFeaturesDb();

  const templateData = {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, COLLECTION_TEMPLATES),
    templateData
  );

  return docRef.id;
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  templateId: string,
  input: Partial<CreateTemplateInput>
): Promise<void> {
  const db = getSharedFeaturesDb();

  await updateDoc(doc(db, COLLECTION_TEMPLATES, templateId), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a template
 */
export async function deleteTemplate(templateId: string): Promise<void> {
  const db = getSharedFeaturesDb();
  await deleteDoc(doc(db, COLLECTION_TEMPLATES, templateId));
}

/**
 * Get all templates
 */
export async function getAllTemplates(): Promise<NotificationTemplate[]> {
  const db = getSharedFeaturesDb();

  const q = query(
    collection(db, COLLECTION_TEMPLATES),
    orderBy('name', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToTemplate(d.id, d.data()));
}

/**
 * Get template by ID
 */
export async function getTemplateById(
  templateId: string
): Promise<NotificationTemplate | null> {
  const db = getSharedFeaturesDb();
  const docSnap = await getDoc(doc(db, COLLECTION_TEMPLATES, templateId));

  if (!docSnap.exists()) return null;
  return docToTemplate(docSnap.id, docSnap.data());
}

/**
 * Get template by event type from Firestore
 */
export async function getFirestoreTemplateByEventType(
  eventType: string
): Promise<NotificationTemplate | null> {
  const db = getSharedFeaturesDb();

  const q = query(
    collection(db, COLLECTION_TEMPLATES),
    where('eventType', '==', eventType)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;

  return docToTemplate(docSnap.id, docSnap.data());
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Get analytics for a specific broadcast
 */
export async function getBroadcastAnalytics(
  broadcastId: string
): Promise<BroadcastAnalytics | null> {
  const db = getSharedFeaturesDb();

  // Get broadcast
  const broadcast = await getBroadcastById(broadcastId);
  if (!broadcast) return null;

  // Get events
  const eventsQuery = query(
    collection(db, COLLECTION_BROADCAST_EVENTS),
    where('broadcastId', '==', broadcastId)
  );

  const eventsSnapshot = await getDocs(eventsQuery);
  const events = eventsSnapshot.docs.map((d) => d.data());

  // Calculate analytics
  const impressions = events.filter((e) => e.action === 'impression').length;
  const clicks = events.filter((e) => e.action === 'click').length;
  const dismissals = events.filter((e) => e.action === 'dismiss').length;

  // Group by platform
  const byPlatform: BroadcastAnalytics['byPlatform'] = {
    web: { impressions: 0, clicks: 0 },
    android: { impressions: 0, clicks: 0 },
    ios: { impressions: 0, clicks: 0 },
  };

  events.forEach((e) => {
    const platform = e.platform as keyof typeof byPlatform;
    if (byPlatform[platform]) {
      if (e.action === 'impression') byPlatform[platform].impressions++;
      if (e.action === 'click') byPlatform[platform].clicks++;
    }
  });

  // Group by project
  const byProject: BroadcastAnalytics['byProject'] = {};
  events.forEach((e) => {
    const projectId = e.projectId as string;
    if (!byProject[projectId]) {
      byProject[projectId] = { impressions: 0, clicks: 0 };
    }
    if (e.action === 'impression') byProject[projectId].impressions++;
    if (e.action === 'click') byProject[projectId].clicks++;
  });

  // Group by date
  const byDateMap: Record<string, { impressions: number; clicks: number }> = {};
  events.forEach((e) => {
    const dateStr = (e.timestamp as Timestamp).toDate().toISOString().split('T')[0];
    if (dateStr) {
      if (!byDateMap[dateStr]) {
        byDateMap[dateStr] = { impressions: 0, clicks: 0 };
      }
      if (e.action === 'impression') byDateMap[dateStr].impressions++;
      if (e.action === 'click') byDateMap[dateStr].clicks++;
    }
  });

  const byDate = Object.entries(byDateMap).map(([date, data]) => ({
    date,
    impressions: data.impressions,
    clicks: data.clicks,
  }));

  return {
    broadcastId,
    title: broadcast.title,
    status: broadcast.status,
    impressions,
    clicks,
    dismissals,
    ctr: impressions > 0 ? clicks / impressions : 0,
    byPlatform,
    byProject,
    byDate,
  };
}

/**
 * Get overall notification analytics
 */
export async function getOverallAnalytics(
  startDate: Date,
  endDate: Date
): Promise<NotificationAnalytics> {
  const db = getSharedFeaturesDb();

  // Get all broadcast events in date range
  const eventsQuery = query(
    collection(db, COLLECTION_BROADCAST_EVENTS),
    where('timestamp', '>=', Timestamp.fromDate(startDate)),
    where('timestamp', '<=', Timestamp.fromDate(endDate))
  );

  const eventsSnapshot = await getDocs(eventsQuery);
  const events = eventsSnapshot.docs.map((d) => d.data());

  // Calculate totals
  const totalSent = events.filter((e) => e.action === 'impression').length;
  const totalRead = events.filter((e) => e.action === 'impression').length; // Impressions = read for broadcasts
  const totalClicked = events.filter((e) => e.action === 'click').length;

  // Initialize category and type breakdowns
  const byCategory: NotificationAnalytics['byCategory'] = {
    system: { sent: 0, read: 0, clicked: 0 },
    account: { sent: 0, read: 0, clicked: 0 },
    activity: { sent: 0, read: 0, clicked: 0 },
    report: { sent: 0, read: 0, clicked: 0 },
    promotional: { sent: 0, read: 0, clicked: 0 },
    social: { sent: 0, read: 0, clicked: 0 },
  };

  const byType: NotificationAnalytics['byType'] = {
    info: { sent: 0, read: 0, clicked: 0 },
    success: { sent: 0, read: 0, clicked: 0 },
    warning: { sent: 0, read: 0, clicked: 0 },
    error: { sent: 0, read: 0, clicked: 0 },
    reminder: { sent: 0, read: 0, clicked: 0 },
    milestone: { sent: 0, read: 0, clicked: 0 },
    announcement: { sent: 0, read: 0, clicked: 0 },
  };

  // Group by date
  const byDateMap: Record<string, { sent: number; read: number; clicked: number }> = {};
  events.forEach((e) => {
    const dateStr = (e.timestamp as Timestamp).toDate().toISOString().split('T')[0];
    if (dateStr) {
      if (!byDateMap[dateStr]) {
        byDateMap[dateStr] = { sent: 0, read: 0, clicked: 0 };
      }
      if (e.action === 'impression') {
        byDateMap[dateStr].sent++;
        byDateMap[dateStr].read++;
      }
      if (e.action === 'click') byDateMap[dateStr].clicked++;
    }
  });

  const byDate = Object.entries(byDateMap)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalSent,
    totalRead,
    totalClicked,
    readRate: totalSent > 0 ? totalRead / totalSent : 0,
    clickRate: totalSent > 0 ? totalClicked / totalSent : 0,
    byCategory,
    byType,
    byDate,
  };
}

// ============================================================================
// EXPORT SERVICE OBJECT
// ============================================================================

export const adminNotificationService = {
  // Broadcasts
  createBroadcast,
  updateBroadcast,
  deleteBroadcast,
  getAllBroadcasts,
  getBroadcastsByStatus,
  getBroadcastById,
  publishBroadcast,
  scheduleBroadcast,
  pauseBroadcast,
  endBroadcast,

  // Templates
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAllTemplates,
  getTemplateById,
  getFirestoreTemplateByEventType,

  // Analytics
  getBroadcastAnalytics,
  getOverallAnalytics,
};

export default adminNotificationService;
