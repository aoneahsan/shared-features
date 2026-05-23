import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  ChevronRight,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Globe,
  MapPin,
  FileText,
} from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/icons/BrandIcons';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  tagline: z.string(),
  bio: z.string(),
  shortBio: z.string(),
  avatar: z.string().url('Must be a valid URL').or(z.literal('')),
  website: z.string().url('Must be a valid URL').or(z.literal('')),
  github: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  yearsOfExperience: z.number().min(0).or(z.nan()),
  location: z.string(),
  availableForHire: z.boolean(),
  resumeUrl: z.string().url('Must be a valid URL').or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

const MAX_BIO_LENGTH = 1000;
const MAX_SHORT_BIO_LENGTH = 250;

/**
 * Skeleton loader for the developer info form.
 */
function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card>
        <CardHeader>
          <div className="h-5 w-40 rounded bg-surface-200" />
          <div className="h-4 w-64 rounded bg-surface-200 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 w-full rounded bg-surface-200" />
          <div className="h-10 w-full rounded bg-surface-200" />
          <div className="h-24 w-full rounded bg-surface-200" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 w-40 rounded bg-surface-200" />
        </CardHeader>
        <CardContent>
          <div className="h-32 w-full rounded bg-surface-200" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function DeveloperInfoAdminPage() {
  const { isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      title: '',
      tagline: '',
      bio: '',
      shortBio: '',
      avatar: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
      yearsOfExperience: 0,
      location: '',
      availableForHire: false,
      resumeUrl: '',
    },
  });

  const watchAvailableForHire = watch('availableForHire');
  const watchBio = watch('bio');
  const watchShortBio = watch('shortBio');
  const watchAvatar = watch('avatar');

  const fetchDeveloperInfo = useCallback(async () => {
    try {
      setError(null);
      const docRef = doc(db, 'portfolio_developer_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        reset({
          name: data.name ?? '',
          title: data.title ?? '',
          tagline: data.tagline ?? '',
          bio: data.bio ?? '',
          shortBio: data.shortBio ?? '',
          avatar: data.avatar ?? '',
          website: data.website ?? '',
          github: data.github ?? '',
          linkedin: data.linkedin ?? '',
          twitter: data.twitter ?? '',
          yearsOfExperience: data.yearsOfExperience ?? 0,
          location: data.location ?? '',
          availableForHire: data.availableForHire ?? false,
          resumeUrl: data.resumeUrl ?? '',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch developer info';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    trackPageView('/admin/developer-info', 'Developer Info Admin');
    fetchDeveloperInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Saves the developer info document to Firestore.
   */
  async function onSubmit(data: FormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const docRef = doc(db, 'portfolio_developer_info', 'main');

      await setDoc(docRef, {
        id: 'main',
        name: data.name,
        title: data.title,
        tagline: data.tagline,
        bio: data.bio,
        shortBio: data.shortBio,
        avatar: data.avatar,
        website: data.website,
        github: data.github,
        linkedin: data.linkedin,
        twitter: data.twitter,
        yearsOfExperience: isNaN(data.yearsOfExperience) ? 0 : data.yearsOfExperience,
        location: data.location,
        availableForHire: data.availableForHire,
        resumeUrl: data.resumeUrl,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      });

      setSuccessMessage('Developer info saved successfully!');
      trackEvent('admin_developer_info_saved');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save developer info';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /**
   * Check if the avatar URL is a valid image.
   */
  function isValidImageUrl(url: string): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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
              <span className="text-white">Developer Info</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <User className="h-8 w-8" />
                  Developer Information
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage your professional profile, bio, and online presence.
                </p>
              </div>
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
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

        {loading ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-violet-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your name, title, and professional identity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Title"
                      placeholder="Full Stack Developer"
                      error={errors.title?.message}
                      {...register('title')}
                    />
                  </div>
                  <Input
                    label="Tagline"
                    placeholder="Building amazing web experiences"
                    error={errors.tagline?.message}
                    {...register('tagline')}
                  />

                  {/* Avatar with Preview */}
                  <div className="space-y-2">
                    <Input
                      label="Avatar URL"
                      placeholder="https://example.com/avatar.jpg"
                      error={errors.avatar?.message}
                      {...register('avatar')}
                    />
                    {isValidImageUrl(watchAvatar) && (
                      <div className="flex items-center gap-4 p-3 rounded-lg border border-surface-200 bg-surface-50">
                        <img
                          src={watchAvatar}
                          alt="Avatar Preview"
                          className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-surface-700">Avatar Preview</p>
                          <p className="text-xs text-surface-500">How your avatar will appear</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bio Section */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-violet-600" />
                    Biography
                  </CardTitle>
                  <CardDescription>
                    Tell your story and professional background.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      label="Full Bio"
                      placeholder="Write a detailed bio about your professional journey, skills, and aspirations..."
                      error={errors.bio?.message}
                      rows={6}
                      {...register('bio')}
                    />
                    <div className="flex justify-end">
                      <span className={cn(
                        'text-xs',
                        (watchBio?.length ?? 0) > MAX_BIO_LENGTH ? 'text-red-500' : 'text-surface-400'
                      )}>
                        {watchBio?.length ?? 0} / {MAX_BIO_LENGTH}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      label="Short Bio"
                      placeholder="A brief summary for limited space contexts..."
                      error={errors.shortBio?.message}
                      rows={3}
                      {...register('shortBio')}
                    />
                    <div className="flex justify-end">
                      <span className={cn(
                        'text-xs',
                        (watchShortBio?.length ?? 0) > MAX_SHORT_BIO_LENGTH ? 'text-red-500' : 'text-surface-400'
                      )}>
                        {watchShortBio?.length ?? 0} / {MAX_SHORT_BIO_LENGTH}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-violet-600" />
                    Online Presence
                  </CardTitle>
                  <CardDescription>
                    Your website and social media profiles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Website"
                    placeholder="https://yourwebsite.com"
                    error={errors.website?.message}
                    {...register('website')}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <Input
                        label="GitHub"
                        placeholder="username"
                        error={errors.github?.message}
                        {...register('github')}
                      />
                      <Github className="absolute right-3 top-9 h-4 w-4 text-surface-400" />
                    </div>
                    <div className="relative">
                      <Input
                        label="LinkedIn"
                        placeholder="username"
                        error={errors.linkedin?.message}
                        {...register('linkedin')}
                      />
                      <Linkedin className="absolute right-3 top-9 h-4 w-4 text-surface-400" />
                    </div>
                    <div className="relative">
                      <Input
                        label="Twitter"
                        placeholder="@username"
                        error={errors.twitter?.message}
                        {...register('twitter')}
                      />
                      <Twitter className="absolute right-3 top-9 h-4 w-4 text-surface-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Details */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-violet-600" />
                    Professional Details
                  </CardTitle>
                  <CardDescription>
                    Experience, location, and availability status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Years of Experience"
                      type="number"
                      min={0}
                      placeholder="5"
                      error={errors.yearsOfExperience?.message}
                      {...register('yearsOfExperience', { valueAsNumber: true })}
                    />
                    <Input
                      label="Location"
                      placeholder="San Francisco, CA"
                      error={errors.location?.message}
                      {...register('location')}
                    />
                  </div>

                  <Input
                    label="Resume URL"
                    placeholder="https://example.com/resume.pdf"
                    error={errors.resumeUrl?.message}
                    {...register('resumeUrl')}
                  />

                  {/* Available for Hire Switch */}
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                    <div>
                      <p className="font-medium text-surface-900">Available for Hire</p>
                      <p className="text-sm text-surface-500">
                        Indicates whether you are currently looking for new opportunities.
                      </p>
                    </div>
                    <Switch
                      checked={watchAvailableForHire}
                      onCheckedChange={(checked: boolean) => setValue('availableForHire', checked, { shouldDirty: true })}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        watchAvailableForHire ? 'bg-violet-600' : 'bg-surface-300'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                          watchAvailableForHire ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </Switch>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Button */}
            <div className="flex items-center justify-between rounded-lg border border-surface-200 bg-white p-4">
              <div className="flex items-center gap-2">
                {isDirty && (
                  <Badge variant="warning" size="sm">
                    Unsaved Changes
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    fetchDeveloperInfo();
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button type="submit" variant="secondary" loading={saving} disabled={saving}>
                  <Save className="h-4 w-4" />
                  Save Developer Info
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
