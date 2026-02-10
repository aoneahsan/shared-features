import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cookie,
  Info,
  Lock,
  Settings,
  BarChart3,
  Server,
  RefreshCw,
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

interface CookieInfo {
  name: string;
  purpose: string;
  duration: string;
  type: 'Essential' | 'Preference' | 'Analytics';
}

const cookiesList: CookieInfo[] = [
  {
    name: 'Firebase Auth Token',
    purpose: 'Authenticates your session after Google sign-in and maintains your logged-in state.',
    duration: 'Session / up to 1 hour',
    type: 'Essential',
  },
  {
    name: 'Firebase Auth Persistence',
    purpose: 'Remembers your authentication state so you do not have to sign in again on return visits.',
    duration: 'Persistent (until sign-out)',
    type: 'Essential',
  },
  {
    name: 'Theme Preference',
    purpose: 'Stores your preferred color theme (light/dark) for a consistent experience.',
    duration: 'Persistent (1 year)',
    type: 'Preference',
  },
  {
    name: 'Sidebar State',
    purpose: 'Remembers whether you had the admin sidebar expanded or collapsed.',
    duration: 'Persistent (1 year)',
    type: 'Preference',
  },
  {
    name: 'Google Analytics (_ga)',
    purpose: 'Distinguishes unique visitors and tracks page views anonymously.',
    duration: '2 years',
    type: 'Analytics',
  },
  {
    name: 'Google Analytics (_ga_*)',
    purpose: 'Maintains session state for analytics reporting.',
    duration: '2 years',
    type: 'Analytics',
  },
];

interface PolicySection {
  icon: typeof Cookie;
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    icon: Info,
    title: 'What Are Cookies',
    content: [
      'Cookies are small text files that websites place on your device to store information. They are widely used to make websites work efficiently and to provide information to site owners.',
      `${APP_NAME} uses cookies and similar technologies (such as local storage) to provide essential functionality, remember your preferences, and understand how you use our services.`,
      'Cookies can be "session" cookies, which are deleted when you close your browser, or "persistent" cookies, which remain on your device for a set period or until you delete them.',
    ],
  },
  {
    icon: Lock,
    title: 'Essential Cookies',
    content: [
      'Essential cookies are strictly necessary for the website to function. Without these, core features such as authentication and session management would not work.',
      'Firebase Authentication cookies are used to securely manage your sign-in session. These tokens are encrypted and contain no personally identifiable information in readable form.',
      'You cannot opt out of essential cookies as they are required for basic functionality. If you disable them through browser settings, the website will not function correctly.',
    ],
  },
  {
    icon: Settings,
    title: 'Preference Cookies',
    content: [
      'Preference cookies allow the website to remember your choices, such as theme settings and UI preferences.',
      'These cookies improve your experience by preventing you from having to re-enter preferences each time you visit.',
      'Disabling preference cookies will not prevent the site from working, but your preferences will not be remembered between visits.',
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics Cookies',
    content: [
      'We use Google Analytics to collect anonymous information about how visitors interact with our website.',
      'Analytics cookies help us understand which pages are most popular, how visitors navigate the site, and where we can improve the user experience.',
      'All analytics data is anonymized. We use IP anonymization so your full IP address is never stored. We do not use analytics data to identify individual users.',
      'You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.',
    ],
  },
  {
    icon: Server,
    title: 'Third-Party Cookies',
    content: [
      'Firebase (Google): Used for authentication and analytics. Subject to Google\'s Privacy Policy and data processing terms.',
      'Google Analytics: Used for website traffic analysis. Processes anonymized usage data to generate aggregate reports.',
      'We do not use any third-party advertising cookies or tracking pixels.',
      'We carefully vet third-party services to ensure they meet appropriate privacy and security standards.',
    ],
  },
  {
    icon: Settings,
    title: 'Managing Cookies',
    content: [
      'Most web browsers allow you to control cookies through their settings. You can usually find these in the "Options" or "Preferences" menu of your browser.',
      'You can delete all cookies that are already on your device and set most browsers to prevent them from being placed.',
      'If you disable cookies, you may find that some parts of the website do not work as expected. In particular, you will not be able to sign in if authentication cookies are blocked.',
      'For more information about managing cookies in specific browsers, visit the browser manufacturer\'s help pages.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Changes to This Policy',
    content: [
      'We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.',
      'The "Last Updated" date at the top of this page indicates the most recent revision.',
      'We encourage you to review this policy periodically to stay informed about our use of cookies.',
    ],
  },
  {
    icon: Mail,
    title: 'Contact',
    content: [
      `If you have any questions about our use of cookies, please contact us at ${DEVELOPER.email}.`,
      `You can also reach us by phone at ${DEVELOPER.phone} or through LinkedIn at ${DEVELOPER.linkedin}.`,
    ],
  },
];

const badgeColorMap: Record<CookieInfo['type'], 'success' | 'info' | 'warning'> = {
  Essential: 'success',
  Preference: 'info',
  Analytics: 'warning',
};

export default function CookiePolicyPage() {
  useEffect(() => {
    trackPageView('/cookies', 'Cookie Policy');
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
            Cookie Policy
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            This policy explains how {APP_NAME} uses cookies and similar technologies to provide,
            improve, and protect our services.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-surface-500">
            <Cookie className="h-4 w-4" />
            <span>Last updated: February 2026</span>
          </div>
        </motion.div>
      </Container>

      {/* Cookies Table */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="mx-auto max-w-4xl"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 text-left">
                      <th className="pb-3 pr-4 font-semibold text-surface-900">Cookie</th>
                      <th className="pb-3 pr-4 font-semibold text-surface-900">Purpose</th>
                      <th className="pb-3 pr-4 font-semibold text-surface-900">Duration</th>
                      <th className="pb-3 font-semibold text-surface-900">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {cookiesList.map((cookie) => (
                      <tr key={cookie.name}>
                        <td className="py-3 pr-4 font-mono text-xs text-surface-700">{cookie.name}</td>
                        <td className="py-3 pr-4 text-surface-600">{cookie.purpose}</td>
                        <td className="py-3 pr-4 text-surface-500 whitespace-nowrap">{cookie.duration}</td>
                        <td className="py-3">
                          <Badge variant={badgeColorMap[cookie.type]} size="sm">{cookie.type}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Policy Sections */}
      <Container className="mt-12">
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
          <Cookie className="h-4 w-4 text-surface-400" />
          <Link to="/privacy" className="text-brand-600 underline-offset-4 hover:underline">Privacy Policy</Link>
          <span className="text-surface-300">|</span>
          <Link to="/terms" className="text-brand-600 underline-offset-4 hover:underline">Terms of Service</Link>
          <span className="text-surface-300">|</span>
          <Link to="/data-deletion" className="text-brand-600 underline-offset-4 hover:underline">Data Deletion</Link>
          <span className="text-surface-300">|</span>
          <Link to="/security" className="text-brand-600 underline-offset-4 hover:underline">Security</Link>
        </motion.div>
      </Container>
    </div>
  );
}
