import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Pencil,
  Trash2,
  Eye,
  MousePointer,
  XCircle,
  Calendar,
  Target,
  Layers,
  Clock,
  BarChart3,
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

interface CampaignData {
  id: string;
  name: string;
  productId: string;
  status: string;
  priority: number;
  placements: string[];
  targetPlatforms: string[];
  targetAudience: string;
  targetProjects: string[];
  excludeProductUsers: boolean;
  frequencyDays: number;
  maxImpressions: number | null;
  startDate: Timestamp;
  endDate: Timestamp | null;
  variant: string;
  customTitle?: string;
  customTagline?: string;
  customDescription?: string;
  customCta?: string;
  totalImpressions: number;
  totalClicks: number;
  totalCloses: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

const STATUS_BADGE_MAP: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  active: 'success',
  paused: 'warning',
  scheduled: 'info',
  ended: 'danger',
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
 * Skeleton loader for the campaign detail page.
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

export default function CampaignDetailAdminPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCampaign = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const docRef = doc(db, 'zaions_campaigns', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCampaign({ id: docSnap.id, ...docSnap.data() } as CampaignData);
      } else {
        setError('Campaign not found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch campaign';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    trackPageView(`/admin/campaigns/${id}`, 'Campaign Detail');
    fetchCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Deletes the campaign and navigates back to the campaigns list.
   */
  async function handleDelete() {
    if (!id) return;
    setDeleting(true);

    try {
      await deleteDoc(doc(db, 'zaions_campaigns', id));
      trackEvent('admin_campaign_deleted', { campaignId: id });
      navigate('/admin/campaigns');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete campaign';
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

  const totalInteractions = (campaign?.totalImpressions ?? 0) + (campaign?.totalClicks ?? 0) + (campaign?.totalCloses ?? 0);
  const ctr = campaign?.totalImpressions
    ? ((campaign.totalClicks / campaign.totalImpressions) * 100).toFixed(1)
    : '0.0';

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
              <Link to="/admin/campaigns" className="hover:text-white transition-colors">
                Campaigns
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{campaign?.name ?? 'Loading...'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Megaphone className="h-8 w-8" />
                  {campaign?.name ?? 'Campaign Detail'}
                </h1>
                {campaign && (
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant={STATUS_BADGE_MAP[campaign.status] ?? 'default'}
                      className="bg-white/20 text-white border-white/30"
                    >
                      {campaign.status}
                    </Badge>
                    <span className="text-violet-200 text-sm">
                      Priority: {campaign.priority}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/campaigns">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                {campaign && (
                  <>
                    <Link to="/admin/campaigns">
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
        ) : campaign ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Metrics Cards */}
            <motion.div variants={staggerItem}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Impressions',
                    value: campaign.totalImpressions.toLocaleString(),
                    icon: Eye,
                    color: 'bg-blue-100 text-blue-600',
                  },
                  {
                    label: 'Total Clicks',
                    value: campaign.totalClicks.toLocaleString(),
                    icon: MousePointer,
                    color: 'bg-green-100 text-green-600',
                  },
                  {
                    label: 'Total Closes',
                    value: campaign.totalCloses.toLocaleString(),
                    icon: XCircle,
                    color: 'bg-red-100 text-red-600',
                  },
                  {
                    label: 'Click-Through Rate',
                    value: `${ctr}%`,
                    icon: BarChart3,
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

            {/* Impressions Bar Chart */}
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-violet-600" />
                    Impressions Breakdown
                  </CardTitle>
                  <CardDescription>Visual breakdown of campaign interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Impressions', value: campaign.totalImpressions, color: 'bg-blue-500', max: totalInteractions || 1 },
                      { label: 'Clicks', value: campaign.totalClicks, color: 'bg-green-500', max: totalInteractions || 1 },
                      { label: 'Closes', value: campaign.totalCloses, color: 'bg-red-400', max: totalInteractions || 1 },
                    ].map((bar) => (
                      <div key={bar.label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-surface-700">{bar.label}</span>
                          <span className="text-surface-500">{bar.value.toLocaleString()}</span>
                        </div>
                        <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-700', bar.color)}
                            style={{ width: `${Math.max((bar.value / bar.max) * 100, 0)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Campaign Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Targeting */}
              <motion.div variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-violet-600" />
                      Targeting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-surface-500">Product ID</p>
                      <p className="font-mono text-surface-900">{campaign.productId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Platforms</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(campaign.targetPlatforms ?? []).map((p) => (
                          <Badge key={p} variant="outline" size="sm">
                            {p}
                          </Badge>
                        ))}
                        {(campaign.targetPlatforms ?? []).length === 0 && (
                          <span className="text-sm text-surface-400">All platforms</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Audience</p>
                      <p className="font-medium text-surface-900 capitalize">
                        {campaign.targetAudience}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Target Projects</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(campaign.targetProjects ?? []).length > 0 ? (
                          campaign.targetProjects.map((p) => (
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
                      <p className="text-sm text-surface-500">Exclude Product Users</p>
                      <p className="text-surface-900">
                        {campaign.excludeProductUsers ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Display Rules */}
              <motion.div variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-violet-600" />
                      Display Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-surface-500">Placements</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(campaign.placements ?? []).map((p) => (
                          <Badge key={p} variant="default" size="sm">
                            {p.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Variant</p>
                      <p className="font-medium text-surface-900">{campaign.variant}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Frequency Cap</p>
                      <p className="text-surface-900">
                        Every {campaign.frequencyDays} days
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Max Impressions</p>
                      <p className="text-surface-900">
                        {campaign.maxImpressions ? campaign.maxImpressions.toLocaleString() : 'Unlimited'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Timeline */}
              <motion.div variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-violet-600" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-surface-500">Start Date</p>
                      <p className="text-surface-900">{formatTimestamp(campaign.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">End Date</p>
                      <p className="text-surface-900">{formatTimestamp(campaign.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Created</p>
                      <p className="text-surface-900">{formatTimestamp(campaign.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Last Updated</p>
                      <p className="text-surface-900">{formatTimestamp(campaign.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Creative */}
              <motion.div variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-violet-600" />
                      Creative Overrides
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-surface-500">Custom Title</p>
                      <p className="text-surface-900">
                        {campaign.customTitle || <span className="text-surface-400 italic">None</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Custom Tagline</p>
                      <p className="text-surface-900">
                        {campaign.customTagline || <span className="text-surface-400 italic">None</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Custom Description</p>
                      <p className="text-surface-900">
                        {campaign.customDescription || <span className="text-surface-400 italic">None</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Custom CTA</p>
                      <p className="text-surface-900">
                        {campaign.customCta || <span className="text-surface-400 italic">None</span>}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Metadata */}
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-surface-500">Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-surface-400">Campaign ID</p>
                      <p className="font-mono text-surface-700 break-all">{campaign.id}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Created By</p>
                      <p className="text-surface-700">{campaign.createdBy ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Updated By</p>
                      <p className="text-surface-700">{campaign.updatedBy ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Priority</p>
                      <p className="text-surface-700">{campaign.priority}/100</p>
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
            <DialogTitle className="text-red-600">Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{campaign?.name}&quot;? This action cannot be
              undone. All associated data will be permanently removed.
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
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
