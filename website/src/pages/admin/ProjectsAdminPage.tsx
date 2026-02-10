import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Search,
  Star,
  Github,
  Globe,
  Smartphone,
  Package,
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

const CATEGORY_OPTIONS = ['web', 'mobile', 'extension', 'full-stack', 'package', 'other'] as const;
const STATUS_OPTIONS = ['planning', 'in-progress', 'completed', 'maintained', 'archived'] as const;

const CATEGORY_BADGE_MAP: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  web: 'info',
  mobile: 'success',
  extension: 'warning',
  'full-stack': 'default',
  package: 'default',
  other: 'default',
};

const STATUS_BADGE_MAP: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  planning: 'warning',
  'in-progress': 'info',
  completed: 'success',
  maintained: 'default',
  archived: 'danger',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  category: z.enum(CATEGORY_OPTIONS),
  status: z.enum(STATUS_OPTIONS),
  thumbnailUrl: z.string(),
  images: z.string(),
  technologies: z.string(),
  features: z.string(),
  website: z.string(),
  github: z.string(),
  playStore: z.string(),
  appStore: z.string(),
  npm: z.string(),
  demo: z.string(),
  clientName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  order: z.number().min(0),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectDoc {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  status: string;
  thumbnailUrl: string;
  images: string[];
  technologies: string[];
  features: string[];
  links: {
    website?: string;
    github?: string;
    playStore?: string;
    appStore?: string;
    npm?: string;
    demo?: string;
  };
  clientName: string;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
}

function ProjectCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="h-40 bg-surface-200 rounded-t-lg" />
      <CardHeader>
        <div className="h-4 w-32 rounded bg-surface-200" />
        <div className="h-3 w-48 rounded bg-surface-200 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-3 w-full rounded bg-surface-100" />
        <div className="h-3 w-3/4 rounded bg-surface-100 mt-2" />
      </CardContent>
    </Card>
  );
}

