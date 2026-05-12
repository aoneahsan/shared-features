/**
 * Seed Data Page
 *
 * Admin page to seed products and campaigns for testing.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import {
  Database,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Play,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Collection names
const PRODUCTS_COLLECTION = 'zaions_products';
const CAMPAIGNS_COLLECTION = 'zaions_campaigns';

// Product data for all Zaions projects
const products = [
  {
    id: 'ztools',
    name: 'ZTools',
    tagline: '380+ free online tools for text, images, PDF, code, and more',
    description: 'Your all-in-one digital toolbox. Process data locally in your browser - no uploads, complete privacy. Text tools, image converters, PDF utilities, code formatters, and much more.',
    type: 'web',
    url: 'https://ztools.zaions.com',
    color: '#3B82F6',
    features: ['380+ Free Tools', 'Privacy-First', 'No Sign-Up', 'Works Offline'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#3B82F6"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">Z</text></svg>',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.zaions.ztools',
    webUrl: 'https://ztools.zaions.com',
    enabled: true,
  },
  {
    id: 'fileshub',
    name: 'FilesHub',
    tagline: 'Free cloud storage API for developers',
    description: 'Upload, store, and manage files with our simple REST API. Free tier with generous limits. Perfect for apps, websites, and side projects.',
    type: 'web',
    url: 'https://fileshub.zaions.com',
    color: '#10B981',
    features: ['Free Storage', 'REST API', 'Easy Integration', 'Developer Friendly'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#10B981"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">F</text></svg>',
    webUrl: 'https://fileshub.zaions.com',
    enabled: true,
  },
  {
    id: 'aoneahsan-portfolio',
    name: 'Ahsan Mahmood',
    tagline: 'Full-Stack Developer & Mobile App Expert',
    description: 'Portfolio of Ahsan Mahmood - Building beautiful apps for web, mobile, and browser. React, TypeScript, Firebase, Capacitor specialist.',
    type: 'website',
    url: 'https://aoneahsan.com',
    color: '#8B5CF6',
    features: ['Web Development', 'Mobile Apps', 'Browser Extensions', 'API Development'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#8B5CF6"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">A</text></svg>',
    webUrl: 'https://aoneahsan.com',
    enabled: true,
  },
  {
    id: 'video-controls-plus',
    name: 'Video Controls Plus',
    tagline: 'Advanced video controls for any website',
    description: 'Take control of online videos. Speed control, picture-in-picture, keyboard shortcuts, and more. Works on YouTube, Netflix, and any video site.',
    type: 'extension',
    url: 'https://chromewebstore.google.com/detail/video-controls-plus',
    color: '#EF4444',
    features: ['Speed Control', 'PiP Mode', 'Keyboard Shortcuts', 'All Sites'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#EF4444"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">V</text></svg>',
    chromeStoreUrl: 'https://chromewebstore.google.com/detail/video-controls-plus',
    enabled: true,
  },
  {
    id: 'orbitcubs-crm',
    name: 'OrbitCubs CRM',
    tagline: 'Free CRM for small businesses',
    description: 'Manage your contacts, leads, and sales pipeline. Simple, beautiful, and free. Perfect for freelancers and small teams.',
    type: 'web',
    url: 'https://orbitcubs.zaions.com',
    color: '#F59E0B',
    features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Free Forever'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#F59E0B"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">O</text></svg>',
    webUrl: 'https://orbitcubs.zaions.com',
    enabled: true,
  },
];

// Campaign data
const campaigns = [
  // Topbar Banner Campaigns
  {
    id: 'ztools-topbar',
    productId: 'ztools',
    name: 'ZTools Topbar Promo',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['topbar_banner'],
    priority: 100,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'small_panel_1',
    customCta: 'Try Now',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'fileshub-topbar',
    productId: 'fileshub',
    name: 'FilesHub Topbar Promo',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['topbar_banner'],
    priority: 90,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'small_panel_1',
    customCta: 'Get Started',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'portfolio-topbar',
    productId: 'aoneahsan-portfolio',
    name: 'Portfolio Topbar Promo',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['topbar_banner'],
    priority: 80,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'small_panel_1',
    customCta: 'Hire Me',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  // Home Banner Campaigns (AdCarousel)
  {
    id: 'ztools-home',
    productId: 'ztools',
    name: 'ZTools Home Banner',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 100,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    customDescription: 'Your all-in-one digital toolbox with 380+ free tools for text, images, PDF, code, and more. Privacy-first - all processing happens in your browser.',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'fileshub-home',
    productId: 'fileshub',
    name: 'FilesHub Home Banner',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 90,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'video-controls-home',
    productId: 'video-controls-plus',
    name: 'Video Controls Home Banner',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 85,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'orbitcubs-home',
    productId: 'orbitcubs-crm',
    name: 'OrbitCubs Home Banner',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 80,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'portfolio-home',
    productId: 'aoneahsan-portfolio',
    name: 'Portfolio Home Banner',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 70,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    customCta: 'View Portfolio',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
];

export default function SeedDataPage() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [stats, setStats] = useState<{ products: number; campaigns: number }>({ products: 0, campaigns: 0 });

  // Fetch current counts on mount
  useState(() => {
    (async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
        const campaignsSnapshot = await getDocs(collection(db, CAMPAIGNS_COLLECTION));
        setStats({
          products: productsSnapshot.size,
          campaigns: campaignsSnapshot.size,
        });
      } catch (error) {
        logger.error('Error fetching stats:', error);
      }
    })();
  });

  const seedProducts = async () => {
    let count = 0;
    for (const product of products) {
      await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
    }
    return count;
  };

  const seedCampaigns = async () => {
    const now = Timestamp.now();
    const oneYearLater = Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

    let count = 0;
    for (const campaign of campaigns) {
      await setDoc(doc(db, CAMPAIGNS_COLLECTION, campaign.id), {
        ...campaign,
        startDate: now,
        endDate: oneYearLater,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: 'seed-page',
      });
      count++;
    }
    return count;
  };

  const handleSeedAll = async () => {
    setLoading(true);
    setResult(null);
    trackEvent('admin_seed_data_start', { type: 'all' });

    try {
      const productsSeeded = await seedProducts();
      const campaignsSeeded = await seedCampaigns();

      setResult({
        success: true,
        message: `Successfully seeded ${productsSeeded} products and ${campaignsSeeded} campaigns!`,
      });
      setStats({ products: productsSeeded, campaigns: campaignsSeeded });
      trackEvent('admin_seed_data_success', { products: productsSeeded, campaigns: campaignsSeeded });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setResult({ success: false, message: `Failed to seed data: ${message}` });
      trackEvent('admin_seed_data_error', { error: message });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL products and campaigns? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    setResult(null);
    trackEvent('admin_clear_data_start');

    try {
      // Delete all products
      const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      for (const docSnap of productsSnapshot.docs) {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, docSnap.id));
      }

      // Delete all campaigns
      const campaignsSnapshot = await getDocs(collection(db, CAMPAIGNS_COLLECTION));
      for (const docSnap of campaignsSnapshot.docs) {
        await deleteDoc(doc(db, CAMPAIGNS_COLLECTION, docSnap.id));
      }

      setResult({
        success: true,
        message: `Deleted ${productsSnapshot.size} products and ${campaignsSnapshot.size} campaigns.`,
      });
      setStats({ products: 0, campaigns: 0 });
      trackEvent('admin_clear_data_success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setResult({ success: false, message: `Failed to clear data: ${message}` });
      trackEvent('admin_clear_data_error', { error: message });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStats = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const campaignsSnapshot = await getDocs(collection(db, CAMPAIGNS_COLLECTION));
      setStats({
        products: productsSnapshot.size,
        campaigns: campaignsSnapshot.size,
      });
    } catch (error) {
      logger.error('Error refreshing stats:', error);
    }
  };

  if (!isAdmin) {
    return (
      <Container className="py-16 max-w-2xl">
        <Alert variant="danger">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You must be an admin to access this page.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100 py-8 lg:py-16">
      <Container className="max-w-2xl">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-surface-600 mb-6">
            <Link to="/admin" className="hover:text-primary-600 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-surface-900 font-medium">Seed Data</span>
          </nav>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
              <Database className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Seed Data</h1>
              <p className="text-surface-600">Seed products and campaigns for testing ad components</p>
            </div>
          </div>

          {/* Current Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Database Stats
                <Button variant="ghost" size="sm" onClick={handleRefreshStats}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.products}</p>
                  <p className="text-sm text-blue-700">Products</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.campaigns}</p>
                  <p className="text-sm text-green-700">Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Alert */}
          {result && (
            <Alert variant={result.success ? 'success' : 'danger'} className="mb-6">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Seed Actions</CardTitle>
              <CardDescription>
                Seed will create {products.length} products and {campaigns.length} campaigns. Existing items with the same ID will be overwritten.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSeedAll}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                {loading ? 'Seeding...' : 'Seed All Products & Campaigns'}
              </Button>

              <Button
                onClick={handleClearAll}
                disabled={loading}
                variant="danger"
                className="w-full"
                size="lg"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                {loading ? 'Clearing...' : 'Clear All Data'}
              </Button>
            </CardContent>
          </Card>

          {/* What Will Be Seeded */}
          <Card>
            <CardHeader>
              <CardTitle>What Will Be Seeded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-surface-900 mb-2">Products ({products.length})</h4>
                  <ul className="list-disc list-inside text-surface-600 text-sm space-y-1">
                    {products.map((p) => (
                      <li key={p.id}>
                        <span className="font-medium">{p.name}</span> - {p.tagline}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-surface-900 mb-2">Campaigns ({campaigns.length})</h4>
                  <ul className="list-disc list-inside text-surface-600 text-sm space-y-1">
                    {campaigns.map((c) => (
                      <li key={c.id}>
                        <span className="font-medium">{c.name}</span> - {c.placements.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              Campaigns with <code className="text-xs bg-surface-200 px-1 rounded">excludeProductUsers: true</code> will NOT show on their own product's website. For example, ZTools ads won't show on ztools.zaions.com, but they will show on fileshub.zaions.com.
            </AlertDescription>
          </Alert>
        </motion.div>
      </Container>
    </div>
  );
}
