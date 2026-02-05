# shared-features

- **[AI Integration Guide](./AI-INTEGRATION-GUIDE.md)** - Quick reference for AI development agents (Claude, Cursor, Copilot)

Centralized common features for Zaions projects. Manage ads, notifications, contacts, and more from a single admin panel at [aoneahsan.com](https://aoneahsan.com).

---

## Three Core Systems

This package provides **three systems** for cross-project feature management:

| System | Purpose | Firestore Collections | Admin Location |
|--------|---------|----------------------|----------------|
| **Feature Flags** | Version management, feature toggles | `zaions_feature_flags` | `/admin/settings` |
| **Advertising Campaigns** | Promote Zaions products across apps | `zaions_campaigns`, `zaions_products`, `zaions_impressions` | `/admin/campaigns` |
| **Broadcasts/Notifications** | In-app notifications, announcements, alerts | `zaions_broadcasts`, `zaions_broadcast_events`, `zaions_notification_templates` | `/admin/notifications` |

### When to Use Which?

| Use Case | System |
|----------|--------|
| Promote ZTools in other apps | **Advertising Campaigns** |
| Announce new feature to all users | **Broadcasts** |
| Cross-sell products | **Advertising Campaigns** |
| Maintenance notice | **Broadcasts** |
| Product ads in footer/sidebar | **Advertising Campaigns** |
| Alert banners at top of page | **Broadcasts** |
| One-time welcome modal for products | **Advertising Campaigns** |
| One-time announcement modal | **Broadcasts** |

---

## Features

### Advertising Campaigns System
- **5 Ad Components** - AdPanel, AdSlider, AdModal, AdUpdateModal, AdBanner
- **10 Display Variants** - 5 small (compact), 5 large (feature areas)
- **Frequency capping** - Control how often users see ads
- **Analytics** - Track impressions, clicks, CTR per project
- **Project targeting** - Target specific projects or all

### Broadcasts/Notifications System
- **4 Notification Types** - Banner, Modal, Toast, Bell (notification center)
- **Priority levels** - Low, Medium, High, Urgent
- **Scheduling** - Immediate or scheduled delivery
- **Templates** - Reusable notification templates
- **Analytics** - Track views, clicks, dismissals

---

## Installation

```bash
yarn add shared-features
```

## Peer Dependencies

```bash
yarn add react react-dom firebase @radix-ui/themes zustand lucide-react
# Optional for mobile:
yarn add @capacitor/preferences
```

## Setup

### 1. Add environment variables

```env
# aoneahsan.com Firebase config (get from admin)
VITE_SHARED_FEATURES_API_KEY=
VITE_SHARED_FEATURES_AUTH_DOMAIN=
VITE_SHARED_FEATURES_PROJECT_ID=
VITE_SHARED_FEATURES_STORAGE_BUCKET=
VITE_SHARED_FEATURES_MESSAGING_SENDER_ID=
VITE_SHARED_FEATURES_APP_ID=
VITE_SHARED_FEATURES_MEASUREMENT_ID=
```

### 2. Initialize the package

```typescript
// src/main.tsx or src/App.tsx
import { initSharedFeatures } from 'shared-features';

if (import.meta.env.VITE_SHARED_FEATURES_API_KEY) {
  initSharedFeatures({
    firebaseConfig: {
      apiKey: import.meta.env.VITE_SHARED_FEATURES_API_KEY,
      authDomain: import.meta.env.VITE_SHARED_FEATURES_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_SHARED_FEATURES_PROJECT_ID,
      storageBucket: import.meta.env.VITE_SHARED_FEATURES_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_SHARED_FEATURES_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_SHARED_FEATURES_APP_ID,
      measurementId: import.meta.env.VITE_SHARED_FEATURES_MEASUREMENT_ID,
    },
    projectId: 'your-project-id',   // e.g., 'ztools', '2fa-studio'
    projectName: 'Your Project Name', // e.g., 'ZTools', '2FA Studio'
    platform: 'web', // or 'android', 'ios', 'extension'
    debug: import.meta.env.DEV, // optional
    // Optional: Lock to specific feature versions
    featureVersions: {
      campaigns: 1,
      broadcasts: 1,
    },
  });
}
```

---

# FEATURE FLAGS SYSTEM

Manage feature availability, versioning, and breaking changes across all consumer projects.

## Why Feature Flags?

- **Version Control**: Roll out breaking changes gradually
- **Feature Toggles**: Enable/disable features globally
- **Deprecation Warnings**: Warn consumers about outdated versions
- **Maintenance Mode**: Show maintenance messages across all apps
- **Platform/Project Targeting**: Enable features for specific platforms or projects

## Firestore Collection

| Collection | Purpose | Access |
|------------|---------|--------|
| `zaions_feature_flags` | Global feature configuration (singleton) | Public read, Admin write |

## Checking Feature Availability

### Check Overall Status

```tsx
import { useFeatureFlags } from 'shared-features';

function App() {
  const { status, loading, isFeatureAvailable, hasDeprecatedFeatures } = useFeatureFlags();

  if (loading) return <Spinner />;

  // Handle maintenance mode
  if (status?.maintenanceMode) {
    return <MaintenancePage message={status.maintenanceMessage} />;
  }

  // Warn about deprecated features
  if (hasDeprecatedFeatures) {
    console.warn('Some features are deprecated:', status?.deprecatedFeatures);
  }

  // Check specific feature
  if (isFeatureAvailable('contactInfo')) {
    return <ContactInfo />;
  }

  return <App />;
}
```

### Check Single Feature

```tsx
import { useFeature } from 'shared-features';

function ContactSection() {
  const { available, loading, deprecated, deprecationWarning } = useFeature('contactInfo');

  if (loading) return <Spinner />;
  if (!available) return <LegacyContactInfo />;

  if (deprecated) {
    console.warn(deprecationWarning);
  }

  return <NewContactInfo />;
}
```

### Conditional Rendering with Feature Gates

```tsx
import { useFeatureGate } from 'shared-features';

function MyComponent() {
  const { shouldRender, FallbackOrChildren } = useFeatureGate('socialLinks');

  return (
    <FallbackOrChildren fallback={<OldSocialLinks />}>
      <NewSocialLinks />
    </FallbackOrChildren>
  );
}
```

### Real-time Updates

```tsx
import { useFeatureFlagsSubscription } from 'shared-features';

function App() {
  useFeatureFlagsSubscription((status) => {
    if (status?.maintenanceMode) {
      showMaintenanceBanner(status.maintenanceMessage);
    }
  });

  return <YourApp />;
}
```

## Available Features

| Feature ID | Description | Status |
|------------|-------------|--------|
| `campaigns` | Advertising campaigns | ✅ Enabled |
| `broadcasts` | Broadcast notifications | ✅ Enabled |
| `contactInfo` | Contact information | ⏳ Coming Soon |
| `developerInfo` | Developer information | ⏳ Coming Soon |
| `socialLinks` | Social media links | ⏳ Coming Soon |
| `paymentOptions` | Payment methods | ⏳ Coming Soon |
| `addressInfo` | Address information | ⏳ Coming Soon |
| `services` | Professional services | ⏳ Coming Soon |
| `skills` | Skills display | ⏳ Coming Soon |
| `testimonials` | Client testimonials | ⏳ Coming Soon |
| `projects` | Portfolio projects | ⏳ Coming Soon |

## Feature Versioning

When breaking changes are introduced:

1. Admin bumps feature version in `zaions_feature_flags`
2. Consumers using old version get deprecation warnings
3. Once `minVersion` is bumped, old consumers get `upgradeRequired: true`
4. Consumers update their code and bump `featureVersions` in config

```typescript
// Consumer specifies supported versions
initSharedFeatures({
  // ... other config
  featureVersions: {
    campaigns: 1,    // Using v1 API
    broadcasts: 1,   // Using v1 API
    contactInfo: 2,  // Updated to v2 API
  },
});
```

---

# ADVERTISING CAMPAIGNS SYSTEM

Cross-promote Zaions products (ZTools, FilesHub, etc.) across all projects.

## Firestore Collections

| Collection | Purpose | Access |
|------------|---------|--------|
| `zaions_products` | Product catalog (name, URL, icon, features) | Public read, Admin write |
| `zaions_campaigns` | Campaign settings (targeting, placements, variants) | Public read, Admin write |
| `zaions_impressions` | Analytics (impressions, clicks per campaign) | Public create, Admin read |

## Displaying Ads

### Simple Usage

```tsx
import { AdPanel, AdSlider } from 'shared-features';

// Sidebar panel
<AdPanel placement="sidebar_panel" />

// Footer slider
<AdSlider placement="footer_slider" />
```

### Custom Implementation

```tsx
import { useCampaigns } from 'shared-features';

function Footer() {
  const { campaigns, loading, recordImpression, recordClick } = useCampaigns({
    placement: 'footer_slider',
    maxCampaigns: 5,
  });

  if (loading || campaigns.length === 0) return null;

  return (
    <div>
      {campaigns.map(campaign => (
        <div
          key={campaign.id}
          onMouseEnter={() => recordImpression(campaign)}
          onClick={() => {
            recordClick(campaign);
            window.open(campaign.product.url, '_blank');
          }}
        >
          <h3>{campaign.product.name}</h3>
          <p>{campaign.product.tagline}</p>
        </div>
      ))}
    </div>
  );
}
```

## Ad Placements

| Placement | Description | Recommended Variant |
|-----------|-------------|-------------------|
| `popup_slider` | Extension popup | Small variants |
| `options_panel` | Extension options page | Small variants |
| `onetime_modal` | First-visit welcome modal | Large variants |
| `update_modal` | Version update modal | Large variants |
| `notification` | Push notification | - |
| `footer_slider` | Web app footer | Small variants |
| `sidebar_panel` | Web app sidebar | Small variants |
| `home_banner` | Home page hero | Large variants |

## Ad Variants

**Small Variants (compact spaces):**
- `small_panel_1` - Minimal
- `small_panel_2` - Tagline
- `small_panel_3` - Features
- `small_panel_4` - Gradient
- `small_panel_5` - Card

**Large Variants (feature areas):**
- `large_slider_1` - Hero
- `large_slider_2` - Feature Grid
- `large_slider_3` - Testimonial
- `large_slider_4` - Comparison
- `large_slider_5` - Video Placeholder

## Ad Components

### `AdPanel`
Simple single-ad panel for sidebars and footers.
```tsx
<AdPanel placement="sidebar_panel" variant="small_panel_2" />
```

### `AdSlider`
Small promotional slider with auto-rotation.
```tsx
<AdSlider placement="footer_slider" />
```

### `AdBanner`
Permanent promotional banner with progress indicators.
```tsx
<AdBanner placement="home_banner" rotationInterval={10000} maxCampaigns={5} />
```

### `AdModal`
One-time promotional modal shown on first visit.
```tsx
import { AdModal, useOneTimeAdModal } from 'shared-features';

function App() {
  const { shouldShow, markAsShown } = useOneTimeAdModal();
  return shouldShow ? <AdModal onClose={markAsShown} /> : null;
}
```

### `AdUpdateModal`
Carousel modal shown when app version changes.
```tsx
import { AdUpdateModal, useUpdateAdModal } from 'shared-features';

function App() {
  const { shouldShow, markAsShown } = useUpdateAdModal();
  return shouldShow ? <AdUpdateModal onClose={markAsShown} /> : null;
}
```

---

# BROADCASTS/NOTIFICATIONS SYSTEM

Send in-app notifications, announcements, and alerts across all projects.

## Firestore Collections

| Collection | Purpose | Access |
|------------|---------|--------|
| `zaions_broadcasts` | Notification content, targeting, scheduling | Public read, Admin write |
| `zaions_broadcast_events` | Analytics (views, clicks, dismissals) | Public create, Admin read |
| `zaions_notification_templates` | Reusable notification templates | Admin only |

## Displaying Broadcasts

### Banner Notifications (Top of Page)

```tsx
import { BroadcastBanner, useBannerBroadcasts } from 'shared-features';

function App() {
  const { broadcasts, dismissBroadcast, trackClick } = useBannerBroadcasts();

  return (
    <>
      <BroadcastBanner
        broadcasts={broadcasts}
        onDismiss={dismissBroadcast}
        onClick={trackClick}
      />
      {/* Your app content */}
    </>
  );
}
```

### Modal Notifications

```tsx
import { useBroadcasts } from 'shared-features';

function App() {
  const { broadcasts, dismissBroadcast } = useBroadcasts({ variant: 'modal' });
  const modalBroadcast = broadcasts[0];

  if (!modalBroadcast) return <YourApp />;

  return (
    <Modal open onClose={() => dismissBroadcast(modalBroadcast.id)}>
      <h2>{modalBroadcast.title}</h2>
      <p>{modalBroadcast.message}</p>
    </Modal>
  );
}
```

### Toast Notifications

```tsx
import { useBroadcasts } from 'shared-features';

function App() {
  const { broadcasts, dismissBroadcast } = useBroadcasts({ variant: 'toast' });

  return (
    <>
      <YourApp />
      {broadcasts.map(toast => (
        <Toast key={toast.id} onClose={() => dismissBroadcast(toast.id)}>
          {toast.message}
        </Toast>
      ))}
    </>
  );
}
```

## Broadcast Variants

| Variant | Use Case |
|---------|----------|
| `banner` | Persistent notification at top of page |
| `modal` | Important announcement requiring attention |
| `toast` | Brief notification that auto-dismisses |
| `bell` | Notification center item |

## Broadcast Priority

| Priority | Use Case |
|----------|----------|
| `low` | General announcements |
| `medium` | Feature updates, tips |
| `high` | Important notices |
| `urgent` | Critical alerts, maintenance |

---

# API REFERENCE

## Initialization

### `initSharedFeatures(config)`

```typescript
interface SharedFeaturesConfig {
  firebaseConfig: FirebaseConfig;
  projectId: string;      // e.g., 'ztools'
  projectName: string;    // e.g., 'ZTools'
  platform: 'web' | 'android' | 'ios' | 'extension';
  debug?: boolean;
  featureVersions?: ConsumerFeatureVersions; // Optional version preferences
}
```

## Feature Flag Hooks

### `useFeatureFlags(options?)`

Check overall feature flags status.

```typescript
interface UseFeatureFlagsOptions {
  autoRefresh?: boolean;      // Auto-refresh flags periodically
  refreshInterval?: number;   // Refresh interval in ms (default: 5 min)
  autoFetch?: boolean;        // Fetch on mount (default: true)
}

interface UseFeatureFlagsResult {
  status: SharedFeaturesStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFeatureAvailable: (featureId: FeatureId) => boolean;
  getFeatureAvailability: (featureId: FeatureId) => FeatureAvailability | null;
  hasDeprecatedFeatures: boolean;
  hasUpgradeRequired: boolean;
}
```

### `useFeature(featureId)`

Check a single feature's availability.

```typescript
const {
  available,           // Feature can be used
  loading,             // Check in progress
  enabled,             // Feature is enabled (but might need upgrade)
  deprecated,          // Using deprecated version
  upgradeRequired,     // Must upgrade to use
  deprecationWarning,  // Warning message
  unavailableReason,   // Why unavailable
} = useFeature('contactInfo');
```

### `useFeatureGate(featureId)`

Conditional rendering helper.

```typescript
const { shouldRender, loading, deprecated, FallbackOrChildren } = useFeatureGate('socialLinks');
```

### `useFeatureFlagsSubscription(callback)`

Real-time feature flag updates.

### `useSharedFeaturesOperational()`

Quick check if shared-features is operational.

## Advertising Hooks

### `useCampaigns(options)`

```typescript
interface UseCampaignsOptions {
  placement: AdPlacement;
  maxCampaigns?: number;
  autoFetch?: boolean;
}

interface UseCampaignsResult {
  campaigns: CampaignWithProduct[];
  campaign: CampaignWithProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  recordImpression: (campaign) => Promise<void>;
  recordClick: (campaign) => Promise<void>;
  recordClose: (campaign) => Promise<void>;
}
```

### `useOneTimeAdModal()`
Manages first-visit modal visibility.

### `useUpdateAdModal(currentVersion?)`
Manages version-change modal visibility.

## Broadcast Hooks

### `useBroadcasts(options)`

```typescript
interface UseBroadcastsOptions {
  variant?: 'banner' | 'modal' | 'toast' | 'bell';
  maxBroadcasts?: number;
}

interface UseBroadcastsResult {
  broadcasts: BroadcastNotification[];
  isLoading: boolean;
  error: Error | null;
  dismissBroadcast: (id: string) => void;
  trackClick: (broadcast) => Promise<void>;
  refresh: () => Promise<void>;
}
```

### `useBannerBroadcasts()`
Convenience hook for banner broadcasts.

### `useModalBroadcasts()`
Convenience hook for modal broadcasts.

### `useToastBroadcasts()`
Convenience hook for toast broadcasts.

---

# ADMIN PANEL

Both systems are managed through the admin panel at aoneahsan.com:

| System | Admin URL | What You Manage |
|--------|-----------|-----------------|
| Advertising | `/admin/campaigns` | Products, Campaigns, Ad targeting |
| Notifications | `/admin/notifications` | Broadcasts, Templates, Scheduling |

---

## Frequency Capping

Both systems support frequency capping:
- **Ads**: Controlled per campaign (default: 20 days between impressions)
- **Broadcasts**: Dismissals are tracked, won't show again until dismissed list clears

Tracking uses Capacitor Preferences (mobile) or localStorage (web).

---

## License

MIT - Ahsan Mahmood <aoneahsan@gmail.com>
