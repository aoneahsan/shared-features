import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Clock,
  Target,
  Eye,
  Layers,
  Monitor,
  Smartphone,
  Layout,
  PanelLeft,
  PanelTop,
  Maximize,
  MessageCircle,
  Square,
  Gauge,
  Copy,
  Check,
  Home,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackPageView, trackClick, trackCodeCopy } from '@/lib/analytics';
import { copyToClipboard } from '@/lib/utils';
import { useState } from 'react';

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
    icon: Layers,
    title: '5 Ad Components',
    description: 'AdPanel, AdSlider, AdModal, AdUpdateModal, and AdBanner — purpose-built components covering every ad scenario.',
  },
  {
    icon: Eye,
    title: '10 Display Variants',
    description: 'Inline, overlay, floating, fullscreen, sidebar, header, footer, interstitial, toast, and banner styles.',
  },
  {
    icon: Clock,
    title: 'Frequency Capping',
    description: 'Control how often users see ads with configurable impression limits and cooldown intervals per user.',
  },
  {
    icon: Target,
    title: 'Campaign Targeting',
    description: 'Target campaigns by project, platform (web/Android/iOS), audience segment, and geographic region.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Tracking',
    description: 'Built-in impression counting, click tracking, conversion events, and CTR analytics stored in Firestore.',
  },
  {
    icon: Gauge,
    title: 'Priority System',
    description: 'Assign priority levels to campaigns so higher-priority ads always take precedence when multiple match.',
  },
];

const COMPONENTS = [
  {
    name: 'AdPanel',
    description: 'A versatile panel component for displaying rich ad content. Supports images, text, call-to-action buttons, and custom layouts. Ideal for sidebar placements and inline content promotions.',
    badge: 'Most Used',
  },
  {
    name: 'AdSlider',
    description: 'Auto-rotating carousel component for showcasing multiple campaigns in sequence. Configurable slide duration, transition effects, and navigation controls. Suitable for hero sections and featured placements.',
    badge: 'Interactive',
  },
  {
    name: 'AdModal',
    description: 'Full-screen or centered overlay modal for high-impact campaign delivery. Includes dismiss tracking, backdrop click handling, and timed auto-close. Designed for important announcements and promotions.',
    badge: 'High Impact',
  },
  {
    name: 'AdUpdateModal',
    description: 'Specialized modal for app update notifications and version-specific campaigns. Supports required vs. optional update flows with custom action buttons and skip functionality.',
    badge: 'Updates',
  },
  {
    name: 'AdBanner',
    description: 'Lightweight banner component for persistent header or footer ad placements. Supports close/dismiss behavior, gradient backgrounds, and responsive sizing across all breakpoints.',
    badge: 'Lightweight',
  },
];

const PLACEMENTS = [
  { name: 'Header', description: 'Top of page, above content. High visibility for announcements and promotions.', icon: PanelTop },
  { name: 'Sidebar', description: 'Left or right column placement. Persistent visibility while users scroll content.', icon: PanelLeft },
  { name: 'Inline', description: 'Embedded within page content. Natural reading flow for contextual promotions.', icon: Layout },
  { name: 'Footer', description: 'Bottom of page placement. Visible after content consumption for follow-up CTAs.', icon: Square },
  { name: 'Interstitial', description: 'Full-screen between navigation. High engagement for important campaigns.', icon: Maximize },
  { name: 'Floating', description: 'Fixed-position overlay. Always visible without blocking content interaction.', icon: MessageCircle },
  { name: 'Toast', description: 'Temporary notification-style. Non-intrusive with auto-dismiss after set duration.', icon: Monitor },
  { name: 'Overlay', description: 'Semi-transparent background overlay. Focused attention on campaign content.', icon: Smartphone },
];

const CODE_EXAMPLE = `import { useCampaigns, AdBanner, AdPanel } from 'shared-features';

function MyApp() {
  const { campaigns, activeCampaigns, trackImpression, trackClick } = useCampaigns();

  return (
    <div>
      {/* Banner at the top */}
      <AdBanner
        campaigns={activeCampaigns}
        placement="header"
        onImpression={trackImpression}
        onClick={trackClick}
      />

      {/* Content area */}
      <main>
        <h1>My Application</h1>

        {/* Inline ad panel */}
        <AdPanel
          campaigns={activeCampaigns}
          placement="inline"
          maxItems={2}
          onImpression={trackImpression}
          onClick={trackClick}
        />
      </main>
    </div>
  );
}`;

/**
 * Advertising system deep-dive page. Shows components, placements, features, and usage examples.
 */
