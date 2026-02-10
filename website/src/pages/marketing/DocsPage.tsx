import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Rocket,
  Settings,
  Flag,
  Megaphone,
  Bell,
  Users,
  Layers,
  Copy,
  Check,
  Menu,
  X,
  ChevronRight,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, copyToClipboard } from '@/lib/utils';
import { trackPageView, trackCodeCopy } from '@/lib/analytics';
import { APP_NAME, NPM_URL } from '@/config/constants';

/* -------------------------------------------------------------------------- */
/*  Sidebar Table of Contents Data                                            */
/* -------------------------------------------------------------------------- */

interface TocItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
}

const TOC_ITEMS: TocItem[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: <Rocket className="h-4 w-4" />,
    children: [
      { id: 'installation', label: 'Installation' },
      { id: 'peer-dependencies', label: 'Peer Dependencies' },
    ],
  },
  {
    id: 'quick-start',
    label: 'Quick Start',
    icon: <Terminal className="h-4 w-4" />,
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: 'feature-flags',
    label: 'Feature Flags',
    icon: <Flag className="h-4 w-4" />,
  },
  {
    id: 'advertising',
    label: 'Advertising',
    icon: <Megaphone className="h-4 w-4" />,
  },
  {
    id: 'broadcasts',
    label: 'Broadcasts',
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: 'common-features',
    label: 'Common Features',
    icon: <Users className="h-4 w-4" />,
    children: [
      { id: 'contact-info', label: 'Contact Info' },
      { id: 'developer-info', label: 'Developer Info' },
      { id: 'social-links', label: 'Social Links' },
      { id: 'address-info', label: 'Address Info' },
      { id: 'payment-options', label: 'Payment Options' },
      { id: 'services', label: 'Services' },
      { id: 'skills', label: 'Skills' },
      { id: 'testimonials', label: 'Testimonials' },
      { id: 'projects', label: 'Projects' },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: <Layers className="h-4 w-4" />,
    children: [
      { id: 'custom-collections', label: 'Custom Collections' },
      { id: 'real-time', label: 'Real-time Subscriptions' },
      { id: 'caching', label: 'Caching' },
      { id: 'capacitor-setup', label: 'Capacitor Setup' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Code Block Component                                                      */
/* -------------------------------------------------------------------------- */

function CodeBlock({
  code,
  language = 'typescript',
  label,
}: {
  code: string;
  language?: string;
  label?: string;
}) {
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
    <div className="group relative my-4 overflow-hidden rounded-lg border border-surface-800 bg-surface-900">
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
        <code className="font-mono text-sm leading-relaxed text-surface-100">
          {code}
        </code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section Heading                                                           */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  id,
  children,
  level = 2,
}: {
  id: string;
  children: React.ReactNode;
  level?: 2 | 3;
}) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag
      id={id}
      className={cn(
        'scroll-mt-24 font-display font-bold text-surface-900',
        level === 2 ? 'mb-4 mt-12 text-2xl' : 'mb-3 mt-8 text-xl',
      )}
    >
      <a
        href={`#${id}`}
        className="group inline-flex items-center gap-2 hover:text-brand-600"
      >
        {children}
        <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sidebar                                                                   */
/* -------------------------------------------------------------------------- */

function Sidebar({
  activeId,
  open,
  onClose,
}: {
  activeId: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r border-surface-200 bg-white p-6 pt-20 shadow-xl lg:hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-2 text-surface-500 hover:bg-surface-100"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent activeId={activeId} onItemClick={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-24 w-56 space-y-1 overflow-y-auto pr-4" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          <SidebarContent activeId={activeId} />
        </nav>
      </aside>
    </>
  );
}

function SidebarContent({
  activeId,
  onItemClick,
}: {
  activeId: string;
  onItemClick?: () => void;
}) {
  return (
    <nav className="space-y-0.5">
      {TOC_ITEMS.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              activeId === item.id
                ? 'bg-brand-50 text-brand-700'
                : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900',
            )}
          >
            {item.icon}
            {item.label}
          </a>
          {item.children && (
            <div className="ml-9 space-y-0.5 border-l border-surface-200 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  onClick={onItemClick}
                  className={cn(
                    'block rounded-md px-2 py-1.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'font-medium text-brand-700'
                      : 'text-surface-500 hover:text-surface-800',
                  )}
                >
                  {child.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page Sections                                                             */
/* -------------------------------------------------------------------------- */

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

function GettingStartedSection() {
  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="getting-started">Getting Started</SectionHeading>
      <p className="font-body text-surface-600">
        Install {APP_NAME} in your React project and configure it with your
        Firebase credentials. The package provides hooks, services, and
        pre-built components for ads, broadcasts, feature flags, and common
        portfolio features.
      </p>

      <SectionHeading id="installation" level={3}>
        Installation
      </SectionHeading>
      <CodeBlock language="bash" label="install" code={`yarn add shared-features`} />

      <SectionHeading id="peer-dependencies" level={3}>
        Peer Dependencies
      </SectionHeading>
      <p className="mb-3 font-body text-sm text-surface-600">
        Make sure you have the following peer dependencies installed:
      </p>
      <CodeBlock
        language="bash"
        label="peer-deps"
        code={`yarn add react react-dom firebase`}
      />
      <div className="overflow-x-auto rounded-lg border border-surface-200">
        <table className="w-full text-sm">
          <thead className="border-b border-surface-200 bg-surface-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-surface-700">Package</th>
              <th className="px-4 py-2.5 text-left font-medium text-surface-700">Version</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {[
              ['react', '^18.0.0 || ^19.0.0'],
              ['react-dom', '^18.0.0 || ^19.0.0'],
              ['firebase', '^11.0.0'],
            ].map(([pkg, version]) => (
              <tr key={pkg}>
                <td className="px-4 py-2 font-mono text-sm text-brand-700">{pkg}</td>
                <td className="px-4 py-2 font-mono text-sm text-surface-600">{version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

function QuickStartSection() {
  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="quick-start">Quick Start</SectionHeading>
      <p className="mb-4 font-body text-surface-600">
        Get up and running in three steps: import, initialize, and use hooks
        throughout your app.
      </p>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
              1
            </span>
            <span className="font-display text-sm font-semibold text-surface-800">
              Import and initialize
            </span>
          </div>
          <CodeBlock
            language="typescript"
            label="quick-start-init"
            code={`import { initSharedFeatures } from 'shared-features';

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
  projectId: 'my-app',
  projectName: 'My Application',
  platform: 'web',
});`}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
              2
            </span>
            <span className="font-display text-sm font-semibold text-surface-800">
              Use hooks in your components
            </span>
          </div>
          <CodeBlock
            language="typescript"
            label="quick-start-hooks"
            code={`import { useCampaigns, useFeatureFlags, useBroadcasts } from 'shared-features';

function MyComponent() {
  const { campaigns, loading } = useCampaigns();
  const { isEnabled } = useFeatureFlags();
  const { broadcasts } = useBroadcasts();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Active campaigns: {campaigns.length}</p>
      <p>Feature X enabled: {isEnabled('feature-x') ? 'Yes' : 'No'}</p>
      <p>Broadcasts: {broadcasts.length}</p>
    </div>
  );
}`}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
              3
            </span>
            <span className="font-display text-sm font-semibold text-surface-800">
              Use pre-built components
            </span>
          </div>
          <CodeBlock
            language="typescript"
            label="quick-start-components"
            code={`import { AdSlider, BroadcastBanner, ContactCard } from 'shared-features';

function App() {
  return (
    <div>
      <BroadcastBanner />
      <AdSlider placement="homepage-hero" />
      <ContactCard />
    </div>
  );
}`}
          />
        </div>
      </div>
    </motion.section>
  );
}

function ConfigurationSection() {
  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="configuration">Configuration</SectionHeading>
      <p className="mb-4 font-body text-surface-600">
        The <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-sm text-brand-700">initSharedFeatures</code> function
        accepts a configuration object with the following properties:
      </p>

      <div className="overflow-x-auto rounded-lg border border-surface-200">
        <table className="w-full text-sm">
          <thead className="border-b border-surface-200 bg-surface-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-surface-700">Property</th>
              <th className="px-4 py-2.5 text-left font-medium text-surface-700">Type</th>
              <th className="px-4 py-2.5 text-left font-medium text-surface-700">Required</th>
              <th className="px-4 py-2.5 text-left font-medium text-surface-700">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {[
              ['firebaseConfig', 'FirebaseOptions', 'Yes', 'Your Firebase project configuration object with all 7 fields'],
              ['projectId', 'string', 'Yes', 'Unique identifier for your project (used for analytics and impressions)'],
              ['projectName', 'string', 'Yes', 'Display name of your project'],
              ['platform', '"web" | "android" | "ios"', 'Yes', 'Target platform for the consumer app'],
              ['debug', 'boolean', 'No', 'Enable debug logging (defaults to false)'],
              ['featureVersions', 'Record<string, number>', 'No', 'Version mapping for feature flag compatibility checks'],
              ['collectionNames', 'Partial<CollectionNames>', 'No', 'Override default Firestore collection names'],
            ].map(([prop, type, req, desc]) => (
              <tr key={prop}>
                <td className="px-4 py-2.5 font-mono text-sm text-brand-700">{prop}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-surface-600">{type}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={req === 'Yes' ? 'success' : 'default'} size="sm">{req}</Badge>
                </td>
                <td className="px-4 py-2.5 text-surface-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CodeBlock
        language="typescript"
        label="config-full"
        code={`initSharedFeatures({
  firebaseConfig: {
    apiKey: 'your-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
    measurementId: 'G-XXXXXXX',
  },
  projectId: 'my-app',
  projectName: 'My Application',
  platform: 'web',
  debug: true,
  featureVersions: {
    campaigns: 1,
    broadcasts: 1,
    featureFlags: 1,
  },
  collectionNames: {
    campaigns: 'custom_campaigns',
    broadcasts: 'custom_broadcasts',
  },
});`}
      />
    </motion.section>
  );
}

function FeatureFlagsSection() {
  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="feature-flags">Feature Flags</SectionHeading>
      <p className="mb-4 font-body text-surface-600">
        Control feature availability across your applications with real-time
        feature flags managed from the admin panel.
      </p>

      <CodeBlock
        language="typescript"
        label="feature-flags-basic"
        code={`import { useFeatureFlags, useFeature, useFeatureGate } from 'shared-features';

// Check all flags at once
function Dashboard() {
  const { flags, loading, isEnabled } = useFeatureFlags();

  if (loading) return <div>Loading flags...</div>;

  return (
    <div>
      {isEnabled('dark-mode') && <ThemeToggle />}
      {isEnabled('beta-features') && <BetaPanel />}
    </div>
  );
}

// Check a single feature
function FeatureButton() {
  const { enabled, loading } = useFeature('new-editor');
  if (!enabled) return null;
  return <button>Try New Editor</button>;
}

// Gate a component - renders null when disabled
function PremiumSection() {
  const { allowed, reason } = useFeatureGate('premium-content');

  if (!allowed) {
    return <div>Access restricted: {reason}</div>;
  }

  return <PremiumContent />;
}`}
      />

      <p className="mt-4 font-body text-sm text-surface-500">
        Feature flags support real-time subscriptions via{' '}
        <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-brand-700">
          useFeatureFlagsSubscription
        </code>{' '}
        for instant updates without page refresh.
      </p>
    </motion.section>
  );
}

function AdvertisingSection() {
  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="advertising">Advertising</SectionHeading>
      <p className="mb-4 font-body text-surface-600">
        Display cross-app promotional campaigns with built-in impression
        tracking, frequency capping, and multiple placement types.
      </p>

      <CodeBlock
        language="typescript"
        label="ads-hooks"
        code={`import {
  useCampaigns,
  useCampaign,
  useOneTimeAdModal,
  useUpdateAdModal,
} from 'shared-features';

// Fetch all active campaigns
function CampaignList() {
  const { campaigns, loading, error } = useCampaigns();
  return <div>{campaigns.map(c => <p key={c.id}>{c.title}</p>)}</div>;
}

// Fetch a single campaign
function SingleCampaign({ id }: { id: string }) {
  const { campaign, loading } = useCampaign(id);
  if (!campaign) return null;
  return <h2>{campaign.title}</h2>;
}

// One-time modal ad (shown once per user)
function AppEntry() {
  const { show, campaign, dismiss } = useOneTimeAdModal();
  if (!show || !campaign) return null;
  return <AdModal campaign={campaign} onClose={dismiss} />;
}

// Update notification modal
function UpdateBanner() {
  const { show, campaign, dismiss } = useUpdateAdModal();
  if (!show || !campaign) return null;
  return <AdUpdateModal campaign={campaign} onClose={dismiss} />;
}`}
      />

      <SectionHeading id="ad-components" level={3}>
        Ad Components
      </SectionHeading>
      <CodeBlock
        language="typescript"
        label="ads-components"
        code={`import {
  AdPanel,
  AdSlider,
  AdBanner,
  AdModal,
  AdUpdateModal,
} from 'shared-features';

// Panel: vertical list of ads
<AdPanel placement="sidebar" maxItems={3} />

// Slider: auto-rotating carousel
<AdSlider placement="homepage" interval={5000} />

// Banner: horizontal strip
<AdBanner placement="top-banner" />

// Modal: fullscreen promotional overlay
<AdModal campaign={campaign} onClose={handleClose} />

// Update modal: app update notification
<AdUpdateModal campaign={campaign} onClose={handleClose} />`}
      />
    </motion.section>
  );
}

function BroadcastsSection() {
  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="broadcasts">Broadcasts</SectionHeading>
      <p className="mb-4 font-body text-surface-600">
        Send announcements, alerts, and notifications to all your app users with
        four broadcast variants: banner, modal, toast, and bell.
      </p>

      <CodeBlock
        language="typescript"
        label="broadcasts-hooks"
        code={`import {
  useBroadcasts,
  useBannerBroadcasts,
  useModalBroadcasts,
  useToastBroadcasts,
  useBellBroadcasts,
  useSingleBroadcast,
  useAnnouncementModal,
} from 'shared-features';

// All broadcasts
function NotificationCenter() {
  const { broadcasts, loading } = useBroadcasts();
  return <div>{broadcasts.length} active notifications</div>;
}

// Filtered by variant
function BannerArea() {
  const { broadcasts } = useBannerBroadcasts();
  return <>{broadcasts.map(b => <BroadcastBanner key={b.id} broadcast={b} />)}</>;
}

// Single broadcast
function AlertDetail({ id }: { id: string }) {
  const { broadcast } = useSingleBroadcast(id);
  return broadcast ? <p>{broadcast.message}</p> : null;
}

// Announcement modal (auto-shows latest)
function AnnouncementArea() {
  const { show, broadcast, dismiss } = useAnnouncementModal();
  if (!show || !broadcast) return null;
  return <AnnouncementModal broadcast={broadcast} onClose={dismiss} />;
}`}
      />

      <SectionHeading id="broadcast-components" level={3}>
        Broadcast Components
      </SectionHeading>
      <CodeBlock
        language="typescript"
        label="broadcasts-components"
        code={`import {
  BroadcastBanner,
  BroadcastBanners,
  AnnouncementModal,
} from 'shared-features';

// Single banner
<BroadcastBanner broadcast={broadcast} onDismiss={handleDismiss} />

// All banner broadcasts stacked
<BroadcastBanners />

// Modal announcement
<AnnouncementModal broadcast={broadcast} onClose={handleClose} />`}
      />
    </motion.section>
  );
}

function CommonFeaturesSection() {
  const features = [
    {
      id: 'contact-info',
      name: 'Contact Info',
      hook: 'useContactInfo',
      desc: 'Fetch and display contact information (email, phone, WhatsApp).',
      code: `const { contactInfo, loading } = useContactInfo();
// contactInfo: { email, phone, whatsapp, ... }`,
    },
    {
      id: 'developer-info',
      name: 'Developer Info',
      hook: 'useDeveloperInfo',
      desc: 'Developer profile with bio, avatar, and links.',
      code: `const { developerInfo, loading } = useDeveloperInfo();
// developerInfo: { name, bio, avatar, title, ... }`,
    },
    {
      id: 'social-links',
      name: 'Social Links',
      hook: 'useSocialLinks',
      desc: 'Social media links collection.',
      code: `const { socialLinks, loading } = useSocialLinks();
// socialLinks: [{ platform, url, icon, ... }]`,
    },
    {
      id: 'address-info',
      name: 'Address Info',
      hook: 'useAddressInfo',
      desc: 'Physical address and location details.',
      code: `const { addressInfo, loading } = useAddressInfo();
// addressInfo: { street, city, state, country, ... }`,
    },
    {
      id: 'payment-options',
      name: 'Payment Options',
      hook: 'usePaymentOptions',
      desc: 'Accepted payment methods and details.',
      code: `const { paymentOptions, loading } = usePaymentOptions();
// paymentOptions: [{ type, name, details, ... }]`,
    },
    {
      id: 'services',
      name: 'Services',
      hook: 'useServices',
      desc: 'Professional services offered.',
      code: `const { services, loading } = useServices();
// services: [{ title, description, icon, price, ... }]`,
    },
    {
      id: 'skills',
      name: 'Skills',
      hook: 'useSkills',
      desc: 'Skills with proficiency levels.',
      code: `const { skills, loading } = useSkills();
// skills: [{ name, category, proficiency, ... }]`,
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      hook: 'useTestimonials',
      desc: 'Client testimonials and reviews.',
      code: `const { testimonials, loading } = useTestimonials();
// testimonials: [{ author, text, rating, avatar, ... }]`,
    },
    {
      id: 'projects',
      name: 'Projects',
      hook: 'useProjects',
      desc: 'Portfolio projects showcase.',
      code: `const { projects, loading } = useProjects();
// projects: [{ title, description, url, image, tags, ... }]`,
    },
  ];

  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="common-features">Common Features</SectionHeading>
      <p className="mb-6 font-body text-surface-600">
        A collection of hooks and components for portfolio-style content. Each
        feature reads from a dedicated Firestore collection and provides
        loading/error states.
      </p>

      <div className="space-y-8">
        {features.map((f) => (
          <div key={f.id}>
            <SectionHeading id={f.id} level={3}>
              {f.name}
            </SectionHeading>
            <p className="mb-2 font-body text-sm text-surface-600">{f.desc}</p>
            <CodeBlock language="typescript" label={f.hook} code={f.code} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function AdvancedSection() {
  return (
    <motion.section {...fadeIn}>
      <SectionHeading id="advanced">Advanced</SectionHeading>

      <SectionHeading id="custom-collections" level={3}>
        Custom Collection Names
      </SectionHeading>
      <p className="mb-2 font-body text-sm text-surface-600">
        Override the default Firestore collection names if you need a custom
        naming scheme.
      </p>
      <CodeBlock
        language="typescript"
        label="custom-collections"
        code={`initSharedFeatures({
  // ...other config
  collectionNames: {
    campaigns: 'my_app_campaigns',
    broadcasts: 'my_app_broadcasts',
    featureFlags: 'my_app_feature_flags',
    contactInfo: 'my_app_contact',
    developerInfo: 'my_app_developer',
    socialLinks: 'my_app_social',
    addressInfo: 'my_app_address',
    paymentOptions: 'my_app_payments',
    services: 'my_app_services',
    skills: 'my_app_skills',
    testimonials: 'my_app_testimonials',
    projects: 'my_app_projects',
  },
});`}
      />

      <SectionHeading id="real-time" level={3}>
        Real-time Subscriptions
      </SectionHeading>
      <p className="mb-2 font-body text-sm text-surface-600">
        Subscribe to Firestore changes for instant updates without polling.
      </p>
      <CodeBlock
        language="typescript"
        label="realtime"
        code={`import { useFeatureFlagsSubscription } from 'shared-features';

function RealtimeFlags() {
  // Automatically subscribes and updates on Firestore changes
  const { flags, loading, error } = useFeatureFlagsSubscription();

  return (
    <div>
      {Object.entries(flags).map(([key, value]) => (
        <div key={key}>
          {key}: {value ? 'ON' : 'OFF'}
        </div>
      ))}
    </div>
  );
}`}
      />

      <SectionHeading id="caching" level={3}>
        Caching
      </SectionHeading>
      <p className="mb-2 font-body text-sm text-surface-600">
        All hooks include built-in caching to minimize Firestore reads. Data is
        cached in memory and refreshed based on a configurable TTL.
      </p>
      <CodeBlock
        language="typescript"
        label="caching"
        code={`// Hooks automatically cache data and return cached results
// on subsequent calls within the same session.
// Cache is invalidated when:
// - The component unmounts and remounts
// - The TTL expires (default: 5 minutes)
// - You manually call refetch()

const { campaigns, refetch } = useCampaigns();

// Force refresh from Firestore
const handleRefresh = () => refetch();`}
      />

      <SectionHeading id="capacitor-setup" level={3}>
        Capacitor Setup
      </SectionHeading>
      <p className="mb-2 font-body text-sm text-surface-600">
        When using with Capacitor for mobile apps, set the platform accordingly
        and ensure Firebase is configured for your native platforms.
      </p>
      <CodeBlock
        language="typescript"
        label="capacitor"
        code={`import { Capacitor } from '@capacitor/core';
import { initSharedFeatures } from 'shared-features';

const platform = Capacitor.getPlatform(); // 'web' | 'android' | 'ios'

initSharedFeatures({
  firebaseConfig: { /* ... */ },
  projectId: 'my-mobile-app',
  projectName: 'My Mobile App',
  platform: platform as 'web' | 'android' | 'ios',
});`}
      />
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main DocsPage Component                                                   */
/* -------------------------------------------------------------------------- */

export default function DocsPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState('getting-started');

  useEffect(() => {
    trackPageView('/docs', 'Documentation');
  }, []);

  // Watch scroll position to update active TOC item
  useEffect(() => {
    const allIds: string[] = [];
    TOC_ITEMS.forEach((item) => {
      allIds.push(item.id);
      item.children?.forEach((child) => allIds.push(child.id));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0 && visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-white">
      {/* Hero banner */}
      <div className="border-b border-surface-200 bg-white">
        <Container className="py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-surface-900 lg:text-4xl">
                  Documentation
                </h1>
                <p className="font-body text-sm text-surface-500">
                  {APP_NAME} v0.1.6
                </p>
              </div>
            </div>
            <p className="max-w-2xl font-body text-lg text-surface-600">
              Everything you need to integrate {APP_NAME} into your React
              project. From installation to advanced configuration.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm" asChild>
                <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View on NPM
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/docs/api">
                  API Reference
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/docs/examples">
                  Examples
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="sticky top-16 z-30 border-b border-surface-200 bg-white/90 backdrop-blur lg:hidden">
        <Container>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex w-full items-center gap-2 py-3 text-sm font-medium text-surface-700"
          >
            <Menu className="h-4 w-4" />
            Table of Contents
          </button>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex gap-10">
          <Sidebar
            activeId={activeId}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="min-w-0 flex-1 lg:pl-4">
            <GettingStartedSection />
            <QuickStartSection />
            <ConfigurationSection />
            <FeatureFlagsSection />
            <AdvertisingSection />
            <BroadcastsSection />
            <CommonFeaturesSection />
            <AdvancedSection />

            {/* Footer navigation */}
            <motion.div
              {...fadeIn}
              className="mt-16 flex flex-col items-center gap-4 border-t border-surface-200 pt-10 sm:flex-row sm:justify-between"
            >
              <Button variant="outline" asChild>
                <Link to="/docs/api">
                  API Reference
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/docs/examples">
                  Code Examples
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}
