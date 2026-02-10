import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquareQuote,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Search,
  Star,
  ExternalLink,
} from 'lucide-react';
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
  Timestamp,
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
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@radix-ui/react-switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

const testimonialFormSchema = z.object({
  authorName: z.string().min(1, 'Author name is required'),
  authorTitle: z.string().min(1, 'Author title is required'),
  authorCompany: z.string(),
  authorAvatar: z.string(),
  authorLinkedin: z.string(),
  content: z.string().min(1, 'Content is required'),
  shortContent: z.string(),
  rating: z.number().min(1).max(5),
  projectName: z.string(),
  projectUrl: z.string(),
  date: z.string(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  order: z.number().min(0),
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

interface TestimonialDoc {
  id: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string;
  authorAvatar: string;
  authorLinkedin: string;
  content: string;
  shortContent: string;
  rating: number;
  projectName: string;
  projectUrl: string;
  date: Timestamp | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
}

function TestimonialCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-surface-200" />
          <div className="flex-1">
            <div className="h-4 w-24 rounded bg-surface-200" />
            <div className="h-3 w-32 rounded bg-surface-200 mt-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-3 w-full rounded bg-surface-100" />
        <div className="h-3 w-3/4 rounded bg-surface-100 mt-2" />
      </CardContent>
    </Card>
  );
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating ? 'text-amber-400 fill-amber-400' : 'text-surface-300'
          )}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function TestimonialsAdminPage() {
  const { isAdmin } = useAuth();
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState<TestimonialDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      authorName: '',
      authorTitle: '',
      authorCompany: '',
      authorAvatar: '',
      authorLinkedin: '',
      content: '',
      shortContent: '',
      rating: 5,
      projectName: '',
      projectUrl: '',
      date: '',
      isActive: true,
      isFeatured: false,
      order: 0,
    },
  });

  const watchIsActive = watch('isActive');
  const watchIsFeatured = watch('isFeatured');
  const watchRating = watch('rating');

  const fetchTestimonials = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as TestimonialDoc[];
      setTestimonials(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch testimonials';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/testimonials', 'Testimonials Admin');
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateDialog() {
    setEditingTestimonial(null);
    reset({
      authorName: '',
      authorTitle: '',
      authorCompany: '',
      authorAvatar: '',
      authorLinkedin: '',
      content: '',
      shortContent: '',
      rating: 5,
      projectName: '',
      projectUrl: '',
      date: new Date().toISOString().slice(0, 10),
      isActive: true,
      isFeatured: false,
      order: testimonials.length,
    });
    setDialogOpen(true);
  }

  function openEditDialog(testimonial: TestimonialDoc) {
    setEditingTestimonial(testimonial);
    reset({
      authorName: testimonial.authorName,
      authorTitle: testimonial.authorTitle,
      authorCompany: testimonial.authorCompany ?? '',
      authorAvatar: testimonial.authorAvatar ?? '',
      authorLinkedin: testimonial.authorLinkedin ?? '',
      content: testimonial.content,
      shortContent: testimonial.shortContent ?? '',
      rating: testimonial.rating ?? 5,
      projectName: testimonial.projectName ?? '',
      projectUrl: testimonial.projectUrl ?? '',
      date: testimonial.date
        ? new Date(testimonial.date.toMillis()).toISOString().slice(0, 10)
        : '',
      isActive: testimonial.isActive ?? true,
      isFeatured: testimonial.isFeatured ?? false,
      order: testimonial.order ?? 0,
    });
    setDialogOpen(true);
  }

  async function onSubmit(data: TestimonialFormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const testimonialData = {
        authorName: data.authorName,
        authorTitle: data.authorTitle,
        authorCompany: data.authorCompany,
        authorAvatar: data.authorAvatar,
        authorLinkedin: data.authorLinkedin,
        content: data.content,
        shortContent: data.shortContent,
        rating: data.rating,
        projectName: data.projectName,
        projectUrl: data.projectUrl,
        date: data.date ? Timestamp.fromDate(new Date(data.date)) : null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        order: data.order,
        updatedAt: serverTimestamp(),
      };

      if (editingTestimonial) {
        const docRef = doc(db, 'testimonials', editingTestimonial.id);
        await updateDoc(docRef, testimonialData);
        setSuccessMessage(`Testimonial from "${data.authorName}" updated successfully!`);
        trackEvent('admin_testimonial_updated', { testimonialId: editingTestimonial.id });
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...testimonialData,
          createdAt: serverTimestamp(),
        });
        setSuccessMessage(`Testimonial from "${data.authorName}" created successfully!`);
        trackEvent('admin_testimonial_created');
      }

      setDialogOpen(false);
      fetchTestimonials();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save testimonial';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingTestimonial) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'testimonials', deletingTestimonial.id));
      setSuccessMessage(`Testimonial from "${deletingTestimonial.authorName}" deleted successfully!`);
      trackEvent('admin_testimonial_deleted', { testimonialId: deletingTestimonial.id });
      setDeleteDialogOpen(false);
      setDeletingTestimonial(null);
      fetchTestimonials();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete testimonial';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="text-white">Testimonials</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <MessageSquareQuote className="h-8 w-8" />
                  Testimonials
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage client testimonials and reviews.
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
                  Add Testimonial
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
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <TestimonialCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquareQuote className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No testimonials found</p>
              <p className="text-surface-400 text-sm mt-1">
                {searchQuery ? 'Try a different search term.' : 'Add your first testimonial to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredTestimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={staggerItem}>
                <Card className="h-full flex flex-col group hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {testimonial.authorAvatar ? (
                        <img
                          src={testimonial.authorAvatar}
                          alt={testimonial.authorName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-medium">
                          {getInitials(testimonial.authorName)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {testimonial.authorName}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {testimonial.authorTitle}
                          {testimonial.authorCompany && ` @ ${testimonial.authorCompany}`}
                        </CardDescription>
                        <div className="mt-1">
                          <StarRating rating={testimonial.rating} size="sm" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {testimonial.isFeatured && (
                          <Badge variant="warning" size="sm">
                            Featured
                          </Badge>
                        )}
                        <Badge
                          variant={testimonial.isActive ? 'success' : 'danger'}
                          size="sm"
                        >
                          {testimonial.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-surface-600 line-clamp-3 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    {testimonial.projectName && (
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="outline" size="sm">
                          {testimonial.projectName}
                        </Badge>
                        {testimonial.projectUrl && (
                          <a
                            href={testimonial.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-600 hover:text-violet-700"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-surface-100">
                    <div className="flex items-center gap-2 w-full">
                      {testimonial.authorLinkedin && (
                        <a
                          href={testimonial.authorLinkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:text-violet-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <span className="text-xs text-surface-400">Order: {testimonial.order}</span>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(testimonial)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setDeletingTestimonial(testimonial);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? 'Update the testimonial details below.'
                : 'Add a new client testimonial to your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Author Name"
                placeholder="John Doe"
                error={formErrors.authorName?.message}
                {...register('authorName')}
              />
              <Input
                label="Author Title"
                placeholder="CEO"
                error={formErrors.authorTitle?.message}
                {...register('authorTitle')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company"
                placeholder="Acme Inc."
                error={formErrors.authorCompany?.message}
                {...register('authorCompany')}
              />
              <Input
                label="Author Avatar URL"
                placeholder="https://..."
                error={formErrors.authorAvatar?.message}
                {...register('authorAvatar')}
              />
            </div>

            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              error={formErrors.authorLinkedin?.message}
              {...register('authorLinkedin')}
            />

            <Textarea
              label="Full Testimonial"
              placeholder="What the client said about your work..."
              rows={4}
              error={formErrors.content?.message}
              {...register('content')}
            />

            <Textarea
              label="Short Testimonial (for cards)"
              placeholder="Brief version for display..."
              error={formErrors.shortContent?.message}
              {...register('shortContent')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Rating (1-5)</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    className="w-20"
                    {...register('rating', { valueAsNumber: true })}
                  />
                  <StarRating rating={watchRating} />
                </div>
                {formErrors.rating && (
                  <p className="text-sm text-red-500">{formErrors.rating.message}</p>
                )}
              </div>
              <Input
                label="Date"
                type="date"
                error={formErrors.date?.message}
                {...register('date')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Project Name"
                placeholder="Website Redesign"
                error={formErrors.projectName?.message}
                {...register('projectName')}
              />
              <Input
                label="Project URL"
                placeholder="https://..."
                error={formErrors.projectUrl?.message}
                {...register('projectUrl')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Order"
                type="number"
                error={formErrors.order?.message}
                {...register('order', { valueAsNumber: true })}
              />

              <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                <div>
                  <p className="font-medium text-surface-900 text-sm">Active</p>
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

              <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                <div>
                  <p className="font-medium text-surface-900 text-sm">Featured</p>
                </div>
                <Switch
                  checked={watchIsFeatured}
                  onCheckedChange={(checked: boolean) => setValue('isFeatured', checked, { shouldDirty: true })}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                    watchIsFeatured ? 'bg-violet-600' : 'bg-surface-300'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                      watchIsFeatured ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </Switch>
              </div>
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
              {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the testimonial from &quot;{deletingTestimonial?.authorName}&quot;?
              This action cannot be undone.
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
              Delete Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
