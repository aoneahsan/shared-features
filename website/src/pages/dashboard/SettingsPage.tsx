import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  User,
  LogOut,
  Trash2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DEVELOPER } from '@/config/constants';
import { trackPageView, trackClick, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/services/auth-service';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  emailNotifications: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const themeOptions = [
  {
    value: 'light' as const,
    label: 'Light',
    description: 'Always use light mode',
    icon: Sun,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    activeColor: 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20',
  },
  {
    value: 'dark' as const,
    label: 'Dark',
    description: 'Always use dark mode',
    icon: Moon,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    activeColor: 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20',
  },
  {
    value: 'auto' as const,
    label: 'System',
    description: 'Follow system preference',
    icon: Monitor,
    color: 'text-surface-600 bg-surface-50 border-surface-200',
    activeColor: 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20',
  },
];

export default function SettingsPage() {
  const { user, userDoc } = useAuth();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { watch, setValue, handleSubmit } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      theme: userDoc?.preferences?.theme ?? 'auto',
      emailNotifications: userDoc?.preferences?.emailNotifications ?? true,
    },
  });

  const currentTheme = watch('theme');
  const emailNotifications = watch('emailNotifications');

  useEffect(() => {
    trackPageView('/dashboard/settings', 'Settings');
  }, []);

  /** Shows a temporary success toast that auto-dismisses after 3 seconds. */
  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  /** Persists the settings form data to the user's Firestore document. */
  async function onSubmit(data: SettingsFormData) {
    if (!user) return;

    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'preferences.theme': data.theme,
        'preferences.emailNotifications': data.emailNotifications,
        updatedAt: serverTimestamp(),
      });

      showToast('Settings saved successfully');
      trackEvent('settings_saved', {
        theme: data.theme,
        email_notifications: data.emailNotifications,
      });
    } catch (err) {
      logger.error('Failed to save settings:', err);
      showToast('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  /** Handles sign-out with analytics tracking. */
  async function handleSignOut() {
    trackClick('settings_sign_out', 'settings');
    await logout();
  }

  const displayName = user?.displayName ?? 'User';

  return (
    <div className="py-8 sm:py-12">
      <Container className="max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Page header */}
          <motion.div variants={fadeInUp}>
            <h1 className="font-display text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
              Settings
            </h1>
            <p className="mt-2 text-surface-600">
              Manage your profile, appearance, and notification preferences.
            </p>
          </motion.div>

          {/* Profile Section (read-only) */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-surface-500" />
                  <CardTitle>Profile</CardTitle>
                </div>
                <CardDescription>
                  Your profile information is synced from your Google account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName}
                      className="h-20 w-20 rounded-full border-2 border-surface-200 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-surface-200 bg-gradient-to-br from-brand-100 to-accent-100 shadow-sm">
                      <span className="font-display text-2xl font-bold text-brand-700">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Profile details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                        Name
                      </p>
                      <p className="mt-0.5 font-medium text-surface-900">{displayName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                        Email
                      </p>
                      <p className="mt-0.5 font-medium text-surface-900">
                        {user?.email ?? 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance Section */}
          <motion.div variants={fadeInUp}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-surface-500" />
                    <CardTitle>Appearance</CardTitle>
                  </div>
                  <CardDescription>
                    Choose how {displayName.split(' ')[0]}&apos;s dashboard looks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {themeOptions.map((option) => {
                      const isActive = currentTheme === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue('theme', option.value, { shouldDirty: true });
                            trackClick(
                              `settings_theme_${option.value}`,
                              'settings',
                            );
                          }}
                          className={cn(
                            'flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all',
                            isActive ? option.activeColor : 'border-surface-200 hover:border-surface-300',
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-12 w-12 items-center justify-center rounded-xl',
                              isActive ? option.color : 'bg-surface-100 text-surface-500',
                            )}
                          >
                            <option.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-display font-semibold text-surface-900">
                              {option.label}
                            </p>
                            <p className="mt-0.5 text-xs text-surface-500">{option.description}</p>
                          </div>
                          {isActive && (
                            <CheckCircle2 className="h-5 w-5 text-brand-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications Section */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-surface-500" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>
                    Control how you receive updates and announcements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                    <div>
                      <p className="font-medium text-surface-900">Email Notifications</p>
                      <p className="mt-0.5 text-sm text-surface-500">
                        Receive product updates, announcements, and feature releases via email.
                      </p>
                    </div>
                    {/* Toggle switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={emailNotifications}
                      onClick={() => {
                        const newValue = !emailNotifications;
                        setValue('emailNotifications', newValue, { shouldDirty: true });
                        trackClick(
                          `settings_notifications_${newValue ? 'on' : 'off'}`,
                          'settings',
                        );
                      }}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        emailNotifications ? 'bg-brand-500' : 'bg-surface-300',
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                          emailNotifications ? 'translate-x-5' : 'translate-x-0',
                        )}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Save button */}
              <div className="mt-6 flex justify-end">
                <Button type="submit" variant="primary" size="lg" loading={saving} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Account Section */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Account</CardTitle>
                <CardDescription>
                  Manage your account data and session.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Data deletion */}
                  <div className="flex flex-col gap-3 rounded-lg border border-surface-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-surface-900">Request Data Deletion</p>
                      <p className="mt-0.5 text-sm text-surface-500">
                        Send a request to permanently delete all your account data.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      className="shrink-0"
                      asChild
                    >
                      <a
                        href={`mailto:${DEVELOPER.email}?subject=Data%20Deletion%20Request%20-%20Shared%20Features&body=I%20would%20like%20to%20request%20deletion%20of%20my%20account%20data.%0A%0AEmail%3A%20${encodeURIComponent(user?.email ?? '')}%0AUser%20ID%3A%20${encodeURIComponent(user?.uid ?? '')}`}
                        onClick={() => trackClick('settings_data_deletion', 'settings')}
                      >
                        <Trash2 className="h-4 w-4" />
                        Request Deletion
                      </a>
                    </Button>
                  </div>

                  {/* Sign out */}
                  <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-surface-900">Sign Out</p>
                      <p className="mt-0.5 text-sm text-surface-500">
                        End your current session and return to the login page.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="md"
                      className="shrink-0"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>

      {/* Success toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow-lg">
            {toast.includes('Failed') ? (
              <Loader2 className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <span className="text-sm font-medium text-green-800">{toast}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
