import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History,
  Tag,
  Sparkles,
  Wrench,
  Bug,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Package,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { trackPageView } from '@/lib/analytics';
import { APP_NAME, NPM_URL } from '@/config/constants';

/* -------------------------------------------------------------------------- */
/*  Changelog Data                                                            */
/* -------------------------------------------------------------------------- */

type ChangeType = 'feature' | 'improvement' | 'fix' | 'breaking';

interface Change {
  type: ChangeType;
  title: string;
  description: string;
}

interface VersionEntry {
  version: string;
  date: string;
  highlights: string;
  changes: Change[];
}

const CHANGELOG: VersionEntry[] = [
  {
    version: '0.1.6',
    date: 'February 2026',
    highlights: 'Portfolio field name fallbacks and new type additions.',
    changes: [
      { type: 'feature', title: 'Portfolio field name fallbacks', description: 'Added fallback support in docTo* conversion functions for flexible Firestore field mapping.' },
      { type: 'feature', title: 'New PaymentType values', description: 'Added "platform" and "wallet" as new PaymentType options for broader payment method support.' },
      { type: 'feature', title: 'Extended ProjectCategory', description: 'Added "extension" and "full-stack" to the ProjectCategory type enum.' },
      { type: 'improvement', title: 'PaymentOption enhancements', description: 'Added displayName and instructions fields to the PaymentOption type for richer payment details.' },
    ],
  },
  {
    version: '0.1.0',
    date: 'February 2026',
    highlights: 'Major release: All common features for portfolio and business profiles.',
    changes: [
      { type: 'feature', title: 'Contact Info system', description: 'New useContactInfo hook and ContactCard component for displaying contact information.' },
      { type: 'feature', title: 'Developer Info system', description: 'New useDeveloperInfo hook and DeveloperCard component for developer profile display.' },
      { type: 'feature', title: 'Social Links system', description: 'New useSocialLinks hook and SocialLinksBar component for social media links.' },
      { type: 'feature', title: 'Address Info system', description: 'New useAddressInfo hook and AddressCard component for physical address display.' },
      { type: 'feature', title: 'Payment Options system', description: 'New usePaymentOptions hook for displaying accepted payment methods.' },
      { type: 'feature', title: 'Services system', description: 'New useServices hook and ServicesGrid component for professional services listing.' },
      { type: 'feature', title: 'Skills system', description: 'New useSkills hook and SkillsDisplay component with proficiency visualization.' },
      { type: 'feature', title: 'Testimonials system', description: 'New useTestimonials hook and TestimonialsGrid component for client reviews.' },
      { type: 'improvement', title: 'Unified common features service', description: 'Centralized all common features under a single service layer with consistent API patterns.' },
      { type: 'improvement', title: 'Type exports', description: 'All common feature types exported from the main package entry point.' },
    ],
  },
  {
    version: '0.0.9',
    date: 'February 2026',
    highlights: 'Feature Flags system for controlling feature availability across apps.',
    changes: [
      { type: 'feature', title: 'Feature Flags system', description: 'Complete feature flags implementation with useFeatureFlags, useFeature, and useFeatureGate hooks.' },
      { type: 'feature', title: 'Real-time subscriptions', description: 'useFeatureFlagsSubscription hook for instant flag updates via Firestore onSnapshot.' },
      { type: 'feature', title: 'Feature gating', description: 'useFeatureGate hook to conditionally render components based on feature availability.' },
      { type: 'improvement', title: 'Operational check hook', description: 'useSharedFeaturesOperational hook to verify initialization status.' },
    ],
  },
  {
    version: '0.0.8',
    date: 'February 2026',
    highlights: 'Full package update to latest dependency versions.',
    changes: [
      { type: 'improvement', title: 'Dependency updates', description: 'Updated all dependencies to their latest versions for security and performance.' },
      { type: 'improvement', title: 'Build optimization', description: 'Improved build output with better tree-shaking support.' },
      { type: 'fix', title: 'TypeScript declarations', description: 'Fixed missing type declarations in the published package.' },
    ],
  },
  {
    version: '0.0.7',
    date: 'January 2026',
    highlights: 'Broadcast system improvements and new notification variants.',
    changes: [
      { type: 'improvement', title: 'Broadcast variant hooks', description: 'Added dedicated hooks for each variant: useBannerBroadcasts, useModalBroadcasts, useToastBroadcasts, useBellBroadcasts.' },
      { type: 'feature', title: 'BroadcastBanners component', description: 'New component that automatically stacks and renders all banner-type broadcasts.' },
      { type: 'improvement', title: 'Broadcast filtering', description: 'Improved active broadcast filtering with date range and targeting support.' },
    ],
  },
  {
    version: '0.0.6',
    date: 'January 2026',
    highlights: 'Multiple ad component variants for different placements.',
    changes: [
      { type: 'feature', title: 'AdSlider component', description: 'Auto-rotating carousel component for hero and featured ad placements.' },
      { type: 'feature', title: 'AdBanner component', description: 'Horizontal banner strip component for top/bottom page placements.' },
      { type: 'feature', title: 'AdUpdateModal component', description: 'Specialized modal for app update notifications with campaign data.' },
      { type: 'improvement', title: 'Ad placement system', description: 'Flexible placement-based filtering for showing ads in different page locations.' },
    ],
  },
  {
    version: '0.0.5',
    date: 'January 2026',
    highlights: 'Initial advertising system with campaigns and impression tracking.',
    changes: [
      { type: 'feature', title: 'Campaign management', description: 'useCampaigns and useCampaign hooks for fetching ad campaigns from Firestore.' },
      { type: 'feature', title: 'AdPanel component', description: 'Vertical panel component for displaying a list of campaign ads.' },
      { type: 'feature', title: 'AdModal component', description: 'Fullscreen modal overlay for promotional campaign display.' },
      { type: 'feature', title: 'Impression tracking', description: 'Built-in impression and click tracking with recordImpression and trackClick services.' },
      { type: 'feature', title: 'One-time modal', description: 'useOneTimeAdModal hook for showing promotional modals once per user.' },
    ],
  },
  {
    version: '0.0.4',
    date: 'January 2026',
    highlights: 'Firebase integration with configurable Firestore collections.',
    changes: [
      { type: 'feature', title: 'Firebase initialization', description: 'initSharedFeatures function for configuring Firebase with consumer project credentials.' },
      { type: 'feature', title: 'Custom collection names', description: 'Support for overriding default Firestore collection names via configuration.' },
      { type: 'improvement', title: 'Configuration validation', description: 'Runtime validation of required configuration fields with helpful error messages.' },
    ],
  },
  {
    version: '0.0.3',
    date: 'December 2025',
    highlights: 'Core hooks and service layer architecture.',
    changes: [
      { type: 'feature', title: 'Hook architecture', description: 'Established the hook pattern with loading, error, and data states for all features.' },
      { type: 'feature', title: 'Service layer', description: 'Created the service layer abstraction for Firestore operations.' },
      { type: 'feature', title: 'Built-in caching', description: 'In-memory caching with configurable TTL to minimize Firestore reads.' },
    ],
  },
  {
    version: '0.0.2',
    date: 'December 2025',
    highlights: 'TypeScript type system foundation.',
    changes: [
      { type: 'feature', title: 'Type definitions', description: 'Complete TypeScript type definitions for Campaign, BroadcastNotification, and FeatureFlags.' },
      { type: 'improvement', title: 'Type exports', description: 'All types exported from main entry point for consumer convenience.' },
    ],
  },
  {
    version: '0.0.1',
    date: 'December 2025',
    highlights: 'Initial release with package scaffolding.',
    changes: [
      { type: 'feature', title: 'Package scaffolding', description: 'Initial package setup with TypeScript, Vite build, ESM and CJS output.' },
      { type: 'feature', title: 'Dual format output', description: 'Both ESM and CommonJS builds for maximum compatibility.' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Change Type Styling                                                       */
/* -------------------------------------------------------------------------- */

const CHANGE_TYPE_CONFIG: Record<
  ChangeType,
  { label: string; icon: React.ReactNode; badgeVariant: 'success' | 'info' | 'warning' | 'danger'; dotColor: string }
> = {
  feature: {
    label: 'Feature',
    icon: <Sparkles className="h-3 w-3" />,
    badgeVariant: 'success',
    dotColor: 'bg-green-500',
  },
  improvement: {
    label: 'Improvement',
    icon: <Wrench className="h-3 w-3" />,
    badgeVariant: 'info',
    dotColor: 'bg-blue-500',
  },
  fix: {
    label: 'Fix',
    icon: <Bug className="h-3 w-3" />,
    badgeVariant: 'warning',
    dotColor: 'bg-amber-500',
  },
  breaking: {
    label: 'Breaking',
    icon: <AlertTriangle className="h-3 w-3" />,
    badgeVariant: 'danger',
    dotColor: 'bg-red-500',
  },
};

/* -------------------------------------------------------------------------- */
/*  Version Entry Component                                                   */
/* -------------------------------------------------------------------------- */

function VersionCard({ entry, index }: { entry: VersionEntry; index: number }) {
  const isLatest = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.5 }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-5 top-0 hidden h-full w-px bg-surface-200 md:block" />

      <div className="flex gap-6">
        {/* Timeline dot */}
        <div className="relative hidden shrink-0 md:block">
          <div
            className={cn(
              'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2',
              isLatest
                ? 'border-brand-400 bg-brand-500 text-white shadow-md shadow-brand-200'
                : 'border-surface-200 bg-white text-surface-400',
            )}
          >
            <Tag className="h-4 w-4" />
          </div>
        </div>

        {/* Card */}
        <div
          className={cn(
            'flex-1 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md',
            isLatest ? 'border-brand-200' : 'border-surface-200',
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6',
              isLatest && 'bg-brand-50/50',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-display text-lg font-bold',
                  isLatest ? 'text-brand-700' : 'text-surface-900',
                )}
              >
                v{entry.version}
              </span>
              {isLatest && (
                <Badge variant="success" size="sm">
                  Latest
                </Badge>
              )}
            </div>
            <span className="text-sm text-surface-400">{entry.date}</span>
          </div>

          {/* Highlights */}
          <div className="border-b border-surface-100 px-5 pb-4 sm:px-6">
            <p className="font-body text-sm text-surface-600">{entry.highlights}</p>
          </div>

          {/* Changes */}
          <div className="divide-y divide-surface-50 px-5 py-3 sm:px-6">
            {entry.changes.map((change, ci) => {
              const config = CHANGE_TYPE_CONFIG[change.type];
              return (
                <div key={ci} className="flex items-start gap-3 py-3">
                  <div className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', config.dotColor)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={config.badgeVariant} size="sm">
                        {config.icon}
                        <span className="ml-1">{config.label}</span>
                      </Badge>
                      <span className="text-sm font-semibold text-surface-800">
                        {change.title}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-surface-500">{change.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function ChangelogPage() {
  useEffect(() => {
    trackPageView('/changelog', 'Changelog');
  }, []);

  const totalFeatures = CHANGELOG.reduce(
    (acc, entry) => acc + entry.changes.filter((c) => c.type === 'feature').length,
    0,
  );
  const totalImprovements = CHANGELOG.reduce(
    (acc, entry) => acc + entry.changes.filter((c) => c.type === 'improvement').length,
    0,
  );
  const totalFixes = CHANGELOG.reduce(
    (acc, entry) => acc + entry.changes.filter((c) => c.type === 'fix').length,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-white">
      {/* Hero */}
      <div className="border-b border-surface-200 bg-white">
        <Container className="py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-md">
                <History className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-surface-900 lg:text-4xl">
                  Changelog
                </h1>
                <p className="font-body text-sm text-surface-500">
                  {CHANGELOG.length} releases &middot; Latest v{CHANGELOG[0].version}
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-2xl font-body text-lg text-surface-600">
              A complete history of every {APP_NAME} release. Track new features,
              improvements, and bug fixes across all versions.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { label: 'Releases', value: CHANGELOG.length, color: 'text-surface-900' },
              { label: 'Features', value: totalFeatures, color: 'text-green-600' },
              { label: 'Improvements', value: totalImprovements, color: 'text-blue-600' },
              { label: 'Fixes', value: totalFixes, color: 'text-amber-600' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-center"
              >
                <p className={cn('font-display text-2xl font-bold', stat.color)}>
                  {stat.value}
                </p>
                <p className="text-xs text-surface-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </Container>
      </div>

      {/* Timeline */}
      <Container className="py-10 lg:py-14">
        <div className="space-y-6 md:space-y-8">
          {CHANGELOG.map((entry, index) => (
            <VersionCard key={entry.version} entry={entry} index={index} />
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 text-center"
        >
          <div className="mx-auto max-w-lg rounded-2xl border border-surface-200 bg-gradient-to-br from-brand-50 to-accent-50 p-8 sm:p-10">
            <Package className="mx-auto mb-3 h-10 w-10 text-brand-500" />
            <h2 className="font-display text-xl font-bold text-surface-900">
              Stay up to date
            </h2>
            <p className="mt-2 font-body text-sm text-surface-600">
              Follow the project on GitHub or check NPM for the latest version.
              Updates are published regularly.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="sm" asChild>
                <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View on NPM
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/docs">
                  Read the Docs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
