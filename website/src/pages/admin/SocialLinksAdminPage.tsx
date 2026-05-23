import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Share2,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Send,
  Globe,
  Mail,
  ExternalLink,
  GripVertical,
} from 'lucide-react';
import { Github, Linkedin, Twitter, Facebook, Instagram, Youtube } from '@/components/icons/BrandIcons';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
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
import { Switch } from '@radix-ui/react-switch';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PLATFORM_OPTIONS = [
  'github',
  'linkedin',
  'twitter',
  'facebook',
  'instagram',
  'youtube',
  'tiktok',
  'discord',
  'telegram',
  'whatsapp',
  'medium',
  'devto',
  'stackoverflow',
  'dribbble',
  'behance',
  'codepen',
  'npm',
  'website',
  'email',
  'other',
] as const;

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  telegram: Send,
  whatsapp: MessageCircle,
  website: Globe,
  email: Mail,
};

const formSchema = z.object({
  platform: z.enum(PLATFORM_OPTIONS),
  url: z.string().url('Must be a valid URL'),
  displayName: z.string().min(1, 'Display name is required'),
  username: z.string(),
  icon: z.string(),
  order: z.number().min(0),
  isActive: z.boolean(),
  showIn: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface SocialLinkDoc {
  id: string;
  platform: string;
  url: string;
  displayName: string;
  username?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  showIn?: string[];
  createdAt: unknown;
  updatedAt: unknown;
}

/**
 * Get the icon component for a platform.
 */
function getPlatformIcon(platform: string): React.ComponentType<{ className?: string }> {
  return PLATFORM_ICONS[platform] ?? Globe;
}

/**
 * Skeleton loader for the social links table.
 */
function TableSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-surface-200" />
      ))}
    </div>
  );
}