export default function AdvertisingDetailPage() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackPageView('/features/advertising', 'Advertising');
  }, []);

  async function handleCopy() {
    const success = await copyToClipboard(CODE_EXAMPLE);
    if (success) {
      setCopied(true);
      trackCodeCopy('advertising_example');
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
            <span className="text-surface-900 font-medium">Advertising</span>
          </nav>
        </Container>
      </section>

      {/* Hero */}
      <section className="bg-gradient-to-b from-surface-50 via-accent-50/20 to-white pt-12 pb-16">
        <Container>
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
                <Megaphone className="h-8 w-8" />
              </div>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl"
            >
              Cross-Project{' '}
              <span className="bg-gradient-to-r from-accent-600 to-brand-600 bg-clip-text text-transparent">
                Advertising
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-5 text-lg text-surface-500 leading-relaxed">
              Run targeted ad campaigns across all your projects from a single admin panel. Five dedicated components,
              ten display variants, built-in analytics, and a powerful priority system give you complete control over
              how your campaigns reach users.
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
              Everything you need to manage ad campaigns across your project ecosystem.
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
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
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

      {/* Component Showcase */}
      <section className="py-20 bg-surface-50">
        <Container>
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-accent-100 text-accent-700">5 Components</Badge>
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Ad Components
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Purpose-built React components for every advertising scenario.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-3xl space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {COMPONENTS.map((comp) => (
              <motion.div key={comp.name} variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CardTitle className="font-mono text-lg text-accent-700">{`<${comp.name} />`}</CardTitle>
                      <Badge size="sm" className="bg-accent-50 text-accent-600">{comp.badge}</Badge>
                    </div>
                    <CardDescription className="mt-2 leading-relaxed">{comp.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Placement Types */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-brand-100 text-brand-700">8 Placements</Badge>
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Placement Types
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Place ads exactly where they perform best within your application layout.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {PLACEMENTS.map((placement) => (
              <motion.div key={placement.name} variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <placement.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{placement.name}</CardTitle>
                        <CardDescription className="mt-1 text-xs leading-relaxed">
                          {placement.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
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
              Use the <span className="font-mono text-accent-600">useCampaigns</span> hook with any ad component.
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
                  <span className="ml-2 text-xs text-surface-400 font-mono">MyApp.tsx</span>
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
                  <span className="text-brand-300">useCampaigns</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-brand-300">AdBanner</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-brand-300">AdPanel</span>
                  <span className="text-surface-300">{' } '}</span>
                  <span className="text-accent-300">from</span>
                  <span className="text-brand-400">{" 'shared-features'"}</span>
                  <span className="text-surface-400">;</span>
                  {'\n\n'}
                  <span className="text-accent-300">function</span>
                  <span className="text-brand-300"> MyApp</span>
                  <span className="text-surface-300">() {'{'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">const</span>
                  <span className="text-surface-300">{' { '}</span>
                  <span className="text-white">activeCampaigns</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-white">trackImpression</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-white">trackClick</span>
                  <span className="text-surface-300">{' } = '}</span>
                  <span className="text-brand-300">useCampaigns</span>
                  <span className="text-surface-300">();</span>
                  {'\n\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">return</span>
                  <span className="text-surface-300">{' ('}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-surface-300">{'<'}</span>
                  <span className="text-brand-300">AdBanner</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-accent-200">campaigns</span>
                  <span className="text-surface-400">={'{'}</span>
                  <span className="text-white">activeCampaigns</span>
                  <span className="text-surface-400">{'}'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-accent-200">placement</span>
                  <span className="text-surface-400">=</span>
                  <span className="text-brand-400">{'"header"'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-accent-200">onImpression</span>
                  <span className="text-surface-400">={'{'}</span>
                  <span className="text-white">trackImpression</span>
                  <span className="text-surface-400">{'}'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-accent-200">onClick</span>
                  <span className="text-surface-400">={'{'}</span>
                  <span className="text-white">trackClick</span>
                  <span className="text-surface-400">{'}'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-surface-300">{'/>'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-surface-300">);</span>
                  {'\n'}
                  <span className="text-surface-300">{'}'}</span>
                </pre>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-accent-600 via-brand-600 to-accent-700">
        <Container>
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={staggerItem} className="font-display text-3xl font-bold text-white sm:text-4xl">
              Launch Your First Campaign
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/80">
              Follow the documentation to set up cross-project advertising in minutes.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-accent-700 hover:bg-surface-100 shadow-lg" asChild>
                <Link to="/docs" onClick={() => trackClick('advertising_cta_docs', 'cta')}>
                  Read the Docs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link to="/features" onClick={() => trackClick('advertising_cta_features', 'cta')}>
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
