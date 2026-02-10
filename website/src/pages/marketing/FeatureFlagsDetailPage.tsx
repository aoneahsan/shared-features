import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ToggleLeft,
  ArrowRight,
  ChevronRight,
  Power,
  Sliders,
  GitBranch,
  Wrench,
  Smartphone,
  AlertCircle,
  Copy,
  Check,
  Home,
  Megaphone,
  Radio,
  Phone,
  User,
  Share2,
  MapPin,
  CreditCard,
  Briefcase,
  Award,
  MessageSquare,
  FolderOpen,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackPageView, trackClick, trackCodeCopy } from '@/lib/analytics';
import { copyToClipboard } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const KEY_FEATURES = [
  {
    icon: Power,
    title: 'Global Kill Switch',
    description: 'Instantly disable all shared features across every project with a single toggle. Use for emergencies or planned maintenance.',
  },
  {
    icon: Sliders,
    title: 'Per-Feature Toggles',
    description: 'Enable or disable advertising, broadcasts, and each common feature module independently. Granular control without full shutdowns.',
  },
  {
    icon: GitBranch,
    title: 'API Versioning',
    description: 'Set minimum required and latest recommended versions. Consumer apps automatically handle version mismatch warnings and enforcement.',
  },
  {
    icon: Wrench,
    title: 'Maintenance Mode',
    description: 'Activate maintenance mode with a custom message. Consumer apps display the message and gracefully degrade instead of erroring.',
  },
  {
    icon: Smartphone,
    title: 'Platform Availability',
    description: 'Control which platforms each feature is available on — web, Android, iOS, or any combination. Per-platform feature gating.',
  },
  {
    icon: AlertCircle,
    title: 'Deprecation Warnings',
    description: 'Mark features as deprecated with configurable warning messages. Consumer apps display notices without removing functionality.',
  },
];

const CONTROLLABLE_FEATURES = [
  { name: 'Advertising', icon: Megaphone, description: 'Campaign display and ad components' },
  { name: 'Broadcasts', icon: Radio, description: 'Cross-project notification delivery' },
  { name: 'Contact Info', icon: Phone, description: 'Contact details module' },
  { name: 'Developer Info', icon: User, description: 'Professional profile module' },
  { name: 'Social Links', icon: Share2, description: 'Social media links module' },
  { name: 'Address Info', icon: MapPin, description: 'Physical address module' },
  { name: 'Payment Options', icon: CreditCard, description: 'Payment methods module' },
  { name: 'Services', icon: Briefcase, description: 'Professional services module' },
  { name: 'Skills', icon: Award, description: 'Skills and expertise module' },
  { name: 'Testimonials', icon: MessageSquare, description: 'Client reviews module' },
  { name: 'Projects', icon: FolderOpen, description: 'Portfolio projects module' },
];

const CODE_EXAMPLE = `import { useFeatureFlags } from 'shared-features';

function App() {
  const {
    flags,
    isEnabled,
    isMaintenanceMode,
    maintenanceMessage,
    isDeprecated,
    deprecationMessage,
    minVersion,
    latestVersion,
  } = useFeatureFlags();

  // Check maintenance mode
  if (isMaintenanceMode) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  // Check if a specific feature is enabled
  if (!isEnabled('advertising')) {
    console.log('Advertising is disabled via feature flags');
  }

  // Check for deprecation
  if (isDeprecated('social_links')) {
    showWarning(deprecationMessage('social_links'));
  }

  return <MyApp />;
}`;

/**
 * Feature flags system deep-dive page. Shows capabilities, controllable features, and usage.
 */
