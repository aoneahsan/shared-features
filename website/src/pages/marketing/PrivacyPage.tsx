import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  Database,
  Share2,
  Clock,
  UserCheck,
  Cookie,
  Server,
  Baby,
  FileText,
  Mail,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME, DEVELOPER } from '@/config/constants';
import { trackPageView } from '@/lib/analytics';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface PolicySection {
  icon: typeof Shield;
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      'We collect minimal information necessary to provide our services. When you sign in with Google, we receive your name, email address, and profile picture from your Google account.',
      'We automatically collect anonymous usage analytics such as pages visited, features used, and general interaction patterns. This data helps us understand how developers use the package and website.',
      'We do not collect financial information, precise location data, or any data from your end users through the shared-features package.',
    ],
  },
  {
    icon: Database,
    title: 'How We Use Information',
    content: [
      'Authentication: Your Google account information is used solely to identify you and provide access to admin features.',
      'Analytics: Anonymous usage data helps us improve the package, identify popular features, and fix issues.',
      'Communication: Your email may be used to respond to support requests you initiate or to notify you of critical security updates.',
      'We never use your data for advertising purposes or to build marketing profiles.',
    ],
  },
  {
    icon: Share2,
    title: 'Data Sharing',
    content: [
      'We do not sell, rent, or share your personal information with third parties for their marketing purposes.',
      'Your data is stored in Google Firebase (Firestore) and is subject to Google Cloud\'s security practices and data processing agreements.',
      'We may disclose information if required by law or to protect the rights, property, or safety of our users.',
    ],
  },
  {
    icon: Clock,
    title: 'Data Retention',
    content: [
      'Your account data is retained for as long as your account remains active.',
      'Analytics data is retained in aggregated, anonymized form and is not tied to individual user accounts.',
      'Upon account deletion, your personal data is removed within 30 days. Some anonymized analytics data may be retained for service improvement purposes.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'Access: You have the right to request a copy of the personal data we hold about you.',
      'Correction: You may request correction of any inaccurate personal data.',
      'Deletion: You may request deletion of your account and associated data at any time by contacting us or visiting our data deletion page.',
      'Export: You may request an export of your data in a machine-readable format.',
      'Objection: You have the right to object to the processing of your personal data for certain purposes.',
      'These rights apply regardless of your location, in accordance with GDPR and CCPA standards.',
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies',
    content: [
      'We use essential cookies for authentication and session management.',
      'We use analytics cookies to understand site usage and improve our services.',
      'We do not use advertising or third-party tracking cookies.',
      'You can manage cookie preferences through your browser settings. Disabling essential cookies may affect site functionality.',
      'For more details, please review our Cookie Policy.',
    ],
  },
  {
    icon: Server,
    title: 'Third-Party Services',
    content: [
      'Firebase Authentication: Used for secure Google sign-in. Governed by Google\'s Privacy Policy.',
      'Firebase Firestore: Used for data storage. Data is encrypted at rest and in transit.',
      'Google Analytics: Used for anonymous website analytics. We use IP anonymization and do not share analytics data externally.',
      'All third-party services are chosen for their strong privacy practices and compliance with international data protection standards.',
    ],
  },
  {
    icon: Baby,
    title: 'Children\'s Privacy',
    content: [
      'Our services are not intended for individuals under the age of 13.',
      'We do not knowingly collect personal information from children under 13.',
      'If you believe a child under 13 has provided us with personal data, please contact us immediately and we will take steps to remove the information.',
    ],
  },
  {
    icon: FileText,
    title: 'Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.',
      'We will notify registered users of significant changes via email.',
      'The "Last Updated" date at the top of this page indicates when the policy was most recently revised.',
      'Your continued use of the service after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    icon: Mail,
    title: 'Contact Information',
    content: [
      `If you have any questions about this Privacy Policy or our data practices, please contact us at ${DEVELOPER.email}.`,
      `You can also reach us by phone at ${DEVELOPER.phone} or connect with us on LinkedIn at ${DEVELOPER.linkedin}.`,
      'We aim to respond to all privacy-related inquiries within 48 hours.',
    ],
  },
];

export default function PrivacyPage() {
  useEffect(() => {
    trackPageView('/privacy', 'Privacy Policy');
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
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            Your privacy is important to us. This policy explains how {APP_NAME} collects, uses,
            and protects your information.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-surface-500">
            <Shield className="h-4 w-4" />
            <span>Last updated: February 2026</span>
          </div>
        </motion.div>
      </Container>

      {/* Policy Sections */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl space-y-6"
        >
          {policySections.map((section, index) => (
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
          <Shield className="h-4 w-4 text-surface-400" />
          <Link to="/terms" className="text-brand-600 underline-offset-4 hover:underline">Terms of Service</Link>
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
