import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Package,
  Mail,
  Shield,
  CheckCircle2,
  Terminal,
  Users,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  FileCode2,
  Scale,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_NAME, DEVELOPER, GITHUB_URL, NPM_URL } from '@/config/constants';
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

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Why is GitHub access restricted?',
    answer: 'While the code is fully open source under the MIT license, we use guided access to maintain code quality and ensure contributors understand the project structure before making changes. The npm package is freely available to everyone without any restrictions.',
  },
  {
    question: 'Can I contribute to the project?',
    answer: 'Absolutely! After receiving GitHub access, you can fork the repository, create feature branches, and submit pull requests. We welcome contributions of all sizes, from bug fixes to new features. Please follow the contribution guidelines in the repository.',
  },
  {
    question: 'Is the code free to use?',
    answer: 'Yes. The shared-features package is released under the MIT license, which means you can use it in personal and commercial projects without any cost. You can modify, distribute, and sublicense the code as permitted by the MIT license.',
  },
  {
    question: 'Do I need GitHub access to use the package?',
    answer: 'No. The npm package is publicly available and can be installed directly using yarn or npm. GitHub access is only needed if you want to browse the source code, report issues on GitHub, or contribute to development.',
  },
  {
    question: 'How long does the review process take?',
    answer: 'Most applications are reviewed within 48 hours. You will receive an email notification once your access has been granted or if we need additional information.',
  },
  {
    question: 'What if my application is denied?',
    answer: 'Denials are rare and usually happen when the application is incomplete. You can re-apply with more detail about your intended use case. Contact us via email if you have questions about your application.',
  },
];

const applicationSteps = [
  {
    step: 1,
    icon: Mail,
    title: 'Send an application email',
    description: `Email ${DEVELOPER.email} with the subject "GitHub Access Request - ${APP_NAME}".`,
  },
  {
    step: 2,
    icon: Users,
    title: 'Include your details',
    description: 'Your full name, GitHub username, project name or company, and a brief description of your intended use.',
  },
  {
    step: 3,
    icon: Clock,
    title: 'Wait for review',
    description: 'The maintainer will review your application within 48 hours and send an access invitation.',
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: 'Accept the invitation',
    description: 'Accept the GitHub repository invitation from your email or GitHub notifications to gain access.',
  },
];

function FaqAccordion({ faq }: { faq: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn('transition-all', isOpen && 'border-brand-200 shadow-md')}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
          <h3 className="font-display font-semibold text-surface-900">{faq.question}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-surface-400" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-surface-400" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <CardContent className="pt-0">
            <p className="ml-8 text-sm leading-relaxed text-surface-600">{faq.answer}</p>
          </CardContent>
        </motion.div>
      )}
    </Card>
  );
}

export default function CodeAccessPage() {
  const [installCopied, setInstallCopied] = useState(false);

  useEffect(() => {
    trackPageView('/code-access', 'Code Access');
  }, []);

  const handleCopyInstall = async () => {
    const success = await copyToClipboard('yarn add shared-features');
    if (success) {
      setInstallCopied(true);
      trackClick('code_access_copy_install', 'code-access');
      setTimeout(() => setInstallCopied(false), 2000);
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
          <Badge variant="success" size="md" className="mb-4">
            Open Source
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            Open Source with{' '}
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
              Guided Access
            </span>
          </h1>
          <p className="mt-6 text-lg text-surface-600">
            {APP_NAME} is fully open source under the MIT license. The npm package is freely
            available to everyone. GitHub repository access requires a brief application to maintain
            quality and community standards.
          </p>
        </motion.div>
      </Container>

      {/* Two Paths */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* NPM Path */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full border-brand-200 bg-brand-50/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>NPM Package</CardTitle>
                    <CardDescription>No access required - install immediately</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-surface-600">
                    The package is publicly available on NPM. Install it in any React project and
                    start using shared features right away.
                  </p>
                  <div className="flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-4 py-3 font-mono text-sm">
                    <Terminal className="h-4 w-4 shrink-0 text-brand-500" />
                    <span className="flex-1 text-surface-800">yarn add shared-features</span>
                    <button
                      onClick={handleCopyInstall}
                      className="shrink-0 rounded p-1 text-surface-400 transition-colors hover:text-surface-700"
                    >
                      {installCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="success" size="sm">Free</Badge>
                    <Badge variant="info" size="sm">No account needed</Badge>
                    <Badge variant="outline" size="sm">MIT License</Badge>
                  </div>
                  <Button variant="primary" className="w-full" asChild>
                    <a
                      href={NPM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick('code_access_npm', 'code-access')}
                    >
                      <Package className="h-4 w-4" />
                      View on NPM
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* GitHub Path */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full border-surface-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-surface-700">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>GitHub Repository</CardTitle>
                    <CardDescription>Application required for source access</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-surface-600">
                    The source code is hosted on GitHub. To browse the repository, contribute code,
                    or submit issues, you need to request access through a brief application.
                  </p>
                  <div className="rounded-lg border border-surface-200 bg-surface-50 p-4">
                    <div className="space-y-2 text-sm text-surface-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-500" />
                        <span>Browse full source code</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-500" />
                        <span>Submit pull requests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-500" />
                        <span>Report issues on GitHub</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-500" />
                        <span>Star and watch the repo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="warning" size="sm">Application required</Badge>
                    <Badge variant="outline" size="sm">48h review</Badge>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`mailto:${DEVELOPER.email}?subject=GitHub%20Access%20Request%20-%20${encodeURIComponent(APP_NAME)}&body=Hi%20${encodeURIComponent(DEVELOPER.name)}%2C%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20${encodeURIComponent(APP_NAME)}%20GitHub%20repository.%0A%0AName%3A%20%0AGitHub%20Username%3A%20%0AProject%2FCompany%3A%20%0AIntended%20Use%3A%20%0A%0AThank%20you.`}
                      onClick={() => trackClick('code_access_apply', 'code-access')}
                    >
                      <Mail className="h-4 w-4" />
                      Apply for Access
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>

      {/* Application Process */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge size="md" className="mb-4">Application Process</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              How to Get GitHub Access
            </h2>
          </motion.div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {applicationSteps.map((step) => (
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
                    <step.icon className="hidden h-5 w-5 shrink-0 text-surface-300 sm:block" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* License */}
      <Container className="mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="border-brand-200 bg-brand-50/30">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-surface-900">MIT License</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">
                  {APP_NAME} is released under the MIT license, one of the most permissive open
                  source licenses available. You are free to use, modify, and distribute the code
                  in both personal and commercial projects. The only requirement is to include the
                  original copyright notice and license text.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="success" size="sm">Commercial use</Badge>
                  <Badge variant="success" size="sm">Modification</Badge>
                  <Badge variant="success" size="sm">Distribution</Badge>
                  <Badge variant="success" size="sm">Private use</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* FAQ */}
      <Container className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <Badge variant="info" size="md" className="mb-4">FAQ</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {faqs.map((faq) => (
              <motion.div key={faq.question} variants={fadeInUp}>
                <FaqAccordion faq={faq} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