export default function ProjectsAdminPage() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<ProjectDoc | null>(null);
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
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      shortDescription: '',
      category: 'web',
      status: 'planning',
      thumbnailUrl: '',
      images: '',
      technologies: '',
      features: '',
      website: '',
      github: '',
      playStore: '',
      appStore: '',
      npm: '',
      demo: '',
      clientName: '',
      startDate: '',
      endDate: '',
      isActive: true,
      isFeatured: false,
      order: 0,
    },
  });

  const watchIsActive = watch('isActive');
  const watchIsFeatured = watch('isFeatured');
  const watchTitle = watch('title');
  const watchThumbnailUrl = watch('thumbnailUrl');

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'portfolio_projects'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ProjectDoc[];
      setProjects(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/projects', 'Projects Admin');
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingProject && watchTitle) {
      setValue('slug', slugify(watchTitle));
    }
  }, [watchTitle, editingProject, setValue]);

  function openCreateDialog() {
    setEditingProject(null);
    reset({
      title: '',
      slug: '',
      description: '',
      shortDescription: '',
      category: 'web',
      status: 'planning',
      thumbnailUrl: '',
      images: '',
      technologies: '',
      features: '',
      website: '',
      github: '',
      playStore: '',
      appStore: '',
      npm: '',
      demo: '',
      clientName: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      isActive: true,
      isFeatured: false,
      order: projects.length,
    });
    setDialogOpen(true);
  }

  function openEditDialog(project: ProjectDoc) {
    setEditingProject(project);
    reset({
      title: project.title,
      slug: project.slug,
      description: project.description,
      shortDescription: project.shortDescription,
      category: (project.category as ProjectFormData['category']) ?? 'web',
      status: (project.status as ProjectFormData['status']) ?? 'planning',
      thumbnailUrl: project.thumbnailUrl ?? '',
      images: (project.images ?? []).join('\n'),
      technologies: (project.technologies ?? []).join('\n'),
      features: (project.features ?? []).join('\n'),
      website: project.links?.website ?? '',
      github: project.links?.github ?? '',
      playStore: project.links?.playStore ?? '',
      appStore: project.links?.appStore ?? '',
      npm: project.links?.npm ?? '',
      demo: project.links?.demo ?? '',
      clientName: project.clientName ?? '',
      startDate: project.startDate
        ? new Date(project.startDate.toMillis()).toISOString().slice(0, 10)
        : '',
      endDate: project.endDate
        ? new Date(project.endDate.toMillis()).toISOString().slice(0, 10)
        : '',
      isActive: project.isActive ?? true,
      isFeatured: project.isFeatured ?? false,
      order: project.order ?? 0,
    });
    setDialogOpen(true);
  }

  async function onSubmit(data: ProjectFormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const imagesArray = data.images
        .split('\n')
        .map((i) => i.trim())
        .filter(Boolean);

      const technologiesArray = data.technologies
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const featuresArray = data.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const projectData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        category: data.category,
        status: data.status,
        thumbnailUrl: data.thumbnailUrl,
        images: imagesArray,
        technologies: technologiesArray,
        features: featuresArray,
        links: {
          website: data.website || undefined,
          github: data.github || undefined,
          playStore: data.playStore || undefined,
          appStore: data.appStore || undefined,
          npm: data.npm || undefined,
          demo: data.demo || undefined,
        },
        clientName: data.clientName,
        startDate: data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : null,
        endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        order: data.order,
        updatedAt: serverTimestamp(),
      };

      if (editingProject) {
        const docRef = doc(db, 'portfolio_projects', editingProject.id);
        await updateDoc(docRef, projectData);
        setSuccessMessage(`Project "${data.title}" updated successfully!`);
        trackEvent('admin_project_updated', { projectId: editingProject.id });
      } else {
        await addDoc(collection(db, 'portfolio_projects'), {
          ...projectData,
          createdAt: serverTimestamp(),
        });
        setSuccessMessage(`Project "${data.title}" created successfully!`);
        trackEvent('admin_project_created');
      }

      setDialogOpen(false);
      fetchProjects();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save project';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingProject) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'portfolio_projects', deletingProject.id));
      setSuccessMessage(`Project "${deletingProject.title}" deleted successfully!`);
      trackEvent('admin_project_deleted', { projectId: deletingProject.id });
      setDeleteDialogOpen(false);
      setDeletingProject(null);
      fetchProjects();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <span className="text-white">Projects</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <FolderKanban className="h-8 w-8" />
                  Projects
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage portfolio projects and case studies.
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
                  Add Project
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderKanban className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No projects found</p>
              <p className="text-surface-400 text-sm mt-1">
                {searchQuery ? 'Try a different search term.' : 'Add your first project to get started.'}
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
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={staggerItem}>
                <Card className="h-full flex flex-col group hover:shadow-lg transition-all overflow-hidden">
                  {/* Thumbnail */}
                  <div className="h-40 bg-surface-100 relative overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderKanban className="h-12 w-12 text-surface-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {project.isFeatured && (
                        <Badge variant="warning" size="sm">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={CATEGORY_BADGE_MAP[project.category] ?? 'default'} size="sm">
                        {project.category}
                      </Badge>
                      <Badge variant={STATUS_BADGE_MAP[project.status] ?? 'default'} size="sm">
                        {project.status}
                      </Badge>
                      <Badge
                        variant={project.isActive ? 'success' : 'danger'}
                        size="sm"
                      >
                        {project.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.shortDescription}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((t) => (
                          <Badge key={t} variant="outline" size="sm">
                            {t}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="outline" size="sm">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-surface-100">
                    <div className="flex items-center gap-2 w-full">
                      {/* Links */}
                      {project.links?.website && (
                        <a
                          href={project.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-surface-500 hover:text-violet-600"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-surface-500 hover:text-violet-600"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.links?.playStore && (
                        <a
                          href={project.links.playStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-surface-500 hover:text-violet-600"
                        >
                          <Smartphone className="h-4 w-4" />
                        </a>
                      )}
                      {project.links?.npm && (
                        <a
                          href={project.links.npm}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-surface-500 hover:text-violet-600"
                        >
                          <Package className="h-4 w-4" />
                        </a>
                      )}

                      <span className="text-xs text-surface-400 ml-auto">Order: {project.order}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setDeletingProject(project);
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? 'Update the project details below.'
                : 'Add a new project to your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Title"
                placeholder="My Awesome Project"
                error={formErrors.title?.message}
                {...register('title')}
              />
              <Input
                label="Slug"
                placeholder="my-awesome-project"
                error={formErrors.slug?.message}
                {...register('slug')}
              />
            </div>

            <Textarea
              label="Short Description"
              placeholder="Brief description for cards"
              error={formErrors.shortDescription?.message}
              {...register('shortDescription')}
            />

            <Textarea
              label="Full Description"
              placeholder="Detailed project description..."
              rows={4}
              error={formErrors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <SelectItem value="web">Web</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="extension">Extension</SelectItem>
                        <SelectItem value="full-stack">Full-Stack</SelectItem>
                        <SelectItem value="package">Package</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
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
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="maintained">Maintained</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  label="Thumbnail URL"
                  placeholder="https://..."
                  error={formErrors.thumbnailUrl?.message}
                  {...register('thumbnailUrl')}
                />
                {watchThumbnailUrl && (
                  <div className="h-24 w-full rounded-lg border border-surface-200 overflow-hidden">
                    <img
                      src={watchThumbnailUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <Input
                label="Client Name"
                placeholder="Client or Company"
                error={formErrors.clientName?.message}
                {...register('clientName')}
              />
            </div>

            <Textarea
              label="Images (one URL per line)"
              placeholder="https://image1.jpg&#10;https://image2.jpg"
              error={formErrors.images?.message}
              {...register('images')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Technologies (one per line)"
                placeholder="React&#10;TypeScript&#10;Node.js"
                error={formErrors.technologies?.message}
                {...register('technologies')}
              />
              <Textarea
                label="Features (one per line)"
                placeholder="Real-time sync&#10;Offline support&#10;Dark mode"
                error={formErrors.features?.message}
                {...register('features')}
              />
            </div>

            <Card className="border-surface-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    placeholder="https://..."
                    error={formErrors.website?.message}
                    {...register('website')}
                  />
                  <Input
                    label="GitHub"
                    placeholder="https://github.com/..."
                    error={formErrors.github?.message}
                    {...register('github')}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Play Store"
                    placeholder="https://play.google.com/..."
                    error={formErrors.playStore?.message}
                    {...register('playStore')}
                  />
                  <Input
                    label="App Store"
                    placeholder="https://apps.apple.com/..."
                    error={formErrors.appStore?.message}
                    {...register('appStore')}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="NPM"
                    placeholder="https://npmjs.com/..."
                    error={formErrors.npm?.message}
                    {...register('npm')}
                  />
                  <Input
                    label="Demo"
                    placeholder="https://demo.example.com"
                    error={formErrors.demo?.message}
                    {...register('demo')}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                error={formErrors.startDate?.message}
                {...register('startDate')}
              />
              <Input
                label="End Date"
                type="date"
                error={formErrors.endDate?.message}
                {...register('endDate')}
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
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingProject?.title}&quot;? This action
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
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
