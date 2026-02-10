import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ToggleLeft,
  Megaphone,
  Radio,
  Copy,
  Check,
  ArrowRight,
  Package,
  Zap,
  Settings,
  Monitor,
  Phone,
  Mail,
  User,
  Share2,
  MapPin,
  CreditCard,
  Briefcase,
  Award,
  MessageSquare,
  FolderOpen,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils';
import { trackPageView, trackClick, trackCodeCopy } from '@/lib/analytics';
import { APP_NAME, NPM_URL } from '@/config/constants';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const INSTALL_CMD = 'npm install shared-features';

const CODE_TABS = [
  {
    label: 'Install',
    code: `npm install shared-features`,
    highlighted: (
      <span className="font-mono text-sm leading-relaxed">
        <span className="text-brand-400">npm</span>{' '}
        <span className="text-accent-300">install</span>{' '}
        <span className="text-white">shared-features</span>
      </span>
    ),
  },
  {
    label: 'Initialize',
    code: `import { initSharedFeatures } from 'shared-features';

initSharedFeatures({
  firebaseConfig: {
    apiKey: import.meta.env.VITE_SHARED_FEATURES_API_KEY,
    authDomain: import.meta.env.VITE_SHARED_FEATURES_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_SHARED_FEATURES_PROJECT_ID,
    storageBucket: import.meta.env.VITE_SHARED_FEATURES_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_SHARED_FEATURES_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_SHARED_FEATURES_APP_ID,
  },
  projectId: 'my-project',
  projectName: 'My Project',
  platform: 'web',
});`,
    highlighted: (
      <span className="font-mono text-sm leading-relaxed whitespace-pre">
        <span className="text-accent-300">import</span>
        <span className="text-surface-300">{' { '}</span>
        <span className="text-brand-300">initSharedFeatures</span>
        <span className="text-surface-300">{' } '}</span>
        <span className="text-accent-300">from</span>
        <span className="text-brand-400">{" 'shared-features'"}</span>
        <span className="text-surface-400">;</span>
        {'\n\n'}
        <span className="text-brand-300">initSharedFeatures</span>
        <span className="text-surface-300">{'({'}</span>
        {'\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-200">firebaseConfig</span>
        <span className="text-surface-400">:</span>
        <span className="text-surface-300">{' {'}</span>
        {'\n'}
        <span className="text-surface-400">{'    '}</span>
        <span className="text-accent-200">apiKey</span>
        <span className="text-surface-400">: </span>
        <span className="text-brand-400">import.meta.env.VITE_SHARED_FEATURES_API_KEY</span>
        <span className="text-surface-400">,</span>
        {'\n'}
        <span className="text-surface-400">{'    '}</span>
        <span className="text-accent-200">authDomain</span>
        <span className="text-surface-400">: </span>
        <span className="text-brand-400">import.meta.env.VITE_SHARED_FEATURES_AUTH_DOMAIN</span>
        <span className="text-surface-400">,</span>
        {'\n'}
        <span className="text-surface-400">{'    '}</span>
        <span className="text-accent-200">projectId</span>
        <span className="text-surface-400">: </span>
        <span className="text-brand-400">import.meta.env.VITE_SHARED_FEATURES_PROJECT_ID</span>
        <span className="text-surface-400">,</span>
        {'\n'}
        <span className="text-surface-400">{'    '}</span>
        <span className="text-surface-500">{'// ...rest of config'}</span>
        {'\n'}
        <span className="text-surface-300">{'  },'}</span>
        {'\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-200">projectId</span>
        <span className="text-surface-400">: </span>
        <span className="text-brand-400">{"'my-project'"}</span>
        <span className="text-surface-400">,</span>
        {'\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-200">projectName</span>
        <span className="text-surface-400">: </span>
        <span className="text-brand-400">{"'My Project'"}</span>
        <span className="text-surface-400">,</span>
        {'\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-200">platform</span>
        <span className="text-surface-400">: </span>
        <span className="text-brand-400">{"'web'"}</span>
        <span className="text-surface-400">,</span>
        {'\n'}
        <span className="text-surface-300">{'});'}</span>
      </span>
    ),
  },
  {
    label: 'Use',
    code: `import { useFeatureFlags, useCampaigns, useContactInfo } from 'shared-features';

function App() {
  const { flags, isEnabled } = useFeatureFlags();
  const { campaigns } = useCampaigns();
  const { contactInfo } = useContactInfo();

  if (!isEnabled('advertising')) return null;

  return <AdBanner campaigns={campaigns} />;
}`,
    highlighted: (
      <span className="font-mono text-sm leading-relaxed whitespace-pre">
        <span className="text-accent-300">import</span>
        <span className="text-surface-300">{' { '}</span>
        <span className="text-brand-300">useFeatureFlags</span>
        <span className="text-surface-400">, </span>
        <span className="text-brand-300">useCampaigns</span>
        <span className="text-surface-400">, </span>
        <span className="text-brand-300">useContactInfo</span>
        <span className="text-surface-300">{' } '}</span>
        <span className="text-accent-300">from</span>
        <span className="text-brand-400">{" 'shared-features'"}</span>
        <span className="text-surface-400">;</span>
        {'\n\n'}
        <span className="text-accent-300">function</span>
        <span className="text-brand-300"> App</span>
        <span className="text-surface-300">() {'{'}</span>
        {'\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-300">const</span>
        <span className="text-surface-300">{' { '}</span>
        <span className="text-white">flags</span>
        <span className="text-surface-400">, </span>
        <span className="text-white">isEnabled</span>
        <span className="text-surface-300">{' } = '}</span>
        <span className="text-brand-300">useFeatureFlags</span>
        <span className="text-surface-300">();</span>
        {'\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-300">const</span>
        <span className="text-surface-300">{' { '}</span>
        <span className="text-white">campaigns</span>
        <span className="text-surface-300">{' } = '}</span>
        <span className="text-brand-300">useCampaigns</span>
        <span className="text-surface-300">();</span>
        {'\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-300">const</span>
        <span className="text-surface-300">{' { '}</span>
        <span className="text-white">contactInfo</span>
        <span className="text-surface-300">{' } = '}</span>
        <span className="text-brand-300">useContactInfo</span>
        <span className="text-surface-300">();</span>
        {'\n\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-300">if</span>
        <span className="text-surface-300">{' (!'}</span>
        <span className="text-brand-300">isEnabled</span>
        <span className="text-surface-300">(</span>
        <span className="text-brand-400">{"'advertising'"}</span>
        <span className="text-surface-300">))</span>
        <span className="text-accent-300"> return</span>
        <span className="text-surface-300"> null;</span>
        {'\n\n'}
        <span className="text-surface-400">{'  '}</span>
        <span className="text-accent-300">return</span>
        <span className="text-surface-300">{' <'}</span>
        <span className="text-brand-300">AdBanner</span>
        <span className="text-accent-200"> campaigns</span>
        <span className="text-surface-400">={'{'}</span>
        <span className="text-white">campaigns</span>
        <span className="text-surface-400">{'}'}</span>
        <span className="text-surface-300">{' />'}</span>
        <span className="text-surface-400">;</span>
        {'\n'}
        <span className="text-surface-300">{'}'}</span>
      </span>
    ),
  },
];

const SYSTEMS = [
  {
    icon: ToggleLeft,
    title: 'Feature Flags',
    description:
      'Global kill switches, per-feature toggles, API versioning, maintenance mode, and platform-specific availability controls across every project.',
    href: '/features/feature-flags',
    color: 'brand' as const,
  },
  {
    icon: Megaphone,
    title: 'Advertising',
    description:
      'Cross-project ad campaigns with 5 components, 10 display variants, frequency capping, campaign targeting, analytics tracking, and priority scheduling.',
    href: '/features/advertising',
    color: 'accent' as const,
  },
  {
    icon: Radio,
    title: 'Broadcasts',
    description:
      'Deliver announcements, updates, and alerts across all projects with banner, modal, toast, and bell notification variants with platform targeting.',
    href: '/features/broadcasts',
    color: 'brand' as const,
  },
];

const STATS = [
  { value: '30+', label: 'Hooks' },
  { value: '50+', label: 'Services' },
  { value: '8+', label: 'Components' },
  { value: '15', label: 'Collections' },
  { value: '3', label: 'Systems' },
];

const STEPS = [
  {
    step: 1,
    title: 'Install Package',
    description: 'Add shared-features to your project with a single npm install command. Zero configuration needed to get started.',
    icon: Package,
  },
  {
    step: 2,
    title: 'Configure Firebase',
    description: 'Pass your Firebase config during initialization. The package creates its own isolated Firebase app instance to avoid conflicts.',
    icon: Settings,
  },
  {
    step: 3,
    title: 'Use Components & Hooks',
    description: 'Import ready-made hooks and components for feature flags, ads, broadcasts, contact info, and all 11 common feature modules.',
    icon: Zap,
  },
  {
    step: 4,
    title: 'Manage from Admin Panel',
    description: 'Control everything from a centralized admin panel. Update feature flags, launch campaigns, and broadcast notifications in real-time.',
    icon: Monitor,
  },
];

const COMMON_FEATURES = [
  { icon: Phone, title: 'Contact Info', description: 'Phone, email, and messaging details', href: '/features/common' },
  { icon: User, title: 'Developer Info', description: 'Professional profile and bio', href: '/features/common' },
  { icon: Share2, title: 'Social Links', description: 'All social media profiles', href: '/features/common' },
  { icon: MapPin, title: 'Address Info', description: 'Physical location and map', href: '/features/common' },
  { icon: CreditCard, title: 'Payment Options', description: 'Accepted payment methods', href: '/features/common' },
  { icon: Briefcase, title: 'Services', description: 'Professional service offerings', href: '/features/common' },
  { icon: Award, title: 'Skills', description: 'Technical skills and expertise', href: '/features/common' },
  { icon: MessageSquare, title: 'Testimonials', description: 'Client reviews and feedback', href: '/features/common' },
  { icon: FolderOpen, title: 'Projects', description: 'Portfolio of past work', href: '/features/common' },
  { icon: Megaphone, title: 'Campaigns', description: 'Cross-project ad campaigns', href: '/features/advertising' },
  { icon: Radio, title: 'Broadcasts', description: 'Cross-project notifications', href: '/features/broadcasts' },
];

const FLOATING_SHAPES = [
  { className: 'top-20 left-[10%] h-16 w-16 rounded-xl bg-brand-400/20 rotate-12', delay: 0, duration: 7 },
  { className: 'top-40 right-[15%] h-12 w-12 rounded-full bg-accent-400/20', delay: 1, duration: 5 },
  { className: 'bottom-32 left-[20%] h-10 w-10 rounded-lg bg-brand-300/15 -rotate-12', delay: 2, duration: 8 },
  { className: 'top-28 right-[30%] h-8 w-8 rounded-full bg-accent-300/20 rotate-45', delay: 0.5, duration: 6 },
  { className: 'bottom-20 right-[10%] h-14 w-14 rounded-xl bg-brand-500/10 rotate-6', delay: 1.5, duration: 9 },
  { className: 'top-60 left-[35%] h-6 w-6 rounded-full bg-accent-500/15', delay: 3, duration: 4 },
];

/**
 * Main landing page for the shared-features marketing website.
 * Showcases the package's core systems, stats, code examples, workflow, and common features.
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackPageView('/', 'Home');
  }, []);

  async function handleCopyInstall() {
    const success = await copyToClipboard(INSTALL_CMD);
    if (success) {
      setCopied(true);
      trackCodeCopy('hero_install');
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleCopyCode() {
    const success = await copyToClipboard(CODE_TABS[activeTab].code);
    if (success) {
      trackCodeCopy(`code_preview_${CODE_TABS[activeTab].label.toLowerCase()}`);
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-surface-50 via-brand-50/30 to-surface-50 pt-16 pb-24">
        {/* Floating shapes */}
        {FLOATING_SHAPES.map((shape, i) => (
          <motion.div
            key={i}
            className={cn('absolute hidden md:block', shape.className)}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: shape.duration, repeat: Infinity, delay: shape.delay }}
          />
        ))}

        <Container className="relative z-10">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <Badge variant="outline" className="mb-6 border-brand-300 text-brand-700 px-4 py-1.5">
                <Package className="mr-1.5 h-3.5 w-3.5" />
                Open Source NPM Package
              </Badge>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-brand-600 via-accent-600 to-brand-600 bg-clip-text text-transparent">
                One Package.
              </span>
              <br />
              <span className="text-surface-900">Every Project.</span>
              <br />
              <span className="bg-gradient-to-r from-accent-600 to-brand-600 bg-clip-text text-transparent">
                All Features.
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mx-auto mt-6 max-w-2xl font-body text-lg text-surface-600 sm:text-xl"
            >
              Centralized feature flags, cross-project advertising, broadcast notifications, and 11 common feature
              modules — all from a single npm package.
            </motion.p>

            {/* Install command */}
            <motion.div variants={staggerItem} className="mt-8 flex justify-center">
              <button
                onClick={handleCopyInstall}
                className="group flex items-center gap-3 rounded-xl border border-surface-200 bg-surface-900 px-5 py-3 font-mono text-sm text-surface-100 shadow-lg transition-all hover:border-brand-500/50 hover:shadow-brand-500/10"
              >
                <span className="text-surface-500">$</span>
                <span>{INSTALL_CMD}</span>
                {copied ? (
                  <Check className="h-4 w-4 text-brand-400" />
                ) : (
                  <Copy className="h-4 w-4 text-surface-400 transition-colors group-hover:text-brand-400" />
                )}
              </button>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={staggerItem} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link to="/docs" onClick={() => trackClick('hero_get_started', 'cta')}>
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('hero_view_npm', 'cta')}
                >
                  View on NPM
                  <Package className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* 3 System Cards */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Three Powerful Systems
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Manage feature availability, run cross-project ad campaigns, and broadcast notifications — all from a single admin panel.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {SYSTEMS.map((system) => (
              <motion.div key={system.title} variants={staggerItem}>
                <Link to={system.href} onClick={() => trackClick(`system_card_${system.title}`, 'navigation')}>
                  <Card className="group h-full cursor-pointer border-surface-200 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5">
                    <CardHeader>
                      <div
                        className={cn(
                          'mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                          system.color === 'brand'
                            ? 'bg-brand-100 text-brand-600 group-hover:bg-brand-200'
                            : 'bg-accent-100 text-accent-600 group-hover:bg-accent-200',
                        )}
                      >
                        <system.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{system.title}</CardTitle>
                      <CardDescription className="text-surface-500 leading-relaxed">
                        {system.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                        Learn more <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-brand-600 via-accent-600 to-brand-600 py-12">
        <Container>
          <motion.div
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem} className="text-center">
                <div className="font-display text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Code Preview */}
      <section className="py-20 bg-surface-50">
        <Container>
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Up and Running in Minutes
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Three steps to integrate shared-features into any React project. Install, initialize, and start using hooks and components.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <div className="overflow-hidden rounded-2xl border border-surface-700 bg-surface-900 shadow-2xl">
              {/* Tab bar */}
              <div className="flex items-center justify-between border-b border-surface-700 bg-surface-800 px-4">
                <div className="flex">
                  {CODE_TABS.map((tab, i) => (
                    <button
                      key={tab.label}
                      onClick={() => {
                        setActiveTab(i);
                        trackClick(`code_tab_${tab.label.toLowerCase()}`, 'code_preview');
                      }}
                      className={cn(
                        'relative px-4 py-3 text-sm font-medium transition-colors',
                        activeTab === i
                          ? 'text-brand-400'
                          : 'text-surface-400 hover:text-surface-200',
                      )}
                    >
                      <span className="relative z-10">
                        {i + 1}. {tab.label}
                      </span>
                      {activeTab === i && (
                        <motion.div
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-400"
                          layoutId="codeTab"
                        />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-surface-400 transition-colors hover:bg-surface-700 hover:text-surface-200"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>

              {/* Code content */}
              <div className="p-5 overflow-x-auto">
                <div className="min-w-0">
                  {CODE_TABS[activeTab].highlighted}
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* How It Works Timeline */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              From installation to a fully managed feature ecosystem in four straightforward steps.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {STEPS.map((item, i) => (
              <motion.div key={item.step} variants={staggerItem} className="relative flex gap-6 pb-12 last:pb-0">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px bg-gradient-to-b from-brand-300 to-surface-200" />
                )}
                {/* Step circle */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 ring-4 ring-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <Badge size="sm" className="bg-brand-100 text-brand-700">
                      Step {item.step}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-surface-900">{item.title}</h3>
                  <p className="mt-1 text-surface-500 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Common Features Grid */}
      <section className="py-20 bg-surface-50">
        <Container>
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-accent-100 text-accent-700">
              <Layers className="mr-1 h-3 w-3" />
              11 Feature Modules
            </Badge>
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Common Features, Centralized
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Every feature module includes types, services, hooks, and optional UI components. Manage all data from one admin panel.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {COMMON_FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Link to={feature.href} onClick={() => trackClick(`feature_${feature.title}`, 'navigation')}>
                  <Card className="group h-full cursor-pointer transition-all hover:border-brand-200 hover:shadow-md">
                    <CardHeader className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                          <CardDescription className="mt-1">{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Button variant="outline" asChild>
              <Link to="/features" onClick={() => trackClick('view_all_features', 'navigation')}>
                View All Features <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-accent-600 to-brand-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <Container className="relative z-10">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={staggerItem}
              className="font-display text-3xl font-bold text-white sm:text-4xl"
            >
              Ready to unify your projects?
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/80">
              Stop duplicating code across projects. Install {APP_NAME} and manage features, ads, broadcasts, and common data from one place.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-surface-100 shadow-lg" asChild>
                <Link to="/docs" onClick={() => trackClick('cta_get_started', 'cta')}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                variant="outline"
                asChild
              >
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('cta_npm', 'cta')}
                >
                  <Package className="h-4 w-4" />
                  npm install shared-features
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
