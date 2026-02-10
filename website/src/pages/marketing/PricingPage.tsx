import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Heart,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Package,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { trackPageView, trackClick } from '@/lib/analytics';
import { APP_NAME, NPM_URL, SUPPORT_URL, GITHUB_URL } from '@/config/constants';

/* -------------------------------------------------------------------------- */
/*  Pricing Features                                                          */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  'Feature Flags System',
  'Advertising System (5 components)',
  'Broadcast System (3 components)',
  'Contact Info hook & component',
  'Developer Info hook & component',
  'Social Links hook & component',
  'Address Info hook & component',
  'Payment Options hook',
  'Services hook & component',
  'Skills hook & component',
  'Testimonials hook & component',
  'Projects hook',
  '30+ React hooks',
  '20+ service functions',
  '16 pre-built components',
  'Full TypeScript support',
  'React 18 & 19 support',
  'ESM & CommonJS builds',
  'Built-in caching',
  'Real-time Firestore subscriptions',
  'Impression & click tracking',
  'Capacitor (mobile) support',
  'MIT open-source license',
  'Community support',
  'Regular updates & maintenance',
];

/* -------------------------------------------------------------------------- */
/*  FAQ Data                                                                  */
/* -------------------------------------------------------------------------- */

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Is it really free?',
    answer:
      'Yes, completely free and open source under the MIT license. There are no hidden costs, premium tiers, or usage limits. You get access to every feature, hook, service, and component at no cost. The package is funded by the developer and community support.',
  },
  {
    question: 'What are the dependencies?',
    answer:
      'The package requires React (v18 or v19), ReactDOM, and Firebase (v11+) as peer dependencies. These are the only external requirements. The package itself bundles everything else it needs, keeping your dependency tree clean.',
  },
  {
    question: 'Can I use it in commercial projects?',
    answer:
      'Absolutely. The MIT license allows you to use shared-features in any project, including commercial applications, SaaS products, and client work. There are no restrictions on commercial use, modification, or distribution.',
  },
  {
    question: 'How do I get support?',
    answer:
      'You can get help through our GitHub repository by opening issues or discussions. The community is active and responsive. For urgent needs, you can reach the developer directly via the contact page. If you find the project valuable, consider supporting its development.',
  },
];

/* -------------------------------------------------------------------------- */
/*  FAQ Accordion Item                                                        */
/* -------------------------------------------------------------------------- */

function FaqAccordion({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="overflow-hidden rounded-xl border border-surface-200 bg-white"
    >
      <button
        onClick={() => {
          setOpen((p) => !p);
          trackClick(`faq-${index}`, 'pricing');
        }}
        className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6"
      >
        <span className="pr-4 font-display text-base font-semibold text-surface-900">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-surface-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="border-t border-surface-100 px-5 pb-5 pt-3 sm:px-6">
            <p className="font-body text-sm leading-relaxed text-surface-600">
              {item.answer}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  useEffect(() => {
    trackPageView('/pricing', 'Pricing');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-white">
      {/* Hero */}
      <div className="border-b border-surface-200 bg-white">
        <Container className="py-14 text-center lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-brand-50 text-brand-700">
              <Sparkles className="mr-1 h-3 w-3" />
              Open Source
            </Badge>
            <h1 className="font-display text-4xl font-bold text-surface-900 lg:text-5xl">
              Free. Forever.
            </h1>
            <p className="mx-auto mt-4 max-w-lg font-body text-lg text-surface-600">
              {APP_NAME} is completely free and open source. No hidden fees, no
              premium tiers, no usage limits. Just install and build.
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto max-w-xl"
        >
          <div className="overflow-hidden rounded-2xl border-2 border-brand-200 bg-white shadow-lg shadow-brand-100/50">
            {/* Card header */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-8 py-8 text-center text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                <Package className="h-4 w-4" />
                Community Edition
              </div>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="font-display text-6xl font-bold">$0</span>
                <span className="text-lg opacity-80">/month</span>
              </div>
              <p className="mt-2 text-sm opacity-80">
                Everything included. No credit card required.
              </p>
            </div>

            {/* Features list */}
            <div className="px-8 py-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-surface-400">
                Everything you get
              </p>
              <ul className="space-y-3">
                {FEATURES.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.03, 0.6), duration: 0.3 }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    <span className="text-sm text-surface-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8 space-y-3">
                <Button variant="primary" size="lg" className="w-full" asChild>
                  <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
                    <Zap className="h-4 w-4" />
                    Install Now &mdash; It&apos;s Free
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/docs">
                    Read the Docs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-20 max-w-2xl"
        >
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-surface-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqAccordion key={faq.question} item={faq} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-20 max-w-2xl"
        >
          <div className="overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-accent-50 via-white to-brand-50">
            <div className="px-8 py-10 text-center sm:px-12">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-brand-500 shadow-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-surface-900">
                Love this project?
              </h3>
              <p className="mx-auto mt-2 max-w-md font-body text-sm leading-relaxed text-surface-600">
                {APP_NAME} is built and maintained by a solo developer. If this
                package has saved you time and effort, consider supporting its
                continued development and maintenance.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="secondary" asChild>
                  <a
                    href={SUPPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('support-pricing', 'pricing')}
                  >
                    <Heart className="h-4 w-4" />
                    Support the Developer
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('github-pricing', 'pricing')}
                  >
                    Star on GitHub
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
