import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Code2,
  Component,
  FileType,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { trackPageView, trackClick } from '@/lib/analytics';
import { APP_NAME } from '@/config/constants';

/* -------------------------------------------------------------------------- */
/*  API Member Data                                                           */
/* -------------------------------------------------------------------------- */

type Category = 'Hooks' | 'Services' | 'Components' | 'Types';

interface ApiMember {
  name: string;
  category: Category;
  description: string;
  signature?: string;
  example?: string;
}

const API_MEMBERS: ApiMember[] = [
  // ---- Hooks ----
  { name: 'useCampaigns', category: 'Hooks', description: 'Fetch all active ad campaigns with loading and error states.', signature: '() => { campaigns: Campaign[]; loading: boolean; error: Error | null; refetch: () => void }', example: 'const { campaigns, loading } = useCampaigns();' },
  { name: 'useCampaign', category: 'Hooks', description: 'Fetch a single campaign by ID.', signature: '(id: string) => { campaign: Campaign | null; loading: boolean; error: Error | null }', example: 'const { campaign } = useCampaign("campaign-123");' },
  { name: 'useOneTimeAdModal', category: 'Hooks', description: 'Show a one-time promotional modal to each user.', signature: '() => { show: boolean; campaign: Campaign | null; dismiss: () => void }', example: 'const { show, campaign, dismiss } = useOneTimeAdModal();' },
  { name: 'useUpdateAdModal', category: 'Hooks', description: 'Show an app update notification modal.', signature: '() => { show: boolean; campaign: Campaign | null; dismiss: () => void }', example: 'const { show, campaign, dismiss } = useUpdateAdModal();' },
  { name: 'useBroadcasts', category: 'Hooks', description: 'Fetch all active broadcast notifications.', signature: '() => { broadcasts: BroadcastNotification[]; loading: boolean; error: Error | null }', example: 'const { broadcasts, loading } = useBroadcasts();' },
  { name: 'useBannerBroadcasts', category: 'Hooks', description: 'Fetch broadcasts filtered to banner variant only.', signature: '() => { broadcasts: BroadcastNotification[]; loading: boolean }', example: 'const { broadcasts } = useBannerBroadcasts();' },
  { name: 'useModalBroadcasts', category: 'Hooks', description: 'Fetch broadcasts filtered to modal variant.', signature: '() => { broadcasts: BroadcastNotification[]; loading: boolean }', example: 'const { broadcasts } = useModalBroadcasts();' },
  { name: 'useToastBroadcasts', category: 'Hooks', description: 'Fetch broadcasts filtered to toast variant.', signature: '() => { broadcasts: BroadcastNotification[]; loading: boolean }', example: 'const { broadcasts } = useToastBroadcasts();' },
  { name: 'useBellBroadcasts', category: 'Hooks', description: 'Fetch broadcasts filtered to bell notification variant.', signature: '() => { broadcasts: BroadcastNotification[]; loading: boolean }', example: 'const { broadcasts } = useBellBroadcasts();' },
  { name: 'useSingleBroadcast', category: 'Hooks', description: 'Fetch a single broadcast notification by ID.', signature: '(id: string) => { broadcast: BroadcastNotification | null; loading: boolean }', example: 'const { broadcast } = useSingleBroadcast("broadcast-id");' },
  { name: 'useAnnouncementModal', category: 'Hooks', description: 'Auto-show the latest announcement modal to the user.', signature: '() => { show: boolean; broadcast: BroadcastNotification | null; dismiss: () => void }', example: 'const { show, broadcast, dismiss } = useAnnouncementModal();' },
  { name: 'useFeatureFlags', category: 'Hooks', description: 'Fetch all feature flags with utility methods.', signature: '() => { flags: Record<string, boolean>; loading: boolean; isEnabled: (key: string) => boolean }', example: 'const { isEnabled } = useFeatureFlags();' },
  { name: 'useFeature', category: 'Hooks', description: 'Check if a single feature is enabled.', signature: '(key: string) => { enabled: boolean; loading: boolean }', example: 'const { enabled } = useFeature("dark-mode");' },
  { name: 'useFeatureFlagsSubscription', category: 'Hooks', description: 'Subscribe to real-time feature flag changes.', signature: '() => { flags: Record<string, boolean>; loading: boolean; error: Error | null }', example: 'const { flags } = useFeatureFlagsSubscription();' },
  { name: 'useSharedFeaturesOperational', category: 'Hooks', description: 'Check if shared-features is initialized and operational.', signature: '() => { operational: boolean; error: Error | null }', example: 'const { operational } = useSharedFeaturesOperational();' },
  { name: 'useFeatureGate', category: 'Hooks', description: 'Gate component rendering based on feature flag.', signature: '(key: string) => { allowed: boolean; reason: string | null }', example: 'const { allowed, reason } = useFeatureGate("premium");' },
  { name: 'useContactInfo', category: 'Hooks', description: 'Fetch contact information (email, phone, WhatsApp).', signature: '() => { contactInfo: ContactInfo | null; loading: boolean }', example: 'const { contactInfo } = useContactInfo();' },
  { name: 'useDeveloperInfo', category: 'Hooks', description: 'Fetch developer profile with bio and avatar.', signature: '() => { developerInfo: DeveloperInfo | null; loading: boolean }', example: 'const { developerInfo } = useDeveloperInfo();' },
  { name: 'useAddressInfo', category: 'Hooks', description: 'Fetch physical address and location.', signature: '() => { addressInfo: AddressInfo | null; loading: boolean }', example: 'const { addressInfo } = useAddressInfo();' },
  { name: 'useSocialLinks', category: 'Hooks', description: 'Fetch social media links collection.', signature: '() => { socialLinks: SocialLink[]; loading: boolean }', example: 'const { socialLinks } = useSocialLinks();' },
  { name: 'usePaymentOptions', category: 'Hooks', description: 'Fetch accepted payment methods.', signature: '() => { paymentOptions: PaymentOption[]; loading: boolean }', example: 'const { paymentOptions } = usePaymentOptions();' },
  { name: 'useServices', category: 'Hooks', description: 'Fetch professional services list.', signature: '() => { services: Service[]; loading: boolean }', example: 'const { services } = useServices();' },
  { name: 'useSkills', category: 'Hooks', description: 'Fetch skills with proficiency levels.', signature: '() => { skills: Skill[]; loading: boolean }', example: 'const { skills } = useSkills();' },
  { name: 'useTestimonials', category: 'Hooks', description: 'Fetch client testimonials and reviews.', signature: '() => { testimonials: Testimonial[]; loading: boolean }', example: 'const { testimonials } = useTestimonials();' },
  { name: 'useProjects', category: 'Hooks', description: 'Fetch portfolio projects showcase.', signature: '() => { projects: Project[]; loading: boolean }', example: 'const { projects } = useProjects();' },
  { name: 'useProject', category: 'Hooks', description: 'Fetch a single project by ID.', signature: '(id: string) => { project: Project | null; loading: boolean }', example: 'const { project } = useProject("project-id");' },

  // ---- Services ----
  { name: 'fetchCampaigns', category: 'Services', description: 'Fetch all campaigns from Firestore.', signature: '() => Promise<Campaign[]>', example: 'const campaigns = await fetchCampaigns();' },
  { name: 'fetchActiveCampaigns', category: 'Services', description: 'Fetch only active, non-expired campaigns.', signature: '() => Promise<Campaign[]>', example: 'const active = await fetchActiveCampaigns();' },
  { name: 'getCampaignById', category: 'Services', description: 'Fetch a single campaign document.', signature: '(id: string) => Promise<Campaign | null>', example: 'const campaign = await getCampaignById("abc");' },
  { name: 'fetchProducts', category: 'Services', description: 'Fetch the products catalog.', signature: '() => Promise<Product[]>', example: 'const products = await fetchProducts();' },
  { name: 'recordImpression', category: 'Services', description: 'Record a campaign impression event.', signature: '(campaignId: string, type: string) => Promise<void>', example: 'await recordImpression("abc", "view");' },
  { name: 'trackImpression', category: 'Services', description: 'Track impression with additional metadata.', signature: '(campaignId: string, metadata: Record<string, unknown>) => Promise<void>', example: 'await trackImpression("abc", { source: "hero" });' },
  { name: 'trackClick', category: 'Services', description: 'Track a campaign click event.', signature: '(campaignId: string) => Promise<void>', example: 'await trackClick("abc");' },
  { name: 'fetchBroadcasts', category: 'Services', description: 'Fetch all broadcast notifications.', signature: '() => Promise<BroadcastNotification[]>', example: 'const broadcasts = await fetchBroadcasts();' },
  { name: 'fetchActiveBroadcasts', category: 'Services', description: 'Fetch only active broadcasts.', signature: '() => Promise<BroadcastNotification[]>', example: 'const active = await fetchActiveBroadcasts();' },
  { name: 'subscribeToBroadcasts', category: 'Services', description: 'Subscribe to real-time broadcast changes.', signature: '(callback: (broadcasts: BroadcastNotification[]) => void) => () => void', example: 'const unsub = subscribeToBroadcasts(setBroadcasts);' },
  { name: 'fetchFeatureFlags', category: 'Services', description: 'Fetch the feature flags document.', signature: '() => Promise<FeatureFlagsDocument | null>', example: 'const flags = await fetchFeatureFlags();' },
  { name: 'subscribeToFeatureFlags', category: 'Services', description: 'Subscribe to real-time feature flag changes.', signature: '(callback: (flags: FeatureFlagsDocument) => void) => () => void', example: 'const unsub = subscribeToFeatureFlags(setFlags);' },
  { name: 'checkFeatureAvailability', category: 'Services', description: 'Check if a feature is available for the current project.', signature: '(key: string) => Promise<boolean>', example: 'const available = await checkFeatureAvailability("v2");' },
  { name: 'isFeatureEnabled', category: 'Services', description: 'Synchronously check if feature is enabled from cache.', signature: '(key: string) => boolean', example: 'if (isFeatureEnabled("dark-mode")) { ... }' },
  { name: 'fetchContactInfo', category: 'Services', description: 'Fetch contact information document.', signature: '() => Promise<ContactInfo | null>', example: 'const info = await fetchContactInfo();' },
  { name: 'fetchDeveloperInfo', category: 'Services', description: 'Fetch developer profile document.', signature: '() => Promise<DeveloperInfo | null>', example: 'const dev = await fetchDeveloperInfo();' },
  { name: 'fetchSocialLinks', category: 'Services', description: 'Fetch social media links.', signature: '() => Promise<SocialLink[]>', example: 'const links = await fetchSocialLinks();' },
  { name: 'fetchAddressInfo', category: 'Services', description: 'Fetch address information.', signature: '() => Promise<AddressInfo | null>', example: 'const address = await fetchAddressInfo();' },
  { name: 'fetchPaymentOptions', category: 'Services', description: 'Fetch payment methods.', signature: '() => Promise<PaymentOption[]>', example: 'const payments = await fetchPaymentOptions();' },
  { name: 'fetchServices', category: 'Services', description: 'Fetch professional services.', signature: '() => Promise<Service[]>', example: 'const services = await fetchServices();' },
  { name: 'fetchSkills', category: 'Services', description: 'Fetch skills list.', signature: '() => Promise<Skill[]>', example: 'const skills = await fetchSkills();' },
  { name: 'fetchTestimonials', category: 'Services', description: 'Fetch testimonials.', signature: '() => Promise<Testimonial[]>', example: 'const testimonials = await fetchTestimonials();' },
  { name: 'fetchProjects', category: 'Services', description: 'Fetch portfolio projects.', signature: '() => Promise<Project[]>', example: 'const projects = await fetchProjects();' },

  // ---- Components ----
  { name: 'AdPanel', category: 'Components', description: 'Vertical panel showing a list of ad campaigns.', signature: '<AdPanel placement?: string; maxItems?: number />', example: '<AdPanel placement="sidebar" maxItems={3} />' },
  { name: 'AdSlider', category: 'Components', description: 'Auto-rotating carousel of campaign ads.', signature: '<AdSlider placement?: string; interval?: number />', example: '<AdSlider placement="hero" interval={5000} />' },
  { name: 'AdModal', category: 'Components', description: 'Fullscreen modal overlay for a campaign.', signature: '<AdModal campaign: Campaign; onClose: () => void />', example: '<AdModal campaign={campaign} onClose={dismiss} />' },
  { name: 'AdUpdateModal', category: 'Components', description: 'App update notification modal.', signature: '<AdUpdateModal campaign: Campaign; onClose: () => void />', example: '<AdUpdateModal campaign={campaign} onClose={dismiss} />' },
  { name: 'AdBanner', category: 'Components', description: 'Horizontal banner ad strip.', signature: '<AdBanner placement?: string />', example: '<AdBanner placement="top" />' },
  { name: 'BroadcastBanner', category: 'Components', description: 'Single broadcast notification banner.', signature: '<BroadcastBanner broadcast: BroadcastNotification; onDismiss?: () => void />', example: '<BroadcastBanner broadcast={broadcast} />' },
  { name: 'BroadcastBanners', category: 'Components', description: 'Stacked list of all banner broadcasts.', signature: '<BroadcastBanners />', example: '<BroadcastBanners />' },
  { name: 'AnnouncementModal', category: 'Components', description: 'Modal dialog for announcements.', signature: '<AnnouncementModal broadcast: BroadcastNotification; onClose: () => void />', example: '<AnnouncementModal broadcast={broadcast} onClose={close} />' },
  { name: 'ContactCard', category: 'Components', description: 'Display contact information in a card layout.', signature: '<ContactCard className?: string />', example: '<ContactCard />' },
  { name: 'DeveloperCard', category: 'Components', description: 'Developer profile card with avatar and bio.', signature: '<DeveloperCard className?: string />', example: '<DeveloperCard />' },
  { name: 'SocialLinksBar', category: 'Components', description: 'Horizontal bar of social media icons.', signature: '<SocialLinksBar className?: string />', example: '<SocialLinksBar />' },
  { name: 'AddressCard', category: 'Components', description: 'Physical address display card.', signature: '<AddressCard className?: string />', example: '<AddressCard />' },
  { name: 'SkillsDisplay', category: 'Components', description: 'Visual display of skills with proficiency bars.', signature: '<SkillsDisplay className?: string />', example: '<SkillsDisplay />' },
  { name: 'TestimonialsGrid', category: 'Components', description: 'Grid layout of client testimonials.', signature: '<TestimonialsGrid className?: string; columns?: number />', example: '<TestimonialsGrid columns={3} />' },
  { name: 'ServicesGrid', category: 'Components', description: 'Grid of professional services offered.', signature: '<ServicesGrid className?: string />', example: '<ServicesGrid />' },
  { name: 'FooterSection', category: 'Components', description: 'Pre-built footer with contact, social links, and credits.', signature: '<FooterSection className?: string />', example: '<FooterSection />' },

  // ---- Types ----
  { name: 'Campaign', category: 'Types', description: 'Ad campaign data structure with title, image, CTA, scheduling, and targeting.', signature: 'interface Campaign { id: string; title: string; description: string; imageUrl: string; ctaUrl: string; ctaText: string; placement: string; priority: number; active: boolean; startDate: Timestamp; endDate: Timestamp; }' },
  { name: 'Product', category: 'Types', description: 'Product catalog item for campaign references.', signature: 'interface Product { id: string; name: string; description: string; imageUrl: string; price: number; url: string; }' },
  { name: 'BroadcastNotification', category: 'Types', description: 'Broadcast notification with variant, severity, and scheduling.', signature: 'interface BroadcastNotification { id: string; title: string; message: string; variant: "banner" | "modal" | "toast" | "bell"; severity: "info" | "warning" | "error" | "success"; active: boolean; }' },
  { name: 'FeatureFlagsDocument', category: 'Types', description: 'Singleton document containing all feature flag states.', signature: 'interface FeatureFlagsDocument { flags: Record<string, boolean>; version: number; updatedAt: Timestamp; }' },
  { name: 'ContactInfo', category: 'Types', description: 'Contact information fields.', signature: 'interface ContactInfo { email: string; phone: string; whatsapp: string; }' },
  { name: 'DeveloperInfo', category: 'Types', description: 'Developer profile information.', signature: 'interface DeveloperInfo { name: string; title: string; bio: string; avatar: string; }' },
  { name: 'SocialLink', category: 'Types', description: 'Social media link entry.', signature: 'interface SocialLink { platform: string; url: string; icon: string; order: number; }' },
  { name: 'AddressInfo', category: 'Types', description: 'Physical address fields.', signature: 'interface AddressInfo { street: string; city: string; state: string; country: string; postalCode: string; }' },
  { name: 'PaymentOption', category: 'Types', description: 'Payment method details with type and instructions.', signature: 'interface PaymentOption { type: "bank" | "platform" | "wallet" | "crypto"; name: string; displayName: string; details: string; instructions: string; }' },
  { name: 'Service', category: 'Types', description: 'Professional service offered.', signature: 'interface Service { title: string; description: string; icon: string; price: string; }' },
  { name: 'Skill', category: 'Types', description: 'Skill with category and proficiency.', signature: 'interface Skill { name: string; category: string; proficiency: number; }' },
  { name: 'Testimonial', category: 'Types', description: 'Client testimonial or review.', signature: 'interface Testimonial { author: string; text: string; rating: number; avatar: string; company: string; }' },
  { name: 'Project', category: 'Types', description: 'Portfolio project with details and tags.', signature: 'interface Project { id: string; title: string; description: string; url: string; imageUrl: string; tags: string[]; category: string; }' },
];

