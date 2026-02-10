import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radio,
  ArrowRight,
  ChevronRight,
  Bell,
  AlertTriangle,
  MessageSquare,
  PanelTop,
  Maximize,
  Monitor,
  Globe,
  Clock,
  Target,
  Eye,
  Copy,
  Check,
  Home,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
    icon: Monitor,
    title: '4 Display Variants',
    description: 'Banner, modal, toast, and bell notification variants let you match the urgency and context of every message.',
  },
  {
    icon: AlertTriangle,
    title: 'Priority Levels',
    description: 'Low, normal, high, and urgent priorities control display order and visual prominence. Urgent bypasses dismissals.',
  },
  {
    icon: Clock,
    title: 'Scheduling',
    description: 'Set start and end timestamps for broadcasts. Messages appear and disappear automatically based on your schedule.',
  },
  {
    icon: Eye,
    title: 'Dismissal Tracking',
    description: 'Track which users dismissed which broadcasts. Dismissed messages stay hidden unless priority is changed to urgent.',
  },
  {
    icon: Target,
    title: 'Platform Targeting',
    description: 'Target broadcasts to specific platforms — web only, Android only, iOS only, or deliver to all platforms simultaneously.',
  },
  {
    icon: Globe,
    title: 'Project Targeting',
    description: 'Send broadcasts to specific projects or make them global. Control which apps in your ecosystem see each message.',
  },
];

const VARIANTS = [
  {
    name: 'Banner',
    icon: PanelTop,
    description: 'A persistent strip at the top or bottom of the page. Ideal for ongoing announcements, maintenance notices, and low-urgency updates that should remain visible without interrupting the user flow.',
    useCases: ['Maintenance windows', 'Version update notices', 'Ongoing promotions', 'System status alerts'],
    color: 'brand' as const,
  },
  {
    name: 'Modal',
    icon: Maximize,
    description: 'A centered overlay that requires user attention. Use for critical announcements, breaking changes, required acknowledgments, and messages that users must read before continuing.',
    useCases: ['Critical security updates', 'Terms of service changes', 'Breaking API changes', 'Required acknowledgments'],
    color: 'accent' as const,
  },
  {
    name: 'Toast',
    icon: MessageSquare,
    description: 'A temporary notification that appears briefly and auto-dismisses. Suitable for quick confirmations, success messages, minor updates, and non-critical information the user can safely miss.',
    useCases: ['Quick tips and hints', 'Feature announcements', 'Minor updates', 'Success confirmations'],
    color: 'brand' as const,
  },
  {
    name: 'Bell',
    icon: Bell,
    description: 'A notification bell indicator with an unread count badge. Users can open a dropdown to see all pending broadcasts. Suitable for accumulated notifications that users check at their own pace.',
    useCases: ['Accumulated notifications', 'Changelog summaries', 'Non-urgent feature updates', 'Community announcements'],
    color: 'accent' as const,
  },
];

const CODE_EXAMPLE = `import { useBroadcasts, BroadcastBanner, AnnouncementModal } from 'shared-features';

function App() {
  const {
    broadcasts,
    activeBroadcasts,
    dismissBroadcast,
    isDismissed,
  } = useBroadcasts();

  const banners = activeBroadcasts.filter(b => b.variant === 'banner');
  const modals = activeBroadcasts.filter(b => b.variant === 'modal');

  return (
    <>
      {banners.map(broadcast => (
        <BroadcastBanner
          key={broadcast.id}
          broadcast={broadcast}
          onDismiss={() => dismissBroadcast(broadcast.id)}
        />
      ))}

      {modals.map(broadcast => (
        <AnnouncementModal
          key={broadcast.id}
          broadcast={broadcast}
          onDismiss={() => dismissBroadcast(broadcast.id)}
        />
      ))}
    </>
  );
}`;

/**
 * Broadcasts system deep-dive page. Shows variants, features, and usage examples.
 */
