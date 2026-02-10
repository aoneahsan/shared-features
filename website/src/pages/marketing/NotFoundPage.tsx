import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Map, ArrowLeft, Compass, Search } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/config/constants';
import { trackPageView } from '@/lib/analytics';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const floatAnimation = {
  y: [0, -12, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
  },
};

const rotateAnimation = {
  rotate: [0, 360],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: 'linear' as const,
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.3, 0.6, 0.3],
  transition: {
    duration: 4,
    repeat: Infinity,
  },
};

export default function NotFoundPage() {
  useEffect(() => {
    trackPageView('/404', '404 - Not Found');
  }, []);

  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden py-16 sm:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={pulseAnimation}
          className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-brand-100"
        />
        <motion.div
          animate={{ ...pulseAnimation, transition: { ...pulseAnimation.transition, delay: 1.5 } }}
          className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-accent-100"
        />
        <motion.div
          animate={rotateAnimation}
          className="absolute top-20 right-[15%] text-surface-100"
        >
          <Compass className="h-16 w-16" />
        </motion.div>
        <motion.div
          animate={{ ...rotateAnimation, transition: { ...rotateAnimation.transition, duration: 15 } }}
          className="absolute bottom-32 left-[10%] text-surface-100"
        >
          <Search className="h-12 w-12" />
        </motion.div>
      </div>

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Large 404 */}
          <motion.div animate={floatAnimation} className="mb-8">
            <h1 className="font-display text-[10rem] font-black leading-none tracking-tighter sm:text-[14rem]">
              <span className="bg-gradient-to-br from-brand-400 via-accent-500 to-brand-600 bg-clip-text text-transparent">
                404
              </span>
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              Page Not Found
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-surface-600">
              The page you are looking for does not exist or has been moved. Check the URL or
              navigate back to familiar ground.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button variant="primary" size="lg" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/sitemap">
                <Map className="h-4 w-4" />
                View Sitemap
              </Link>
            </Button>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 rounded-xl border border-surface-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
          >
            <p className="mb-4 text-sm font-medium text-surface-700">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
              <Link to="/features" className="inline-flex items-center gap-1 text-brand-600 underline-offset-4 hover:underline">
                <ArrowLeft className="h-3 w-3" /> Features
              </Link>
              <Link to="/docs" className="inline-flex items-center gap-1 text-brand-600 underline-offset-4 hover:underline">
                <ArrowLeft className="h-3 w-3" /> Documentation
              </Link>
              <Link to="/docs/api" className="inline-flex items-center gap-1 text-brand-600 underline-offset-4 hover:underline">
                <ArrowLeft className="h-3 w-3" /> API Reference
              </Link>
              <Link to="/demos" className="inline-flex items-center gap-1 text-brand-600 underline-offset-4 hover:underline">
                <ArrowLeft className="h-3 w-3" /> Demos
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-1 text-brand-600 underline-offset-4 hover:underline">
                <ArrowLeft className="h-3 w-3" /> Contact
              </Link>
            </div>
          </motion.div>

          {/* Fun message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 text-sm text-surface-400"
          >
            Even {APP_NAME} cannot find this page. And that is saying something.
          </motion.p>
        </motion.div>
      </Container>
    </div>
  );
}
