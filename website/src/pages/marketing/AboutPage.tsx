import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Zap,
  Shield,
  Code2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Package,
  Layers,
  Sparkles,
  Users,
  Rocket,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME, DEVELOPER, GITHUB_URL, NPM_URL, SUPPORT_URL } from '@/config/constants';
import { trackPageView, trackClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const ecosystemProjects = [
  {
    name: 'Zaions Platform',
    description: 'The central hub for all Zaions web applications and services, powered by shared-features for unified feature management.',
    badge: 'Platform',
  },
  {
    name: 'Developer Portfolio',
    description: 'Personal portfolio website using shared-features for contact info, social links, and services display.',
    badge: 'Website',
  },
  {
    name: 'Mobile Applications',
    description: 'Multiple React + Capacitor mobile apps leveraging shared advertising campaigns and broadcast notifications.',
    badge: 'Mobile',
  },
  {
    name: 'Browser Extensions',
    description: 'Chrome and Firefox extensions using shared feature flags for cross-platform feature control.',
    badge: 'Extension',
  },
];

const techStack = [
  { name: 'React 19', description: 'Modern UI library with hooks and concurrent features', icon: Code2 },
  { name: 'TypeScript', description: 'Full type safety across the entire package', icon: Shield },
  { name: 'Firebase', description: 'Real-time data sync with Firestore', icon: Zap },
  { name: 'Vite', description: 'Lightning-fast build tooling for ESM and CJS', icon: Rocket },
  { name: 'Radix UI', description: 'Accessible, unstyled component primitives', icon: Layers },
  { name: 'Tailwind CSS', description: 'Utility-first CSS for rapid UI development', icon: Sparkles },
];

const values = [
  {
    icon: Heart,
    title: 'Open Source',
    description: 'Built in the open with an MIT license. Every developer deserves access to quality shared feature tooling.',
    color: 'text-red-500 bg-red-50',
  },
  {
    icon: Sparkles,
    title: 'Developer Experience',
    description: 'Intuitive APIs, comprehensive TypeScript types, and clear documentation so you spend less time configuring and more time building.',
    color: 'text-accent-500 bg-accent-50',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Tree-shakeable exports, lazy-loaded Firebase modules, and minimal bundle impact. Your users should never feel the weight of shared features.',
    color: 'text-amber-500 bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Type Safety',
    description: 'Every hook, component, and service is fully typed. Catch errors at compile time, not in production.',
    color: 'text-brand-500 bg-brand-50',
  },
];

const profileLinks = [
  { label: 'LinkedIn', href: DEVELOPER.linkedin, icon: Linkedin },
  { label: 'GitHub', href: DEVELOPER.github, icon: Github },
  { label: 'NPM', href: DEVELOPER.npm, icon: Package },
  { label: 'Portfolio', href: DEVELOPER.portfolio, icon: Globe },
];

export default function AboutPage() {
  useEffect(() => {
    trackPageView('/about', 'About');
  }, []);

  return (
    <div className="py-16 sm:py-24">
      {/* Hero */}
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="info" size="md" className="mb-4">
            About {APP_NAME}
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl">
            Built by a Developer,{' '}
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
              For Developers
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-surface-600">
            {APP_NAME} was born from the frustration of duplicating feature management code across
            dozens of projects. One package, one admin panel, every project in sync.
          </p>
        </motion.div>
      </Container>

      {/* Developer Section */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <Card className="overflow-hidden">
            <div className="grid gap-0 md:grid-cols-[280px_1fr]">
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-50 to-accent-50 p-8 md:p-10"
              >
                {/* Avatar placeholder */}
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25">
                  <span className="font-display text-3xl font-bold text-white">AM</span>
                </div>
                <div className="text-center">
                  <h2 className="font-display text-xl font-bold text-surface-900">{DEVELOPER.name}</h2>
                  <p className="mt-1 text-sm text-surface-500">
                    Full-Stack Developer &amp; Open Source Advocate
                  </p>
                </div>
                <div className="flex gap-2">
                  {profileLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick(`about_profile_${link.label.toLowerCase()}`, 'about')}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-colors',
                        'hover:bg-brand-50 hover:text-brand-600',
                      )}
                      aria-label={link.label}
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="p-8 md:p-10">
                <h3 className="font-display text-lg font-semibold text-surface-900">The Story</h3>
                <div className="mt-4 space-y-4 text-surface-600">
                  <p>
                    After maintaining over 20 React and Capacitor projects, I noticed the same pattern
                    repeating: every app needed advertising panels, broadcast notifications, feature flags,
                    and developer contact information. Each implementation was slightly different, and
                    keeping them in sync was a nightmare.
                  </p>
                  <p>
                    {APP_NAME} solves this by providing a single npm package that connects all your
                    projects to one centralized Firebase backend. Update an ad campaign once and it
                    appears across every app. Toggle a feature flag and it propagates everywhere in
                    real time.
                  </p>
                  <p>
                    The admin panel at <strong>aoneahsan.com</strong> serves as the control center,
                    letting you manage campaigns, broadcasts, feature flags, contact info, and more
                    from a single dashboard. No more copy-pasting configuration between projects.
                  </p>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </Container>

      {/* Mission */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="success" size="md" className="mb-4">
            Our Mission
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Simplify cross-project feature management for the React ecosystem
          </h2>
          <p className="mt-6 text-lg text-surface-600">
            Every React project deserves powerful feature management without the overhead.
            We believe in writing code once, managing it centrally, and deploying it everywhere.
          </p>
        </motion.div>
      </Container>

      {/* Ecosystem */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge size="md" className="mb-4">Ecosystem</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              Projects Powered by {APP_NAME}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-surface-600">
              A growing ecosystem of applications and services that share features through a single
              centralized package.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {ecosystemProjects.map((project) => (
              <motion.div key={project.name} variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{project.name}</CardTitle>
                      <Badge variant="outline" size="sm">{project.badge}</Badge>
                    </div>
                    <CardDescription className="mt-2">{project.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* Tech Stack */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge variant="info" size="md" className="mb-4">Tech Stack</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              Built With Modern Tools
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => (
              <motion.div key={tech.name} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <tech.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-surface-900">{tech.name}</h3>
                      <p className="mt-1 text-sm text-surface-500">{tech.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* Values */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge variant="success" size="md" className="mb-4">Values</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              What We Stand For
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', value.color)}>
                      <value.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-surface-900">{value.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-surface-500">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* CTA */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="bg-gradient-to-br from-brand-500 to-accent-600 text-white">
            <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
              <CheckCircle2 className="h-12 w-12 opacity-80" />
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to simplify your projects?</h2>
                <p className="mx-auto mt-3 max-w-xl text-brand-100">
                  Get started with {APP_NAME} in minutes. Install via NPM, configure Firebase, and
                  manage all your project features from one place.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  asChild
                >
                  <a
                    href={NPM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('about_cta_npm', 'about')}
                  >
                    <Package className="h-4 w-4" />
                    View on NPM
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  asChild
                >
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('about_cta_github', 'about')}
                  >
                    <Github className="h-4 w-4" />
                    View Source
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  asChild
                >
                  <a
                    href={SUPPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('about_cta_support', 'about')}
                  >
                    <Heart className="h-4 w-4" />
                    Support the Project
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-brand-100">
                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick(`about_footer_${link.label.toLowerCase()}`, 'about')}
                    className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Quick Links */}
      <Container className="mt-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-3 text-sm"
        >
          <Users className="h-4 w-4 text-surface-400" />
          <Link to="/contact" className="text-brand-600 underline-offset-4 hover:underline">Contact</Link>
          <span className="text-surface-300">|</span>
          <Link to="/docs" className="text-brand-600 underline-offset-4 hover:underline">Documentation</Link>
          <span className="text-surface-300">|</span>
          <Link to="/features" className="text-brand-600 underline-offset-4 hover:underline">Features</Link>
          <span className="text-surface-300">|</span>
          <Link to="/changelog" className="text-brand-600 underline-offset-4 hover:underline">Changelog</Link>
        </motion.div>
      </Container>
    </div>
  );
}
