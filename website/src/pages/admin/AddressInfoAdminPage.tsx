import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  ChevronRight,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Building,
  Globe,
  Map,
  Eye,
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Switzerland',
  'Austria',
  'Belgium',
  'Ireland',
  'New Zealand',
  'Singapore',
  'Japan',
  'South Korea',
  'India',
  'Pakistan',
  'United Arab Emirates',
  'Saudi Arabia',
  'Brazil',
  'Mexico',
  'Spain',
  'Italy',
  'Portugal',
  'Poland',
  'Czech Republic',
  'Other',
] as const;

const formSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  fullAddress: z.string(),
  googleMapsUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  isPublic: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Skeleton loader for the address form.
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
    </div>
  );
}

export default function AddressInfoAdminPage() {
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
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      fullAddress: '',
      googleMapsUrl: '',
      isPublic: true,
    },
  });

  const watchIsPublic = watch('isPublic');
  const watchStreetAddress = watch('streetAddress');
  const watchCity = watch('city');
  const watchState = watch('state');
  const watchPostalCode = watch('postalCode');
  const watchCountry = watch('country');
  const watchFullAddress = watch('fullAddress');
  const watchLabel = watch('label');

  const fetchAddressInfo = useCallback(async () => {
    try {
      setError(null);
      const docRef = doc(db, 'portfolio_address_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        reset({
          label: data.label ?? '',
          streetAddress: data.streetAddress ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          postalCode: data.postalCode ?? '',
          country: data.country ?? '',
          fullAddress: data.fullAddress ?? '',
          googleMapsUrl: data.googleMapsUrl ?? '',
          isPublic: data.isPublic ?? true,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch address info';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    trackPageView('/admin/address-info', 'Address Info Admin');
    fetchAddressInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Auto-compose full address from parts.
   */
  function autoComposeAddress() {
    const parts = [
      watchStreetAddress,
      watchCity,
      watchState,
      watchPostalCode,
      watchCountry,
    ].filter(Boolean);
    const composed = parts.join(', ');
    setValue('fullAddress', composed, { shouldDirty: true });
  }

  /**
   * Saves the address info document to Firestore.
   */
  async function onSubmit(data: FormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const docRef = doc(db, 'portfolio_address_info', 'main');

      await setDoc(docRef, {
        id: 'main',
        label: data.label,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        fullAddress: data.fullAddress,
        googleMapsUrl: data.googleMapsUrl,
        isPublic: data.isPublic,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      });

      setSuccessMessage('Address info saved successfully!');
      trackEvent('admin_address_info_saved');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save address info';
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
              <span className="text-white">Address Info</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <MapPin className="h-8 w-8" />
                  Address Information
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage your physical address and location details.
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
            {/* Address Details */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-violet-600" />
                    Address Details
                  </CardTitle>
                  <CardDescription>
                    Enter your physical address information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Label"
                    placeholder="Main Office, Home, Headquarters..."
                    error={errors.label?.message}
                    {...register('label')}
                  />

                  <Input
                    label="Street Address"
                    placeholder="123 Main Street, Suite 100"
                    error={errors.streetAddress?.message}
                    {...register('streetAddress')}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      placeholder="San Francisco"
                      error={errors.city?.message}
                      {...register('city')}
                    />
                    <Input
                      label="State/Province"
                      placeholder="California"
                      error={errors.state?.message}
                      {...register('state')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Postal Code"
                      placeholder="94105"
                      error={errors.postalCode?.message}
                      {...register('postalCode')}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-surface-700">Country</label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <SelectRoot value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectRoot>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Full Address */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-violet-600" />
                    Full Address
                  </CardTitle>
                  <CardDescription>
                    Complete formatted address for display purposes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Input
                          label="Full Address"
                          placeholder="123 Main Street, Suite 100, San Francisco, CA 94105, USA"
                          error={errors.fullAddress?.message}
                          {...register('fullAddress')}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={autoComposeAddress}
                        className="mb-0.5"
                      >
                        Auto-compose
                      </Button>
                    </div>
                    <p className="text-xs text-surface-400">
                      You can auto-compose from the parts above or manually edit.
                    </p>
                  </div>

                  <Input
                    label="Google Maps URL"
                    placeholder="https://maps.google.com/..."
                    error={errors.googleMapsUrl?.message}
                    {...register('googleMapsUrl')}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Visibility */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-violet-600" />
                    Visibility Settings
                  </CardTitle>
                  <CardDescription>
                    Control whether your address is publicly visible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                    <div>
                      <p className="font-medium text-surface-900">Public Address</p>
                      <p className="text-sm text-surface-500">
                        When enabled, your address will be visible on public pages.
                      </p>
                    </div>
                    <Switch
                      checked={watchIsPublic}
                      onCheckedChange={(checked: boolean) => setValue('isPublic', checked, { shouldDirty: true })}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        watchIsPublic ? 'bg-violet-600' : 'bg-surface-300'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                          watchIsPublic ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </Switch>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview */}
            {watchFullAddress && (
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <Card className="border-violet-200 bg-violet-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-700">
                      <Map className="h-5 w-5" />
                      Address Preview
                    </CardTitle>
                    <CardDescription className="text-violet-600">
                      This is how your address will appear publicly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-violet-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium text-surface-900">{watchLabel || 'Address'}</p>
                          <p className="text-surface-600 mt-1">{watchFullAddress}</p>
                          {!watchIsPublic && (
                            <Badge variant="warning" size="sm" className="mt-2">
                              Not Public
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

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
                    fetchAddressInfo();
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button type="submit" variant="secondary" loading={saving} disabled={saving}>
                  <Save className="h-4 w-4" />
                  Save Address Info
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
