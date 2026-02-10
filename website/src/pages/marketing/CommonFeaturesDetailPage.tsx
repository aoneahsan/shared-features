import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  ArrowRight,
  ChevronRight,
  Phone,
  User,
  Share2,
  MapPin,
  CreditCard,
  Briefcase,
  Award,
  MessageSquare,
  FolderOpen,
  Megaphone,
  Radio,
  Home,
  Database,
  Code2,
  Component,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

const FEATURES = [
  {
    icon: Phone,
    title: 'Contact Info',
    description: 'Centralized contact details shared across all projects. Update once and every consumer app reflects the changes in real-time.',
    hook: 'useContactInfo',
    component: 'ContactCard',
    collection: 'zaions_contact_info',
    fields: ['Primary phone', 'Secondary phone', 'Primary email', 'Secondary email', 'WhatsApp number', 'Telegram handle', 'Preferred contact method'],
    color: 'brand' as const,
  },
  {
    icon: User,
    title: 'Developer Info',
    description: 'Professional profile information for portfolio pages, about sections, and footer credits. Consistent identity across every project.',
    hook: 'useDeveloperInfo',
    component: 'DeveloperCard',
    collection: 'zaions_developer_info',
    fields: ['Full name', 'Title/role', 'Bio/summary', 'Profile photo URL', 'Resume URL', 'Years of experience', 'Specializations'],
    color: 'accent' as const,
  },
  {
    icon: Share2,
    title: 'Social Links',
    description: 'All social media profiles managed in one place. LinkedIn, GitHub, Twitter, YouTube, and any custom platform links.',
    hook: 'useSocialLinks',
    component: 'SocialLinksBar',
    collection: 'zaions_social_links',
    fields: ['Platform name', 'Profile URL', 'Username/handle', 'Icon identifier', 'Display order', 'Is primary', 'Is active'],
    color: 'brand' as const,
  },
  {
    icon: MapPin,
    title: 'Address Info',
    description: 'Physical address and location data for contact pages, maps integration, and legal footers. Supports multiple address formats.',
    hook: 'useAddressInfo',
    component: 'AddressCard',
    collection: 'zaions_address_info',
    fields: ['Street address', 'City', 'State/province', 'Country', 'Postal/ZIP code', 'Latitude/longitude', 'Google Maps URL'],
    color: 'accent' as const,
  },
  {
    icon: CreditCard,
    title: 'Payment Options',
    description: 'Accepted payment methods, bank details, and digital wallet information for support and donation pages across all projects.',
    hook: 'usePaymentOptions',
    component: null,
    collection: 'zaions_payment_options',
    fields: ['Payment method name', 'Account/wallet details', 'Display name', 'Instructions', 'Payment type (bank/crypto/platform/wallet)', 'Currency', 'Is active', 'Display order'],
    color: 'brand' as const,
  },
  {
    icon: Briefcase,
    title: 'Services',
    description: 'Professional service offerings with descriptions, pricing tiers, and availability. Showcase what you offer consistently everywhere.',
    hook: 'useServices',
    component: 'ServicesGrid',
    collection: 'zaions_services',
    fields: ['Service name', 'Description', 'Category', 'Pricing/rate', 'Availability status', 'Featured flag', 'Icon identifier', 'Display order'],
    color: 'accent' as const,
  },
  {
    icon: Award,
    title: 'Skills',
    description: 'Technical skills, proficiency levels, and expertise areas for portfolio and resume sections. Categorized and sorted by proficiency.',
    hook: 'useSkills',
    component: 'SkillsDisplay',
    collection: 'zaions_skills',
    fields: ['Skill name', 'Category', 'Proficiency level (1-100)', 'Years of experience', 'Is featured', 'Icon/logo URL', 'Display order'],
    color: 'brand' as const,
  },
  {
    icon: MessageSquare,
    title: 'Testimonials',
    description: 'Client reviews, ratings, and project references. Display social proof consistently across every project in your ecosystem.',
    hook: 'useTestimonials',
    component: 'TestimonialsGrid',
    collection: 'zaions_testimonials',
    fields: ['Client name', 'Client title/company', 'Review text', 'Rating (1-5)', 'Project reference', 'Photo URL', 'Is approved', 'Date'],
    color: 'accent' as const,
  },
  {
    icon: FolderOpen,
    title: 'Projects',
    description: 'Portfolio of completed work with tech stack details, live links, screenshots, and categorization. Your work, everywhere.',
    hook: 'useProjects',
    component: null,
    collection: 'zaions_projects',
    fields: ['Project name', 'Description', 'Category (web/mobile/extension/full-stack)', 'Tech stack array', 'Live URL', 'Source URL', 'Screenshot URLs', 'Is featured', 'Status'],
    color: 'brand' as const,
  },
  {
    icon: Megaphone,
    title: 'Campaigns',
    description: 'Cross-project advertising campaigns with targeting, scheduling, and analytics. Defined in the advertising system, accessible as a common feature.',
    hook: 'useCampaigns',
    component: 'AdBanner, AdPanel, AdSlider, AdModal',
    collection: 'zaions_campaigns',
    fields: ['Campaign name', 'Content/creative', 'Target projects', 'Target platforms', 'Priority', 'Schedule (start/end)', 'Frequency cap', 'Status'],
    color: 'accent' as const,
  },
  {
    icon: Radio,
    title: 'Broadcasts',
    description: 'Cross-project notification system for announcements, updates, and alerts. Defined in the broadcasts system, accessible as a common feature.',
    hook: 'useBroadcasts',
    component: 'BroadcastBanner, AnnouncementModal',
    collection: 'zaions_broadcasts',
    fields: ['Title', 'Message body', 'Variant (banner/modal/toast/bell)', 'Priority', 'Target projects', 'Target platforms', 'Schedule', 'Action URL'],
    color: 'brand' as const,
  },
];

