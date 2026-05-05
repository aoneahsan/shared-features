import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rss, ArrowUpRight, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackPageView } from '@/lib/analytics';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface FeedItem {
  title: string;
  date: string;
  category: 'release' | 'feature' | 'announcement';
  link: string;
  description: string;
}

const FEED_ITEMS: FeedItem[] = [
  {
    title: 'v0.1.14 — Sitemap, feed, and centralized logger',
    date: '2026-05-05',
    category: 'release',
    link: '/changelog',
    description:
      'sitemap.xml now ships lastmod on every URL, a public RSS feed at /feed.xml, and a configurable logger for consuming apps to silence package-level logs.',
  },
  {
    title: 'v0.1.13 — Profile data modules and feature flag wiring',
    date: '2026-04-30',
    category: 'release',
    link: '/changelog',
    description:
      'Eleven common profile-data modules (contact info, developer info, address, social links, payment options, services, skills, testimonials, projects) plus per-feature flag toggles consumable via useCommonFeatures.',
  },
  {
    title: 'Cross-promotion advertising module',
    date: '2026-04-22',
    category: 'feature',
    link: '/features/advertising',
    description:
      'Run cross-promotion campaigns across Zaions products with placement targeting, impression caps, and exclude-existing-user rules.',
  },
  {
    title: 'Broadcasts: in-app announcements with read tracking',
    date: '2026-04-14',
    category: 'feature',
    link: '/features/broadcasts',
    description:
      'Push announcements to specific projects with per-user impression, click, and dismiss tracking out of the box.',
  },
  {
    title: 'Feature flags with deprecation warnings',
    date: '2026-04-07',
    category: 'feature',
    link: '/features/feature-flags',
    description:
      'Real-time feature flag evaluation backed by Firestore, with built-in deprecation warnings when consumers reference removed flags.',
  },
];

const categoryBadge: Record<FeedItem['category'], 'default' | 'success' | 'info'> = {
  release: 'success',
  feature: 'info',
  announcement: 'default',
};

export default function FeedPage() {
  useEffect(() => {
    trackPageView('/feed', 'Feed');
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="info" size="md" className="mb-4">
            Updates
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            What&apos;s new in shared-features
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            Releases, new modules, and product updates. Subscribe via RSS to stay current without
            checking back manually.
          </p>

          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Rss className="h-4 w-4" aria-hidden />
            Subscribe to RSS feed
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </motion.div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {FEED_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
            >
              <Card className="hover:border-brand-400 transition">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={categoryBadge[item.category]} size="sm">
                      {item.category}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-surface-500">
                      <Calendar className="h-3 w-3" aria-hidden />
                      <time dateTime={item.date}>{item.date}</time>
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-surface-900">
                    <a
                      href={item.link}
                      className="hover:text-brand-700"
                    >
                      {item.title}
                    </a>
                  </h2>
                  <p className="mt-2 text-surface-600">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
