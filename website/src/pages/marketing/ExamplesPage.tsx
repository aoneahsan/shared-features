import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket,
  Flag,
  Megaphone,
  Bell,
  User,
  Puzzle,
  Copy,
  Check,
  ArrowLeft,
  Code2,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { copyToClipboard } from '@/lib/utils';
import { trackPageView, trackCodeCopy } from '@/lib/analytics';
import { APP_NAME } from '@/config/constants';

/* -------------------------------------------------------------------------- */
/*  Code Block                                                                */
/* -------------------------------------------------------------------------- */

function CodeBlock({ code, language = 'typescript', label }: { code: string; language?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      trackCodeCopy(label ?? language);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code, language, label]);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-surface-800 bg-surface-900">
      <div className="flex items-center justify-between border-b border-surface-800 px-4 py-2">
        <span className="font-mono text-xs text-surface-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-200"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm leading-relaxed text-surface-100">{code}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Examples Data                                                             */
/* -------------------------------------------------------------------------- */

interface ExampleData {
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  code: string;
  language: string;
}

const EXAMPLES: ExampleData[] = [
  {
    title: 'Basic Setup',
    description: 'Initialize shared-features in a React app with Firebase configuration. This is the minimum setup required to start using all features.',
    icon: <Rocket className="h-5 w-5" />,
    tags: ['Setup', 'Firebase', 'Init'],
    code: `// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSharedFeatures } from 'shared-features';
import App from './App';

// Initialize before rendering
initSharedFeatures({
  firebaseConfig: {
    apiKey: import.meta.env.VITE_SHARED_FEATURES_API_KEY,
    authDomain: import.meta.env.VITE_SHARED_FEATURES_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_SHARED_FEATURES_PROJECT_ID,
    storageBucket: import.meta.env.VITE_SHARED_FEATURES_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_SHARED_FEATURES_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_SHARED_FEATURES_APP_ID,
    measurementId: import.meta.env.VITE_SHARED_FEATURES_MEASUREMENT_ID,
  },
  projectId: 'my-react-app',
  projectName: 'My React App',
  platform: 'web',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
    language: 'typescript',
  },
  {
    title: 'Feature Flags',
    description: 'Check feature availability, gate UI sections, and subscribe to real-time flag changes for instant updates without page refresh.',
    icon: <Flag className="h-5 w-5" />,
    tags: ['Feature Flags', 'Hooks', 'Conditional Rendering'],
    code: `import { useFeatureFlags, useFeature, useFeatureGate } from 'shared-features';

function AppSettings() {
  const { isEnabled, loading } = useFeatureFlags();
  const { enabled: hasBeta } = useFeature('beta-features');
  const { allowed: canAccessPremium, reason } = useFeatureGate('premium');

  if (loading) return <div>Loading feature flags...</div>;

  return (
    <div className="space-y-4">
      <h2>App Settings</h2>

      {/* Toggle based on flag */}
      {isEnabled('dark-mode') && (
        <label>
          <input type="checkbox" /> Enable Dark Mode
        </label>
      )}

      {/* Beta features section */}
      {hasBeta && (
        <section className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3>Beta Features</h3>
          <p>You have access to experimental features!</p>
        </section>
      )}

      {/* Gated premium section */}
      {canAccessPremium ? (
        <section className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h3>Premium Content</h3>
          <p>Exclusive premium features available here.</p>
        </section>
      ) : (
        <p className="text-sm text-gray-500">
          Premium access restricted: {reason}
        </p>
      )}
    </div>
  );
}`,
    language: 'typescript',
  },
  {
    title: 'Display Ads',
    description: 'Show promotional campaigns using pre-built ad components. Includes slider, panel, banner, and modal variants with built-in impression tracking.',
    icon: <Megaphone className="h-5 w-5" />,
    tags: ['Advertising', 'Components', 'Campaigns'],
    code: `import {
  AdSlider,
  AdPanel,
  AdBanner,
  useCampaigns,
  useOneTimeAdModal,
  AdModal,
} from 'shared-features';

function HomePage() {
  const { campaigns, loading } = useCampaigns();
  const { show, campaign: modalCampaign, dismiss } = useOneTimeAdModal();

  return (
    <div>
      {/* Top banner ad */}
      <AdBanner placement="top-banner" />

      {/* Hero slider - auto-rotates every 5 seconds */}
      <section className="py-8">
        <h2>Featured</h2>
        <AdSlider placement="homepage-hero" interval={5000} />
      </section>

      {/* Sidebar panel with max 3 ads */}
      <aside className="w-80">
        <AdPanel placement="sidebar" maxItems={3} />
      </aside>

      {/* Campaign count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          {campaigns.length} active campaigns
        </p>
      )}

      {/* One-time promotional modal */}
      {show && modalCampaign && (
        <AdModal campaign={modalCampaign} onClose={dismiss} />
      )}
    </div>
  );
}`,
    language: 'typescript',
  },
  {
    title: 'Broadcast Notifications',
    description: 'Display announcements and notifications using banner, modal, toast, and bell variants. Auto-shows the latest announcements to users.',
    icon: <Bell className="h-5 w-5" />,
    tags: ['Broadcasts', 'Notifications', 'Components'],
    code: `import {
  BroadcastBanners,
  AnnouncementModal,
  useBroadcasts,
  useBannerBroadcasts,
  useAnnouncementModal,
  useBellBroadcasts,
} from 'shared-features';

function NotificationCenter() {
  const { broadcasts, loading } = useBroadcasts();
  const { broadcasts: banners } = useBannerBroadcasts();
  const { broadcasts: bellNotifs } = useBellBroadcasts();
  const { show, broadcast: announcement, dismiss } = useAnnouncementModal();

  return (
    <div>
      {/* Stack all banner broadcasts at the top */}
      <BroadcastBanners />

      {/* Bell notification badge in header */}
      <header>
        <nav>
          <button className="relative">
            Bell Icon
            {bellNotifs.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {bellNotifs.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* Announcement modal (auto-shows latest) */}
      {show && announcement && (
        <AnnouncementModal broadcast={announcement} onClose={dismiss} />
      )}

      {/* Stats */}
      {!loading && (
        <footer className="text-sm text-gray-500">
          {broadcasts.length} total notifications |{' '}
          {banners.length} banners active
        </footer>
      )}
    </div>
  );
}`,
    language: 'typescript',
  },
  {
    title: 'Developer Portfolio',
    description: 'Build a portfolio page using pre-built components for contact info, developer profile, social links, skills, testimonials, and services.',
    icon: <User className="h-5 w-5" />,
    tags: ['Portfolio', 'Components', 'Common Features'],
    code: `import {
  ContactCard,
  DeveloperCard,
  SocialLinksBar,
  AddressCard,
  SkillsDisplay,
  TestimonialsGrid,
  ServicesGrid,
  FooterSection,
} from 'shared-features';

function PortfolioPage() {
  return (
    <div className="min-h-screen">
      {/* Hero section with developer info */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="mx-auto max-w-4xl">
          <DeveloperCard />
          <div className="mt-6">
            <SocialLinksBar />
          </div>
        </div>
      </section>

      {/* Skills showcase */}
      <section className="py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Skills</h2>
        <SkillsDisplay />
      </section>

      {/* Services offered */}
      <section className="bg-gray-50 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Services</h2>
        <ServicesGrid />
      </section>

      {/* Client testimonials */}
      <section className="py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Testimonials</h2>
        <TestimonialsGrid columns={3} />
      </section>

      {/* Contact section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <ContactCard />
          <AddressCard />
        </div>
      </section>

      {/* Pre-built footer */}
      <FooterSection />
    </div>
  );
}`,
    language: 'typescript',
  },
  {
    title: 'Full Integration',
    description: 'Complete application setup using all three systems (feature flags, advertising, broadcasts) plus common features in a single app.',
    icon: <Puzzle className="h-5 w-5" />,
    tags: ['Full Setup', 'All Features', 'Production'],
    code: `// main.tsx - Full initialization
import { initSharedFeatures } from 'shared-features';

initSharedFeatures({
  firebaseConfig: {
    apiKey: import.meta.env.VITE_SHARED_FEATURES_API_KEY,
    authDomain: import.meta.env.VITE_SHARED_FEATURES_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_SHARED_FEATURES_PROJECT_ID,
    storageBucket: import.meta.env.VITE_SHARED_FEATURES_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_SHARED_FEATURES_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_SHARED_FEATURES_APP_ID,
    measurementId: import.meta.env.VITE_SHARED_FEATURES_MEASUREMENT_ID,
  },
  projectId: 'production-app',
  projectName: 'Production App',
  platform: 'web',
  debug: import.meta.env.DEV,
  featureVersions: { campaigns: 1, broadcasts: 1, featureFlags: 1 },
});

// App.tsx - Use everything together
import {
  useFeatureFlags,
  useCampaigns,
  useBroadcasts,
  useSharedFeaturesOperational,
  BroadcastBanners,
  AdSlider,
  AdModal,
  useOneTimeAdModal,
  ContactCard,
  DeveloperCard,
  SocialLinksBar,
  FooterSection,
} from 'shared-features';

function App() {
  const { operational } = useSharedFeaturesOperational();
  const { isEnabled, loading: flagsLoading } = useFeatureFlags();
  const { campaigns } = useCampaigns();
  const { broadcasts } = useBroadcasts();
  const { show, campaign, dismiss } = useOneTimeAdModal();

  if (!operational) return <div>Initializing...</div>;

  return (
    <div>
      {/* Broadcast banners at top */}
      <BroadcastBanners />

      {/* Feature-flagged sections */}
      {!flagsLoading && isEnabled('hero-ads') && (
        <AdSlider placement="hero" interval={4000} />
      )}

      {/* Main content */}
      <main>
        <h1>Welcome to Production App</h1>
        <p>Active campaigns: {campaigns.length}</p>
        <p>Notifications: {broadcasts.length}</p>

        {isEnabled('contact-section') && (
          <section>
            <ContactCard />
            <DeveloperCard />
            <SocialLinksBar />
          </section>
        )}
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Promotional modal */}
      {show && campaign && (
        <AdModal campaign={campaign} onClose={dismiss} />
      )}
    </div>
  );
}`,
    language: 'typescript',
  },
];

/* -------------------------------------------------------------------------- */
/*  Animation Variants                                                        */
/* -------------------------------------------------------------------------- */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function ExamplesPage() {
  useEffect(() => {
    trackPageView('/docs/examples', 'Code Examples');
  }, []);

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
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link to="/docs">
                <ArrowLeft className="h-4 w-4" />
                Back to Docs
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 shadow-md">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-surface-900 lg:text-4xl">
                  Code Examples
                </h1>
                <p className="font-body text-sm text-surface-500">
                  {EXAMPLES.length} ready-to-use examples
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-2xl font-body text-lg text-surface-600">
              Copy-paste examples to get started quickly with {APP_NAME}. Each
              example is a complete, working snippet.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Examples Grid */}
      <Container className="py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {EXAMPLES.map((example, index) => (
            <motion.div key={example.title} variants={cardVariants}>
              <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                {/* Card header */}
                <div className="flex items-start gap-4 border-b border-surface-100 p-5 sm:p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 text-white shadow-sm">
                    {example.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-surface-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-display text-lg font-bold text-surface-900">
                        {example.title}
                      </h2>
                    </div>
                    <p className="mt-1 font-body text-sm text-surface-600">
                      {example.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {example.tags.map((tag) => (
                        <Badge key={tag} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Code block */}
                <div className="p-4 sm:p-5">
                  <CodeBlock
                    code={example.code}
                    language={example.language}
                    label={`example-${example.title.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 rounded-2xl border border-surface-200 bg-gradient-to-br from-brand-50 to-accent-50 p-8 text-center sm:p-12"
        >
          <h2 className="font-display text-2xl font-bold text-surface-900">
            Ready to build?
          </h2>
          <p className="mx-auto mt-2 max-w-md font-body text-surface-600">
            Check out the full documentation for detailed guides and advanced
            configuration options.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="primary" asChild>
              <Link to="/docs">Full Documentation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/docs/api">API Reference</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/demos">Live Demos</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
