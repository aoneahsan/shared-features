import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone,
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const campaignFormSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  productId: z.string().min(1, 'Product ID is required'),
  status: z.enum(['active', 'paused', 'scheduled', 'ended']),
  priority: z.number().min(1).max(100),
  targetPlatforms: z.string(),
  targetAudience: z.string(),
  targetProjects: z.string(),
  placements: z.string().min(1, 'At least one placement is required'),
  frequencyDays: z.number().min(1),
  maxImpressions: z.number().min(0),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string(),
  customTitle: z.string(),
  customTagline: z.string(),
  customDescription: z.string(),
  customCta: z.string(),
});

type CampaignFormData = z.infer<typeof campaignFormSchema>;

interface CampaignDoc {
  id: string;
  name: string;
  productId: string;
  status: string;
  priority: number;
  placements: string[];
  targetPlatforms: string[];
  targetAudience: string;
  targetProjects: string[];
  frequencyDays: number;
  maxImpressions: number | null;
  startDate: Timestamp;
  endDate: Timestamp | null;
  totalImpressions: number;
  totalClicks: number;
  totalCloses: number;
  customTitle?: string;
  customTagline?: string;
  customDescription?: string;
  customCta?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const STATUS_BADGE_MAP: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  active: 'success',
  paused: 'warning',
  scheduled: 'info',
  ended: 'danger',
};

