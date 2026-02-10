import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ToggleLeft,
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
  ArrowRight,
  ChevronRight,
  Check,
  X,
  Layers,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Target,
  Bell,
  Sliders,
  Eye,
  Globe,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { trackPageView, trackClick } from '@/lib/analytics';

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

type SystemTab = 'feature-flags' | 'advertising' | 'broadcasts';

const SYSTEM_TABS: {
  id: SystemTab;
  label: string;
  icon: typeof ToggleLeft;
  color: string;
  description: string;
  bullets: string[];
  href: string;
}[] = [
  {
    id: 'feature-flags',
    label: 'Feature Flags',
    icon: ToggleLeft,
    color: 'brand',
    description:
      'Control every feature across all your projects from a single dashboard. Enable or disable functionality instantly without deploying new code.',
    bullets: [
      'Global kill switch to instantly disable all shared features',
      'Per-feature toggles for advertising, broadcasts, and common features',
      'API versioning with minimum and latest version enforcement',
      'Maintenance mode with custom messages and scheduled windows',
      'Platform-specific availability (web, Android, iOS)',
      'Deprecation warnings with configurable messages',
      'Real-time updates via Firestore listeners',
      'No deployment required for flag changes',
    ],
    href: '/features/feature-flags',
  },
  {
    id: 'advertising',
    label: 'Advertising',
    icon: Megaphone,
    color: 'accent',
    description:
      'Run targeted ad campaigns across all your projects. Five dedicated components, ten display variants, frequency capping, analytics, and priority-based scheduling.',
    bullets: [
      '5 ad components: AdPanel, AdSlider, AdModal, AdUpdateModal, AdBanner',
      '10 display variants including inline, overlay, fullscreen, and floating',
      'Frequency capping per user with configurable intervals',
      'Campaign targeting by project, platform, and audience segment',
      'Built-in impression and click analytics tracking',
      'Priority system for controlling ad display order',
      '8 placement types: header, sidebar, footer, interstitial, and more',
      'Scheduling with start/end dates and timezone support',
    ],
    href: '/features/advertising',
  },
  {
    id: 'broadcasts',
    label: 'Broadcasts',
    icon: Radio,
    color: 'brand',
    description:
      'Deliver announcements, updates, and urgent alerts across every project. Four display variants, priority levels, scheduling, and dismissal tracking.',
    bullets: [
      '4 display variants: banner, modal, toast, and bell notification',
      'Priority levels: low, normal, high, and urgent',
      'Scheduling with start and end timestamps',
      'Dismissal tracking per user so dismissed messages stay hidden',
      'Platform targeting for web, Android, iOS, or all platforms',
      'Project-specific or global broadcast targeting',
      'Action buttons with custom URLs and labels',
      'Real-time delivery via Firestore listeners',
    ],
    href: '/features/broadcasts',
  },
];

const COMMON_FEATURES = [
  {
    icon: Phone,
    title: 'Contact Info',
    description: 'Centralized phone numbers, email addresses, and messaging details shared across all projects.',
    href: '/features/common',
  },
  {
    icon: User,
    title: 'Developer Info',
    description: 'Professional bio, profile photo, title, and summary displayed consistently everywhere.',
    href: '/features/common',
  },
  {
    icon: Share2,
    title: 'Social Links',
    description: 'All social media profiles — LinkedIn, GitHub, Twitter, and more — managed in one place.',
    href: '/features/common',
  },
  {
    icon: MapPin,
    title: 'Address Info',
    description: 'Physical address, city, country, postal code, and coordinates for maps integration.',
    href: '/features/common',
  },
  {
    icon: CreditCard,
    title: 'Payment Options',
    description: 'Accepted payment methods, bank details, and digital wallet information for support pages.',
    href: '/features/common',
  },
  {
    icon: Briefcase,
    title: 'Services',
    description: 'Professional service offerings with descriptions, pricing, categories, and availability status.',
    href: '/features/common',
  },
  {
    icon: Award,
    title: 'Skills',
    description: 'Technical skills, proficiency levels, categories, and years of experience for portfolio display.',
    href: '/features/common',
  },
  {
    icon: MessageSquare,
    title: 'Testimonials',
    description: 'Client reviews, ratings, project references, and approval status for social proof sections.',
    href: '/features/common',
  },
  {
    icon: FolderOpen,
    title: 'Projects',
    description: 'Portfolio of completed work with tech stack details, links, images, and project categories.',
    href: '/features/common',
  },
  {
    icon: Megaphone,
    title: 'Campaigns',
    description: 'Cross-project advertising campaigns with targeting, scheduling, and analytics tracking.',
    href: '/features/advertising',
  },
  {
    icon: Radio,
    title: 'Broadcasts',
    description: 'Cross-project notification system for announcements, updates, and urgent alerts.',
    href: '/features/broadcasts',
  },
];