export default function FeatureFlagsDetailPage() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackPageView('/features/feature-flags', 'Feature Flags');
  }, []);

  async function handleCopy() {
    const success = await copyToClipboard(CODE_EXAMPLE);
    if (success) {
      setCopied(true);
      trackCodeCopy('feature_flags_example');
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-surface-50 pt-8 pb-0">
        <Container>
          <nav className="flex items-center gap-1.5 text-sm text-surface-500">
            <Link to="/" className="hover:text-brand-600 transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/features" className="hover:text-brand-600 transition-colors">
              Features
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-surface-900 font-medium">Feature Flags</span>
          </nav>
        </Container>
      </section>

      {/* Hero */}
      <section className="bg-gradient-to-b from-surface-50 via-brand-50/20 to-white pt-12 pb-16">
        <Container>
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <ToggleLeft className="h-8 w-8" />
              </div>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl"
            >
              Centralized{' '}
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                Feature Flags
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-5 text-lg text-surface-500 leading-relaxed">
              Control the availability and behavior of every feature across all your projects from a single Firestore
              document. Global kill switches, per-feature toggles, API versioning, maintenance mode, and deprecation
              warnings — all without redeploying.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Key Features */}
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
              Key Capabilities
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Powerful controls that give you real-time command over your entire project ecosystem.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {KEY_FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Controllable Features */}
      <section className="py-20 bg-surface-50">
        <Container>
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-brand-100 text-brand-700">
              <ToggleLeft className="mr-1 h-3 w-3" />
              11 Toggles
            </Badge>
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Controllable Features
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Each of these features can be independently enabled, disabled, deprecated, or restricted by platform.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {CONTROLLABLE_FEATURES.map((feature) => (
              <motion.div key={feature.name} variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{feature.name}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* How It Works */}
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
              How Feature Flags Work
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              A single Firestore document stores all flag states. Consumer apps subscribe via real-time listeners for instant updates.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {[
              {
                step: 1,
                title: 'Admin sets flags',
                description: 'Toggle features, set maintenance mode, or update API versions from the admin panel. Changes save to the zaions_feature_flags Firestore document instantly.',
              },
              {
                step: 2,
                title: 'Firestore syncs in real-time',
                description: 'The shared-features package subscribes to the feature flags document using onSnapshot. Any change propagates to all connected consumer apps within seconds.',
              },
              {
                step: 3,
                title: 'Consumer apps react',
                description: 'The useFeatureFlags hook provides the current flag state. Components conditionally render based on isEnabled, isMaintenanceMode, and isDeprecated checks.',
              },
            ].map((item, i) => (
              <motion.div key={item.step} variants={staggerItem} className="relative flex gap-6 pb-10 last:pb-0">
                {i < 2 && (
                  <div className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px bg-gradient-to-b from-brand-300 to-surface-200" />
                )}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white font-display font-bold ring-4 ring-white">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-lg font-semibold text-surface-900">{item.title}</h3>
                  <p className="mt-1 text-surface-500 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Code Example */}
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
              Quick Example
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Use the <span className="font-mono text-brand-600">useFeatureFlags</span> hook for real-time flag checks.
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
              <div className="flex items-center justify-between border-b border-surface-700 bg-surface-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-2 text-xs text-surface-400 font-mono">App.tsx</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-surface-400 transition-colors hover:bg-surface-700 hover:text-surface-200"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-brand-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="overflow-x-auto p-5">
                <pre className="font-mono text-sm leading-relaxed">
                  <span className="text-accent-300">import</span>
                  <span className="text-surface-300">{' { '}</span>
                  <span className="text-brand-300">useFeatureFlags</span>
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
                  <span className="text-surface-300">{' {'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-white">flags</span>
                  <span className="text-surface-400">,</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-white">isEnabled</span>
                  <span className="text-surface-400">,</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-white">isMaintenanceMode</span>
                  <span className="text-surface-400">,</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-white">maintenanceMessage</span>
                  <span className="text-surface-400">,</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-white">isDeprecated</span>
                  <span className="text-surface-400">,</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-white">deprecationMessage</span>
                  <span className="text-surface-400">,</span>
                  {'\n'}
                  <span className="text-surface-300">{'  }'}</span>
                  <span className="text-surface-400">{' = '}</span>
                  <span className="text-brand-300">useFeatureFlags</span>
                  <span className="text-surface-300">();</span>
                  {'\n\n'}
                  <span className="text-surface-500">{'  // Check maintenance mode'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">if</span>
                  <span className="text-surface-300">{' ('}</span>
                  <span className="text-white">isMaintenanceMode</span>
                  <span className="text-surface-300">) {'{'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-accent-300">return</span>
                  <span className="text-surface-300">{' <'}</span>
                  <span className="text-brand-300">MaintenancePage</span>
                  <span className="text-accent-200"> message</span>
                  <span className="text-surface-400">={'{'}</span>
                  <span className="text-white">maintenanceMessage</span>
                  <span className="text-surface-400">{'}'}</span>
                  <span className="text-surface-300">{' />'}</span>
                  <span className="text-surface-400">;</span>
                  {'\n'}
                  <span className="text-surface-300">{'  }'}</span>
                  {'\n\n'}
                  <span className="text-surface-500">{'  // Check specific feature'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">if</span>
                  <span className="text-surface-300">{' (!'}</span>
                  <span className="text-brand-300">isEnabled</span>
                  <span className="text-surface-300">(</span>
                  <span className="text-brand-400">{"'advertising'"}</span>
                  <span className="text-surface-300">)) {'{'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-white">console</span>
                  <span className="text-surface-400">.</span>
                  <span className="text-brand-300">log</span>
                  <span className="text-surface-300">(</span>
                  <span className="text-brand-400">{"'Ads disabled'"}</span>
                  <span className="text-surface-300">);</span>
                  {'\n'}
                  <span className="text-surface-300">{'  }'}</span>
                  {'\n\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">return</span>
                  <span className="text-surface-300">{' <'}</span>
                  <span className="text-brand-300">MyApp</span>
                  <span className="text-surface-300">{' />'}</span>
                  <span className="text-surface-400">;</span>
                  {'\n'}
                  <span className="text-surface-300">{'}'}</span>
                </pre>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-600 via-accent-600 to-brand-700">
        <Container>
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={staggerItem} className="font-display text-3xl font-bold text-white sm:text-4xl">
              Take Control of Your Features
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/80">
              Follow the documentation to set up centralized feature flag management.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-surface-100 shadow-lg" asChild>
                <Link to="/docs" onClick={() => trackClick('feature_flags_cta_docs', 'cta')}>
                  Read the Docs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link to="/features" onClick={() => trackClick('feature_flags_cta_features', 'cta')}>
                  All Features
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
