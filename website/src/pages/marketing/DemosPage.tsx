import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Bell,
  Users,
  Eye,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  MapPin,
  Star,
  Briefcase,
  Palette,
  ArrowLeft,
  MonitorPlay,
  ChevronRight,
  MessageSquare,
  Zap,
  Shield,
  Layout,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, copyToClipboard } from '@/lib/utils';
import { trackPageView, trackClick, trackCodeCopy } from '@/lib/analytics';
import { APP_NAME, DEVELOPER } from '@/config/constants';

/* -------------------------------------------------------------------------- */
/*  Code Block (compact version for demos)                                    */
/* -------------------------------------------------------------------------- */

function MiniCodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      trackCodeCopy(label ?? 'demo');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code, label]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-surface-800 bg-surface-900">
      <div className="flex items-center justify-between border-b border-surface-800 px-3 py-1.5">
        <span className="font-mono text-[10px] text-surface-400">typescript</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-200"
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className="font-mono text-xs leading-relaxed text-surface-100">{code}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tab Toggle                                                                */
/* -------------------------------------------------------------------------- */

function TabToggle({
  activeTab,
  onChange,
}: {
  activeTab: 'preview' | 'code';
  onChange: (tab: 'preview' | 'code') => void;
}) {
  return (
    <div className="flex rounded-lg bg-surface-100 p-0.5">
      <button
        onClick={() => onChange('preview')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
          activeTab === 'preview'
            ? 'bg-white text-surface-900 shadow-sm'
            : 'text-surface-500 hover:text-surface-700',
        )}
      >
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>
      <button
        onClick={() => onChange('code')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
          activeTab === 'code'
            ? 'bg-white text-surface-900 shadow-sm'
            : 'text-surface-500 hover:text-surface-700',
        )}
      >
        <Code2 className="h-3.5 w-3.5" />
        Code
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Demo Card Wrapper                                                         */
/* -------------------------------------------------------------------------- */

function DemoCard({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-surface-100 px-5 py-4 sm:px-6">
        <div>
          <h3 className="font-display text-base font-bold text-surface-900">{title}</h3>
          <p className="mt-0.5 text-sm text-surface-500">{description}</p>
        </div>
        <TabToggle activeTab={tab} onChange={setTab} />
      </div>
      <div className="p-5 sm:p-6">
        {tab === 'preview' ? (
          <div className="rounded-xl border border-dashed border-surface-200 bg-surface-50/50 p-4 sm:p-6">
            {children}
          </div>
        ) : (
          <MiniCodeBlock code={code} label={`demo-${title.toLowerCase().replace(/\s+/g, '-')}`} />
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mock Previews - Ad Components                                             */
/* -------------------------------------------------------------------------- */

function MockAdPanel() {
  const mockAds = [
    { title: 'Launch Your App', desc: 'Build with React + Capacitor', cta: 'Learn More' },
    { title: 'Shared Features Pro', desc: 'One package, all features', cta: 'Get Started' },
    { title: 'Firebase Integration', desc: 'Real-time data sync', cta: 'Explore' },
  ];
  return (
    <div className="space-y-3">
      {mockAds.map((ad) => (
        <div key={ad.title} className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-surface-800">{ad.title}</p>
            <p className="text-xs text-surface-500">{ad.desc}</p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-semibold text-white">
            {ad.cta}
          </span>
        </div>
      ))}
    </div>
  );
}

function MockAdSlider() {
  const [active, setActive] = useState(0);
  const slides = [
    { title: 'Build Faster', subtitle: 'Pre-built components for every need', color: 'from-brand-500 to-brand-700' },
    { title: 'Scale Easily', subtitle: 'Firebase-powered real-time features', color: 'from-accent-500 to-accent-700' },
    { title: 'Ship Today', subtitle: 'Zero config, just initialize and go', color: 'from-emerald-500 to-emerald-700' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % slides.length), 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-xl">
      <div className={cn('bg-gradient-to-r p-6 text-white transition-all duration-500', slides[active].color)}>
        <p className="text-lg font-bold">{slides[active].title}</p>
        <p className="mt-1 text-sm opacity-90">{slides[active].subtitle}</p>
        <button className="mt-3 rounded-lg bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur">
          Learn More
        </button>
      </div>
      <div className="flex justify-center gap-1.5 bg-surface-100 py-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === active ? 'w-6 bg-brand-500' : 'w-1.5 bg-surface-300',
            )}
          />
        ))}
      </div>
    </div>
  );
}