export default function BroadcastsDetailPage() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackPageView('/features/broadcasts', 'Broadcasts');
  }, []);

  async function handleCopy() {
    const success = await copyToClipboard(CODE_EXAMPLE);
    if (success) {
      setCopied(true);
      trackCodeCopy('broadcasts_example');
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
            <span className="text-surface-900 font-medium">Broadcasts</span>
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
                <Radio className="h-8 w-8" />
              </div>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl"
            >
              Cross-Project{' '}
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                Broadcasts
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-5 text-lg text-surface-500 leading-relaxed">
              Reach users across every project in your ecosystem with a unified notification system. Four display
              variants, priority levels, scheduling, and per-user dismissal tracking ensure the right message reaches
              the right user at the right time.
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
              A complete notification infrastructure for your multi-project ecosystem.
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

      {/* Variant Showcase */}
      <section className="py-20 bg-surface-50">
        <Container>
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-brand-100 text-brand-700">4 Variants</Badge>
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Display Variants
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Choose the right delivery method for every type of message.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {VARIANTS.map((variant) => (
              <motion.div key={variant.name} variants={staggerItem}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                          variant.color === 'brand'
                            ? 'bg-brand-100 text-brand-600'
                            : 'bg-accent-100 text-accent-600',
                        )}
                      >
                        <variant.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{variant.name}</CardTitle>
                    </div>
                    <CardDescription className="leading-relaxed">{variant.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Use cases</span>
                      {variant.useCases.map((uc) => (
                        <div key={uc} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                          <span className="text-sm text-surface-600">{uc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Code Example */}
      <section className="py-20 bg-white">
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
              Use the <span className="font-mono text-brand-600">useBroadcasts</span> hook to filter and render broadcasts.
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
                  <span className="text-brand-300">useBroadcasts</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-brand-300">BroadcastBanner</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-brand-300">AnnouncementModal</span>
                  <span className="text-surface-300">{' }'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
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
                  <span className="text-white">activeBroadcasts</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-white">dismissBroadcast</span>
                  <span className="text-surface-300">{' }'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    = '}</span>
                  <span className="text-brand-300">useBroadcasts</span>
                  <span className="text-surface-300">();</span>
                  {'\n\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">const</span>
                  <span className="text-white"> banners</span>
                  <span className="text-surface-400"> = </span>
                  <span className="text-white">activeBroadcasts</span>
                  <span className="text-surface-400">.</span>
                  <span className="text-brand-300">filter</span>
                  <span className="text-surface-300">(</span>
                  <span className="text-white">b</span>
                  <span className="text-accent-300">{' => '}</span>
                  <span className="text-white">b.variant</span>
                  <span className="text-accent-300">{' === '}</span>
                  <span className="text-brand-400">{"'banner'"}</span>
                  <span className="text-surface-300">);</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">const</span>
                  <span className="text-white"> modals</span>
                  <span className="text-surface-400"> = </span>
                  <span className="text-white">activeBroadcasts</span>
                  <span className="text-surface-400">.</span>
                  <span className="text-brand-300">filter</span>
                  <span className="text-surface-300">(</span>
                  <span className="text-white">b</span>
                  <span className="text-accent-300">{' => '}</span>
                  <span className="text-white">b.variant</span>
                  <span className="text-accent-300">{' === '}</span>
                  <span className="text-brand-400">{"'modal'"}</span>
                  <span className="text-surface-300">);</span>
                  {'\n\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">return</span>
                  <span className="text-surface-300">{' ('}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-surface-300">{'<>'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-surface-300">{'{'}</span>
                  <span className="text-white">banners</span>
                  <span className="text-surface-400">.</span>
                  <span className="text-brand-300">map</span>
                  <span className="text-surface-300">(</span>
                  <span className="text-white">b</span>
                  <span className="text-accent-300">{' => '}</span>
                  <span className="text-surface-300">{'<'}</span>
                  <span className="text-brand-300">BroadcastBanner</span>
                  {'\n'}
                  <span className="text-surface-400">{'        '}</span>
                  <span className="text-accent-200">broadcast</span>
                  <span className="text-surface-400">={'{'}</span>
                  <span className="text-white">b</span>
                  <span className="text-surface-400">{'}'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'        '}</span>
                  <span className="text-accent-200">onDismiss</span>
                  <span className="text-surface-400">={'{'}</span>
                  <span className="text-surface-300">() =&gt; </span>
                  <span className="text-brand-300">dismissBroadcast</span>
                  <span className="text-surface-300">(</span>
                  <span className="text-white">b.id</span>
                  <span className="text-surface-300">)</span>
                  <span className="text-surface-400">{'}'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-surface-300">{'/>'}</span>
                  <span className="text-surface-300">)</span>
                  <span className="text-surface-300">{'}'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-surface-300">{'</>'}</span>
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
              Send Your First Broadcast
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/80">
              Follow the documentation to set up cross-project broadcasts in minutes.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-surface-100 shadow-lg" asChild>
                <Link to="/docs" onClick={() => trackClick('broadcasts_cta_docs', 'cta')}>
                  Read the Docs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link to="/features" onClick={() => trackClick('broadcasts_cta_features', 'cta')}>
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
