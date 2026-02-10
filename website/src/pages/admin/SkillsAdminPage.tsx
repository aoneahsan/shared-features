import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Search,
  Star,
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
  CardContent,
  CardFooter,
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

const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

const LEVEL_BADGE_MAP: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  beginner: 'default',
  intermediate: 'info',
  advanced: 'warning',
  expert: 'success',
};

const LEVEL_PERCENT_MAP: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

const skillFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(LEVEL_OPTIONS),
  yearsOfExperience: z.number().min(0).max(50),
  icon: z.string(),
  color: z.string().min(1, 'Color is required'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  order: z.number().min(0),
});

type SkillFormData = z.infer<typeof skillFormSchema>;

interface SkillDoc {
  id: string;
  name: string;
  category: string;
  level: string;
  yearsOfExperience: number;
  icon: string;
  color: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
}

function SkillCardSkeleton() {
  return (
    <div className="animate-pulse p-4 rounded-lg border border-surface-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full bg-surface-200" />
        <div className="h-4 w-24 rounded bg-surface-200" />
        <div className="h-5 w-16 rounded bg-surface-200 ml-auto" />
      </div>
      <div className="h-2 w-full rounded bg-surface-100 mt-3" />
    </div>
  );
}

export default function SkillsAdminPage() {
  const { isAdmin } = useAuth();
  const [skills, setSkills] = useState<SkillDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<SkillDoc | null>(null);
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
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: '',
      category: '',
      level: 'intermediate',
      yearsOfExperience: 1,
      icon: '',
      color: '#7c3aed',
      isActive: true,
      isFeatured: false,
      order: 0,
    },
  });

  const watchIsActive = watch('isActive');
  const watchIsFeatured = watch('isFeatured');

  const fetchSkills = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'portfolio_skills'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as SkillDoc[];
      setSkills(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch skills';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/skills', 'Skills Admin');
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const existingCategories = useMemo(() => {
    const cats = new Set(skills.map((s) => s.category));
    return Array.from(cats).filter(Boolean);
  }, [skills]);

  const groupedSkills = useMemo(() => {
    const filtered = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped: Record<string, SkillDoc[]> = {};
    filtered.forEach((skill) => {
      const cat = skill.category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    });

    return grouped;
  }, [skills, searchQuery]);

  function openCreateDialog() {
    setEditingSkill(null);
    reset({
      name: '',
      category: '',
      level: 'intermediate',
      yearsOfExperience: 1,
      icon: '',
      color: '#7c3aed',
      isActive: true,
      isFeatured: false,
      order: skills.length,
    });
    setDialogOpen(true);
  }

  function openEditDialog(skill: SkillDoc) {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      category: skill.category,
      level: (skill.level as SkillFormData['level']) ?? 'intermediate',
      yearsOfExperience: skill.yearsOfExperience ?? 1,
      icon: skill.icon ?? '',
      color: skill.color ?? '#7c3aed',
      isActive: skill.isActive ?? true,
      isFeatured: skill.isFeatured ?? false,
      order: skill.order ?? 0,
    });
    setDialogOpen(true);
  }

  async function onSubmit(data: SkillFormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const skillData = {
        name: data.name,
        category: data.category,
        level: data.level,
        yearsOfExperience: data.yearsOfExperience,
        icon: data.icon,
        color: data.color,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        order: data.order,
        updatedAt: serverTimestamp(),
      };

      if (editingSkill) {
        const docRef = doc(db, 'portfolio_skills', editingSkill.id);
        await updateDoc(docRef, skillData);
        setSuccessMessage(`Skill "${data.name}" updated successfully!`);
        trackEvent('admin_skill_updated', { skillId: editingSkill.id });
      } else {
        await addDoc(collection(db, 'portfolio_skills'), {
          ...skillData,
          createdAt: serverTimestamp(),
        });
        setSuccessMessage(`Skill "${data.name}" created successfully!`);
        trackEvent('admin_skill_created');
      }

      setDialogOpen(false);
      fetchSkills();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save skill';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingSkill) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'portfolio_skills', deletingSkill.id));
      setSuccessMessage(`Skill "${deletingSkill.name}" deleted successfully!`);
      trackEvent('admin_skill_deleted', { skillId: deletingSkill.id });
      setDeleteDialogOpen(false);
      setDeletingSkill(null);
      fetchSkills();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete skill';
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
              <span className="text-white">Skills</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Award className="h-8 w-8" />
                  Skills
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage skills and expertise displayed in the portfolio.
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
                  Add Skill
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
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Skills by Category */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-5 w-32 rounded bg-surface-200 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <SkillCardSkeleton key={j} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : Object.keys(groupedSkills).length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Award className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No skills found</p>
              <p className="text-surface-400 text-sm mt-1">
                {searchQuery ? 'Try a different search term.' : 'Add your first skill to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <motion.div key={category} variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-4 rounded-lg border border-surface-200 bg-white hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="h-4 w-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: skill.color || '#7c3aed' }}
                            />
                            <span className="font-medium text-surface-900 truncate flex-1">
                              {skill.name}
                            </span>
                            {skill.isFeatured && (
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            )}
                            <Badge
                              variant={LEVEL_BADGE_MAP[skill.level] ?? 'default'}
                              size="sm"
                            >
                              {skill.level}
                            </Badge>
                          </div>

                          {/* Progress Bar */}
                          <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${LEVEL_PERCENT_MAP[skill.level] ?? 50}%`,
                                backgroundColor: skill.color || '#7c3aed',
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-surface-500">
                              {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                            </span>
                            <div className="flex items-center gap-1">
                              {!skill.isActive && (
                                <Badge variant="danger" size="sm">Inactive</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => openEditDialog(skill)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setDeletingSkill(skill);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? 'Edit Skill' : 'Create Skill'}
            </DialogTitle>
            <DialogDescription>
              {editingSkill
                ? 'Update the skill details below.'
                : 'Add a new skill to your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Skill Name"
              placeholder="React"
              error={formErrors.name?.message}
              {...register('name')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-surface-700">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or type category" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                    <Input
                      placeholder="Or type a new category"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                )}
              />
              {formErrors.category && (
                <p className="text-sm text-red-500">{formErrors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Level</label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <Input
                label="Years of Experience"
                type="number"
                min={0}
                max={50}
                error={formErrors.yearsOfExperience?.message}
                {...register('yearsOfExperience', { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Icon (Lucide name or URL)"
                placeholder="Code or https://..."
                error={formErrors.icon?.message}
                {...register('icon')}
              />
              <Input
                label="Color"
                type="color"
                error={formErrors.color?.message}
                {...register('color')}
              />
            </div>

            <Input
              label="Order"
              type="number"
              error={formErrors.order?.message}
              {...register('order', { valueAsNumber: true })}
            />

            <div className="grid grid-cols-2 gap-4">
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
              {editingSkill ? 'Update Skill' : 'Create Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingSkill?.name}&quot;? This action
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
              Delete Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