function MockAdBanner() {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2.5 text-white">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4" />
        <span className="text-sm font-medium">New: shared-features v0.1.6 is out!</span>
      </div>
      <span className="hidden text-xs font-semibold underline underline-offset-2 sm:block">
        View changelog
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mock Previews - Notification Components                                   */
/* -------------------------------------------------------------------------- */

function MockBroadcastBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return (
    <button
      onClick={() => setVisible(true)}
      className="text-xs text-brand-600 underline"
    >
      Show banner again
    </button>
  );
  return (
    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <Bell className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-blue-800">System Maintenance</p>
        <p className="mt-0.5 text-xs text-blue-600">
          Scheduled maintenance on Feb 15, 2026 from 2:00 AM - 4:00 AM UTC. Some services may be
          briefly unavailable.
        </p>
      </div>
      <button onClick={() => setVisible(false)} className="shrink-0 text-blue-400 hover:text-blue-600">
        &times;
      </button>
    </div>
  );
}

function MockAnnouncementModal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        Show Announcement
      </Button>
      {open && (
        <div className="mt-4 overflow-hidden rounded-xl border border-surface-200 bg-white shadow-lg">
          <div className="bg-gradient-to-r from-accent-500 to-brand-500 p-5 text-white">
            <p className="text-lg font-bold">Major Update Available</p>
            <p className="mt-1 text-sm opacity-90">Version 0.1.6 brings exciting new features</p>
          </div>
          <div className="p-5">
            <ul className="space-y-2 text-sm text-surface-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Portfolio field name fallbacks
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> New payment types (platform, wallet)
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Extended project categories
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                Update Now
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mock Previews - Common Feature Components                                 */
/* -------------------------------------------------------------------------- */

function MockContactCard() {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-5">
      <h4 className="mb-3 font-display text-sm font-bold text-surface-800">Contact Information</h4>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-sm text-surface-600">
          <Mail className="h-4 w-4 text-brand-500" />
          <span>{DEVELOPER.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-surface-600">
          <Phone className="h-4 w-4 text-brand-500" />
          <span>{DEVELOPER.phone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-surface-600">
          <MessageSquare className="h-4 w-4 text-brand-500" />
          <span>WhatsApp: {DEVELOPER.whatsapp}</span>
        </div>
      </div>
    </div>
  );
}

function MockDeveloperCard() {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xl font-bold text-white">
          AM
        </div>
        <div>
          <h4 className="font-display text-base font-bold text-surface-900">{DEVELOPER.name}</h4>
          <p className="text-sm text-surface-500">Full Stack Developer</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-surface-600">
        Passionate developer building open-source tools and mobile applications.
        Experienced in React, TypeScript, Firebase, and Capacitor.
      </p>
      <div className="mt-3 flex gap-2">
        <Badge variant="default" size="sm">React</Badge>
        <Badge variant="default" size="sm">TypeScript</Badge>
        <Badge variant="default" size="sm">Firebase</Badge>
      </div>
    </div>
  );
}

function MockSocialLinksBar() {
  const links = [
    { label: 'GitHub', icon: <Globe className="h-4 w-4" /> },
    { label: 'LinkedIn', icon: <Users className="h-4 w-4" /> },
    { label: 'NPM', icon: <Layout className="h-4 w-4" /> },
    { label: 'Portfolio', icon: <ExternalLink className="h-4 w-4" /> },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <span
          key={l.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-3 py-1.5 text-xs font-medium text-surface-600 transition-colors hover:border-brand-300 hover:text-brand-600"
        >
          {l.icon}
          {l.label}
        </span>
      ))}
    </div>
  );
}