export default function SocialLinksAdminPage() {
  const { isAdmin, user } = useAuth();
  const [socialLinks, setSocialLinks] = useState<SocialLinkDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLinkDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<SocialLinkDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: 'github',
      url: '',
      displayName: '',
      username: '',
      icon: '',
      order: 0,
      isActive: true,
      showIn: 'header,footer',
    },
  });

  const watchIsActive = watch('isActive');

  const fetchSocialLinks = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'portfolio_social_links'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as SocialLinkDoc[];
      setSocialLinks(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch social links';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/social-links', 'Social Links Admin');
    fetchSocialLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens the dialog in create mode with default form values.
   */
  function openCreateDialog() {
    setEditingLink(null);
    const nextOrder = socialLinks.length > 0 ? Math.max(...socialLinks.map((l) => l.order)) + 1 : 0;
    reset({
      platform: 'github',
      url: '',
      displayName: '',
      username: '',
      icon: '',
      order: nextOrder,
      isActive: true,
      showIn: 'header,footer',
    });
    setDialogOpen(true);
  }

  /**
   * Opens the dialog in edit mode with pre-filled link data.
   */
  function openEditDialog(link: SocialLinkDoc) {
    setEditingLink(link);
    reset({
      platform: link.platform as FormData['platform'],
      url: link.url,
      displayName: link.displayName,
      username: link.username ?? '',
      icon: link.icon ?? '',
      order: link.order,
      isActive: link.isActive,
      showIn: (link.showIn ?? []).join(','),
    });
    setDialogOpen(true);
  }

  /**
   * Handles form submission for creating or updating a social link.
   */
  async function onSubmit(data: FormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const showInArray = data.showIn
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const linkData = {
        platform: data.platform,
        url: data.url,
        displayName: data.displayName,
        username: data.username || undefined,
        icon: data.icon || undefined,
        order: data.order,
        isActive: data.isActive,
        showIn: showInArray,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      };

      if (editingLink) {
        const docRef = doc(db, 'portfolio_social_links', editingLink.id);
        await updateDoc(docRef, linkData);
        setSuccessMessage(`Social link "${data.displayName}" updated successfully!`);
        trackEvent('admin_social_link_updated', { linkId: editingLink.id });
      } else {
        await addDoc(collection(db, 'portfolio_social_links'), {
          ...linkData,
          createdAt: serverTimestamp(),
        });
        setSuccessMessage(`Social link "${data.displayName}" created successfully!`);
        trackEvent('admin_social_link_created');
      }

      setDialogOpen(false);
      fetchSocialLinks();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save social link';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /**
   * Handles social link deletion after confirmation.
   */
  async function handleDelete() {
    if (!deletingLink) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'portfolio_social_links', deletingLink.id));
      setSuccessMessage(`Social link "${deletingLink.displayName}" deleted successfully!`);
      trackEvent('admin_social_link_deleted', { linkId: deletingLink.id });
      setDeleteDialogOpen(false);
      setDeletingLink(null);
      fetchSocialLinks();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete social link';
      setError(message);
    } finally {
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
              <span className="text-white">Social Links</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Share2 className="h-8 w-8" />
                  Social Links
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage your social media profiles and online presence links.
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
                  Add Social Link
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

        {/* Social Links Table */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>All Social Links</CardTitle>
              <CardDescription>
                Manage your social media profiles. Drag to reorder or edit order numbers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableSkeleton />
              ) : socialLinks.length === 0 ? (
                <div className="py-12 text-center">
                  <Share2 className="h-12 w-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500 font-medium">No social links yet</p>
                  <p className="text-surface-400 text-sm mt-1">
                    Add your first social media profile to get started.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Order</TableHead>
                      <TableHead>Show In</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {socialLinks.map((link) => {
                      const IconComponent = getPlatformIcon(link.platform);
                      return (
                        <TableRow key={link.id}>
                          <TableCell>
                            <GripVertical className="h-4 w-4 text-surface-300" />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-surface-100 flex items-center justify-center">
                                <IconComponent className="h-4 w-4 text-surface-600" />
                              </div>
                              <span className="font-medium capitalize">{link.platform}</span>
                            </div>
                          </TableCell>
                          <TableCell>{link.displayName}</TableCell>
                          <TableCell>
                            <span className="text-surface-500">{link.username || '-'}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={link.isActive ? 'success' : 'danger'}
                              size="sm"
                            >
                              {link.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-mono text-sm">{link.order}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(link.showIn ?? []).map((place) => (
                                <Badge key={place} variant="outline" size="sm">
                                  {place}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-600 hover:text-violet-700"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(link)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setDeletingLink(link);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Social Link' : 'Add Social Link'}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? 'Update the social link details below.'
                : 'Add a new social media profile or link.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-surface-700">Platform</label>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <SelectRoot value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORM_OPTIONS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          <span className="capitalize">{platform}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                )}
              />
            </div>

            <Input
              label="URL"
              placeholder="https://github.com/username"
              error={formErrors.url?.message}
              {...register('url')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                placeholder="GitHub"
                error={formErrors.displayName?.message}
                {...register('displayName')}
              />
              <Input
                label="Username"
                placeholder="@username"
                error={formErrors.username?.message}
                {...register('username')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Custom Icon URL (optional)"
                placeholder="https://example.com/icon.svg"
                error={formErrors.icon?.message}
                {...register('icon')}
              />
              <Input
                label="Order"
                type="number"
                min={0}
                error={formErrors.order?.message}
                {...register('order', { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Show In (comma-separated)"
              placeholder="header, footer, contact, profile"
              error={formErrors.showIn?.message}
              {...register('showIn')}
            />

            {/* Active Switch */}
            <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
              <div>
                <p className="font-medium text-surface-900">Active</p>
                <p className="text-sm text-surface-500">
                  Only active links are displayed publicly.
                </p>
              </div>
              <Switch
                checked={watchIsActive}
                onCheckedChange={(checked: boolean) => setValue('isActive', checked, { shouldDirty: true })}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                  watchIsActive ? 'bg-violet-600' : 'bg-surface-300'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                    watchIsActive ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </Switch>
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
              {editingLink ? 'Update Link' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Social Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingLink?.displayName}&quot;? This action
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
              Delete Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
