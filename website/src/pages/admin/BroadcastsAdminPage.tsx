import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radio,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
} from 'lucide-react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import Switch from '@radix-ui/react-switch';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardHeader, CardTitle } from '@/components/ui/card';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const broadcastFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be under 500 characters'),
  type: z.enum(['info', 'success', 'warning', 'error', 'reminder', 'milestone', 'announcement']),
  category: z.enum(['system', 'account', 'activity', 'report', 'promotional', 'social']),
  targetProjects: z.string(),
  targetPlatforms: z.string(),
  targetAudience: z.enum(['all', 'authenticated', 'anonymous']),
  status: z.enum(['draft', 'scheduled', 'active', 'ended']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string(),
  priority: z.enum(['urgent', 'high', 'normal', 'low']),
  dismissible: z.boolean(),
  variant: z.enum(['banner', 'modal', 'toast', 'bell']),
  actionUrl: z.string(),
  actionText: z.string(),
});

type BroadcastFormData = z.infer<typeof broadcastFormSchema>;

interface BroadcastDoc {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
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
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
}

const STATUS_BADGE_MAP: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  active: 'success',
  scheduled: 'info',
  draft: 'default',
  ended: 'danger',
};

const TYPE_BADGE_MAP: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
  reminder: 'default',
  milestone: 'success',
  announcement: 'info',
};

const PRIORITY_BADGE_MAP: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  urgent: 'danger',
  high: 'warning',
  normal: 'default',
  low: 'info',
};

/**
 * Formats a Firestore Timestamp to a localized short date string.
 */
function formatTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return '-';
  return new Date(ts.toMillis()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Skeleton loader for table rows.
 */
function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 rounded bg-surface-100" />
      ))}
    </div>
  );
}

