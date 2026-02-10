import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trash2,
  Mail,
  Clock,
  Database,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertTriangle,
  ListChecks,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME, DEVELOPER } from '@/config/constants';
import { trackPageView, trackClick } from '@/lib/analytics';
import { copyToClipboard } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const dataWeStore = [
  { label: 'Google profile name', deletable: true },
  { label: 'Google email address', deletable: true },
  { label: 'Google profile picture URL', deletable: true },
  { label: 'Account creation timestamp', deletable: true },
  { label: 'Last login timestamp', deletable: true },
  { label: 'Admin role assignment', deletable: true },
  { label: 'Theme and UI preferences', deletable: true },
  { label: 'Campaign and broadcast content (admin-created)', deletable: true },
];

const dataRetained = [
  'Anonymized, aggregate analytics data (page views, feature usage counts) that cannot be linked back to your account.',
  'Server access logs required for security purposes, retained for a maximum of 90 days.',
];

const deletionSteps = [
  {
    step: 1,
    title: 'Send a deletion request',
    description: `Email ${DEVELOPER.email} with the subject line "Data Deletion Request" and include the Google email address associated with your account.`,
  },
  {
    step: 2,
    title: 'Identity verification',
    description: 'We will verify your identity by sending a confirmation email to the address on file. Reply to confirm your request.',
  },
  {
    step: 3,
    title: 'Data removal',
    description: 'Upon verification, we will permanently delete your personal data from our Firebase systems within 30 calendar days.',
  },
  {
    step: 4,
    title: 'Confirmation',
    description: 'You will receive a final email confirming that your data has been deleted and your account has been closed.',
  },
];

export default function DataDeletionPage() {
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    trackPageView('/data-deletion', 'Data Deletion');
  }, []);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(DEVELOPER.email);
    if (success) {
      setEmailCopied(true);
      trackClick('data_deletion_copy_email', 'data-deletion');
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

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
            Data Rights
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            Data Deletion
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            You have the right to request deletion of your personal data at any time.
            This page explains what data we store, how to request deletion, and our timeline.
          </p>
        </motion.div>
      </Container>

      {/* How to Request */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="border-brand-200 bg-brand-50/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Request Data Deletion</CardTitle>
                  <CardDescription>
                    Send an email to the address below to begin the deletion process.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-lg border border-brand-200 bg-white px-4 py-3">
                  <p className="text-sm text-surface-500">Email address</p>
                  <p className="font-mono text-lg font-semibold text-surface-900">{DEVELOPER.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" asChild>
                    <a
                      href={`mailto:${DEVELOPER.email}?subject=Data%20Deletion%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20deletion%20of%20my%20account%20data.%0A%0AMy%20Google%20account%20email%3A%20%5Byour%20email%20here%5D%0A%0AThank%20you.`}
                      onClick={() => trackClick('data_deletion_send_email', 'data-deletion')}
                    >
                      <Mail className="h-4 w-4" />
                      Send Request
                    </a>
                  </Button>
                  <Button variant="outline" onClick={handleCopyEmail}>
                    {emailCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {emailCopied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Deletion Process */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge size="md" className="mb-4">Process</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              Deletion Process
            </h2>
          </motion.div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {deletionSteps.map((step, idx) => (
              <motion.div key={step.step} variants={fadeInUp}>
                <Card>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-surface-900">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-surface-600">{step.description}</p>
                    </div>
                    {idx < deletionSteps.length - 1 && (
                      <ArrowRight className="hidden h-5 w-5 shrink-0 text-surface-300 sm:block" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* Timeline */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="border-amber-200 bg-amber-50/30">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-surface-900">Timeline</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">
                  We process all data deletion requests within <strong>30 calendar days</strong> of
                  identity verification. In most cases, data is deleted within 7 business days.
                  You will receive an email confirmation once the process is complete.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* What Data We Store */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge variant="info" size="md" className="mb-4">Data Inventory</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              What Data We Store
            </h2>
          </motion.div>

          <div className="mx-auto mt-10 max-w-3xl">
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-brand-600" />
                    <CardTitle>Personal Data (Deleted on Request)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dataWeStore.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-lg border border-surface-100 px-4 py-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        <span className="flex-1 text-sm text-surface-700">{item.label}</span>
                        <Badge variant="success" size="sm">Will be deleted</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                    <CardTitle>Retained Data</CardTitle>
                  </div>
                  <CardDescription>
                    The following anonymized data may be retained even after account deletion.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dataRetained.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-lg border border-surface-100 px-4 py-2.5">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span className="flex-1 text-sm text-surface-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {/* Contact */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <ListChecks className="h-8 w-8 text-brand-500" />
              <h3 className="font-display text-lg font-semibold text-surface-900">
                Questions About Data Deletion?
              </h3>
              <p className="max-w-lg text-sm text-surface-600">
                If you have questions about the deletion process, what data is affected, or need
                assistance, contact {DEVELOPER.name} at{' '}
                <a href={`mailto:${DEVELOPER.email}`} className="text-brand-600 underline-offset-4 hover:underline">
                  {DEVELOPER.email}
                </a>{' '}
                or call{' '}
                <a href={`tel:${DEVELOPER.phone}`} className="text-brand-600 underline-offset-4 hover:underline">
                  {DEVELOPER.phone}
                </a>.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Related Links */}
      <Container className="mt-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-3 text-sm"
        >
          <Trash2 className="h-4 w-4 text-surface-400" />
          <Link to="/privacy" className="text-brand-600 underline-offset-4 hover:underline">Privacy Policy</Link>
          <span className="text-surface-300">|</span>
          <Link to="/terms" className="text-brand-600 underline-offset-4 hover:underline">Terms of Service</Link>
          <span className="text-surface-300">|</span>
          <Link to="/security" className="text-brand-600 underline-offset-4 hover:underline">Security</Link>
          <span className="text-surface-300">|</span>
          <Link to="/contact" className="text-brand-600 underline-offset-4 hover:underline">Contact</Link>
        </motion.div>
      </Container>
    </div>
  );
}
