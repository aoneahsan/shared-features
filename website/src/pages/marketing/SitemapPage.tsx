import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import {
  Search,
  Home,
  Layers,
  Megaphone,
  Bell,
  Flag,
  Puzzle,
  BookOpen,
  Code2,
  FileCode2,
  Play,
  CreditCard,
  History,
  Info,
  Mail,
  Shield,
  FileText,
  Cookie,
  Trash2,
  Lock,
  LogIn,
  LayoutDashboard,
  BarChart3,
  Users,
  Globe,
  Phone,
  MapPin,
  Wallet,
  Briefcase,
  Star,
  MessageSquare,
  FolderKanban,
  Eye,
  Map,
  Package,
  Github,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME } from '@/config/constants';
import { trackPageView, trackClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

type SitemapCategory = 'Marketing' | 'Documentation' | 'Admin' | 'Legal' | 'Auth';

interface SitemapEntry {
  title: string;
  description: string;
  href: string;
  icon: typeof Home;
  category: SitemapCategory;
  tags: string[];
}

const sitemapEntries: SitemapEntry[] = [
  // Marketing
  { title: 'Home', description: 'Landing page with overview, features, and getting started guide.', href: '/', icon: Home, category: 'Marketing', tags: ['landing', 'overview', 'introduction'] },
  { title: 'Features', description: 'Complete list of all features provided by the package.', href: '/features', icon: Layers, category: 'Marketing', tags: ['features', 'capabilities', 'overview'] },
  { title: 'Advertising', description: 'Detailed look at advertising campaign management features.', href: '/features/advertising', icon: Megaphone, category: 'Marketing', tags: ['ads', 'campaigns', 'advertising', 'marketing'] },
  { title: 'Broadcasts', description: 'Notification and broadcast messaging system details.', href: '/features/broadcasts', icon: Bell, category: 'Marketing', tags: ['notifications', 'broadcasts', 'messaging', 'announcements'] },
  { title: 'Feature Flags', description: 'Feature flag system for controlling features across projects.', href: '/features/feature-flags', icon: Flag, category: 'Marketing', tags: ['flags', 'toggles', 'remote config', 'control'] },
  { title: 'Common Features', description: 'Shared common features: contact, developer info, social links, and more.', href: '/features/common', icon: Puzzle, category: 'Marketing', tags: ['contact', 'developer', 'social', 'shared'] },
  { title: 'Documentation', description: 'Getting started guide, installation, and configuration.', href: '/docs', icon: BookOpen, category: 'Marketing', tags: ['docs', 'guide', 'setup', 'installation'] },
  { title: 'API Reference', description: 'Complete API reference for all hooks, services, and components.', href: '/docs/api', icon: Code2, category: 'Documentation', tags: ['api', 'reference', 'hooks', 'services'] },
  { title: 'Examples', description: 'Code examples and integration patterns for common use cases.', href: '/docs/examples', icon: FileCode2, category: 'Documentation', tags: ['examples', 'code', 'patterns', 'snippets'] },
  { title: 'Demos', description: 'Interactive demos showcasing package components and features.', href: '/demos', icon: Play, category: 'Marketing', tags: ['demos', 'interactive', 'live', 'preview'] },
  { title: 'Pricing', description: 'Pricing information and plan comparison.', href: '/pricing', icon: CreditCard, category: 'Marketing', tags: ['pricing', 'plans', 'free', 'cost'] },
  { title: 'Changelog', description: 'Version history and release notes for all updates.', href: '/changelog', icon: History, category: 'Marketing', tags: ['changelog', 'releases', 'versions', 'updates'] },
  { title: 'About', description: 'About the project, developer, mission, and tech stack.', href: '/about', icon: Info, category: 'Marketing', tags: ['about', 'developer', 'mission', 'story'] },
  { title: 'Contact', description: 'Get in touch via email, phone, LinkedIn, or GitHub.', href: '/contact', icon: Mail, category: 'Marketing', tags: ['contact', 'email', 'phone', 'support'] },
  { title: 'Code Access', description: 'How to access the source code repository on GitHub.', href: '/code-access', icon: Github, category: 'Marketing', tags: ['github', 'source', 'repository', 'open source'] },

  // Admin
  { title: 'Admin Overview', description: 'Admin dashboard with system status and quick actions.', href: '/admin', icon: LayoutDashboard, category: 'Admin', tags: ['admin', 'dashboard', 'overview', 'management'] },
  { title: 'Feature Flags Admin', description: 'Manage feature flags and version requirements.', href: '/admin/feature-flags', icon: Flag, category: 'Admin', tags: ['feature flags', 'toggles', 'admin'] },
  { title: 'Campaigns Admin', description: 'Create and manage advertising campaigns.', href: '/admin/campaigns', icon: Megaphone, category: 'Admin', tags: ['campaigns', 'ads', 'advertising', 'admin'] },
  { title: 'Products Admin', description: 'Manage product catalog for campaigns.', href: '/admin/products', icon: Package, category: 'Admin', tags: ['products', 'catalog', 'admin'] },
  { title: 'Broadcasts Admin', description: 'Create and manage broadcast notifications.', href: '/admin/broadcasts', icon: Bell, category: 'Admin', tags: ['broadcasts', 'notifications', 'admin'] },
  { title: 'Contact Info Admin', description: 'Manage public contact information.', href: '/admin/contact', icon: Phone, category: 'Admin', tags: ['contact', 'phone', 'email', 'admin'] },
  { title: 'Developer Info Admin', description: 'Manage developer profile information.', href: '/admin/developer', icon: Users, category: 'Admin', tags: ['developer', 'profile', 'admin'] },
  { title: 'Social Links Admin', description: 'Manage social media profile links.', href: '/admin/social-links', icon: Globe, category: 'Admin', tags: ['social', 'links', 'media', 'admin'] },
  { title: 'Address Info Admin', description: 'Manage physical address information.', href: '/admin/address', icon: MapPin, category: 'Admin', tags: ['address', 'location', 'admin'] },
  { title: 'Payment Options Admin', description: 'Manage payment and donation options.', href: '/admin/payment-options', icon: Wallet, category: 'Admin', tags: ['payment', 'donation', 'support', 'admin'] },
  { title: 'Services Admin', description: 'Manage professional services listing.', href: '/admin/services', icon: Briefcase, category: 'Admin', tags: ['services', 'professional', 'admin'] },
  { title: 'Skills Admin', description: 'Manage skills and expertise listing.', href: '/admin/skills', icon: Star, category: 'Admin', tags: ['skills', 'expertise', 'admin'] },
  { title: 'Testimonials Admin', description: 'Manage client testimonials and reviews.', href: '/admin/testimonials', icon: MessageSquare, category: 'Admin', tags: ['testimonials', 'reviews', 'admin'] },
  { title: 'Projects Admin', description: 'Manage project portfolio listing.', href: '/admin/projects', icon: FolderKanban, category: 'Admin', tags: ['projects', 'portfolio', 'admin'] },
  { title: 'Analytics Admin', description: 'View usage analytics and reports.', href: '/admin/analytics', icon: BarChart3, category: 'Admin', tags: ['analytics', 'reports', 'metrics', 'admin'] },
  { title: 'Impressions Admin', description: 'View ad impression data and performance metrics.', href: '/admin/impressions', icon: Eye, category: 'Admin', tags: ['impressions', 'ads', 'performance', 'admin'] },

  // Legal
  { title: 'Privacy Policy', description: 'How we collect, use, and protect your information.', href: '/privacy', icon: Shield, category: 'Legal', tags: ['privacy', 'data', 'gdpr', 'ccpa'] },
  { title: 'Terms of Service', description: 'Terms and conditions for using the service.', href: '/terms', icon: FileText, category: 'Legal', tags: ['terms', 'conditions', 'legal', 'agreement'] },
  { title: 'Cookie Policy', description: 'Information about cookies and tracking technologies.', href: '/cookies', icon: Cookie, category: 'Legal', tags: ['cookies', 'tracking', 'analytics'] },
  { title: 'Data Deletion', description: 'How to request deletion of your personal data.', href: '/data-deletion', icon: Trash2, category: 'Legal', tags: ['deletion', 'data', 'gdpr', 'rights'] },
  { title: 'Security', description: 'Security practices, vulnerability reporting, and bug bounty.', href: '/security', icon: Lock, category: 'Legal', tags: ['security', 'vulnerability', 'encryption', 'protection'] },

  // Auth
  { title: 'Login', description: 'Sign in with your Google account to access admin features.', href: '/login', icon: LogIn, category: 'Auth', tags: ['login', 'sign in', 'google', 'auth'] },
];

const categories: SitemapCategory[] = ['Marketing', 'Documentation', 'Admin', 'Legal', 'Auth'];

const categoryColors: Record<SitemapCategory, string> = {
  Marketing: 'bg-brand-50 text-brand-700',
  Documentation: 'bg-blue-50 text-blue-700',
  Admin: 'bg-accent-50 text-accent-700',
  Legal: 'bg-amber-50 text-amber-700',
  Auth: 'bg-green-50 text-green-700',
};

const categoryBadgeVariants: Record<SitemapCategory, 'default' | 'success' | 'warning' | 'info' | 'outline'> = {
  Marketing: 'default',
  Documentation: 'info',
  Admin: 'outline',
  Legal: 'warning',
  Auth: 'success',
};

const fuse = new Fuse(sitemapEntries, {
  keys: ['title', 'description', 'tags', 'category'],
  threshold: 0.4,
  includeScore: true,
});

export default function SitemapPage() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    trackPageView('/sitemap', 'Sitemap');
  }, []);

  const filteredEntries = useMemo(() => {
    if (!query.trim()) return sitemapEntries;
    return fuse.search(query).map((result) => result.item);
  }, [query]);

  const groupedEntries = useMemo(() => {
    const groups: Record<SitemapCategory, SitemapEntry[]> = {
      Marketing: [],
      Documentation: [],
      Admin: [],
      Legal: [],
      Auth: [],
    };
    for (const entry of filteredEntries) {
      groups[entry.category].push(entry);
    }
    return groups;
  }, [filteredEntries]);

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
            Navigation
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            Sitemap
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            Find any page on the {APP_NAME} website. Use the search bar to filter by name,
            description, or tags.
          </p>
        </motion.div>

        {/* Machine-readable feeds */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2"
        >
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg border border-surface-200 bg-white p-4 hover:border-brand-400 hover:shadow-sm transition"
          >
            <Map className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
            <div>
              <div className="font-semibold text-surface-900">sitemap.xml</div>
              <div className="text-sm text-surface-600">XML sitemap for Google Search Console and other crawlers. Lists every public URL with last-modified dates.</div>
            </div>
          </a>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg border border-surface-200 bg-white p-4 hover:border-brand-400 hover:shadow-sm transition"
          >
            <History className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
            <div>
              <div className="font-semibold text-surface-900">feed.xml</div>
              <div className="text-sm text-surface-600">RSS 2.0 feed of releases, new modules, and product updates. Subscribe in any RSS reader to stay current.</div>
            </div>
          </a>
        </motion.div>
      </Container>

      {/* Search */}
      <Container className="mt-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mx-auto max-w-xl"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <Input
              placeholder="Search pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="mt-2 text-center text-xs text-surface-400">
            {filteredEntries.length} of {sitemapEntries.length} pages
          </p>
        </motion.div>
      </Container>

      {/* Categories */}
      <Container className="mt-12">
        {categories.map((category) => {
          const entries = groupedEntries[category];
          if (entries.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="mb-12"
            >
              <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
                <Badge
                  variant={categoryBadgeVariants[category]}
                  size="md"
                >
                  {category}
                </Badge>
                <span className="text-sm text-surface-400">
                  {entries.length} {entries.length === 1 ? 'page' : 'pages'}
                </span>
              </motion.div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((entry) => (
                  <motion.div key={entry.href} variants={fadeInUp}>
                    <Link
                      to={entry.href}
                      onClick={() => trackClick(`sitemap_${entry.title.toLowerCase().replace(/\s+/g, '_')}`, 'sitemap')}
                      className="block h-full"
                    >
                      <Card className="h-full transition-all hover:border-brand-300 hover:shadow-md">
                        <CardContent className="flex items-start gap-3 pt-5 pb-5">
                          <div className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            categoryColors[entry.category],
                          )}>
                            <entry.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-display text-sm font-semibold text-surface-900 truncate">
                                {entry.title}
                              </h3>
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-surface-500 line-clamp-2">
                              {entry.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {entry.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block rounded bg-surface-50 px-1.5 py-0.5 text-[10px] text-surface-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {filteredEntries.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="py-16 text-center"
          >
            <Map className="mx-auto h-12 w-12 text-surface-300" />
            <h3 className="mt-4 font-display text-lg font-semibold text-surface-900">No pages found</h3>
            <p className="mt-2 text-sm text-surface-500">
              Try a different search term or clear the search to see all pages.
            </p>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