/**
 * Formats a Firestore Timestamp into a human-readable date string.
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
 * Skeleton loader for the campaigns table.
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

export default function CampaignsAdminPage() {
  const { isAdmin, user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState<CampaignDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors: formErrors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: '',
      productId: '',
      status: 'active',
      priority: 50,
      targetPlatforms: 'web,android,ios,extension',
      targetAudience: 'all',
      targetProjects: '',
      placements: 'home_banner',
      frequencyDays: 20,
      maxImpressions: 0,
      startDate: '',
      endDate: '',
      customTitle: '',
      customTagline: '',
      customDescription: '',
      customCta: '',
    },
  });

  const fetchCampaigns = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'zaions_campaigns'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CampaignDoc[];
      setCampaigns(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/campaigns', 'Campaigns Admin');
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens the create/edit dialog. Resets the form for a new campaign,
   * or pre-fills it when editing an existing campaign.
   */
  function openCreateDialog() {
    setEditingCampaign(null);
    reset({
      name: '',
      productId: '',
      status: 'active',
      priority: 50,
      targetPlatforms: 'web,android,ios,extension',
      targetAudience: 'all',
      targetProjects: '',
      placements: 'home_banner',
      frequencyDays: 20,
      maxImpressions: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      customTitle: '',
      customTagline: '',
      customDescription: '',
      customCta: '',
    });
    setDialogOpen(true);
  }

  /**
   * Opens the edit dialog pre-filled with the campaign data.
   */
  function openEditDialog(campaign: CampaignDoc) {
    setEditingCampaign(campaign);
    reset({
      name: campaign.name,
      productId: campaign.productId,
      status: campaign.status as CampaignFormData['status'],
      priority: campaign.priority,
      targetPlatforms: (campaign.targetPlatforms ?? []).join(','),
      targetAudience: campaign.targetAudience ?? 'all',
      targetProjects: (campaign.targetProjects ?? []).join(','),
      placements: (campaign.placements ?? []).join(','),
      frequencyDays: campaign.frequencyDays ?? 20,
      maxImpressions: campaign.maxImpressions ?? 0,
      startDate: campaign.startDate
        ? new Date(campaign.startDate.toMillis()).toISOString().slice(0, 10)
        : '',
      endDate: campaign.endDate
        ? new Date(campaign.endDate.toMillis()).toISOString().slice(0, 10)
        : '',
      customTitle: campaign.customTitle ?? '',
      customTagline: campaign.customTagline ?? '',
      customDescription: campaign.customDescription ?? '',
      customCta: campaign.customCta ?? '',
    });
    setDialogOpen(true);
  }

  /**
   * Submits the campaign form to create or update a campaign in Firestore.
   */
  async function onSubmit(data: CampaignFormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const campaignData = {
        name: data.name,
        productId: data.productId,
        status: data.status,
        priority: data.priority,
        targetPlatforms: data.targetPlatforms.split(',').map((s) => s.trim()).filter(Boolean),
        targetAudience: data.targetAudience,
        targetProjects: data.targetProjects ? data.targetProjects.split(',').map((s) => s.trim()).filter(Boolean) : [],
        excludeProductUsers: false,
        placements: data.placements.split(',').map((s) => s.trim()).filter(Boolean),
        frequencyDays: data.frequencyDays,
        maxImpressions: data.maxImpressions > 0 ? data.maxImpressions : null,
        startDate: Timestamp.fromDate(new Date(data.startDate)),
        endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null,
        customTitle: data.customTitle || undefined,
        customTagline: data.customTagline || undefined,
        customDescription: data.customDescription || undefined,
        customCta: data.customCta || undefined,
        variant: 'small_panel_1',
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      };

      if (editingCampaign) {
        const docRef = doc(db, 'zaions_campaigns', editingCampaign.id);
        await updateDoc(docRef, campaignData);
        setSuccessMessage(`Campaign "${data.name}" updated successfully!`);
        trackEvent('admin_campaign_updated', { campaignId: editingCampaign.id });
      } else {
        await addDoc(collection(db, 'zaions_campaigns'), {
          ...campaignData,
          totalImpressions: 0,
          totalClicks: 0,
          totalCloses: 0,
          createdAt: serverTimestamp(),
          createdBy: user?.email ?? 'unknown',
        });
        setSuccessMessage(`Campaign "${data.name}" created successfully!`);
        trackEvent('admin_campaign_created');
      }

      setDialogOpen(false);
      fetchCampaigns();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save campaign';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /**
   * Deletes a campaign from Firestore after confirmation.
   */
  async function handleDelete() {
    if (!deletingCampaign) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'zaions_campaigns', deletingCampaign.id));
      setSuccessMessage(`Campaign "${deletingCampaign.name}" deleted successfully!`);
      trackEvent('admin_campaign_deleted', { campaignId: deletingCampaign.id });
      setDeleteDialogOpen(false);
      setDeletingCampaign(null);
      fetchCampaigns();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete campaign';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productId.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="text-white">Campaigns</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Megaphone className="h-8 w-8" />
                  Campaigns
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage advertising campaigns, targeting, and creative.
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
                  Create Campaign
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
              placeholder="Search campaigns..."
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
            ) : filteredCampaigns.length === 0 ? (
              <div className="py-16 text-center">
                <Megaphone className="h-12 w-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No campaigns found</p>
                <p className="text-surface-400 text-sm mt-1">
                  {searchQuery ? 'Try a different search term.' : 'Create your first campaign to get started.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-center">Placements</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Impressions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <p className="font-medium text-surface-900">{campaign.name}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-surface-500 font-mono">
                          {campaign.productId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE_MAP[campaign.status] ?? 'default'} size="sm">
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium">{campaign.priority}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{(campaign.placements ?? []).length}</span>
                      </TableCell>
                      <TableCell className="text-sm text-surface-600">
                        {formatTimestamp(campaign.startDate)}
                      </TableCell>
                      <TableCell className="text-sm text-surface-600">
                        {formatTimestamp(campaign.endDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium">
                          {(campaign.totalImpressions ?? 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/campaigns/${campaign.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(campaign)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setDeletingCampaign(campaign);
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
              {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? 'Update the campaign details below.'
                : 'Fill in the details to create a new advertising campaign.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Campaign Name"
                placeholder="Summer Sale 2026"
                error={formErrors.name?.message}
                {...register('name')}
              />
              <Input
                label="Product ID"
                placeholder="product-id"
                error={formErrors.productId?.message}
                {...register('productId')}
              />
            </div>

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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <Input
                label="Priority (1-100)"
                type="number"
                error={formErrors.priority?.message}
                {...register('priority', { valueAsNumber: true })}
              />
            </div>

            <Card className="border-surface-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Targeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Platforms (comma separated)"
                  placeholder="web,android,ios,extension"
                  error={formErrors.targetPlatforms?.message}
                  {...register('targetPlatforms')}
                />
                <Input
                  label="Target Audience"
                  placeholder="all, authenticated, or anonymous"
                  error={formErrors.targetAudience?.message}
                  {...register('targetAudience')}
                />
                <Input
                  label="Target Projects (comma separated)"
                  placeholder="project-1,project-2 (empty = all)"
                  error={formErrors.targetProjects?.message}
                  {...register('targetProjects')}
                />
              </CardContent>
            </Card>

            <Input
              label="Placements (comma separated)"
              placeholder="home_banner,sidebar_panel,popup_slider"
              error={formErrors.placements?.message}
              {...register('placements')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Frequency (days)"
                type="number"
                error={formErrors.frequencyDays?.message}
                {...register('frequencyDays', { valueAsNumber: true })}
              />
              <Input
                label="Max Impressions (0 = unlimited)"
                type="number"
                error={formErrors.maxImpressions?.message}
                {...register('maxImpressions', { valueAsNumber: true })}
              />
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

            <Card className="border-surface-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Creative (Optional Overrides)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Custom Title"
                  placeholder="Override product name"
                  {...register('customTitle')}
                />
                <Input
                  label="Custom Tagline"
                  placeholder="Override product tagline"
                  {...register('customTagline')}
                />
                <Textarea
                  label="Custom Description"
                  placeholder="Override product description"
                  {...register('customDescription')}
                />
                <Input
                  label="Custom CTA"
                  placeholder="Try It Free"
                  {...register('customCta')}
                />
              </CardContent>
            </Card>
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
              {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingCampaign?.name}&quot;? This action
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
