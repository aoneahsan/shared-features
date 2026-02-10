import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Search,
  Star,
  Code,
  Palette,
  Globe,
  Smartphone,
  Database,
  Shield,
  Zap,
  Settings,
  BarChart,
  Users,
  FileText,
  Layers,
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

const ICON_OPTIONS = [
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
  { value: 'Database', label: 'Database', icon: Database },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Settings', label: 'Settings', icon: Settings },
  { value: 'BarChart', label: 'BarChart', icon: BarChart },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'FileText', label: 'FileText', icon: FileText },
  { value: 'Layers', label: 'Layers', icon: Layers },
  { value: 'Briefcase', label: 'Briefcase', icon: Briefcase },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Palette,
  Globe,
  Smartphone,
  Database,
  Shield,
  Zap,
  Settings,
  BarChart,
  Users,
  FileText,
  Layers,
  Briefcase,
};

const serviceFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().min(1, 'Icon is required'),
  features: z.string(),
  technologies: z.string(),
  priceRange: z.string(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  order: z.number().min(0),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface ServiceDoc {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  icon: string;
  features: string[];
  technologies: string[];
  priceRange: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
}

function ServiceCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-10 w-10 rounded-lg bg-surface-200" />
        <div className="h-4 w-32 rounded bg-surface-200 mt-2" />
        <div className="h-3 w-48 rounded bg-surface-200 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-3 w-full rounded bg-surface-100" />
        <div className="h-3 w-3/4 rounded bg-surface-100 mt-2" />
      </CardContent>
    </Card>
  );
}

export default function ServicesAdminPage() {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<ServiceDoc | null>(null);
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
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      category: '',
      icon: 'Code',
      features: '',
      technologies: '',
      priceRange: '',
      isActive: true,
      isFeatured: false,
      order: 0,
    },
  });

  const watchIsActive = watch('isActive');
  const watchIsFeatured = watch('isFeatured');

  const fetchServices = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'portfolio_services'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ServiceDoc[];
      setServices(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/services', 'Services Admin');
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateDialog() {
    setEditingService(null);
    reset({
      title: '',
      description: '',
      shortDescription: '',
      category: '',
      icon: 'Code',
      features: '',
      technologies: '',
      priceRange: '',
      isActive: true,
      isFeatured: false,
      order: services.length,
    });
    setDialogOpen(true);
  }

  function openEditDialog(service: ServiceDoc) {
    setEditingService(service);
    reset({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription,
      category: service.category,
      icon: service.icon ?? 'Code',
      features: (service.features ?? []).join('\n'),
      technologies: (service.technologies ?? []).join('\n'),
      priceRange: service.priceRange ?? '',
      isActive: service.isActive ?? true,
      isFeatured: service.isFeatured ?? false,
      order: service.order ?? 0,
    });
    setDialogOpen(true);
  }

  async function onSubmit(data: ServiceFormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const featuresArray = data.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const technologiesArray = data.technologies
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const serviceData = {
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        category: data.category,
        icon: data.icon,
        features: featuresArray,
        technologies: technologiesArray,
        priceRange: data.priceRange,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        order: data.order,
        updatedAt: serverTimestamp(),
      };

      if (editingService) {
        const docRef = doc(db, 'portfolio_services', editingService.id);
        await updateDoc(docRef, serviceData);
        setSuccessMessage(`Service "${data.title}" updated successfully!`);
        trackEvent('admin_service_updated', { serviceId: editingService.id });
      } else {
        await addDoc(collection(db, 'portfolio_services'), {
          ...serviceData,
          createdAt: serverTimestamp(),
        });
        setSuccessMessage(`Service "${data.title}" created successfully!`);
        trackEvent('admin_service_created');
      }

      setDialogOpen(false);
      fetchServices();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save service';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingService) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'portfolio_services', deletingService.id));
      setSuccessMessage(`Service "${deletingService.title}" deleted successfully!`);
      trackEvent('admin_service_deleted', { serviceId: deletingService.id });
      setDeleteDialogOpen(false);
      setDeletingService(null);
      fetchServices();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete service';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="text-white">Services</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Briefcase className="h-8 w-8" />
                  Services
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage professional services offered in the portfolio.
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
                  Add Service
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
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No services found</p>
              <p className="text-surface-400 text-sm mt-1">
                {searchQuery ? 'Try a different search term.' : 'Add your first service to get started.'}
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
            {filteredServices.map((service) => {
              const IconComponent = ICON_MAP[service.icon] ?? Briefcase;
              return (
                <motion.div key={service.id} variants={staggerItem}>
                  <Card className="h-full flex flex-col group hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" size="sm">
                            {service.category}
                          </Badge>
                          {service.isFeatured && (
                            <Badge variant="warning" size="sm">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge
                            variant={service.isActive ? 'success' : 'danger'}
                            size="sm"
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-base mt-2">{service.title}</CardTitle>
                      <CardDescription>{service.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {service.priceRange && (
                        <p className="text-sm font-medium text-violet-600 mb-2">
                          {service.priceRange}
                        </p>
                      )}
                      {service.technologies && service.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {service.technologies.slice(0, 4).map((t) => (
                            <Badge key={t} variant="outline" size="sm">
                              {t}
                            </Badge>
                          ))}
                          {service.technologies.length > 4 && (
                            <Badge variant="outline" size="sm">
                              +{service.technologies.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-surface-100">
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-surface-400">Order: {service.order}</span>
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setDeletingService(service);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Create Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? 'Update the service details below.'
                : 'Add a new professional service to your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Title"
                placeholder="Web Development"
                error={formErrors.title?.message}
                {...register('title')}
              />
              <Input
                label="Category"
                placeholder="Development"
                error={formErrors.category?.message}
                {...register('category')}
              />
            </div>

            <Textarea
              label="Short Description"
              placeholder="Brief description for card display"
              error={formErrors.shortDescription?.message}
              {...register('shortDescription')}
            />

            <Textarea
              label="Full Description"
              placeholder="Detailed description of the service"
              rows={4}
              error={formErrors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Icon</label>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {opt.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <Input
                label="Price Range"
                placeholder="$500 - $2,000"
                error={formErrors.priceRange?.message}
                {...register('priceRange')}
              />
            </div>

            <Textarea
              label="Features (one per line)"
              placeholder="Custom design&#10;Responsive layout&#10;SEO optimization"
              error={formErrors.features?.message}
              {...register('features')}
            />

            <Textarea
              label="Technologies (one per line)"
              placeholder="React&#10;Node.js&#10;TypeScript"
              error={formErrors.technologies?.message}
              {...register('technologies')}
            />

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
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingService?.title}&quot;? This action
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
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
