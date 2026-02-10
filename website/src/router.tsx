import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';

const HomePage = lazy(() => import('@/pages/marketing/HomePage'));
const FeaturesPage = lazy(() => import('@/pages/marketing/FeaturesPage'));
const AdvertisingDetailPage = lazy(() => import('@/pages/marketing/AdvertisingDetailPage'));
const BroadcastsDetailPage = lazy(() => import('@/pages/marketing/BroadcastsDetailPage'));
const FeatureFlagsDetailPage = lazy(() => import('@/pages/marketing/FeatureFlagsDetailPage'));
const CommonFeaturesDetailPage = lazy(() => import('@/pages/marketing/CommonFeaturesDetailPage'));
const DocsPage = lazy(() => import('@/pages/marketing/DocsPage'));
const ApiReferencePage = lazy(() => import('@/pages/marketing/ApiReferencePage'));
const ExamplesPage = lazy(() => import('@/pages/marketing/ExamplesPage'));
const DemosPage = lazy(() => import('@/pages/marketing/DemosPage'));
const PricingPage = lazy(() => import('@/pages/marketing/PricingPage'));
const ChangelogPage = lazy(() => import('@/pages/marketing/ChangelogPage'));
const AboutPage = lazy(() => import('@/pages/marketing/AboutPage'));
const ContactPage = lazy(() => import('@/pages/marketing/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/marketing/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/marketing/TermsPage'));
const CookiePolicyPage = lazy(() => import('@/pages/marketing/CookiePolicyPage'));
const DataDeletionPage = lazy(() => import('@/pages/marketing/DataDeletionPage'));
const SecurityPage = lazy(() => import('@/pages/marketing/SecurityPage'));
const SitemapPage = lazy(() => import('@/pages/marketing/SitemapPage'));
const CodeAccessPage = lazy(() => import('@/pages/marketing/CodeAccessPage'));

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

const DashboardOverview = lazy(() => import('@/pages/dashboard/DashboardOverview'));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));

const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const FeatureFlagsAdminPage = lazy(() => import('@/pages/admin/FeatureFlagsAdminPage'));
const CampaignsAdminPage = lazy(() => import('@/pages/admin/CampaignsAdminPage'));
const CampaignDetailAdminPage = lazy(() => import('@/pages/admin/CampaignDetailAdminPage'));
const ProductsAdminPage = lazy(() => import('@/pages/admin/ProductsAdminPage'));
const BroadcastsAdminPage = lazy(() => import('@/pages/admin/BroadcastsAdminPage'));
const BroadcastDetailAdminPage = lazy(() => import('@/pages/admin/BroadcastDetailAdminPage'));
const ContactInfoAdminPage = lazy(() => import('@/pages/admin/ContactInfoAdminPage'));
const DeveloperInfoAdminPage = lazy(() => import('@/pages/admin/DeveloperInfoAdminPage'));
const SocialLinksAdminPage = lazy(() => import('@/pages/admin/SocialLinksAdminPage'));
const AddressInfoAdminPage = lazy(() => import('@/pages/admin/AddressInfoAdminPage'));
const PaymentOptionsAdminPage = lazy(() => import('@/pages/admin/PaymentOptionsAdminPage'));
const ServicesAdminPage = lazy(() => import('@/pages/admin/ServicesAdminPage'));
const SkillsAdminPage = lazy(() => import('@/pages/admin/SkillsAdminPage'));
const TestimonialsAdminPage = lazy(() => import('@/pages/admin/TestimonialsAdminPage'));
const ProjectsAdminPage = lazy(() => import('@/pages/admin/ProjectsAdminPage'));
const AnalyticsAdminPage = lazy(() => import('@/pages/admin/AnalyticsAdminPage'));
const ImpressionsAdminPage = lazy(() => import('@/pages/admin/ImpressionsAdminPage'));

const NotFoundPage = lazy(() => import('@/pages/marketing/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/features/advertising', element: <AdvertisingDetailPage /> },
      { path: '/features/broadcasts', element: <BroadcastsDetailPage /> },
      { path: '/features/feature-flags', element: <FeatureFlagsDetailPage /> },
      { path: '/features/common', element: <CommonFeaturesDetailPage /> },
      { path: '/docs', element: <DocsPage /> },
      { path: '/docs/api', element: <ApiReferencePage /> },
      { path: '/docs/examples', element: <ExamplesPage /> },
      { path: '/demos', element: <DemosPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/changelog', element: <ChangelogPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/cookies', element: <CookiePolicyPage /> },
      { path: '/data-deletion', element: <DataDeletionPage /> },
      { path: '/security', element: <SecurityPage /> },
      { path: '/sitemap', element: <SitemapPage /> },
      { path: '/code-access', element: <CodeAccessPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardOverview /> },
          { path: '/dashboard/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminOverview /> },
          { path: '/admin/feature-flags', element: <FeatureFlagsAdminPage /> },
          { path: '/admin/campaigns', element: <CampaignsAdminPage /> },
          { path: '/admin/campaigns/:id', element: <CampaignDetailAdminPage /> },
          { path: '/admin/products', element: <ProductsAdminPage /> },
          { path: '/admin/broadcasts', element: <BroadcastsAdminPage /> },
          { path: '/admin/broadcasts/:id', element: <BroadcastDetailAdminPage /> },
          { path: '/admin/contact', element: <ContactInfoAdminPage /> },
          { path: '/admin/developer', element: <DeveloperInfoAdminPage /> },
          { path: '/admin/social-links', element: <SocialLinksAdminPage /> },
          { path: '/admin/address', element: <AddressInfoAdminPage /> },
          { path: '/admin/payment-options', element: <PaymentOptionsAdminPage /> },
          { path: '/admin/services', element: <ServicesAdminPage /> },
          { path: '/admin/skills', element: <SkillsAdminPage /> },
          { path: '/admin/testimonials', element: <TestimonialsAdminPage /> },
          { path: '/admin/projects', element: <ProjectsAdminPage /> },
          { path: '/admin/analytics', element: <AnalyticsAdminPage /> },
          { path: '/admin/impressions', element: <ImpressionsAdminPage /> },
        ],
      },
    ],
  },
]);