/**
 * Common features deep-dive page. Shows all 11 feature modules with fields, hooks, and components.
 */
export default function CommonFeaturesDetailPage() {
  useEffect(() => {
    trackPageView('/features/common', 'Common Features');
  }, []);

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
            <span className="text-surface-900 font-medium">Common Features</span>
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
                <Layers className="h-8 w-8" />
              </div>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl"
            >
              11 Common{' '}
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                Feature Modules
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-5 text-lg text-surface-500 leading-relaxed">
              Every module follows the same architecture: TypeScript types, Firestore services, React hooks, and
              optional UI components. Manage all data from the centralized admin panel and consume it in any project.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Architecture Overview */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Module Architecture
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Every common feature module follows the same four-layer architecture.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-4xl grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Code2,
                title: 'TypeScript Types',
                description: 'Fully typed interfaces for every data structure. Import types directly for type-safe development.',
                badge: 'types/',
              },
              {
                icon: Database,
                title: 'Firestore Services',
                description: 'CRUD operations, real-time listeners, and query helpers for each Firestore collection.',
                badge: 'services/',
              },
              {
                icon: Layers,
                title: 'React Hooks',
                description: 'Ready-made hooks that handle loading, error states, real-time subscriptions, and caching.',
                badge: 'hooks/',
              },
              {
                icon: Component,
                title: 'UI Components',
                description: 'Optional pre-built React components for common display patterns. Fully customizable via props.',
                badge: 'components/',
              },
            ].map((layer) => (
              <motion.div key={layer.title} variants={staggerItem}>
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <layer.icon className="h-5 w-5" />
                    </div>
                    <Badge size="sm" className="mx-auto mb-2 bg-surface-100 text-surface-600 font-mono">
                      {layer.badge}
                    </Badge>
                    <CardTitle className="text-base">{layer.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{layer.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Feature Modules Grid */}
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
              All Modules
            </Badge>
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Feature Modules in Detail
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Each module includes its hook name, component name, Firestore collection, and key data fields.
            </p>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card className="overflow-hidden">
                  <div className="md:flex">
                    {/* Left: Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                            feature.color === 'brand'
                              ? 'bg-brand-100 text-brand-600'
                              : 'bg-accent-100 text-accent-600',
                          )}
                        >
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-surface-900">{feature.title}</h3>
                        </div>
                      </div>
                      <p className="text-surface-500 leading-relaxed text-sm mb-4">{feature.description}</p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge size="sm" className="bg-brand-50 text-brand-700 font-mono">
                          {feature.hook}()
                        </Badge>
                        {feature.component && (
                          <Badge size="sm" className="bg-accent-50 text-accent-700 font-mono">
                            {feature.component.includes(',') ? feature.component.split(',')[0]?.trim() : feature.component}
                          </Badge>
                        )}
                        <Badge size="sm" variant="outline" className="font-mono text-xs">
                          {feature.collection}
                        </Badge>
                      </div>
                    </div>

                    {/* Right: Fields */}
                    <div className="border-t md:border-t-0 md:border-l border-surface-200 bg-surface-50/50 p-6 md:w-80 lg:w-96">
                      <span className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-2 block">
                        Key Fields
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {feature.fields.map((field) => (
                          <div key={field} className="flex items-center gap-1.5">
                            <div className="h-1 w-1 rounded-full bg-brand-400 shrink-0" />
                            <span className="text-xs text-surface-600">{field}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Usage Pattern */}
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
              Consistent Usage Pattern
            </h2>
            <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
              Every hook follows the same pattern: call the hook, get the data, handle loading and error states.
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
              <div className="flex items-center border-b border-surface-700 bg-surface-800 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-3 text-xs text-surface-400 font-mono">Usage Pattern</span>
              </div>
              <div className="overflow-x-auto p-5">
                <pre className="font-mono text-sm leading-relaxed">
                  <span className="text-surface-500">{'// Every hook returns the same shape'}</span>
                  {'\n'}
                  <span className="text-accent-300">import</span>
                  <span className="text-surface-300">{' { '}</span>
                  <span className="text-brand-300">useContactInfo</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-brand-300">useDeveloperInfo</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-brand-300">useSkills</span>
                  <span className="text-surface-300">{' }'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">from</span>
                  <span className="text-brand-400">{" 'shared-features'"}</span>
                  <span className="text-surface-400">;</span>
                  {'\n\n'}
                  <span className="text-accent-300">function</span>
                  <span className="text-brand-300"> Footer</span>
                  <span className="text-surface-300">() {'{'}</span>
                  {'\n'}
                  <span className="text-surface-500">{'  // Singleton data (single document)'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">const</span>
                  <span className="text-surface-300">{' { '}</span>
                  <span className="text-white">contactInfo</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-white">loading</span>
                  <span className="text-surface-300">{' } = '}</span>
                  <span className="text-brand-300">useContactInfo</span>
                  <span className="text-surface-300">();</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">const</span>
                  <span className="text-surface-300">{' { '}</span>
                  <span className="text-white">developerInfo</span>
                  <span className="text-surface-300">{' } = '}</span>
                  <span className="text-brand-300">useDeveloperInfo</span>
                  <span className="text-surface-300">();</span>
                  {'\n\n'}
                  <span className="text-surface-500">{'  // Collection data (multiple documents)'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">const</span>
                  <span className="text-surface-300">{' { '}</span>
                  <span className="text-white">skills</span>
                  <span className="text-surface-400">, </span>
                  <span className="text-white">featuredSkills</span>
                  <span className="text-surface-300">{' } = '}</span>
                  <span className="text-brand-300">useSkills</span>
                  <span className="text-surface-300">();</span>
                  {'\n\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">if</span>
                  <span className="text-surface-300">{' ('}</span>
                  <span className="text-white">loading</span>
                  <span className="text-surface-300">)</span>
                  <span className="text-accent-300"> return</span>
                  <span className="text-surface-300">{' <'}</span>
                  <span className="text-brand-300">Spinner</span>
                  <span className="text-surface-300">{' />'}</span>
                  <span className="text-surface-400">;</span>
                  {'\n\n'}
                  <span className="text-surface-400">{'  '}</span>
                  <span className="text-accent-300">return</span>
                  <span className="text-surface-300">{' ('}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-surface-300">{'<'}</span>
                  <span className="text-brand-300">footer</span>
                  <span className="text-surface-300">{'>'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-surface-300">{'<'}</span>
                  <span className="text-brand-300">p</span>
                  <span className="text-surface-300">{'>'}</span>
                  <span className="text-surface-300">{'{'}</span>
                  <span className="text-white">contactInfo</span>
                  <span className="text-surface-400">?.</span>
                  <span className="text-white">email</span>
                  <span className="text-surface-300">{'}</'}</span>
                  <span className="text-brand-300">p</span>
                  <span className="text-surface-300">{'>'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-surface-300">{'<'}</span>
                  <span className="text-brand-300">p</span>
                  <span className="text-surface-300">{'>'}</span>
                  <span className="text-surface-300">{'{'}</span>
                  <span className="text-white">developerInfo</span>
                  <span className="text-surface-400">?.</span>
                  <span className="text-white">name</span>
                  <span className="text-surface-300">{'}</'}</span>
                  <span className="text-brand-300">p</span>
                  <span className="text-surface-300">{'>'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'      '}</span>
                  <span className="text-surface-300">{'{'}</span>
                  <span className="text-white">featuredSkills</span>
                  <span className="text-surface-400">.</span>
                  <span className="text-brand-300">map</span>
                  <span className="text-surface-300">(</span>
                  <span className="text-white">s</span>
                  <span className="text-accent-300">{' => '}</span>
                  <span className="text-surface-300">{'<'}</span>
                  <span className="text-brand-300">span</span>
                  <span className="text-surface-300">{'>'}</span>
                  <span className="text-surface-300">{'{'}</span>
                  <span className="text-white">s.name</span>
                  <span className="text-surface-300">{'}</'}</span>
                  <span className="text-brand-300">span</span>
                  <span className="text-surface-300">{'>'}</span>
                  <span className="text-surface-300">)</span>
                  <span className="text-surface-300">{'}'}</span>
                  {'\n'}
                  <span className="text-surface-400">{'    '}</span>
                  <span className="text-surface-300">{'</'}</span>
                  <span className="text-brand-300">footer</span>
                  <span className="text-surface-300">{'>'}</span>
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
              Start Using Common Features
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/80">
              Follow the documentation to integrate any or all of the 11 common feature modules into your project.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-surface-100 shadow-lg" asChild>
                <Link to="/docs" onClick={() => trackClick('common_features_cta_docs', 'cta')}>
                  Read the Docs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link to="/features" onClick={() => trackClick('common_features_cta_features', 'cta')}>
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
