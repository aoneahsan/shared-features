# shared-features

Centralized common features for Zaions projects. Manage ads, contacts, feature requests, and more from a single admin panel at [aoneahsan.com](https://aoneahsan.com).

## Features

- **Advertising Campaigns** - Cross-promote Zaions products across all projects
  - 5 Ad Components (AdPanel, AdSlider, AdModal, AdUpdateModal, AdBanner)
  - 10 Display Variants (5 small, 5 large)
  - Frequency capping and analytics
- **Products Catalog** - Centralized product information
- **Contact Forms** - (Coming soon)
- **Feature Requests** - (Coming soon)
- **Payment Options** - (Coming soon)
- **Social Links** - (Coming soon)
- **Developer Info** - (Coming soon)

## Installation

```bash
yarn add shared-features
```

## Peer Dependencies

This package requires the following peer dependencies:

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

## Usage

### Displaying Ads

```tsx
import { AdPanel, useCampaigns } from 'shared-features';

// Simple panel in sidebar
function Sidebar() {
  return <AdPanel placement="sidebar_panel" />;
}

// Custom implementation with hook
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

### Available Placements

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

### Available Variants

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

## API Reference

### `initSharedFeatures(config)`

Initialize the package with your configuration.

```typescript
interface SharedFeaturesConfig {
  firebaseConfig: FirebaseConfig;
  projectId: string;
  projectName: string;
  platform: 'web' | 'android' | 'ios' | 'extension';
  debug?: boolean;
}
```

### `useCampaigns(options)`

Hook to fetch and manage campaigns.

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
  recordImpression: (campaign: CampaignWithProduct) => Promise<void>;
  recordClick: (campaign: CampaignWithProduct) => Promise<void>;
  recordClose: (campaign: CampaignWithProduct) => Promise<void>;
}
```

### Components

#### `AdPanel`

Simple single-ad panel for sidebars and footers.

```tsx
<AdPanel placement="sidebar_panel" variant="small_panel_2" className="my-ad" />
```

#### `AdSlider`

Small promotional slider using small panel variants.

```tsx
<AdSlider placement="footer_slider" className="my-slider" />
```

#### `AdBanner`

Permanent promotional banner with auto-rotation and progress indicators.

```tsx
<AdBanner
  placement="home_banner"
  rotationInterval={10000}
  maxCampaigns={5}
/>
```

#### `AdModal`

One-time promotional modal shown on first visit.

```tsx
import { AdModal, useOneTimeAdModal } from 'shared-features';

function App() {
  const { shouldShow, markAsShown } = useOneTimeAdModal();

  return (
    <>
      {shouldShow && <AdModal onClose={markAsShown} />}
      {/* Your app content */}
    </>
  );
}
```

#### `AdUpdateModal`

Carousel modal shown when app version changes.

```tsx
import { AdUpdateModal, useUpdateAdModal } from 'shared-features';

function App() {
  const { shouldShow, currentVersion, markAsShown } = useUpdateAdModal();

  return (
    <>
      {shouldShow && <AdUpdateModal onClose={markAsShown} />}
      {/* Your app content */}
    </>
  );
}
```

### Modal Hooks

#### `useOneTimeAdModal()`

Manages one-time modal visibility (first visit).

```typescript
const { shouldShow, markAsShown } = useOneTimeAdModal();
```

#### `useUpdateAdModal(currentVersion?)`

Manages update modal visibility (version change).

```typescript
const { shouldShow, previousVersion, currentVersion, markAsShown } = useUpdateAdModal();
```

## Frequency Capping

Ads automatically respect frequency capping set in the admin panel. By default, each campaign is shown to a user once every 20 days. This is tracked locally using Capacitor Preferences (mobile) or localStorage (web).

## Admin Panel

All campaigns are managed through the admin panel at [aoneahsan.com/admin/campaigns](https://aoneahsan.com/admin/campaigns). Consumer projects only need read access.

## License

MIT - Ahsan Mahmood <aoneahsan@gmail.com>
