# shared-features

Centralized common features for Zaions projects. Manage ads, contacts, feature requests, and more from a single admin panel at [aoneahsan.com](https://aoneahsan.com).

## Features

- **Advertising Campaigns** - Cross-promote Zaions products across all projects
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
yarn add react react-dom firebase @radix-ui/themes zustand
# Optional for mobile:
yarn add @capacitor/preferences
```

## Setup

### 1. Initialize the package

```typescript
// src/config/shared-features.ts
import { initSharedFeatures } from 'shared-features';

export const sharedFeatures = initSharedFeatures({
  firebaseConfig: {
    apiKey: import.meta.env.VITE_ZAIONS_FIREBASE_API_KEY,
    authDomain: 'aoneahsan-portfolio.firebaseapp.com',
    projectId: 'aoneahsan-portfolio',
  },
  projectId: 'your-project-id',
  projectName: 'Your Project Name',
  platform: 'web', // or 'android', 'ios', 'extension'
  debug: import.meta.env.DEV,
});
```

### 2. Add environment variables

Create or update your `.env` file:

```env
# shared-features configuration
VITE_ZAIONS_FIREBASE_API_KEY=your-api-key
```

### 3. Initialize on app startup

```typescript
// src/main.tsx or src/App.tsx
import { initSharedFeatures } from 'shared-features';
import './config/shared-features'; // Import to initialize
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

### `AdPanel`

Component to display a single ad.

```tsx
<AdPanel
  placement="sidebar_panel"
  variant="small_panel_2"
  className="my-ad"
/>
```

## Frequency Capping

Ads automatically respect frequency capping set in the admin panel. By default, each campaign is shown to a user once every 20 days. This is tracked locally using Capacitor Preferences (mobile) or localStorage (web).

## Admin Panel

All campaigns are managed through the admin panel at [aoneahsan.com/admin/campaigns](https://aoneahsan.com/admin/campaigns). Consumer projects only need read access.

## License

MIT - Ahsan Mahmood <aoneahsan@gmail.com>
