import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  KeyRound,
  ShieldCheck,
  Bug,
  Award,
  Server,
  Eye,
  FileCode2,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME, DEVELOPER } from '@/config/constants';
import { trackPageView, trackClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const securityMeasures = [
  {
    icon: Lock,
    title: 'HTTPS Everywhere',
    description: 'All communication between your browser and our services is encrypted using TLS 1.2+ with strong cipher suites. We enforce HTTPS on all endpoints with HSTS headers.',
    color: 'text-green-500 bg-green-50',
  },
  {
    icon: KeyRound,
    title: 'OAuth 2.0 Authentication',
    description: 'We use Google OAuth 2.0 for authentication. We never store or handle passwords. All authentication flows use industry-standard protocols with PKCE where applicable.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Firebase Security Rules',
    description: 'All Firestore collections are protected by strict security rules. Read and write access is role-based, with admin operations requiring verified admin status.',
    color: 'text-brand-500 bg-brand-50',
  },
  {
    icon: Server,
    title: 'Data Encryption',
    description: 'All data stored in Firebase Firestore is encrypted at rest using AES-256 and in transit using TLS. Backup data is also encrypted.',
    color: 'text-accent-500 bg-accent-50',
  },
  {
    icon: Eye,
    title: 'Minimal Data Collection',
    description: 'We follow the principle of data minimization. We only collect the minimum information necessary to provide the service. No tracking pixels, no fingerprinting, no ad trackers.',
    color: 'text-amber-500 bg-amber-50',
  },
  {
    icon: FileCode2,
    title: 'Open Source Package',
    description: 'The npm package source code is available for review. You can inspect exactly what the package does before integrating it into your projects.',
    color: 'text-surface-700 bg-surface-100',
  },
];

const responseTimeline = [
  { severity: 'Critical', response: 'Within 24 hours', resolution: 'Within 48 hours', color: 'danger' as const },
  { severity: 'High', response: 'Within 48 hours', resolution: 'Within 7 days', color: 'warning' as const },
  { severity: 'Medium', response: 'Within 7 days', resolution: 'Within 30 days', color: 'info' as const },
  { severity: 'Low', response: 'Within 14 days', resolution: 'Next release cycle', color: 'default' as const },
];

export default function SecurityPage() {
  useEffect(() => {
    trackPageView('/security', 'Security');
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
          <Badge variant="success" size="md" className="mb-4">
            Security
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            Security Practices
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            Security is a core principle of {APP_NAME}. We use industry-standard practices to
            protect your data and provide a secure experience for all users.
          </p>
        </motion.div>
      </Container>

      {/* Security Measures */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              How We Protect Your Data
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {securityMeasures.map((measure) => (
              <motion.div key={measure.title} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="flex flex-col gap-4 pt-6">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', measure.color)}>
                      <measure.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-surface-900">{measure.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-surface-500">{measure.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* Vulnerability Reporting */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="border-red-200 bg-red-50/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Bug className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Report a Vulnerability</CardTitle>
                  <CardDescription>
                    Found a security issue? We take all reports seriously and respond promptly.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-surface-600">
                  If you discover a security vulnerability in {APP_NAME} (the npm package, website,
                  or admin panel), please report it responsibly by emailing us directly. Do not
                  disclose the vulnerability publicly until we have had a chance to address it.
                </p>
                <div className="rounded-lg border border-red-200 bg-white p-4">
                  <h4 className="font-display text-sm font-semibold text-surface-900">What to include in your report:</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-surface-600">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                      Description of the vulnerability and its potential impact
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                      Steps to reproduce the issue
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                      Affected component (npm package, website, admin, API)
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                      Your suggested severity level (Critical, High, Medium, Low)
                    </li>
                  </ul>
                </div>
                <Button variant="primary" asChild>
                  <a
                    href={`mailto:${DEVELOPER.email}?subject=Security%20Vulnerability%20Report%20-%20${APP_NAME}`}
                    onClick={() => trackClick('security_report_email', 'security')}
                  >
                    <Mail className="h-4 w-4" />
                    Report via Email: {DEVELOPER.email}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Response Timeline */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge size="md" className="mb-4">Response Timeline</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              How Quickly We Respond
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="mx-auto mt-10 max-w-3xl">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-200 text-left">
                        <th className="pb-3 pr-4 font-semibold text-surface-900">Severity</th>
                        <th className="pb-3 pr-4 font-semibold text-surface-900">Initial Response</th>
                        <th className="pb-3 font-semibold text-surface-900">Target Resolution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {responseTimeline.map((item) => (
                        <tr key={item.severity}>
                          <td className="py-3 pr-4">
                            <Badge variant={item.color} size="sm">{item.severity}</Badge>
                          </td>
                          <td className="py-3 pr-4 text-surface-600">{item.response}</td>
                          <td className="py-3 text-surface-600">{item.resolution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>

      {/* Bug Bounty */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-surface-900">Bug Bounty Program</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">
                  We appreciate the security research community. While we do not currently offer
                  monetary bounties, we will publicly acknowledge your contribution in our changelog
                  and security hall of fame (with your permission). Responsible disclosure is expected
                  and appreciated.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="success" size="sm">Public Credit</Badge>
                  <Badge variant="info" size="sm">Changelog Mention</Badge>
                  <Badge variant="outline" size="sm">Hall of Fame</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Encryption & Data Protection Summary */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="bg-gradient-to-br from-brand-500 to-accent-600 text-white">
            <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
              <Shield className="h-12 w-12 opacity-80" />
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">Your Data is Protected</h2>
                <p className="mx-auto mt-3 max-w-xl text-brand-100">
                  AES-256 encryption at rest, TLS 1.2+ in transit, OAuth 2.0 authentication, strict
                  Firestore security rules, and minimal data collection. We take every step to ensure
                  your data remains secure.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge className="border-white/30 bg-white/10 text-white" size="md">AES-256</Badge>
                <Badge className="border-white/30 bg-white/10 text-white" size="md">TLS 1.2+</Badge>
                <Badge className="border-white/30 bg-white/10 text-white" size="md">OAuth 2.0</Badge>
                <Badge className="border-white/30 bg-white/10 text-white" size="md">Firebase Rules</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Contact */}
      <Container className="mt-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center"
        >
          <p className="text-sm text-surface-600">
            For security concerns, contact{' '}
            <a
              href={`mailto:${DEVELOPER.email}`}
              className="font-medium text-brand-600 underline-offset-4 hover:underline"
            >
              {DEVELOPER.email}
            </a>
            {' '}or call{' '}
            <a
              href={`tel:${DEVELOPER.phone}`}
              className="font-medium text-brand-600 underline-offset-4 hover:underline"
            >
              {DEVELOPER.phone}
            </a>
          </p>
        </motion.div>
      </Container>

      {/* Related Links */}
      <Container className="mt-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-3 text-sm"
        >
          <Shield className="h-4 w-4 text-surface-400" />
          <Link to="/privacy" className="text-brand-600 underline-offset-4 hover:underline">Privacy Policy</Link>
          <span className="text-surface-300">|</span>
          <Link to="/terms" className="text-brand-600 underline-offset-4 hover:underline">Terms of Service</Link>
          <span className="text-surface-300">|</span>
          <Link to="/data-deletion" className="text-brand-600 underline-offset-4 hover:underline">Data Deletion</Link>
          <span className="text-surface-300">|</span>
          <Link to="/cookies" className="text-brand-600 underline-offset-4 hover:underline">Cookie Policy</Link>
        </motion.div>
      </Container>
    </div>
  );
}
