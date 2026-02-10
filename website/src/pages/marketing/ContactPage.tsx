import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Package,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Heart,
  Bug,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME, DEVELOPER, GITHUB_URL, NPM_URL, SUPPORT_URL } from '@/config/constants';
import { trackPageView, trackClick } from '@/lib/analytics';
import { cn, copyToClipboard } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface ContactCardData {
  id: string;
  icon: typeof Mail;
  label: string;
  value: string;
  displayValue: string;
  action: 'copy' | 'link';
  href: string;
  color: string;
}

const contactCards: ContactCardData[] = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: DEVELOPER.email,
    displayValue: DEVELOPER.email,
    action: 'copy',
    href: `mailto:${DEVELOPER.email}`,
    color: 'text-red-500 bg-red-50',
  },
  {
    id: 'phone',
    icon: Phone,
    label: 'Phone / WhatsApp',
    value: DEVELOPER.phone,
    displayValue: DEVELOPER.phone,
    action: 'copy',
    href: `tel:${DEVELOPER.phone}`,
    color: 'text-green-500 bg-green-50',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/aoneahsan',
    displayValue: 'linkedin.com/in/aoneahsan',
    action: 'link',
    href: DEVELOPER.linkedin,
    color: 'text-blue-500 bg-blue-50',
  },
  {
    id: 'github-issues',
    icon: Bug,
    label: 'GitHub Issues',
    value: 'github.com/aoneahsan/shared-features/issues',
    displayValue: 'Report an Issue',
    action: 'link',
    href: `${GITHUB_URL}/issues`,
    color: 'text-surface-700 bg-surface-100',
  },
  {
    id: 'npm',
    icon: Package,
    label: 'NPM Package',
    value: 'npmjs.com/package/shared-features',
    displayValue: 'npmjs.com/package/shared-features',
    action: 'link',
    href: NPM_URL,
    color: 'text-red-600 bg-red-50',
  },
  {
    id: 'portfolio',
    icon: Globe,
    label: 'Portfolio',
    value: 'aoneahsan.com',
    displayValue: 'aoneahsan.com',
    action: 'link',
    href: DEVELOPER.portfolio,
    color: 'text-accent-500 bg-accent-50',
  },
];

function ContactCard({ card }: { card: ContactCardData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(card.value);
    if (success) {
      setCopied(true);
      trackClick(`contact_copy_${card.id}`, 'contact');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVisit = () => {
    trackClick(`contact_visit_${card.id}`, 'contact');
  };

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-4 pt-6">
        <div className="flex items-start justify-between">
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', card.color)}>
            <card.icon className="h-5 w-5" />
          </div>
          <Badge variant="outline" size="sm">{card.label}</Badge>
        </div>

        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-surface-900">{card.label}</p>
          <p className="mt-1 truncate text-sm text-surface-500">{card.displayValue}</p>
        </div>

        <div className="flex gap-2">
          {card.action === 'copy' ? (
            <>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={card.href}>
                  <card.icon className="h-3.5 w-3.5" />
                  Open
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={cn(copied && 'text-green-600')}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleVisit}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visit
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContactPage() {
  useEffect(() => {
    trackPageView('/contact', 'Contact');
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
            Contact
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            Get in{' '}
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            Have a question about {APP_NAME}? Need help with integration? Want to report a bug or
            request a feature? Reach out through any of the channels below.
          </p>
        </motion.div>
      </Container>

      {/* Contact Cards Grid */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {contactCards.map((card) => (
            <motion.div key={card.id} variants={fadeInUp}>
              <ContactCard card={card} />
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* Quick Channels */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
              Preferred Communication Channels
            </h2>
            <p className="mt-3 text-surface-600">
              Choose the channel that works best for your needs.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <motion.div variants={fadeInUp}>
              <Card className="h-full text-center">
                <CardContent className="flex flex-col items-center gap-3 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Bug className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-surface-900">Bug Reports</h3>
                  <p className="text-sm text-surface-500">
                    Found a bug? Open an issue on GitHub for the fastest response and tracking.
                  </p>
                  <Button variant="outline" size="sm" className="mt-auto" asChild>
                    <a
                      href={`${GITHUB_URL}/issues`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick('contact_channel_github', 'contact')}
                    >
                      <Github className="h-3.5 w-3.5" />
                      Open Issue
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full text-center">
                <CardContent className="flex flex-col items-center gap-3 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-500">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-surface-900">General Questions</h3>
                  <p className="text-sm text-surface-500">
                    Questions about integration, usage, or features? Send an email or WhatsApp message.
                  </p>
                  <Button variant="outline" size="sm" className="mt-auto" asChild>
                    <a
                      href={`mailto:${DEVELOPER.email}`}
                      onClick={() => trackClick('contact_channel_email', 'contact')}
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Send Email
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full text-center">
                <CardContent className="flex flex-col items-center gap-3 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                    <Linkedin className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-surface-900">Professional</h3>
                  <p className="text-sm text-surface-500">
                    For professional inquiries, partnerships, or collaboration opportunities.
                  </p>
                  <Button variant="outline" size="sm" className="mt-auto" asChild>
                    <a
                      href={DEVELOPER.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick('contact_channel_linkedin', 'contact')}
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      Connect
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {/* Support Section */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="bg-gradient-to-br from-brand-500 to-accent-600 text-white">
            <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
              <Heart className="h-12 w-12 opacity-80" />
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">
                  Support {APP_NAME}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-brand-100">
                  {APP_NAME} is free and open source. If it has helped your projects, consider
                  supporting its continued development.
                </p>
              </div>
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
                  onClick={() => trackClick('contact_support_link', 'contact')}
                >
                  <Heart className="h-4 w-4" />
                  Support the Project
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