const CATEGORIES: Array<{ label: string; value: Category | 'All'; icon: React.ReactNode }> = [
  { label: 'All', value: 'All', icon: <Layers className="h-3.5 w-3.5" /> },
  { label: 'Hooks', value: 'Hooks', icon: <Code2 className="h-3.5 w-3.5" /> },
  { label: 'Services', value: 'Services', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { label: 'Components', value: 'Components', icon: <Component className="h-3.5 w-3.5" /> },
  { label: 'Types', value: 'Types', icon: <FileType className="h-3.5 w-3.5" /> },
];

const CATEGORY_BADGE_VARIANTS: Record<Category, 'info' | 'success' | 'warning' | 'danger'> = {
  Hooks: 'info',
  Services: 'success',
  Components: 'warning',
  Types: 'danger',
};

/* -------------------------------------------------------------------------- */
/*  Expandable API Row                                                        */
/* -------------------------------------------------------------------------- */

function ApiRow({ member }: { member: ApiMember }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-lg border border-surface-200 bg-white transition-shadow hover:shadow-sm"
    >
      <button
        onClick={() => {
          setExpanded((p) => !p);
          trackClick(`api-expand-${member.name}`, 'api-reference');
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-left sm:px-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <code className="shrink-0 font-mono text-sm font-semibold text-surface-900">
            {member.name}
          </code>
          <Badge
            variant={CATEGORY_BADGE_VARIANTS[member.category]}
            size="sm"
            className="hidden shrink-0 sm:inline-flex"
          >
            {member.category}
          </Badge>
        </div>
        <span className="hidden flex-1 truncate text-sm text-surface-500 sm:block">
          {member.description}
        </span>
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-surface-400" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-surface-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-surface-100 px-4 pb-4 pt-3 sm:px-5">
              <p className="mb-3 text-sm text-surface-600 sm:hidden">
                {member.description}
              </p>
              <Badge
                variant={CATEGORY_BADGE_VARIANTS[member.category]}
                size="sm"
                className="mb-3 sm:hidden"
              >
                {member.category}
              </Badge>

              {member.signature && (
                <div className="mb-3">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-surface-400">
                    Signature
                  </p>
                  <div className="overflow-x-auto rounded-md border border-surface-800 bg-surface-900 px-3 py-2">
                    <code className="font-mono text-xs leading-relaxed text-surface-100">
                      {member.signature}
                    </code>
                  </div>
                </div>
              )}

              {member.example && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-surface-400">
                    Example
                  </p>
                  <div className="overflow-x-auto rounded-md border border-surface-800 bg-surface-900 px-3 py-2">
                    <code className="font-mono text-xs leading-relaxed text-emerald-300">
                      {member.example}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function ApiReferencePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    trackPageView('/docs/api', 'API Reference');
  }, []);

  const filtered = useMemo(() => {
    let results = API_MEMBERS;

    if (activeCategory !== 'All') {
      results = results.filter((m) => m.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q),
      );
    }

    return results;
  }, [search, activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: API_MEMBERS.length };
    API_MEMBERS.forEach((m) => {
      map[m.category] = (map[m.category] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-white">
      {/* Hero */}
      <div className="border-b border-surface-200 bg-white">
        <Container className="py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link to="/docs">
                <ArrowLeft className="h-4 w-4" />
                Back to Docs
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500 shadow-md">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-surface-900 lg:text-4xl">
                  API Reference
                </h1>
                <p className="font-body text-sm text-surface-500">
                  {APP_NAME} &middot; {API_MEMBERS.length} API members
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-2xl font-body text-lg text-surface-600">
              Complete reference for every hook, service function, component, and
              type exported by the package.
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Search & filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="sticky top-16 z-20 -mx-4 mb-6 rounded-b-xl border-b border-surface-200 bg-white/90 px-4 py-4 backdrop-blur sm:-mx-0 sm:rounded-xl sm:border sm:shadow-sm"
        >
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search hooks, services, components, types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2.5 pl-10 pr-4 font-body text-sm text-surface-900 outline-none transition-colors placeholder:text-surface-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  trackClick(`api-filter-${cat.value}`, 'api-reference');
                }}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                  activeCategory === cat.value
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200',
                )}
              >
                {cat.icon}
                {cat.label}
                <span
                  className={cn(
                    'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    activeCategory === cat.value
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-200 text-surface-500',
                  )}
                >
                  {counts[cat.value] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <Search className="mx-auto mb-3 h-10 w-10 text-surface-300" />
              <p className="font-display text-lg font-semibold text-surface-700">
                No results found
              </p>
              <p className="text-sm text-surface-500">
                Try a different search term or filter category.
              </p>
            </motion.div>
          )}

          {filtered.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.3 }}
            >
              <ApiRow member={member} />
            </motion.div>
          ))}
        </div>

        {/* Counts summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {(['Hooks', 'Services', 'Components', 'Types'] as Category[]).map((cat) => (
            <div
              key={cat}
              className="rounded-xl border border-surface-200 bg-white p-4 text-center"
            >
              <p className="font-display text-2xl font-bold text-surface-900">
                {counts[cat]}
              </p>
              <p className="text-sm text-surface-500">{cat}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
