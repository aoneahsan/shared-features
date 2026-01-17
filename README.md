# shared-features

Centralized common features for Zaions projects. Manage ads, notifications, contacts, and more from a single admin panel at [aoneahsan.com](https://aoneahsan.com).

---

## Two Core Systems

This package provides **two separate systems** for cross-project communication:

| System | Purpose | Firestore Collections | Admin Location |
|--------|---------|----------------------|----------------|
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
  });
}
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
}
```

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
