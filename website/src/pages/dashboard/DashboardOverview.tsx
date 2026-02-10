import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Layers,
  Play,
  Settings,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Rocket,
  Copy,
  Terminal,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackPageView, trackClick } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const quickLinks = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides, API reference, and integration tutorials.',
    href: '/docs',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Features',
    description: 'Explore advertising, broadcasts, feature flags, and common features.',
    href: '/features',
    icon: Layers,
    color: 'text-brand-600 bg-brand-50',
  },
  {
    title: 'Live Demos',
    description: 'Interactive demonstrations of every component and hook.',
    href: '/demos',
    icon: Play,
    color: 'text-accent-600 bg-accent-50',
  },
  {
    title: 'Settings',
    description: 'Manage your profile, appearance, and notification preferences.',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'text-amber-600 bg-amber-50',
  },
];

const gettingStartedSteps = [
  {
    step: 1,
    title: 'Install the package',
    description: 'Add shared-features to your React project via npm or yarn.',
    code: 'yarn add shared-features',
    icon: Terminal,
  },
  {
    step: 2,
    title: 'Initialize Firebase',
    description: 'Configure the package with your Firebase credentials and project info.',
    code: 'initSharedFeatures({ firebaseConfig, projectId })',
    icon: Rocket,
  },
  {
    step: 3,
    title: 'Use hooks and components',
    description: 'Import hooks like useCampaigns or components like AdBanner directly.',
    code: "import { useCampaigns } from 'shared-features'",
    icon: Sparkles,
  },
];

/**
 * Formats a Firestore Timestamp or date-like value into a human-readable date string.
 * Returns a fallback string when the value is missing or not convertible.
 */
function formatLastLogin(lastLogin: unknown): string {
  if (!lastLogin) return 'N/A';

  // Firestore Timestamp objects expose a toDate() method.
  if (typeof lastLogin === 'object' && lastLogin !== null && 'toDate' in lastLogin) {
    const ts = lastLogin as { toDate: () => Date };
    return ts.toDate().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  // Fallback for plain Date or numeric timestamps.
  const date = new Date(lastLogin as string | number);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function DashboardOverview() {
  const { user, userDoc, isAdmin } = useAuth();

  useEffect(() => {
    trackPageView('/dashboard', 'Dashboard');
  }, []);

  const displayName = user?.displayName ?? 'User';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Welcome Card */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden bg-gradient-to-br from-brand-500 to-accent-600 text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={displayName}
                        className="h-14 w-14 rounded-full border-2 border-white/30 shadow-lg sm:h-16 sm:w-16"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 shadow-lg sm:h-16 sm:w-16">
                        <span className="font-display text-xl font-bold">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h1 className="font-display text-xl font-bold sm:text-2xl">
                        Welcome back, {firstName}
                      </h1>
                      <p className="mt-1 text-sm text-brand-100">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isAdmin && (
                      <Badge className="border border-white/20 bg-white/15 text-white">Admin</Badge>
                    )}
                    <Badge className="border border-white/20 bg-white/15 text-white">
                      Last login: {formatLastLogin(userDoc?.lastLogin)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Panel CTA (only for admins) */}
          {isAdmin && (
            <motion.div variants={fadeInUp}>
              <Card className="border-accent-200 bg-accent-50/50">
                <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-surface-900">
                        Admin Panel
                      </h2>
                      <p className="mt-0.5 text-sm text-surface-600">
                        Manage campaigns, broadcasts, feature flags, and all shared content.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    asChild
                    className="shrink-0"
                  >
                    <Link
                      to="/admin"
                      onClick={() => trackClick('dashboard_go_admin', 'dashboard')}
                    >
                      <Shield className="h-4 w-4" />
                      Go to Admin Panel
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h2 className="mb-4 font-display text-lg font-semibold text-surface-900">
              Quick Links
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <motion.div key={link.title} variants={fadeInUp}>
                  <Link
                    to={link.href}
                    className="group block h-full"
                    onClick={() =>
                      trackClick(
                        `dashboard_quick_${link.title.toLowerCase().replace(/\s/g, '_')}`,
                        'dashboard',
                      )
                    }
                  >
                    <Card className="h-full transition-all group-hover:border-brand-200 group-hover:shadow-lg">
                      <CardContent className="flex flex-col gap-3 p-5">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            link.color,
                          )}
                        >
                          <link.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base group-hover:text-brand-600">
                            {link.title}
                          </CardTitle>
                          <CardDescription className="mt-1">{link.description}</CardDescription>
                        </div>
                        <div className="mt-auto flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                          Explore
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Getting Started Section */}
          <motion.div variants={fadeInUp}>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-surface-900">
                Getting Started
              </h2>
              <Badge variant="info" size="sm">
                3 steps
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {gettingStartedSteps.map((step) => (
                <motion.div key={step.step} variants={fadeInUp}>
                  <Card className="h-full">
                    <CardContent className="flex flex-col gap-4 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                          {step.step}
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-50 text-surface-600">
                          <step.icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-surface-900">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm text-surface-500">{step.description}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-2 rounded-lg bg-surface-900 px-3 py-2">
                        <code className="flex-1 truncate font-mono text-xs text-surface-300">
                          {step.code}
                        </code>
                        <button
                          type="button"
                          className="shrink-0 text-surface-500 transition-colors hover:text-white"
                          onClick={() => {
                            navigator.clipboard.writeText(step.code);
                            trackClick(`dashboard_copy_step_${step.step}`, 'dashboard');
                          }}
                          aria-label={`Copy step ${step.step} code`}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Account Info Card */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details synced from Google authentication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-surface-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                      Display Name
                    </p>
                    <p className="mt-1 font-medium text-surface-900">{displayName}</p>
                  </div>
                  <div className="rounded-lg bg-surface-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                      Email
                    </p>
                    <p className="mt-1 font-medium text-surface-900">{user?.email ?? 'N/A'}</p>
                  </div>
                  <div className="rounded-lg bg-surface-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                      Email Verified
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-surface-900">
                        {user?.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-surface-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                      Provider
                    </p>
                    <p className="mt-1 font-medium text-surface-900">Google</p>
                  </div>
                  <div className="rounded-lg bg-surface-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                      Last Login
                    </p>
                    <p className="mt-1 font-medium text-surface-900">
                      {formatLastLogin(userDoc?.lastLogin)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                      Role
                    </p>
                    <Badge variant={isAdmin ? 'success' : 'default'} size="sm" className="mt-1">
                      {isAdmin ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Helpful links footer */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-3 pt-4 text-sm"
          >
            <Link
              to="/docs"
              className="text-brand-600 underline-offset-4 hover:underline"
              onClick={() => trackClick('dashboard_footer_docs', 'dashboard')}
            >
              Documentation
            </Link>
            <span className="text-surface-300">|</span>
            <Link
              to="/features"
              className="text-brand-600 underline-offset-4 hover:underline"
              onClick={() => trackClick('dashboard_footer_features', 'dashboard')}
            >
              Features
            </Link>
            <span className="text-surface-300">|</span>
            <Link
              to="/changelog"
              className="text-brand-600 underline-offset-4 hover:underline"
              onClick={() => trackClick('dashboard_footer_changelog', 'dashboard')}
            >
              Changelog
            </Link>
            <span className="text-surface-300">|</span>
            <Link
              to="/contact"
              className="text-brand-600 underline-offset-4 hover:underline"
              onClick={() => trackClick('dashboard_footer_contact', 'dashboard')}
            >
              Contact
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
