import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ToggleLeft,
  ChevronRight,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Wrench,
  Layers,
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

const FEATURE_IDS = [
  'campaigns',
  'broadcasts',
  'contactInfo',
  'developerInfo',
  'socialLinks',
  'paymentOptions',
  'addressInfo',
  'services',
  'skills',
  'testimonials',
  'projects',
] as const;

const FEATURE_DISPLAY_NAMES: Record<string, string> = {
  campaigns: 'Advertising Campaigns',
  broadcasts: 'Broadcasts & Notifications',
  contactInfo: 'Contact Information',
  developerInfo: 'Developer Information',
  socialLinks: 'Social Links',
  paymentOptions: 'Payment Options',
  addressInfo: 'Address Information',
  services: 'Services',
  skills: 'Skills',
  testimonials: 'Testimonials',
  projects: 'Portfolio Projects',
};

const featureConfigSchema = z.object({
  enabled: z.boolean(),
  version: z.number().min(1),
  minVersion: z.number().min(1),
  maxVersion: z.number().min(1),
  availablePlatforms: z.array(z.string()).optional(),
});

const formSchema = z.object({
  globalEnabled: z.boolean(),
  currentApiVersion: z.string().min(1, 'API version is required'),
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().optional(),
  maintenanceEndTime: z.string().optional(),
  features: z.record(z.string(), featureConfigSchema),
});

type FormData = z.infer<typeof formSchema>;

interface FeatureConfigData {
  enabled: boolean;
  version: number;
  minVersion: number;
  maxVersion: number;
  availablePlatforms?: string[];
}

