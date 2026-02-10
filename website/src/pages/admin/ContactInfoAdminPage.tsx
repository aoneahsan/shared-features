import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  ChevronRight,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Mail,
  MessageSquare,
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

const formSchema = z.object({
  email: z.string().email('Must be a valid email').or(z.literal('')),
  supportEmail: z.string().email('Must be a valid email').or(z.literal('')),
  phone: z.string(),
  whatsapp: z.string(),
  telegram: z.string(),
  skype: z.string(),
  freelanceAvailable: z.boolean(),
  workingHours: z.string(),
  timezone: z.string(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp', 'telegram']),
  responseTime: z.string(),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Skeleton loader for the contact info form.
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
          <div className="h-32 w-full rounded bg-surface-200" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContactInfoAdminPage() {
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
      email: '',
      supportEmail: '',
      phone: '',
      whatsapp: '',
      telegram: '',
      skype: '',
      freelanceAvailable: false,
      workingHours: '',
      timezone: '',
      preferredContact: 'email',
      responseTime: '',
    },
  });

  const watchFreelanceAvailable = watch('freelanceAvailable');

  const fetchContactInfo = useCallback(async () => {
    try {
      setError(null);
      const docRef = doc(db, 'portfolio_contact_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        reset({
          email: data.email ?? '',
          supportEmail: data.supportEmail ?? '',
          phone: data.phone ?? '',
          whatsapp: data.whatsapp ?? '',
          telegram: data.telegram ?? '',
          skype: data.skype ?? '',
          freelanceAvailable: data.freelanceAvailable ?? false,
          workingHours: data.workingHours ?? '',
          timezone: data.timezone ?? '',
          preferredContact: data.preferredContact ?? 'email',
          responseTime: data.responseTime ?? '',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch contact info';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    trackPageView('/admin/contact-info', 'Contact Info Admin');
    fetchContactInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Saves the contact info document to Firestore.
   */
  async function onSubmit(data: FormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const docRef = doc(db, 'portfolio_contact_info', 'main');

      await setDoc(docRef, {
        id: 'main',
        email: data.email,
        supportEmail: data.supportEmail,
        phone: data.phone,
        whatsapp: data.whatsapp,
        telegram: data.telegram,
        skype: data.skype,
        freelanceAvailable: data.freelanceAvailable,
        workingHours: data.workingHours,
        timezone: data.timezone,
        preferredContact: data.preferredContact,
        responseTime: data.responseTime,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      });

      setSuccessMessage('Contact info saved successfully!');
      trackEvent('admin_contact_info_saved');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save contact info';
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
              <span className="text-white">Contact Info</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Phone className="h-8 w-8" />
                  Contact Information
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage contact details, availability, and communication preferences.
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
            {/* Email Contacts */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-violet-600" />
                    Email Contacts
                  </CardTitle>
                  <CardDescription>
                    Primary and support email addresses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Primary Email"
                      type="email"
                      placeholder="hello@example.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <Input
                      label="Support Email"
                      type="email"
                      placeholder="support@example.com"
                      error={errors.supportEmail?.message}
                      {...register('supportEmail')}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Messaging & Phone */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-violet-600" />
                    Phone & Messaging
                  </CardTitle>
                  <CardDescription>
                    Phone number and instant messaging handles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone"
                      placeholder="+1 (555) 123-4567"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <Input
                      label="WhatsApp"
                      placeholder="+1 (555) 123-4567"
                      error={errors.whatsapp?.message}
                      {...register('whatsapp')}
                    />
                    <Input
                      label="Telegram"
                      placeholder="@username"
                      error={errors.telegram?.message}
                      {...register('telegram')}
                    />
                    <Input
                      label="Skype"
                      placeholder="live:username"
                      error={errors.skype?.message}
                      {...register('skype')}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Availability & Preferences */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-violet-600" />
                    Availability & Preferences
                  </CardTitle>
                  <CardDescription>
                    Working hours, timezone, and contact preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Freelance Available Switch */}
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                    <div>
                      <p className="font-medium text-surface-900">Available for Freelance</p>
                      <p className="text-sm text-surface-500">
                        Indicates whether you are currently accepting freelance work.
                      </p>
                    </div>
                    <Switch
                      checked={watchFreelanceAvailable}
                      onCheckedChange={(checked: boolean) => setValue('freelanceAvailable', checked, { shouldDirty: true })}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        watchFreelanceAvailable ? 'bg-violet-600' : 'bg-surface-300'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                          watchFreelanceAvailable ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </Switch>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Working Hours"
                      placeholder="Mon-Fri 9AM-6PM"
                      error={errors.workingHours?.message}
                      {...register('workingHours')}
                    />
                    <Input
                      label="Timezone"
                      placeholder="EST (UTC-5)"
                      error={errors.timezone?.message}
                      {...register('timezone')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-surface-700">Preferred Contact Method</label>
                      <Controller
                        name="preferredContact"
                        control={control}
                        render={({ field }) => (
                          <SelectRoot value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preferred contact" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="telegram">Telegram</SelectItem>
                            </SelectContent>
                          </SelectRoot>
                        )}
                      />
                    </div>
                    <Input
                      label="Response Time"
                      placeholder="Within 24 hours"
                      error={errors.responseTime?.message}
                      {...register('responseTime')}
                    />
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
                    fetchContactInfo();
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button type="submit" variant="secondary" loading={saving} disabled={saving}>
                  <Save className="h-4 w-4" />
                  Save Contact Info
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
