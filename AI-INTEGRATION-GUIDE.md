# AI Integration Guide - shared-features

Quick reference for AI development agents (Claude Code, Cursor, Copilot, etc.) to integrate shared-features into React + Capacitor projects.

## Installation

```bash
yarn add shared-features
```

### Peer Dependencies
```bash
yarn add react react-dom firebase @radix-ui/themes zustand lucide-react
# Optional for mobile:
yarn add @capacitor/preferences
```

## Core Concepts

shared-features provides two main systems:
1. **Advertising Campaigns** - Cross-promotion of Zaions products
2. **Broadcasts/Notifications** - In-app announcements and alerts

## Quick Start

### 1. Add Environment Variables

```env
VITE_SHARED_FEATURES_API_KEY=
VITE_SHARED_FEATURES_AUTH_DOMAIN=
VITE_SHARED_FEATURES_PROJECT_ID=
VITE_SHARED_FEATURES_STORAGE_BUCKET=
VITE_SHARED_FEATURES_MESSAGING_SENDER_ID=
VITE_SHARED_FEATURES_APP_ID=
VITE_SHARED_FEATURES_MEASUREMENT_ID=
```

### 2. Initialize

```typescript
// src/main.tsx
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
    projectId: 'your-project-id',
    projectName: 'Your Project Name',
    platform: 'web', // 'web' | 'android' | 'ios' | 'extension'
    debug: import.meta.env.DEV,
  });
}
```

## Advertising Components

### AdPanel (Recommended)
Best for sidebars and feature areas.

```tsx
import { AdPanel } from 'shared-features';

// Small variant (sidebar)
<AdPanel variant="small" />

// Large variant (feature area)
<AdPanel variant="large" />
```

### AdSlider
Auto-rotating carousel of ads.

```tsx
import { AdSlider } from 'shared-features';

<AdSlider
  variant="small"
  autoRotate={true}
  interval={5000}
/>
```

### AdBanner
Horizontal banner for headers/footers.

```tsx
import { AdBanner } from 'shared-features';

<AdBanner />
```

### AdModal (One-time Welcome)
Shows once per product, great for onboarding.

```tsx
import { useOneTimeAdModal } from 'shared-features';

function App() {
  const { AdModalComponent } = useOneTimeAdModal();

  return (
    <>
      {AdModalComponent}
      {/* rest of app */}
    </>
  );
}
```

### AdUpdateModal (What's New)
Shows once per version update.

```tsx
import { useUpdateAdModal } from 'shared-features';

function App() {
  const { UpdateModalComponent } = useUpdateAdModal();

  return (
    <>
      {UpdateModalComponent}
      {/* rest of app */}
    </>
  );
}
```

## Broadcasts/Notifications

### BroadcastBanner
Alert banner at top of page.

```tsx
import { BroadcastBanner } from 'shared-features';

<BroadcastBanner position="top" />
```

### AnnouncementModal
Modal announcements.

```tsx
import { AnnouncementModal } from 'shared-features';

<AnnouncementModal />
```

### useBroadcasts Hook

```tsx
import { useBroadcasts } from 'shared-features';

function MyComponent() {
  const { broadcasts, loading, markAsRead, dismissBroadcast } = useBroadcasts();

  return broadcasts.map(broadcast => (
    <div key={broadcast.id}>
      <h3>{broadcast.title}</h3>
      <p>{broadcast.message}</p>
      <button onClick={() => dismissBroadcast(broadcast.id)}>Dismiss</button>
    </div>
  ));
}
```

## Hooks Reference

| Hook | Description | Returns |
|------|-------------|---------|
| `useCampaigns()` | Get active ad campaigns | `{ campaigns, loading, error }` |
| `useOneTimeAdModal()` | One-time product modal | `{ AdModalComponent }` |
| `useUpdateAdModal()` | Version update modal | `{ UpdateModalComponent }` |
| `useBroadcasts()` | Get active broadcasts | `{ broadcasts, loading, markAsRead, dismiss }` |

## Services

### Analytics Tracking

```typescript
import { trackImpression, trackClick, trackDismissal } from 'shared-features';

// Track ad impression
await trackImpression(campaignId, productId);

// Track ad click
await trackClick(campaignId, productId);

// Track dismissal
await trackDismissal(campaignId);
```

### Campaigns Service

```typescript
import { getCampaigns, getCampaignById } from 'shared-features';

// Get all active campaigns for current project
const campaigns = await getCampaigns();

// Get specific campaign
const campaign = await getCampaignById('campaign-id');
```

## Types

```typescript
import type {
  SharedFeaturesConfig,
  Campaign,
  Product,
  Broadcast,
  NotificationTemplate,
  AdVariant,
  Platform,
} from 'shared-features';
```

## Configuration Interface

```typescript
interface SharedFeaturesConfig {
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  projectId: string;      // Your project identifier
  projectName: string;    // Display name
  platform: 'web' | 'android' | 'ios' | 'extension';
  debug?: boolean;        // Enable debug logging
}
```

## Common Patterns

### Conditional Rendering (Check Initialization)

```tsx
import { isInitialized } from 'shared-features';

function AdSection() {
  if (!isInitialized()) {
    return null; // Don't render until initialized
  }

  return <AdPanel variant="small" />;
}
```

### Footer Ad Integration

```tsx
import { AdBanner, isInitialized } from 'shared-features';

function Footer() {
  return (
    <footer>
      {isInitialized() && <AdBanner />}
      <p>© 2026 Your Company</p>
    </footer>
  );
}
```

### Sidebar with Ads

```tsx
import { AdPanel, isInitialized } from 'shared-features';

function Sidebar() {
  return (
    <aside>
      <nav>{/* Navigation */}</nav>
      {isInitialized() && <AdPanel variant="small" />}
    </aside>
  );
}
```

## Firestore Collections (Reference)

| Collection | Purpose |
|------------|---------|
| `zaions_campaigns` | Ad campaigns data |
| `zaions_products` | Products being promoted |
| `zaions_impressions` | Ad impression analytics |
| `zaions_broadcasts` | Broadcast messages |
| `zaions_broadcast_events` | Broadcast analytics |
| `zaions_notification_templates` | Reusable templates |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Components not rendering | Check `isInitialized()` returns true |
| Firebase errors | Verify all 7 config fields are provided |
| No ads showing | Check projectId matches admin panel config |
| Styles missing | Ensure `@radix-ui/themes` is imported |

## Links

- [Full Documentation](./README.md)
- [Admin Panel](https://aoneahsan.com/admin)