function MockAddressCard() {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-5">
      <h4 className="mb-3 font-display text-sm font-bold text-surface-800">Address</h4>
      <div className="flex items-start gap-2.5 text-sm text-surface-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
        <div>
          <p>Zaions HQ</p>
          <p className="text-surface-400">Pakistan</p>
          <a
            href={DEVELOPER.address}
            className="mt-1 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
          >
            View on map <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function MockSkillsDisplay() {
  const skills = [
    { name: 'React', proficiency: 95 },
    { name: 'TypeScript', proficiency: 90 },
    { name: 'Firebase', proficiency: 85 },
    { name: 'Node.js', proficiency: 80 },
    { name: 'Capacitor', proficiency: 85 },
  ];
  return (
    <div className="space-y-3">
      {skills.map((s) => (
        <div key={s.name}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-surface-700">{s.name}</span>
            <span className="text-xs text-surface-400">{s.proficiency}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${s.proficiency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MockTestimonialsGrid() {
  const testimonials = [
    { author: 'Sarah K.', company: 'TechStartup Inc.', text: 'Shared Features saved us weeks of development time. The ad system is incredibly flexible.', rating: 5 },
    { author: 'James L.', company: 'DevAgency', text: 'Feature flags work flawlessly. We can roll out features gradually with confidence.', rating: 5 },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {testimonials.map((t) => (
        <div key={t.author} className="rounded-xl border border-surface-200 bg-white p-4">
          <div className="mb-2 flex gap-0.5">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-surface-600">&ldquo;{t.text}&rdquo;</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-100 text-xs font-bold text-surface-500">
              {t.author[0]}
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-800">{t.author}</p>
              <p className="text-[10px] text-surface-400">{t.company}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MockServicesGrid() {
  const services = [
    { title: 'Web Development', desc: 'Full-stack React applications', icon: <Globe className="h-5 w-5" /> },
    { title: 'Mobile Apps', desc: 'Cross-platform with Capacitor', icon: <Layout className="h-5 w-5" /> },
    { title: 'UI/UX Design', desc: 'Modern, accessible interfaces', icon: <Palette className="h-5 w-5" /> },
    { title: 'Consulting', desc: 'Architecture and code review', icon: <Briefcase className="h-5 w-5" /> },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((s) => (
        <div key={s.title} className="flex items-start gap-3 rounded-xl border border-surface-200 bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            {s.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-800">{s.title}</p>
            <p className="mt-0.5 text-xs text-surface-500">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Demo Section Wrapper                                                      */
/* -------------------------------------------------------------------------- */

interface DemoSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  demos: {
    title: string;
    description: string;
    code: string;
    preview: React.ReactNode;
  }[];
}

const DEMO_SECTIONS: DemoSection[] = [
  {
    id: 'ad-components',
    title: 'Ad Components',
    icon: <Megaphone className="h-5 w-5" />,
    description: 'Promotional campaign display components with multiple layout variants.',
    demos: [
      {
        title: 'AdPanel',
        description: 'Vertical list of ad campaigns for sidebars',
        code: `<AdPanel placement="sidebar" maxItems={3} />`,
        preview: <MockAdPanel />,
      },
      {
        title: 'AdSlider',
        description: 'Auto-rotating carousel of campaign ads',
        code: `<AdSlider placement="hero" interval={5000} />`,
        preview: <MockAdSlider />,
      },
      {
        title: 'AdBanner',
        description: 'Horizontal strip banner ad',
        code: `<AdBanner placement="top-banner" />`,
        preview: <MockAdBanner />,
      },
    ],
  },
  {
    id: 'notification-components',
    title: 'Notification Components',
    icon: <Bell className="h-5 w-5" />,
    description: 'Broadcast notification components for alerts and announcements.',
    demos: [
      {
        title: 'BroadcastBanner',
        description: 'Dismissible notification banner',
        code: `<BroadcastBanner broadcast={broadcast} onDismiss={handleDismiss} />`,
        preview: <MockBroadcastBanner />,
      },
      {
        title: 'AnnouncementModal',
        description: 'Modal dialog for major announcements',
        code: `<AnnouncementModal broadcast={broadcast} onClose={handleClose} />`,
        preview: <MockAnnouncementModal />,
      },
    ],
  },
  {
    id: 'common-components',
    title: 'Common Feature Components',
    icon: <Users className="h-5 w-5" />,
    description: 'Portfolio and profile components for developer and business information.',
    demos: [
      {
        title: 'ContactCard',
        description: 'Contact information display card',
        code: `<ContactCard />`,
        preview: <MockContactCard />,
      },
      {
        title: 'DeveloperCard',
        description: 'Developer profile card with avatar and bio',
        code: `<DeveloperCard />`,
        preview: <MockDeveloperCard />,
      },
      {
        title: 'SocialLinksBar',
        description: 'Horizontal bar of social media links',
        code: `<SocialLinksBar />`,
        preview: <MockSocialLinksBar />,
      },
      {
        title: 'AddressCard',
        description: 'Physical address display card',
        code: `<AddressCard />`,
        preview: <MockAddressCard />,
      },
      {
        title: 'SkillsDisplay',
        description: 'Visual skills display with proficiency bars',
        code: `<SkillsDisplay />`,
        preview: <MockSkillsDisplay />,
      },
      {
        title: 'TestimonialsGrid',
        description: 'Grid layout of client testimonials',
        code: `<TestimonialsGrid columns={2} />`,
        preview: <MockTestimonialsGrid />,
      },
      {
        title: 'ServicesGrid',
        description: 'Grid of professional services',
        code: `<ServicesGrid />`,
        preview: <MockServicesGrid />,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function DemosPage() {
  useEffect(() => {
    trackPageView('/demos', 'Component Demos');
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
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-md">
                <MonitorPlay className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-surface-900 lg:text-4xl">
                  Component Demos
                </h1>
                <p className="font-body text-sm text-surface-500">
                  Interactive previews of every component
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-2xl font-body text-lg text-surface-600">
              Explore live previews of all {APP_NAME} components. Toggle between
              preview and code views to see exactly what you get.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {DEMO_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-3 py-1.5 text-xs font-medium text-surface-600 transition-colors hover:border-brand-300 hover:text-brand-600"
                >
                  {s.icon}
                  {s.title}
                  <ChevronRight className="h-3 w-3" />
                </a>
              ))}
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-10">
        <div className="space-y-16">
          {DEMO_SECTIONS.map((section) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              {/* Section header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  {section.icon}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-surface-900">
                    {section.title}
                  </h2>
                  <p className="text-sm text-surface-500">{section.description}</p>
                </div>
              </div>

              {/* Demo cards */}
              <div className="space-y-6">
                {section.demos.map((demo) => (
                  <DemoCard
                    key={demo.title}
                    title={demo.title}
                    description={demo.description}
                    code={demo.code}
                  >
                    {demo.preview}
                  </DemoCard>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-2xl border border-surface-200 bg-gradient-to-br from-brand-50 to-accent-50 p-8 text-center sm:p-12"
        >
          <Shield className="mx-auto mb-3 h-10 w-10 text-brand-500" />
          <h2 className="font-display text-2xl font-bold text-surface-900">
            Ready to use these components?
          </h2>
          <p className="mx-auto mt-2 max-w-md font-body text-surface-600">
            Install {APP_NAME}, initialize with your Firebase config, and start
            using every component shown here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="primary" asChild>
              <Link to="/docs">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/docs/examples">Code Examples</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