/**
 * Skeleton loader for the feature flags form.
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
          <div className="h-10 w-full rounded bg-surface-200" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 w-40 rounded bg-surface-200" />
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full rounded bg-surface-200" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function FeatureFlagsAdminPage() {
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
      globalEnabled: true,
      currentApiVersion: 'v1',
      maintenanceMode: false,
      maintenanceMessage: '',
      maintenanceEndTime: '',
      features: {},
    },
  });

  const watchGlobalEnabled = watch('globalEnabled');
  const watchMaintenanceMode = watch('maintenanceMode');

  const fetchFeatureFlags = useCallback(async () => {
    try {
      setError(null);
      const docRef = doc(db, 'zaions_feature_flags', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const maintenanceEndTimeValue = data.maintenanceEndTime instanceof Timestamp
          ? new Date(data.maintenanceEndTime.toMillis()).toISOString().slice(0, 16)
          : '';

        const featuresData: Record<string, FeatureConfigData> = {};
        for (const featureId of FEATURE_IDS) {
          const featureConfig = data.features?.[featureId];
          featuresData[featureId] = {
            enabled: featureConfig?.enabled ?? false,
            version: featureConfig?.version ?? 1,
            minVersion: featureConfig?.minVersion ?? 1,
            maxVersion: featureConfig?.maxVersion ?? 1,
            availablePlatforms: featureConfig?.availablePlatforms ?? [],
          };
        }

        reset({
          globalEnabled: data.globalEnabled ?? true,
          currentApiVersion: data.currentApiVersion ?? 'v1',
          maintenanceMode: data.maintenanceMode ?? false,
          maintenanceMessage: data.maintenanceMessage ?? '',
          maintenanceEndTime: maintenanceEndTimeValue,
          features: featuresData,
        });
      } else {
        const defaultFeatures: Record<string, FeatureConfigData> = {};
        for (const featureId of FEATURE_IDS) {
          defaultFeatures[featureId] = {
            enabled: false,
            version: 1,
            minVersion: 1,
            maxVersion: 1,
            availablePlatforms: [],
          };
        }
        reset({
          globalEnabled: true,
          currentApiVersion: 'v1',
          maintenanceMode: false,
          maintenanceMessage: '',
          maintenanceEndTime: '',
          features: defaultFeatures,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch feature flags';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    trackPageView('/admin/feature-flags', 'Feature Flags Admin');
    fetchFeatureFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Saves the feature flags document to Firestore.
   */
  async function onSubmit(data: FormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const docRef = doc(db, 'zaions_feature_flags', 'main');

      const maintenanceEndTime = data.maintenanceEndTime
        ? Timestamp.fromDate(new Date(data.maintenanceEndTime))
        : null;

      await setDoc(docRef, {
        id: 'main',
        globalEnabled: data.globalEnabled,
        currentApiVersion: data.currentApiVersion,
        supportedApiVersions: [data.currentApiVersion],
        maintenanceMode: data.maintenanceMode,
        maintenanceMessage: data.maintenanceMessage || '',
        maintenanceEndTime,
        features: data.features,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      });

      setSuccessMessage('Feature flags saved successfully!');
      trackEvent('admin_feature_flags_saved');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save feature flags';
      setError(message);
    } finally {
      setSaving(false);
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
              <span className="text-white">Feature Flags</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <ToggleLeft className="h-8 w-8" />
                  Feature Flags
                </h1>
                <p className="text-violet-200 mt-1">
                  Control global settings, maintenance mode, and per-feature toggles.
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
            {/* Global Settings */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-violet-600" />
                    Global Settings
                  </CardTitle>
                  <CardDescription>
                    Control the global kill switch and API version for all shared features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Global Enabled */}
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                    <div>
                      <p className="font-medium text-surface-900">Global Enabled</p>
                      <p className="text-sm text-surface-500">
                        Kill switch to enable/disable all shared features globally.
                      </p>
                    </div>
                    <Switch
                      checked={watchGlobalEnabled}
                      onCheckedChange={(checked: boolean) => setValue('globalEnabled', checked, { shouldDirty: true })}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        watchGlobalEnabled ? 'bg-violet-600' : 'bg-surface-300'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                          watchGlobalEnabled ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </Switch>
                  </div>

                  {/* API Version */}
                  <Input
                    label="Current API Version"
                    placeholder="v1"
                    error={errors.currentApiVersion?.message}
                    {...register('currentApiVersion')}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Maintenance Mode */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-amber-600" />
                    Maintenance Mode
                  </CardTitle>
                  <CardDescription>
                    Enable maintenance mode to show a message to all consumers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                    <div>
                      <p className="font-medium text-surface-900">Maintenance Mode</p>
                      <p className="text-sm text-surface-500">
                        When enabled, all consumers will see the maintenance message.
                      </p>
                    </div>
                    <Switch
                      checked={watchMaintenanceMode}
                      onCheckedChange={(checked: boolean) => setValue('maintenanceMode', checked, { shouldDirty: true })}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        watchMaintenanceMode ? 'bg-amber-600' : 'bg-surface-300'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                          watchMaintenanceMode ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </Switch>
                  </div>

                  {watchMaintenanceMode && (
                    <>
                      <Textarea
                        label="Maintenance Message"
                        placeholder="We are currently performing maintenance. Please try again later."
                        error={errors.maintenanceMessage?.message}
                        {...register('maintenanceMessage')}
                      />
                      <Input
                        label="Maintenance End Time"
                        type="datetime-local"
                        error={errors.maintenanceEndTime?.message}
                        {...register('maintenanceEndTime')}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Table */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-violet-600" />
                    Feature Configuration
                  </CardTitle>
                  <CardDescription>
                    Toggle individual features and configure their version settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead className="text-center">Enabled</TableHead>
                        <TableHead className="text-center">Version</TableHead>
                        <TableHead className="text-center">Min Version</TableHead>
                        <TableHead className="text-center">Max Version</TableHead>
                        <TableHead>Platforms</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {FEATURE_IDS.map((featureId) => {
                        const featureEnabled = watch(`features.${featureId}.enabled`);
                        const platforms = watch(`features.${featureId}.availablePlatforms`) ?? [];

                        return (
                          <TableRow key={featureId}>
                            <TableCell>
                              <p className="font-medium text-surface-900">
                                {FEATURE_DISPLAY_NAMES[featureId]}
                              </p>
                              <p className="text-xs text-surface-400 font-mono">{featureId}</p>
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={featureEnabled}
                                onCheckedChange={(checked: boolean) =>
                                  setValue(`features.${featureId}.enabled`, checked, { shouldDirty: true })
                                }
                                className={cn(
                                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                                  featureEnabled ? 'bg-violet-600' : 'bg-surface-300'
                                )}
                              >
                                <span
                                  className={cn(
                                    'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
                                    featureEnabled ? 'translate-x-4' : 'translate-x-0'
                                  )}
                                />
                              </Switch>
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                type="number"
                                min={1}
                                className="w-16 h-8 rounded border border-surface-300 text-center text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                                {...register(`features.${featureId}.version`, { valueAsNumber: true })}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                type="number"
                                min={1}
                                className="w-16 h-8 rounded border border-surface-300 text-center text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                                {...register(`features.${featureId}.minVersion`, { valueAsNumber: true })}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                type="number"
                                min={1}
                                className="w-16 h-8 rounded border border-surface-300 text-center text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                                {...register(`features.${featureId}.maxVersion`, { valueAsNumber: true })}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {platforms.length > 0 ? (
                                  platforms.map((p: string) => (
                                    <Badge key={p} variant="outline" size="sm">
                                      {p}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="default" size="sm">
                                    All
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
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
                    fetchFeatureFlags();
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button type="submit" variant="secondary" loading={saving} disabled={saving}>
                  <Save className="h-4 w-4" />
                  Save Feature Flags
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