const COMPARISON_WITHOUT = [
  'Duplicate feature flag logic in every project',
  'Separate ad campaign setup per application',
  'No centralized broadcast system',
  'Copy-paste contact info across codebases',
  'Inconsistent developer profiles',
  'Manual updates to each project when info changes',
  'No cross-project analytics or impressions',
  'No way to disable a feature across all projects at once',
];

const COMPARISON_WITH = [
  'Single feature flag dashboard controls everything',
  'One campaign targets all projects simultaneously',
  'Unified broadcast system reaches every user',
  'Contact info updated once, reflected everywhere',
  'Consistent developer profile across all projects',
  'Real-time Firestore sync — change once, update all',
  'Centralized impression tracking and analytics',
  'Global kill switch disables everything instantly',
];

/**
 * Features overview page showing the three core systems, all common features,
 * and a before/after comparison.
 */
export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<SystemTab>('feature-flags');

  useEffect(() => {
    trackPageView('/features', 'Features');
  }, []);

  const activeSystem = SYSTEM_TABS.find((t) => t.id === activeTab)!;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-surface-50 via-accent-50/20 to-white pt-20 pb-16">
        <Container>
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <Badge variant="outline" className="mb-6 border-accent-300 text-accent-700 px-4 py-1.5">
                <Layers className="mr-1.5 h-3.5 w-3.5" />
                Full Feature Overview
              </Badge>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl"
            >
              Everything You Need,{' '}
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                Nothing You Don't
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-5 text-lg text-surface-500">
              Three core systems and eleven common feature modules give you full control over shared functionality
              across every project in your ecosystem.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Tabbed System Details */}
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
              Core Systems
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Three interconnected systems that power cross-project management capabilities.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mx-auto max-w-4xl">
            <div className="flex justify-center gap-2 mb-10">
              {SYSTEM_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      trackClick(`features_tab_${tab.id}`, 'features');
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-surface-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-xl',
                        activeSystem.color === 'brand'
                          ? 'bg-brand-100 text-brand-600'
                          : 'bg-accent-100 text-accent-600',
                      )}
                    >
                      <activeSystem.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-2xl">{activeSystem.label}</CardTitle>
                  </div>
                  <CardDescription className="text-base text-surface-500 leading-relaxed">
                    {activeSystem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeSystem.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                        <span className="text-sm text-surface-600 leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="primary" size="md" asChild>
                      <Link
                        to={activeSystem.href}
                        onClick={() => trackClick(`features_detail_${activeSystem.id}`, 'navigation')}
                      >
                        Explore {activeSystem.label} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
            <Badge className="mb-4 bg-brand-100 text-brand-700">
              <Layers className="mr-1 h-3 w-3" />
              11 Modules
            </Badge>
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Common Feature Modules
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Each module includes TypeScript types, Firestore services, React hooks, and optional UI components.
              Manage all data from the centralized admin panel.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {COMMON_FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Link
                  to={feature.href}
                  onClick={() => trackClick(`feature_card_${feature.title}`, 'navigation')}
                >
                  <Card className="group h-full cursor-pointer transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                          <CardDescription className="mt-1.5 leading-relaxed">
                            {feature.description}
                          </CardDescription>
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
              <Link to="/features/common" onClick={() => trackClick('view_common_features', 'navigation')}>
                Explore All Common Features <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Before vs After */}
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
              Before vs After
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              See the difference shared-features makes when managing features across multiple projects.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Without */}
            <motion.div variants={staggerItem}>
              <Card className="h-full border-red-200 bg-red-50/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <X className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg text-red-800">Without shared-features</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {COMPARISON_WITHOUT.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <span className="text-sm text-red-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* With */}
            <motion.div variants={staggerItem}>
              <Card className="h-full border-brand-200 bg-brand-50/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <Check className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg text-brand-800">With shared-features</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {COMPARISON_WITH.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                        <span className="text-sm text-brand-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
              Start Building with Shared Features
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/80">
              Read the documentation to integrate shared-features into your project in minutes.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-surface-100 shadow-lg" asChild>
                <Link to="/docs" onClick={() => trackClick('features_cta_docs', 'cta')}>
                  Read the Docs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
