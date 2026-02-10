import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  Package,
  Globe,
  UserCheck,
  ShieldAlert,
  Ban,
  Scale,
  Scissors,
  Landmark,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME, DEVELOPER, GITHUB_URL } from '@/config/constants';
import { trackPageView } from '@/lib/analytics';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface TermsSection {
  icon: typeof FileText;
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    icon: CheckCircle2,
    title: 'Acceptance of Terms',
    content: [
      `By accessing or using ${APP_NAME}, its website, admin panel, or npm package, you agree to be bound by these Terms of Service.`,
      'If you do not agree with any part of these terms, you must not use our services.',
      'These terms apply to all users, including visitors, registered users, and administrators.',
    ],
  },
  {
    icon: Package,
    title: 'Package Usage',
    content: [
      `The ${APP_NAME} npm package is distributed under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software.`,
      'The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement.',
      'In no event shall the authors be liable for any claim, damages, or other liability arising from the use of the software.',
      `The full license text is available in the package repository at ${GITHUB_URL}.`,
    ],
  },
  {
    icon: Globe,
    title: 'Website Usage',
    content: [
      'The website provides documentation, demos, examples, and an admin panel for managing shared features.',
      'You may browse the public portions of the website without creating an account.',
      'You agree not to interfere with the website\'s functionality, attempt unauthorized access to any systems, or use automated tools to scrape or abuse the service.',
      'We reserve the right to restrict or terminate access to the website at our discretion.',
    ],
  },
  {
    icon: UserCheck,
    title: 'User Accounts',
    content: [
      'Account creation requires Google authentication. By creating an account, you agree to provide accurate information.',
      'You are responsible for maintaining the security of your account and for all activities that occur under your account.',
      'You must notify us immediately of any unauthorized use of your account.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    icon: ShieldAlert,
    title: 'Admin Access',
    content: [
      'Admin features allow management of campaigns, broadcasts, feature flags, and other shared data.',
      'Admin access is granted at the sole discretion of the project maintainer.',
      'Admins are responsible for the content they create and manage through the admin panel.',
      'Misuse of admin privileges, including creating harmful content or abusing the platform, will result in immediate access revocation.',
    ],
  },
  {
    icon: Ban,
    title: 'Prohibited Activities',
    content: [
      'You may not use the service for any unlawful purpose or in violation of any applicable laws or regulations.',
      'You may not attempt to reverse-engineer, decompile, or disassemble the admin panel or backend services (the npm package source is open).',
      'You may not distribute malware, spam, or harmful content through the platform.',
      'You may not attempt to gain unauthorized access to other users\' accounts or data.',
      'You may not use the platform to collect personal data about other users without their consent.',
      'You may not overload, disable, or impair the service through excessive automated requests.',
    ],
  },
  {
    icon: Scale,
    title: 'Intellectual Property',
    content: [
      `The ${APP_NAME} npm package is open source under the MIT License.`,
      `The ${APP_NAME} brand, website design, documentation content, and admin panel interface are the intellectual property of ${DEVELOPER.name}.`,
      'User-generated content (campaigns, broadcasts, etc.) remains the property of the respective account holder.',
      'You grant us a non-exclusive license to store and display content you create through the admin panel for the purpose of providing the service.',
    ],
  },
  {
    icon: Scissors,
    title: 'Limitation of Liability',
    content: [
      `${APP_NAME} is provided on an "as is" and "as available" basis without warranties of any kind.`,
      'We do not guarantee uninterrupted or error-free operation of the service.',
      'In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages.',
      'Our total liability for any claims arising from the use of the service shall not exceed the amount you have paid us in the twelve months preceding the claim, if any.',
    ],
  },
  {
    icon: Scissors,
    title: 'Termination',
    content: [
      'You may terminate your account at any time by contacting us or using the data deletion process.',
      'We may terminate or suspend your access immediately, without prior notice, for any breach of these terms.',
      'Upon termination, your right to use the service ceases immediately. Data deletion will follow our data retention policy.',
      'Sections regarding limitation of liability, intellectual property, and governing law survive termination.',
    ],
  },
  {
    icon: Landmark,
    title: 'Governing Law',
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of Pakistan.',
      'Any disputes arising from these terms or the use of the service shall be resolved through good-faith negotiation.',
      'If negotiation fails, disputes shall be submitted to the competent courts of Pakistan.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Changes to Terms',
    content: [
      'We reserve the right to modify these Terms of Service at any time.',
      'We will notify registered users of significant changes via email or through a notice on the website.',
      'Your continued use of the service after changes constitutes acceptance of the updated terms.',
      'The "Last Updated" date at the top of this page indicates when these terms were most recently revised.',
    ],
  },
  {
    icon: Mail,
    title: 'Contact',
    content: [
      `For questions about these Terms of Service, please contact ${DEVELOPER.name} at ${DEVELOPER.email}.`,
      `You can also reach us by phone at ${DEVELOPER.phone} or through LinkedIn at ${DEVELOPER.linkedin}.`,
    ],
  },
];

export default function TermsPage() {
  useEffect(() => {
    trackPageView('/terms', 'Terms of Service');
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
            Legal
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            Please read these terms carefully before using {APP_NAME}. By accessing or using our
            services, you agree to be bound by these terms.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-surface-500">
            <FileText className="h-4 w-4" />
            <span>Last updated: February 2026</span>
          </div>
        </motion.div>
      </Container>

      {/* Terms Sections */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl space-y-6"
        >
          {termsSections.map((section, index) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">
                      {index + 1}. {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-sm leading-relaxed text-surface-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
          <FileText className="h-4 w-4 text-surface-400" />
          <Link to="/privacy" className="text-brand-600 underline-offset-4 hover:underline">Privacy Policy</Link>
          <span className="text-surface-300">|</span>
          <Link to="/cookies" className="text-brand-600 underline-offset-4 hover:underline">Cookie Policy</Link>
          <span className="text-surface-300">|</span>
          <Link to="/data-deletion" className="text-brand-600 underline-offset-4 hover:underline">Data Deletion</Link>
          <span className="text-surface-300">|</span>
          <Link to="/security" className="text-brand-600 underline-offset-4 hover:underline">Security</Link>
        </motion.div>
      </Container>
    </div>
  );
}