export default function BroadcastsAdminPage() {
  const { isAdmin, user } = useAuth();
  const [broadcasts, setBroadcasts] = useState<BroadcastDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<BroadcastDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBroadcast, setDeletingBroadcast] = useState<BroadcastDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<BroadcastFormData>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'info',
      category: 'system',
      targetProjects: '',
      targetPlatforms: 'web,android,ios',
      targetAudience: 'all',
      status: 'draft',
      startDate: '',
      endDate: '',
      priority: 'normal',
      dismissible: true,
      variant: 'banner',
      actionUrl: '',
      actionText: '',
    },
  });

  const watchDismissible = watch('dismissible');

  const fetchBroadcasts = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'zaions_broadcasts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as BroadcastDoc[];
      setBroadcasts(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch broadcasts';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/broadcasts', 'Broadcasts Admin');
    fetchBroadcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens the dialog in create mode with default values.
   */
  function openCreateDialog() {
    setEditingBroadcast(null);
    reset({
      title: '',
      message: '',
      type: 'info',
      category: 'system',
      targetProjects: '',
      targetPlatforms: 'web,android,ios',
      targetAudience: 'all',
      status: 'draft',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      priority: 'normal',
      dismissible: true,
      variant: 'banner',
      actionUrl: '',
      actionText: '',
    });
    setDialogOpen(true);
  }

  /**
   * Opens the dialog in edit mode with broadcast data pre-filled.
   */
  function openEditDialog(broadcast: BroadcastDoc) {
    setEditingBroadcast(broadcast);
    reset({
      title: broadcast.title,
      message: broadcast.message,
      type: broadcast.type as BroadcastFormData['type'],
      category: broadcast.category as BroadcastFormData['category'],
      targetProjects: (broadcast.targetProjects ?? []).join(','),
      targetPlatforms: (broadcast.targetPlatforms ?? []).join(','),
      targetAudience: (broadcast.targetAudience ?? 'all') as BroadcastFormData['targetAudience'],
      status: (broadcast.status ?? 'draft') as BroadcastFormData['status'],
      startDate: broadcast.startDate
        ? new Date(broadcast.startDate.toMillis()).toISOString().slice(0, 10)
        : '',
      endDate: broadcast.endDate
        ? new Date(broadcast.endDate.toMillis()).toISOString().slice(0, 10)
        : '',
      priority: (broadcast.priority ?? 'normal') as BroadcastFormData['priority'],
      dismissible: broadcast.dismissible ?? true,
      variant: (broadcast.variant ?? 'banner') as BroadcastFormData['variant'],
      actionUrl: broadcast.actionUrl ?? '',
      actionText: broadcast.actionText ?? '',
    });
    setDialogOpen(true);
  }

  /**
   * Submits the broadcast form to create or update a broadcast in Firestore.
   */
  async function onSubmit(data: BroadcastFormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const broadcastData = {
        title: data.title,
        message: data.message,
        type: data.type,
        category: data.category,
        targetProjects: data.targetProjects ? data.targetProjects.split(',').map((s) => s.trim()).filter(Boolean) : [],
        targetPlatforms: data.targetPlatforms ? data.targetPlatforms.split(',').map((s) => s.trim()).filter(Boolean) : [],
        targetAudience: data.targetAudience,
        status: data.status,
        startDate: Timestamp.fromDate(new Date(data.startDate)),
        endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null,
        priority: data.priority,
        dismissible: data.dismissible,
        variant: data.variant,
        actionUrl: data.actionUrl || undefined,
        actionText: data.actionText || undefined,
        isRead: false,
        isImportant: data.priority === 'urgent' || data.priority === 'high',
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      };

      if (editingBroadcast) {
        const docRef = doc(db, 'zaions_broadcasts', editingBroadcast.id);
        await updateDoc(docRef, broadcastData);
        setSuccessMessage(`Broadcast "${data.title}" updated successfully!`);
        trackEvent('admin_broadcast_updated', { broadcastId: editingBroadcast.id });
      } else {
        await addDoc(collection(db, 'zaions_broadcasts'), {
          ...broadcastData,
          impressions: 0,
          clicks: 0,
          createdAt: serverTimestamp(),
          createdBy: user?.email ?? 'unknown',
        });
        setSuccessMessage(`Broadcast "${data.title}" created successfully!`);
        trackEvent('admin_broadcast_created');
      }

      setDialogOpen(false);
      fetchBroadcasts();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save broadcast';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /**
   * Deletes a broadcast from Firestore after confirmation.
   */
  async function handleDelete() {
    if (!deletingBroadcast) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'zaions_broadcasts', deletingBroadcast.id));
      setSuccessMessage(`Broadcast "${deletingBroadcast.title}" deleted successfully!`);
      trackEvent('admin_broadcast_deleted', { broadcastId: deletingBroadcast.id });
      setDeleteDialogOpen(false);
      setDeletingBroadcast(null);
      fetchBroadcasts();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete broadcast';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  const filteredBroadcasts = broadcasts.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span className="text-white">Broadcasts</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Radio className="h-8 w-8" />
                  Broadcasts
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage cross-project notifications and announcements.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  className="bg-white text-violet-700 hover:bg-violet-50"
                  onClick={openCreateDialog}
                >
                  <Plus className="h-4 w-4" />
                  Create Broadcast
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Messages */}
        {error && (
          <Alert variant="danger" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <Input
              placeholder="Search broadcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <TableSkeleton />
              </div>
            ) : filteredBroadcasts.length === 0 ? (
              <div className="py-16 text-center">
                <Radio className="h-12 w-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No broadcasts found</p>
                <p className="text-surface-400 text-sm mt-1">
                  {searchQuery ? 'Try a different search term.' : 'Create your first broadcast to get started.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Impressions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBroadcasts.map((broadcast) => (
                    <TableRow key={broadcast.id}>
                      <TableCell>
                        <p className="font-medium text-surface-900 max-w-[200px] truncate">
                          {broadcast.title}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={TYPE_BADGE_MAP[broadcast.type] ?? 'default'} size="sm">
                          {broadcast.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-surface-600 capitalize">
                          {broadcast.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE_MAP[broadcast.status] ?? 'default'} size="sm">
                          {broadcast.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={PRIORITY_BADGE_MAP[broadcast.priority] ?? 'default'} size="sm">
                          {broadcast.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" size="sm">
                          {broadcast.variant}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-surface-600">
                        {formatTimestamp(broadcast.startDate)}
                      </TableCell>
                      <TableCell className="text-sm text-surface-600">
                        {formatTimestamp(broadcast.endDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium">
                          {(broadcast.impressions ?? 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/broadcasts/${broadcast.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(broadcast)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setDeletingBroadcast(broadcast);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBroadcast ? 'Edit Broadcast' : 'Create Broadcast'}
            </DialogTitle>
            <DialogDescription>
              {editingBroadcast
                ? 'Update the broadcast details below.'
                : 'Create a new cross-project notification or announcement.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Title"
              placeholder="System Maintenance Notice"
              error={formErrors.title?.message}
              {...register('title')}
            />

            <Textarea
              label="Message"
              placeholder="We will be performing scheduled maintenance..."
              error={formErrors.message?.message}
              {...register('message')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Type</label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Category</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="activity">Activity</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
            </div>

            <Card className="border-surface-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Targeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Target Projects (comma separated, empty = all)"
                  placeholder="project-1,project-2"
                  error={formErrors.targetProjects?.message}
                  {...register('targetProjects')}
                />
                <Input
                  label="Target Platforms (comma separated)"
                  placeholder="web,android,ios"
                  error={formErrors.targetPlatforms?.message}
                  {...register('targetPlatforms')}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-surface-700">Target Audience</label>
                  <Controller
                    name="targetAudience"
                    control={control}
                    render={({ field }) => (
                      <SelectRoot value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="authenticated">Authenticated Only</SelectItem>
                          <SelectItem value="anonymous">Anonymous Only</SelectItem>
                        </SelectContent>
                      </SelectRoot>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Priority</label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                error={formErrors.startDate?.message}
                {...register('startDate')}
              />
              <Input
                label="End Date (optional)"
                type="date"
                error={formErrors.endDate?.message}
                {...register('endDate')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Variant</label>
                <Controller
                  name="variant"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="modal">Modal</SelectItem>
                        <SelectItem value="toast">Toast</SelectItem>
                        <SelectItem value="bell">Bell (Notification Center)</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 self-end">
                <div>
                  <p className="font-medium text-surface-900 text-sm">Dismissible</p>
                </div>
                <Switch
                  checked={watchDismissible}
                  onCheckedChange={(checked: boolean) => setValue('dismissible', checked, { shouldDirty: true })}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                    watchDismissible ? 'bg-violet-600' : 'bg-surface-300'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                      watchDismissible ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </Switch>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Action URL (optional)"
                placeholder="https://example.com/update"
                error={formErrors.actionUrl?.message}
                {...register('actionUrl')}
              />
              <Input
                label="Action Text (optional)"
                placeholder="Learn More"
                error={formErrors.actionText?.message}
                {...register('actionText')}
              />
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              loading={saving}
              disabled={saving}
              onClick={handleSubmit(onSubmit)}
            >
              {editingBroadcast ? 'Update Broadcast' : 'Create Broadcast'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Broadcast</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingBroadcast?.title}&quot;? This action
              cannot be undone.
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
