import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Megaphone,
  Package,
  Radio,
  ToggleLeft,
  BarChart3,
  Share2,
  Plus,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface DashboardStats {
  totalCampaigns: number;
  totalProducts: number;
  activeBroadcasts: number;
  featureFlagsEnabled: boolean;
  totalImpressions: number;
  totalSocialLinks: number;
}

/**
 * Skeleton loader for stat cards displayed while data is loading.
 */
function StatCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-surface-200" />
          <div className="h-5 w-16 rounded bg-surface-200" />
        </div>
        <div className="h-4 w-24 rounded bg-surface-200 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 rounded bg-surface-200" />
      </CardContent>
    </Card>
  );
}

export default function AdminOverview() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);

      const [
        campaignsSnap,
        productsSnap,
        broadcastsSnap,
        impressionsSnap,
        socialLinksSnap,
        featureFlagsSnap,
      ] = await Promise.all([
        getDocs(collection(db, 'zaions_campaigns')),
        getDocs(collection(db, 'zaions_products')),
        getDocs(collection(db, 'zaions_broadcasts')),
        getDocs(collection(db, 'zaions_impressions')),
        getDocs(collection(db, 'portfolio_social_links')),
        getDoc(doc(db, 'zaions_feature_flags', 'main')),
      ]);

      const activeBroadcasts = broadcastsSnap.docs.filter(
        (d) => d.data().status === 'active'
      ).length;

      const featureFlagsData = featureFlagsSnap.data();
      const featureFlagsEnabled = featureFlagsData?.globalEnabled ?? false;

      setStats({
        totalCampaigns: campaignsSnap.size,
        totalProducts: productsSnap.size,
        activeBroadcasts,
        featureFlagsEnabled,
        totalImpressions: impressionsSnap.size,
        totalSocialLinks: socialLinksSnap.size,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin', 'Admin Overview');
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handles manual refresh of dashboard statistics.
   */
  function handleRefresh() {
    setRefreshing(true);
    trackEvent('admin_dashboard_refresh');
    fetchStats();
  }

  const statCards = [
    {
      label: 'Total Campaigns',
      value: stats?.totalCampaigns ?? 0,
      icon: Megaphone,
      color: 'bg-violet-100 text-violet-600',
      href: '/admin/campaigns',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/products',
    },
    {
      label: 'Active Broadcasts',
      value: stats?.activeBroadcasts ?? 0,
      icon: Radio,
      color: 'bg-emerald-100 text-emerald-600',
      href: '/admin/broadcasts',
    },
    {
      label: 'Feature Flags',
      value: stats?.featureFlagsEnabled ? 'ON' : 'OFF',
      icon: ToggleLeft,
      color: stats?.featureFlagsEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600',
      href: '/admin/feature-flags',
    },
    {
      label: 'Total Impressions',
      value: stats?.totalImpressions ?? 0,
      icon: BarChart3,
      color: 'bg-amber-100 text-amber-600',
      href: '/admin/campaigns',
    },
    {
      label: 'Social Links',
      value: stats?.totalSocialLinks ?? 0,
      icon: Share2,
      color: 'bg-pink-100 text-pink-600',
      href: '/admin',
    },
  ];

  const quickActions = [
    {
      label: 'Create Campaign',
      icon: Megaphone,
      href: '/admin/campaigns',
      description: 'Launch a new advertising campaign',
    },
    {
      label: 'Create Broadcast',
      icon: Radio,
      href: '/admin/broadcasts',
      description: 'Send a cross-project notification',
    },
    {
      label: 'Toggle Maintenance',
      icon: ToggleLeft,
      href: '/admin/feature-flags',
      description: 'Enable or disable maintenance mode',
    },
    {
      label: 'Add Product',
      icon: Package,
      href: '/admin/products',
      description: 'Register a new product for ads',
    },
  ];

  if (!isAdmin) {
    return (
      <Container className="py-20">
        <Alert variant="danger">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin privileges to view this page.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <Container className="py-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-2 text-violet-200 text-sm mb-2">
              <Link to="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">Overview</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <LayoutDashboard className="h-8 w-8" />
                  Admin Dashboard
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage shared features, campaigns, broadcasts, and more.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                onClick={handleRefresh}
                disabled={refreshing}
                loading={refreshing}
              >
                <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8 space-y-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="danger">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <StatCardSkeleton />
                </motion.div>
              ))
            : statCards.map((stat) => (
                <motion.div key={stat.label} variants={staggerItem}>
                  <Link to={stat.href}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', stat.color)}>
                            <stat.icon className="h-5 w-5" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-surface-400 group-hover:text-violet-500 transition-colors" />
                        </div>
                        <CardDescription className="mt-2">{stat.label}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-display font-bold text-surface-900">
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <h2 className="font-display text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full group border-violet-100 hover:border-violet-300">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-200 transition-colors">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base mt-2 flex items-center gap-2">
                      {action.label}
                      <Plus className="h-3.5 w-3.5 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <h2 className="font-display text-xl font-semibold text-surface-900 mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">Activity tracking coming in v2</p>
              <p className="text-surface-400 text-sm mt-1">
                Campaign events, broadcast analytics, and admin actions will appear here.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Navigation */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <h2 className="font-display text-xl font-semibold text-surface-900 mb-4">Manage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                label: 'Feature Flags',
                description: 'Global toggles, maintenance mode, API versioning',
                icon: ToggleLeft,
                href: '/admin/feature-flags',
                badge: 'Singleton',
              },
              {
                label: 'Campaigns',
                description: 'Advertising campaigns and targeting',
                icon: Megaphone,
                href: '/admin/campaigns',
                badge: `${stats?.totalCampaigns ?? 0} total`,
              },
              {
                label: 'Products',
                description: 'Product catalog for advertisements',
                icon: Package,
                href: '/admin/products',
                badge: `${stats?.totalProducts ?? 0} total`,
              },
              {
                label: 'Broadcasts',
                description: 'Cross-project notifications and announcements',
                icon: Radio,
                href: '/admin/broadcasts',
                badge: `${stats?.activeBroadcasts ?? 0} active`,
              },
            ].map((item) => (
              <Link key={item.label} to={item.href}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" size="sm">
                        {item.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2">{item.label}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-violet-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Manage
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
