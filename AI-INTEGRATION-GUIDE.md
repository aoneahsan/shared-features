# AI Integration Guide — shared-features

A precise reference for coding agents (Claude Code, Cursor, Copilot) integrating `shared-features` into a
React application. Every signature below was read from the built `.d.ts` files, not from prose.

Human-facing overview: [README](https://github.com/aoneahsan/shared-features/blob/main/README.md).
Full documentation: [shared-features-docs.aoneahsan.com](https://shared-features-docs.aoneahsan.com).

## Before you write any code

1. **This package talks to one specific Firebase project** — the shared `aoneahsan.com` backend. Without its
   web config in the environment, every hook returns empty and every component renders `null`. That is the
   designed behaviour, not a failure. Do not add error handling for it.
2. **Guard the init call on the API key.** The app must boot cleanly when the config is absent.
3. **Radix Themes is required for the UI.** Components must be inside `<Theme>` with
   `@radix-ui/themes/styles.css` imported once, or they render unstyled.
4. **Client-only.** No SSR. Render behind a client-side guard in Next.js or similar.

## Install

```bash
yarn add shared-features
yarn add react react-dom firebase @radix-ui/themes @radix-ui/react-icons lucide-react zustand
# Capacitor apps only — persists dismissals and frequency caps across restarts:
yarn add @capacitor/preferences && npx cap sync
```

## Environment

```env
VITE_SHARED_FEATURES_API_KEY=
VITE_SHARED_FEATURES_AUTH_DOMAIN=
VITE_SHARED_FEATURES_PROJECT_ID=
VITE_SHARED_FEATURES_STORAGE_BUCKET=
VITE_SHARED_FEATURES_MESSAGING_SENDER_ID=
VITE_SHARED_FEATURES_APP_ID=
VITE_SHARED_FEATURES_MEASUREMENT_ID=
```

These are Firebase **web** config values — client-public by design, not secrets. They are not published;
request them at [the issue tracker](https://github.com/aoneahsan/shared-features/issues).

## Initialise

```ts
import { initSharedFeatures } from 'shared-features';

if (import.meta.env.VITE_SHARED_FEATURES_API_KEY) {
  await initSharedFeatures({
    firebaseConfig: {
      apiKey: import.meta.env.VITE_SHARED_FEATURES_API_KEY,
      authDomain: import.meta.env.VITE_SHARED_FEATURES_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_SHARED_FEATURES_PROJECT_ID,
      storageBucket: import.meta.env.VITE_SHARED_FEATURES_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_SHARED_FEATURES_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_SHARED_FEATURES_APP_ID,
      measurementId: import.meta.env.VITE_SHARED_FEATURES_MEASUREMENT_ID,
    },
    projectId: 'my-app',        // must match the id registered in the admin panel
    projectName: 'My App',
    platform: 'web',            // 'web' | 'android' | 'ios' | 'extension'
    debug: import.meta.env.DEV, // optional
  });
}
```

`initSharedFeatures` returns `Promise<{ app: FirebaseApp; db: Firestore; auth: Auth }>`. It creates a
**secondary** Firebase app named `shared-features`, so the host app's own Firebase instance is untouched.

## Entry points

| Import | Contains |
|---|---|
| `shared-features` | everything, re-exported |
| `shared-features/components` | ad, broadcast and common-feature components |
| `shared-features/hooks` | every React hook |
| `shared-features/services` | direct Firestore reads, writes, analytics |
| `shared-features/types` | types only |
| `shared-features/notifications` | notification event registry and template engine |

## Components — exact props

Every component returns `JSX.Element | null` and renders `null` when it has nothing to show.

| Component | Props |
|---|---|
| `AdPanel` | `placement: AdPlacement` (**required**), `variant?: SmallPanelVariant`, `className?` |
| `AdSlider` | `placement?: AdPlacement` (default `footer_slider`), `className?`, `style?` |
| `AdBanner` | `placement?` (default `home_banner`), `rotationInterval?` (default `10000`), `maxCampaigns?`, `dismissible?`, `dismissDuration?: 'session' \| 'persistent'`, `className?`, `style?` |
| `TopbarAdBanner` | see `TopbarAdBannerProps` |
| `AdCarousel` | see `AdCarouselProps` |
| `AdModal` | `placement?` (default `onetime_modal`), `onClose?`, `welcomeTitle?`, `welcomeDescription?` |
| `AdUpdateModal` | `placement?` (default `update_modal`), `maxCampaigns?`, `autoAdvanceInterval?`, `onClose?` |
| `BroadcastBanner` | `broadcast: BroadcastNotification` — **one** broadcast, `onActionClick?`, `onDismiss?`, `className?` |
| `BroadcastBanners` | `broadcasts: BroadcastNotification[]`, `onDismiss?: (id: string) => void`, `onActionClick?: (id: string) => void`, `maxBanners?`, `className?` |
| `AnnouncementModal` | `broadcast`, `isOpen`, `onClose`, `onActionClick` — all controlled by the caller |

> `BroadcastBanner` takes a single `broadcast`. Passing a `broadcasts` array is the most common mistake —
> use `BroadcastBanners` for a list.

```tsx
import { AdPanel, BroadcastBanners, useBannerBroadcasts } from 'shared-features';

<AdPanel placement="sidebar_panel" variant="small_panel_2" />;

function TopOfPage() {
  const { broadcasts, dismissBroadcast, trackClick } = useBannerBroadcasts();
  return (
    <BroadcastBanners
      broadcasts={broadcasts}
      onDismiss={dismissBroadcast}
      onActionClick={trackClick}
      maxBanners={3}
    />
  );
}
```

## Hooks — exact returns

| Hook | Returns |
|---|---|
| `useCampaigns(options)` | `{ campaigns, campaign, loading, error, refetch, recordImpression, recordClick, recordClose }` |
| `useCampaign(options)` | same shape; options omit `maxCampaigns` |
| `useOneTimeAdModal()` | `{ shouldShow: boolean, markAsShown: () => void }` |
| `useUpdateAdModal(currentVersion?)` | `{ shouldShow, previousVersion, currentVersion, markAsShown }` |
| `useBroadcasts(options?)` | `{ broadcasts, isLoading, error, dismissBroadcast, trackImpression, trackClick, isDismissed, refresh }` |
| `useBannerBroadcasts` · `useModalBroadcasts` · `useToastBroadcasts` · `useBellBroadcasts` | same as `useBroadcasts`, variant pre-set |
| `useSingleBroadcast(options?)` | `{ broadcast, isLoading, error, dismiss, trackImpression, trackClick, isDismissed }` |
| `useFeatureFlags(options?)` | `{ status, loading, error, refetch, isFeatureAvailable, getFeatureAvailability, hasDeprecatedFeatures, hasUpgradeRequired }` |
| `useFeature(featureId)` | `{ available, loading, availability, enabled, deprecated, upgradeRequired, deprecationWarning, unavailableReason }` |
| `useFeatureGate(featureId)` | `{ shouldRender, loading, deprecated, FallbackOrChildren }` |

These hooks do **not** return `markAsRead`, `AdModalComponent` or `UpdateModalComponent`. The modal hooks
return visibility state; you render the modal yourself.

Loading state is `isLoading` on the broadcast hooks and `loading` on the campaign and flag hooks. They differ.

```tsx
import { AdModal, useOneTimeAdModal } from 'shared-features';

function App() {
  const { shouldShow, markAsShown } = useOneTimeAdModal();
  return shouldShow ? <AdModal onClose={markAsShown} /> : null;
}
```

## Services — exact signatures

```ts
// Campaigns
fetchCampaigns(options?: FetchCampaignsOptions): Promise<Campaign[]>;
fetchActiveCampaigns(placement: AdPlacement): Promise<CampaignWithProduct[]>;
getCampaignById(campaignId: string): Promise<Campaign | null>;
fetchProducts(): Promise<Product[]>;

// Analytics — placement and variant are required
trackImpression(campaignId, productId, placement, variant, frequencyDays?): Promise<void>;
trackClick(campaignId, productId, placement, variant): Promise<void>;
trackClose(campaignId, productId, placement, variant): Promise<void>;

// Broadcasts
fetchBroadcasts(options?: FetchBroadcastsOptions): Promise<BroadcastNotification[]>;
subscribeToBroadcasts(cb: (b: BroadcastNotification[]) => void, options?): Unsubscribe;
dismissBroadcast(broadcastId: string): Promise<void>;

// Feature flags
fetchFeatureFlags(forceRefresh?: boolean): Promise<FeatureFlagsDocument | null>;
subscribeToFeatureFlags(cb: (f: FeatureFlagsDocument | null) => void): Unsubscribe;
checkFeatureAvailability(featureId, consumerVersions?): Promise<FeatureAvailability>;
```

There is no `getCampaigns` (it is `fetchCampaigns`) and no `trackDismissal` (it is `trackClose`).
Both `subscribe*` functions return an `Unsubscribe` — call it on unmount.

Admin write services (`createBroadcast`, `publishBroadcast`, `saveContactInfo`, …) exist for building an
admin UI and are rejected by security rules for non-admin callers. Do not call them from a consumer app.

## Types

```ts
import type {
  SharedFeaturesConfig, FirebaseConfig, ConsumerPlatform, ConsumerFeatureVersions,
  FeatureId, FeatureAvailability, SharedFeaturesStatus,
  Campaign, CampaignWithProduct, Product, AdPlacement, AdVariant,
  SmallPanelVariant, LargePanelVariant,
  BroadcastNotification, BroadcastVariant, NotificationPriority,
  NotificationPlatform, NotificationTemplate,
} from 'shared-features';
```

There is no exported `Broadcast` type — it is `BroadcastNotification`. There is no exported `Platform` —
it is `ConsumerPlatform` (config, includes `'extension'`) or `NotificationPlatform` (targeting, does not).

```ts
type AdPlacement =
  | 'popup_slider' | 'options_panel' | 'onetime_modal' | 'update_modal'
  | 'notification' | 'footer_slider' | 'sidebar_panel' | 'home_banner' | 'topbar_banner';

type SmallPanelVariant =
  | 'small_panel_1' | 'small_panel_2' | 'small_panel_3' | 'small_panel_4' | 'small_panel_5';
type LargePanelVariant =
  | 'large_slider_1' | 'large_slider_2' | 'large_slider_3' | 'large_slider_4' | 'large_slider_5';

type BroadcastVariant = 'banner' | 'modal' | 'toast' | 'bell';
type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';   // 'normal', not 'medium'

type FeatureId =
  | 'campaigns' | 'broadcasts' | 'contactInfo' | 'developerInfo' | 'socialLinks'
  | 'paymentOptions' | 'addressInfo' | 'services' | 'skills' | 'testimonials' | 'projects';
```

## Patterns

```tsx
// Gate on initialisation before rendering anything from this package
import { isInitialized, AdPanel } from 'shared-features';

function Sidebar() {
  return <aside>{isInitialized() && <AdPanel placement="sidebar_panel" />}</aside>;
}
```

`getConfig()` returns `SharedFeaturesConfig` and **throws** when not initialised — check `isInitialized()`
first rather than catching.

Rendering campaigns yourself means recording analytics yourself; otherwise the campaign gets no impressions
and its frequency cap never advances:

```tsx
const { campaigns, recordImpression, recordClick } = useCampaigns({ placement: 'footer_slider' });
```

## Firestore collections (read-only reference)

| Collection | Holds |
|---|---|
| `zaions_feature_flags` | global feature configuration (single document) |
| `zaions_products` | product catalogue |
| `zaions_campaigns` | campaign targeting, placements, variants |
| `zaions_impressions` | ad impression and click analytics |
| `zaions_broadcasts` | broadcast content, targeting, scheduling |
| `zaions_broadcast_events` | broadcast analytics |
| `zaions_notification_templates` | reusable templates |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Everything renders `null`, no error | not initialised, or initialised after mount | call `initSharedFeatures` at module scope in the entry file; verify with `isInitialized()` |
| `getConfig()` throws | not initialised | guard with `isInitialized()` |
| Components unstyled | Radix Themes missing | wrap in `<Theme>`, import `@radix-ui/themes/styles.css` |
| No ads, flags fine | no campaign targets this `projectId`/`placement`, or frequency cap holding | check the admin panel; `projectId` must match exactly |
| Dismissals reset on mobile restart | `@capacitor/preferences` not installed | `yarn add @capacitor/preferences && npx cap sync` |
| `Missing or insufficient permissions` | an admin-only write, or wrong project config | admin services need an admin account |

## Links

- [README](https://github.com/aoneahsan/shared-features/blob/main/README.md)
- [Documentation](https://shared-features-docs.aoneahsan.com)
- [API reference](https://shared-features-docs.aoneahsan.com/reference/api-overview)
- [Issues](https://github.com/aoneahsan/shared-features/issues)
