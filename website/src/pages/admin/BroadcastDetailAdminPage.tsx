import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radio,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Pencil,
  Trash2,
  Eye,
  MousePointer,
  Calendar,
  Target,
  Bell,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Star,
  Volume2,
  MessageSquare,
  Layout,
} from 'lucide-react';
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface BroadcastData {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  isRead: boolean;
  isImportant?: boolean;
  actionUrl?: string;
  actionText?: string;
  targetProjects: string[];
  targetPlatforms: string[];
  targetAudience: string;
  status: string;
  startDate: Timestamp;
  endDate: Timestamp | null;
  priority: string;
  dismissible: boolean;
  variant: string;
  impressions: number;
  clicks: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

const STATUS_BADGE_MAP: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  active: 'success',
  scheduled: 'info',
  draft: 'default',
  ended: 'danger',
};

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  info: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  success: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  error: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  reminder: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  milestone: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  announcement: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
};

const TYPE_ICONS: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  reminder: Clock,
  milestone: Star,
  announcement: Volume2,
};

/**
 * Converts a Firestore Timestamp to a localized date string.
 */
function formatTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return '-';
  return new Date(ts.toMillis()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Skeleton loader for the broadcast detail page.
 */
function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-5 w-40 rounded bg-surface-200" />
          </CardHeader>
          <CardContent>
            <div className="h-20 w-full rounded bg-surface-100" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function BroadcastDetailAdminPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [broadcast, setBroadcast] = useState<BroadcastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBroadcast = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const docRef = doc(db, 'zaions_broadcasts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBroadcast({ id: docSnap.id, ...docSnap.data() } as BroadcastData);
      } else {
        setError('Broadcast not found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch broadcast';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    trackPageView(`/admin/broadcasts/${id}`, 'Broadcast Detail');
    fetchBroadcast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Deletes the broadcast and navigates back to the broadcasts list.
   */
  async function handleDelete() {
    if (!id) return;
    setDeleting(true);

    try {
      await deleteDoc(doc(db, 'zaions_broadcasts', id));
      trackEvent('admin_broadcast_deleted', { broadcastId: id });
      navigate('/admin/broadcasts');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete broadcast';
      setError(message);
      setDeleting(false);
    }
  }

  if (!isAdmin) {
    return (
      <Container className="py-20">
        <Alert variant="danger">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin privileges to view this page.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  const typeColors = broadcast ? (TYPE_COLORS[broadcast.type] ?? TYPE_COLORS.info) : TYPE_COLORS.info;
  const TypeIcon = broadcast ? (TYPE_ICONS[broadcast.type] ?? Info) : Info;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <Container className="py-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-2 text-violet-200 text-sm mb-2">
              <Link to="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/admin/broadcasts" className="hover:text-white transition-colors">
                Broadcasts
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{broadcast?.title ?? 'Loading...'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Radio className="h-8 w-8" />
                  {broadcast?.title ?? 'Broadcast Detail'}
                </h1>
                {broadcast && (
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant={STATUS_BADGE_MAP[broadcast.status] ?? 'default'}
                      className="bg-white/20 text-white border-white/30"
                    >
                      {broadcast.status}
                    </Badge>
                    <span className="text-violet-200 text-sm capitalize">
                      {broadcast.type} / {broadcast.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/broadcasts">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                {broadcast && (
                  <>
                    <Link to="/admin/broadcasts">
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8">
        {error && (
          <Alert variant="danger" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <DetailSkeleton />
        ) : broadcast ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Analytics */}
            <motion.div variants={staggerItem}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Impressions',
                    value: (broadcast.impressions ?? 0).toLocaleString(),
                    icon: Eye,
                    color: 'bg-blue-100 text-blue-600',
                  },
                  {
                    label: 'Clicks',
                    value: (broadcast.clicks ?? 0).toLocaleString(),
                    icon: MousePointer,
                    color: 'bg-green-100 text-green-600',
                  },
                  {
                    label: 'Click-Through Rate',
                    value: broadcast.impressions
                      ? `${((broadcast.clicks / broadcast.impressions) * 100).toFixed(1)}%`
                      : '0.0%',
                    icon: Target,
                    color: 'bg-violet-100 text-violet-600',
                  },
                ].map((metric) => (
                  <Card key={metric.label}>
                    <CardHeader>
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', metric.color)}>
                        <metric.icon className="h-5 w-5" />
                      </div>
                      <CardDescription className="mt-2">{metric.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-display font-bold text-surface-900">
                        {metric.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Preview Section */}
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-violet-600" />
                    Preview
                  </CardTitle>
                  <CardDescription>
                    How the broadcast appears in different variants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Banner Preview */}
                  <div>
                    <p className="text-sm font-medium text-surface-500 mb-2">Banner</p>
                    <div
                      className={cn(
                        'rounded-lg border p-4 flex items-start gap-3',
                        typeColors.bg,
                        typeColors.border
                      )}
                    >
                      <TypeIcon className={cn('h-5 w-5 mt-0.5 shrink-0', typeColors.text)} />
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-semibold text-sm', typeColors.text)}>
                          {broadcast.title}
                        </p>
                        <p className={cn('text-sm mt-0.5 opacity-80', typeColors.text)}>
                          {broadcast.message}
                        </p>
                        {broadcast.actionText && (
                          <span className={cn('text-sm font-medium underline mt-1 inline-block', typeColors.text)}>
                            {broadcast.actionText}
                          </span>
                        )}
                      </div>
                      {broadcast.dismissible && (
                        <button className={cn('shrink-0 opacity-60', typeColors.text)}>
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Modal Preview */}
                  <div>
                    <p className="text-sm font-medium text-surface-500 mb-2">Modal</p>
                    <div className="rounded-lg border border-surface-200 bg-white shadow-lg max-w-md mx-auto p-6">
                      <div className="text-center">
                        <div
                          className={cn(
                            'h-12 w-12 rounded-full flex items-center justify-center mx-auto',
                            typeColors.bg
                          )}
                        >
                          <TypeIcon className={cn('h-6 w-6', typeColors.text)} />
                        </div>
                        <h3 className="font-display font-semibold text-surface-900 mt-3">
                          {broadcast.title}
                        </h3>
                        <p className="text-sm text-surface-600 mt-2">{broadcast.message}</p>
                        <div className="flex items-center justify-center gap-3 mt-4">
                          {broadcast.actionText && (
                            <span className="text-sm font-medium text-violet-600">
                              {broadcast.actionText}
                            </span>
                          )}
                          {broadcast.dismissible && (
                            <span className="text-sm text-surface-400">Dismiss</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toast Preview */}
                  <div>
                    <p className="text-sm font-medium text-surface-500 mb-2">Toast</p>
                    <div className="rounded-lg border border-surface-200 bg-white shadow-md max-w-sm ml-auto p-3 flex items-start gap-3">
                      <TypeIcon className={cn('h-5 w-5 mt-0.5 shrink-0', typeColors.text)} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-surface-900">{broadcast.title}</p>
                        <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">
                          {broadcast.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bell Preview */}
                  <div>
                    <p className="text-sm font-medium text-surface-500 mb-2">
                      Bell (Notification Center)
                    </p>
                    <div className="rounded-lg border border-surface-200 bg-white max-w-sm p-3 flex items-start gap-3 hover:bg-surface-50 transition-colors">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                          typeColors.bg
                        )}
                      >
                        <Bell className={cn('h-4 w-4', typeColors.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-surface-900">{broadcast.title}</p>
                        <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">
                          {broadcast.message}
                        </p>
                        <p className="text-xs text-surface-400 mt-1">Just now</p>
                      </div>
                      {broadcast.isImportant && (
                        <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detail Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content */}
              <motion.div variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-violet-600" />
                      Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-surface-500">Title</p>
                      <p className="font-medium text-surface-900">{broadcast.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Message</p>
                      <p className="text-surface-900 whitespace-pre-wrap">{broadcast.message}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Type</p>
                      <Badge variant={STATUS_BADGE_MAP[broadcast.type] ?? 'default'} size="sm">
                        {broadcast.type}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Category</p>
                      <p className="text-surface-900 capitalize">{broadcast.category}</p>
                    </div>
                    {broadcast.actionUrl && (
                      <div>
                        <p className="text-sm text-surface-500">Action URL</p>
                        <a
                          href={broadcast.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:underline text-sm break-all"
                        >
                          {broadcast.actionUrl}
                        </a>
                      </div>
                    )}
                    {broadcast.actionText && (
                      <div>
                        <p className="text-sm text-surface-500">Action Text</p>
                        <p className="text-surface-900">{broadcast.actionText}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Targeting */}
              <motion.div variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-violet-600" />
                      Targeting & Display
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-surface-500">Platforms</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(broadcast.targetPlatforms ?? []).map((p) => (
                          <Badge key={p} variant="outline" size="sm">
                            {p}
                          </Badge>
                        ))}
                        {(broadcast.targetPlatforms ?? []).length === 0 && (
                          <span className="text-sm text-surface-400">All platforms</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Audience</p>
                      <p className="text-surface-900 capitalize">{broadcast.targetAudience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Target Projects</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(broadcast.targetProjects ?? []).length > 0 ? (
                          broadcast.targetProjects.map((p) => (
                            <Badge key={p} variant="outline" size="sm">
                              {p}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-surface-400">All projects</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Variant</p>
                      <Badge variant="default" size="sm">
                        {broadcast.variant}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Priority</p>
                      <Badge variant={STATUS_BADGE_MAP[broadcast.priority] ?? 'default'} size="sm">
                        {broadcast.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Dismissible</p>
                      <p className="text-surface-900">{broadcast.dismissible ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Important</p>
                      <p className="text-surface-900">{broadcast.isImportant ? 'Yes' : 'No'}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-violet-600" />
                    Timeline & Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-surface-400">Start Date</p>
                      <p className="text-surface-700">{formatTimestamp(broadcast.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">End Date</p>
                      <p className="text-surface-700">{formatTimestamp(broadcast.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Created</p>
                      <p className="text-surface-700">{formatTimestamp(broadcast.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Updated</p>
                      <p className="text-surface-700">{formatTimestamp(broadcast.updatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Broadcast ID</p>
                      <p className="font-mono text-surface-700 break-all">{broadcast.id}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Created By</p>
                      <p className="text-surface-700">{broadcast.createdBy ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Updated By</p>
                      <p className="text-surface-700">{broadcast.updatedBy ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Status</p>
                      <Badge variant={STATUS_BADGE_MAP[broadcast.status] ?? 'default'} size="sm">
                        {broadcast.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Broadcast</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{broadcast?.title}&quot;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              disabled={deleting}
              onClick={handleDelete}
            >
              Delete Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
