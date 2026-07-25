<div align="center">

<img src="https://raw.githubusercontent.com/aoneahsan/shared-features/main/assets/logo.svg" alt="shared-features logo" width="120" />

<h1>shared-features</h1>

<p><strong>Feature flags, cross-promotion ads and in-app broadcasts for React apps, from one admin panel.</strong></p>

[![npm version](https://img.shields.io/npm/v/shared-features.svg)](https://www.npmjs.com/package/shared-features)
[![downloads](https://img.shields.io/npm/dm/shared-features.svg)](https://www.npmjs.com/package/shared-features)
[![license](https://img.shields.io/npm/l/shared-features.svg)](https://github.com/aoneahsan/shared-features/blob/main/LICENSE)
[![types](https://img.shields.io/npm/types/shared-features.svg)](https://www.npmjs.com/package/shared-features)
[![bundle size](https://img.shields.io/bundlephobia/minzip/shared-features.svg)](https://bundlephobia.com/package/shared-features)
[![node](https://img.shields.io/node/v/shared-features.svg)](https://nodejs.org)

[Docs](https://shared-features-docs.aoneahsan.com) · [npm](https://www.npmjs.com/package/shared-features) · [GitHub](https://github.com/aoneahsan/shared-features) · [Changelog](https://github.com/aoneahsan/shared-features/blob/main/CHANGELOG.md) · [AI Guide](https://github.com/aoneahsan/shared-features/blob/main/AI-INTEGRATION-GUIDE.md) · [Support](https://github.com/aoneahsan/shared-features/issues)

</div>

> [!IMPORTANT]
> This package is a **client for one specific Firebase project** — the shared `aoneahsan.com` backend. It reads
> its campaigns, broadcasts and feature flags from that project's Firestore collections, and it ships no server
> of its own. You need that project's Firebase web config to use it, and you get it by
> [asking the maintainer](https://github.com/aoneahsan/shared-features/issues). Without it, every hook returns
> empty and every component renders `null`. See [Why shared-features](#why-shared-features) before installing.

`shared-features` gives a fleet of React applications one place to control three things that would otherwise be
rebuilt in each of them: which features are switched on, which sibling products get promoted, and what
announcement is currently showing. An operator changes a document in the admin panel; every app that installed
this package picks it up on its next fetch, with no redeploy. It is a small, opinionated client for a shared
backend — not a general-purpose feature-flag platform.

| | |
|---|---|
| **Version** | `0.1.14` |
| **License** | MIT |
| **Node** | `>=24.13.0` (to build; consumers ship browser output) |
| **Platforms** | Web · Android · iOS · Browser extension |
| **Package size** | 142 kB packed · 771 kB unpacked · 78 files |
| **Types** | Bundled `.d.ts` (ESM + CJS), 6 entry points |
| **Status** | Pre-1.0 — the public API may change in a minor release |

<a id="table-of-contents"></a>
## 🧭 Table of Contents&nbsp;[#](#table-of-contents)

- [💡 Why shared-features](#why-shared-features)
- [✨ Features](#features)
- [📱 Platform Support](#platform-support)
- [📋 Requirements](#requirements)
- [📦 Installation](#installation)
- [🚀 Quick Start](#quick-start)
- [🛠️ Usage](#usage)
- [⚙️ Configuration](#configuration)
- [🔧 API Reference](#api-reference)
- [🧩 Types](#types)
- [🧪 Examples](#examples)
- [🎛️ Advanced Features](#advanced-features)
- [🚑 Recovery & Troubleshooting](#recovery-troubleshooting)
- [🚧 Limitations](#limitations)
- [📚 Documentation](#documentation)
- [🔄 Changelog](#changelog)
- [🤝 Contributing](#contributing)
- [🗂️ Repository](#repository)
- [💬 Support](#support)
- [📄 License](#license)
- [👤 Author](#author)
- [🔗 Links](#links)
- [🏷️ Keywords](#keywords)

<a id="why-shared-features"></a>
## 💡 Why shared-features&nbsp;[#](#why-shared-features)

Run more than two or three apps and the same three chores reappear in each one. Every app grows its own
"is this feature on yet" switch. Every app hand-codes the banner promoting the sibling product. Every app
needs a way to say "we are down for maintenance" without shipping a build. Three copies become ten, they
drift, and turning something off means ten deploys.

This package collapses those three into one Firestore-backed control plane. The apps stay dumb clients: they
call a hook, render a component, and honour whatever the admin panel currently says.

| | `shared-features` | Building it per app |
|---|---|---|
| Flipping a feature across every app | one admin document | one deploy per app |
| Cross-promotion | ten ad layouts, campaign targeting and analytics included | hand-built per app, per placement |
| Announcements | banner, modal, toast and bell variants out of the box | rebuilt per app |
| Analytics | impressions, clicks and dismissals recorded automatically | wired by hand, or skipped |
| Backend you operate | none — the shared project is already running | your own collections and rules |
| Backend you control | **none** — the maintainer operates it | entirely yours |

**Not the right tool when:**

- **You need a feature-flag service you own.** Flags live in the maintainer's Firebase project. If that
  matters — and for anything commercial it should — use Firebase Remote Config, LaunchDarkly, Unleash, or
  your own collection.
- **You are shipping one app.** The whole premise is amortising this work across a fleet. For a single app
  the indirection costs more than it saves.
- **You are not on React 19 with Radix Themes.** The components are built on both, and neither is optional
  for the UI layer.
- **You need offline-first behaviour.** Content is fetched from Firestore and cached in memory. There is no
  persistent offline store.
- **You need per-user targeting.** Targeting works at project, platform and campaign level. Individual users
  are only ever an anonymous device id.

<a id="features"></a>
## ✨ Features&nbsp;[#](#features)

- **Feature flags with versioning** — switch a capability on or off across every app, mark a version
  deprecated, or force an upgrade, from one document.
- **Maintenance mode** — a single flag every consuming app can read before it renders.
- **Cross-promotion campaigns** — promote sibling products with placement targeting and frequency capping,
  so the same user is not shown the same ad every visit.
- **Ten ad layouts** — five compact panel variants for sidebars and footers, five large ones for hero and
  modal areas, selectable per campaign or per call site.
- **Seven ad components** — panel, slider, banner, topbar banner, carousel, one-time modal and update modal.
- **Four broadcast variants** — banner, modal, toast and notification-bell, each with four priority levels
  and optional scheduling.
- **Notification event registry** — named events with reusable, variable-interpolated templates.
- **Built-in analytics** — impressions, clicks, closes and dismissals recorded without extra wiring.
- **Real-time subscriptions** — opt into Firestore listeners where a change needs to land immediately.
- **Six entry points** — import the root barrel, or just `./hooks`, `./components`, `./services`, `./types`
  or `./notifications`.
- **Typed throughout** — bundled declarations for both ESM and CJS, no `@types` package needed.

<a id="platform-support"></a>
## 📱 Platform Support&nbsp;[#](#platform-support)

| Platform | Supported | Notes |
|---|---|---|
| Web | ✅ | The primary target. Dismissal state is kept in `localStorage`. |
| Android (Capacitor) | ✅ | Install `@capacitor/preferences` so state survives a restart. |
| iOS (Capacitor) | ✅ | Same as Android. |
| Browser extension | ⚠️ | Pass `platform: 'extension'`. The Firebase SDK is bundled, never loaded from a CDN, so it satisfies the MV3 remote-code rule — but verify against your own store review. |
| React Native | ❌ | The components are DOM and Radix Themes based. |
| Node / SSR | ❌ | Hooks and components are client-only. Render them behind a client-side guard. |

<a id="requirements"></a>
## 📋 Requirements&nbsp;[#](#requirements)

| Requirement | Version | Why |
|---|---|---|
| Node | `>=24.13.0` | Build-time only, matching [`.nvmrc`](https://github.com/aoneahsan/shared-features/blob/main/.nvmrc). Published output runs in the browser. |
| `react` · `react-dom` | `>=19.2.3` | peer — components and hooks target the React 19 API. |
| `firebase` | `>=12.8.0` | peer — the Firestore client that reads every collection. |
| `@radix-ui/themes` | `>=3.2.1` | peer — every shipped component is built from Radix primitives. |
| `@radix-ui/react-icons` | `>=1.3.2` | peer — icons used inside those components. |
| `lucide-react` | `>=0.562.0` | peer — icons used by the common-feature components. |
| `zustand` | `>=5.0.10` | peer — internal state for dismissal and frequency tracking. |
| `@capacitor/preferences` | `>=8.0.0` | **optional** peer — native persistence. Falls back to `localStorage`. |
| Firebase config | — | The shared `aoneahsan.com` project's web config. Request it via [an issue](https://github.com/aoneahsan/shared-features/issues). |

Peers are peers deliberately: your app owns React, Firebase and Radix, and shipping a second copy of any of
them inside this package would break hooks and double your bundle.

<a id="installation"></a>
## 📦 Installation&nbsp;[#](#installation)

```bash
yarn add shared-features
```

Then the peer dependencies your app does not already have:

```bash
yarn add react react-dom firebase @radix-ui/themes @radix-ui/react-icons lucide-react zustand
```

On Capacitor, add the optional native storage peer so dismissals and frequency caps survive an app restart:

```bash
yarn add @capacitor/preferences
npx cap sync
```

Finally, put the shared Firebase config in your environment file. These are Firebase **web** config values —
client-public by design, not secrets — but they are not published here, so
[request them](https://github.com/aoneahsan/shared-features/issues) before you start:

```env
VITE_SHARED_FEATURES_API_KEY=
VITE_SHARED_FEATURES_AUTH_DOMAIN=
VITE_SHARED_FEATURES_PROJECT_ID=
VITE_SHARED_FEATURES_STORAGE_BUCKET=
VITE_SHARED_FEATURES_MESSAGING_SENDER_ID=
VITE_SHARED_FEATURES_APP_ID=
VITE_SHARED_FEATURES_MEASUREMENT_ID=
```

<a id="quick-start"></a>
## 🚀 Quick Start&nbsp;[#](#quick-start)

Initialise once at app start, then render an ad panel. Gating on the API key means the app still boots
cleanly when the config is absent — every hook simply returns empty.

```tsx
import { initSharedFeatures, AdPanel } from 'shared-features';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

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
    projectId: 'my-app',
    projectName: 'My App',
    platform: 'web',
  });
}

export default function App() {
  return (
    <Theme>
      <main>{/* your app */}</main>
      <AdPanel placement="sidebar_panel" />
    </Theme>
  );
}
```

`AdPanel` renders `null` until a campaign targeting `sidebar_panel` exists in the admin panel, so it is safe
to leave mounted from day one.

<a id="usage"></a>
## 🛠️ Usage&nbsp;[#](#usage)

### Gate a feature on a flag

```tsx
import { useFeature } from 'shared-features';

function ContactSection() {
  const { available, loading } = useFeature('contactInfo');

  if (loading) return null;
  return available ? <NewContactInfo /> : <LegacyContactInfo />;
}
```

### Respect maintenance mode

```tsx
import { useFeatureFlags } from 'shared-features';

function App() {
  const { status, loading } = useFeatureFlags();

  if (loading) return null;
  if (status?.maintenanceMode) return <Maintenance message={status.maintenanceMessage} />;
  return <Routes />;
}
```

### Show broadcast banners

`BroadcastBanner` renders **one** broadcast. Use `BroadcastBanners` for a stacked list.

```tsx
import { BroadcastBanners, useBannerBroadcasts } from 'shared-features';

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

### Show a welcome modal once

```tsx
import { AdModal, useOneTimeAdModal } from 'shared-features';

function App() {
  const { shouldShow, markAsShown } = useOneTimeAdModal();
  return shouldShow ? <AdModal onClose={markAsShown} /> : null;
}
```

### Render campaigns yourself

When the shipped layouts do not fit, take the data and render your own markup. Record the impression and the
click yourself, or the campaign gets no analytics and its frequency cap never advances.

```tsx
import { useCampaigns } from 'shared-features';

function Footer() {
  const { campaigns, recordImpression, recordClick } = useCampaigns({
    placement: 'footer_slider',
    maxCampaigns: 5,
  });

  return campaigns.map((campaign) => (
    <button
      key={campaign.id}
      onMouseEnter={() => recordImpression(campaign)}
      onClick={() => {
        recordClick(campaign);
        window.open(campaign.product.url, '_blank', 'noopener,noreferrer');
      }}
    >
      {campaign.product.name}
    </button>
  ));
}
```

Deeper walkthroughs live on the docs site —
[feature flags](https://shared-features-docs.aoneahsan.com/guides/feature-flags),
[campaigns](https://shared-features-docs.aoneahsan.com/guides/advertising-campaigns) and
[broadcasts](https://shared-features-docs.aoneahsan.com/guides/broadcasts).

<a id="configuration"></a>
## ⚙️ Configuration&nbsp;[#](#configuration)

Everything `initSharedFeatures` accepts:

| Option | Type | Default | What it does |
|---|---|---|---|
| `firebaseConfig` | `FirebaseConfig` | — | **Required.** The shared project's web config. Initialises a *secondary* Firebase app named `shared-features`, so your own Firebase app is untouched. |
| `projectId` | `string` | — | **Required.** Identifies this app to campaign and broadcast targeting. Must match the id registered in the admin panel. |
| `projectName` | `string` | — | **Required.** Display name used in analytics. |
| `platform` | `'web' \| 'android' \| 'ios' \| 'extension'` | — | **Required.** Drives platform targeting and selects the storage backend. |
| `debug` | `boolean` | `false` | Verbose logging. Pass `import.meta.env.DEV`. |
| `featureVersions` | `ConsumerFeatureVersions` | `{}` | Which API version of each feature this app implements. Lets the admin panel warn you before a breaking change lands, instead of after. |

Per-feature options — placements, variants, rotation intervals, frequency caps — are documented under
[Configuration](https://shared-features-docs.aoneahsan.com/getting-started/configuration).

<a id="api-reference"></a>
## 🔧 API Reference&nbsp;[#](#api-reference)

An index of the exported surface. Full signatures are on the docs site.

| Export | Signature | Docs |
|---|---|---|
| `initSharedFeatures` | `(config: SharedFeaturesConfig) => Promise<{ app; db; auth }>` | [→](https://shared-features-docs.aoneahsan.com/reference/initialization) |
| `isInitialized` | `() => boolean` | [→](https://shared-features-docs.aoneahsan.com/reference/initialization) |
| `getConfig` | `() => SharedFeaturesConfig` (throws if not initialised) | [→](https://shared-features-docs.aoneahsan.com/reference/initialization) |
| `getDeviceId` | `() => string \| null` | [→](https://shared-features-docs.aoneahsan.com/reference/initialization) |
| `useFeatureFlags` | `(options?: UseFeatureFlagsOptions) => UseFeatureFlagsResult` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useFeature` | `(featureId: FeatureId) => { available, loading, deprecated, … }` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useFeatureGate` | `(featureId: FeatureId) => { shouldRender, FallbackOrChildren, … }` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useCampaigns` | `(options: UseCampaignsOptions) => UseCampaignsResult` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useCampaign` | `(options: Omit<UseCampaignsOptions, 'maxCampaigns'>) => UseCampaignsResult` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useOneTimeAdModal` | `() => { shouldShow: boolean; markAsShown: () => void }` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useUpdateAdModal` | `(currentVersion?: string) => { shouldShow, previousVersion, currentVersion, markAsShown }` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useBroadcasts` | `(options?: UseBroadcastsOptions) => UseBroadcastsReturn` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `useBannerBroadcasts` · `useModalBroadcasts` · `useToastBroadcasts` · `useBellBroadcasts` | `(options?) => UseBroadcastsReturn` | [→](https://shared-features-docs.aoneahsan.com/reference/hooks) |
| `AdPanel` · `AdSlider` · `AdBanner` · `TopbarAdBanner` · `AdCarousel` · `AdModal` · `AdUpdateModal` | React components | [→](https://shared-features-docs.aoneahsan.com/reference/components) |
| `BroadcastBanner` · `BroadcastBanners` · `AnnouncementModal` | React components | [→](https://shared-features-docs.aoneahsan.com/reference/components) |
| `fetchCampaigns` · `fetchProducts` · `getCampaignById` | `() => Promise<…>` | [→](https://shared-features-docs.aoneahsan.com/reference/services) |
| `trackImpression` · `trackClick` · `trackClose` | `(campaignId, productId, placement, variant) => Promise<void>` — `trackImpression` takes a trailing `frequencyDays?` | [→](https://shared-features-docs.aoneahsan.com/reference/services) |
| `fetchBroadcasts` · `subscribeToBroadcasts` · `dismissBroadcast` | broadcast services; `subscribeToBroadcasts` returns an `Unsubscribe` | [→](https://shared-features-docs.aoneahsan.com/reference/services) |
| `fetchFeatureFlags` · `subscribeToFeatureFlags` · `checkFeatureAvailability` | flag services | [→](https://shared-features-docs.aoneahsan.com/reference/services) |

The complete list, including the admin-side write services, is at
[API overview](https://shared-features-docs.aoneahsan.com/reference/api-overview).

### Entry points

| Import | Contains |
|---|---|
| `shared-features` | everything below, re-exported |
| `shared-features/components` | the ad, broadcast and common-feature components |
| `shared-features/hooks` | every React hook |
| `shared-features/services` | direct Firestore reads, writes and analytics |
| `shared-features/types` | type definitions only |
| `shared-features/notifications` | the notification event registry and template engine |

<a id="types"></a>
## 🧩 Types&nbsp;[#](#types)

The types you touch when wiring the package up:

```ts
interface SharedFeaturesConfig {
  firebaseConfig: FirebaseConfig;
  projectId: string;
  projectName: string;
  platform: ConsumerPlatform;
  debug?: boolean;
  featureVersions?: ConsumerFeatureVersions;
}

type ConsumerPlatform = 'web' | 'android' | 'ios' | 'extension';

type FeatureId =
  | 'campaigns' | 'broadcasts' | 'contactInfo' | 'developerInfo'
  | 'socialLinks' | 'paymentOptions' | 'addressInfo' | 'services'
  | 'skills' | 'testimonials' | 'projects';

type AdPlacement =
  | 'popup_slider' | 'options_panel' | 'onetime_modal' | 'update_modal'
  | 'notification' | 'footer_slider' | 'sidebar_panel' | 'home_banner'
  | 'topbar_banner';

type SmallPanelVariant =
  | 'small_panel_1' | 'small_panel_2' | 'small_panel_3'
  | 'small_panel_4' | 'small_panel_5';

type LargePanelVariant =
  | 'large_slider_1' | 'large_slider_2' | 'large_slider_3'
  | 'large_slider_4' | 'large_slider_5';

type AdVariant = SmallPanelVariant | LargePanelVariant;

type BroadcastVariant = 'banner' | 'modal' | 'toast' | 'bell';
type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';
type NotificationPlatform = 'web' | 'android' | 'ios';
```

Note that `NotificationPlatform` has no `'extension'` member, while `ConsumerPlatform` does. An extension
app initialises with `platform: 'extension'`, but a broadcast cannot be targeted at extensions specifically.

Every exported type is listed at
[Types](https://shared-features-docs.aoneahsan.com/reference/types).

<a id="examples"></a>
## 🧪 Examples&nbsp;[#](#examples)

| Goal | Example |
|---|---|
| Get the package running end to end | [Quick start](https://shared-features-docs.aoneahsan.com/getting-started/quick-start) |
| Gate features and handle maintenance mode | [Feature flags guide](https://shared-features-docs.aoneahsan.com/guides/feature-flags) |
| Place ads and read their analytics | [Advertising campaigns guide](https://shared-features-docs.aoneahsan.com/guides/advertising-campaigns) |
| Ship banners, modals, toasts and a bell | [Broadcasts guide](https://shared-features-docs.aoneahsan.com/guides/broadcasts) |
| Trigger templated notification events | [Notification events guide](https://shared-features-docs.aoneahsan.com/guides/notification-events) |
| Copy-paste snippets | [Examples](https://shared-features-docs.aoneahsan.com/examples) |

<a id="advanced-features"></a>
## 🎛️ Advanced Features&nbsp;[#](#advanced-features)

- **Notification event registry** — register named events and trigger them by name, so message copy lives in
  a template rather than in your components. [→](https://shared-features-docs.aoneahsan.com/guides/notification-events)
- **Template interpolation** — `interpolate` and `interpolateWithFormatters` fill `{{variable}}` placeholders,
  with formatter support and validation of the supplied context.
- **Real-time subscriptions** — `subscribeToBroadcasts` and `subscribeToFeatureFlags` open Firestore listeners
  where polling is too slow. Both return an unsubscribe function; call it on unmount.
- **Admin write services** — `createBroadcast`, `publishBroadcast`, `scheduleBroadcast` and the common-feature
  CRUD functions exist for building an admin UI. They are rejected by security rules for non-admin callers.
- **Common-feature content** — contact details, social links, services, skills, testimonials and projects can
  be served from the same backend, with matching components. Availability is flag-controlled.
  [→](https://shared-features-docs.aoneahsan.com/guides/common-features)

<a id="recovery-troubleshooting"></a>
## 🚑 Recovery & Troubleshooting&nbsp;[#](#recovery-troubleshooting)

| Symptom | Cause | Fix |
|---|---|---|
| Every component renders nothing and no error appears | `initSharedFeatures` never ran, or ran after the components mounted | Call it before render — at module scope in your entry file. Confirm with `isInitialized()`. |
| `isInitialized()` is `false` even though you called init | The API key env var was empty, so your own `if` guard skipped the call | Check the variable is set and that your bundler exposes it (Vite only exposes a `VITE_`-prefixed name). |
| Components render unstyled or throw about a missing theme | Radix Themes is not mounted or its stylesheet is not imported | Wrap the tree in `<Theme>` and import `@radix-ui/themes/styles.css` once. |
| No ads appear, but flags work | No campaign targets this `projectId`/`placement`, or the frequency cap is still holding | Confirm the campaign in the admin panel, and that `projectId` matches exactly. |
| The same ad returns immediately after a reinstall | Frequency state is per device and lives in storage that was cleared | Expected. State is keyed on a generated device id, not an account. |
| Dismissals reset every time the mobile app restarts | `@capacitor/preferences` is not installed, so it fell back to web storage | `yarn add @capacitor/preferences && npx cap sync`. |
| `Missing or insufficient permissions` from Firestore | An admin-only write, or a config pointing at the wrong project | Admin services require an admin account. Verify `projectId` in `firebaseConfig`. |
| TypeScript cannot find the module's types | A build older than the fix in [Unreleased](https://github.com/aoneahsan/shared-features/blob/main/CHANGELOG.md) emitted declarations to the wrong path | Update to a release published after that entry, or import from a subpath. |

<a id="limitations"></a>
## 🚧 Limitations&nbsp;[#](#limitations)

Stated plainly, because finding these out after integrating is worse.

- **You do not control the backend.** Data lives in the maintainer's Firebase project. There is no
  self-hosted mode, and no migration path to one.
- **The config is not public.** You have to ask for it, so this is not a package you can evaluate in five
  minutes without contact.
- **Pre-1.0.** The API can change in a minor release. Pin an exact version if that matters.
- **React 19 and Radix Themes are hard requirements** for anything in `./components`. Hooks and services
  work without Radix; the UI does not.
- **No SSR support.** Hooks and components are client-only.
- **No offline persistence.** Caching is in-memory for the process lifetime. A reload refetches.
- **Analytics are write-only from the client.** You record impressions and clicks; reading them back is done
  in the admin panel, not through this package.
- **Identity is an anonymous device id**, generated on first run and stored locally. Clearing storage
  produces a new one, so counts are approximate and per-user targeting is not possible.
- **No automated test suite.** Correctness rests on TypeScript, ESLint, a clean build and review. If that is
  below your bar for a dependency, it is a fair reason to pass.
- **Common-feature components are shipped but flag-gated.** Their availability is decided by the backend, so
  a feature can be present in the bundle and still return nothing.

<a id="documentation"></a>
## 📚 Documentation&nbsp;[#](#documentation)

| Document | Read it when |
|---|---|
| [Introduction](https://shared-features-docs.aoneahsan.com/intro) | deciding whether this package fits |
| [Installation](https://shared-features-docs.aoneahsan.com/getting-started/installation) | adding it to a project |
| [Quick start](https://shared-features-docs.aoneahsan.com/getting-started/quick-start) | you want something on screen |
| [Configuration](https://shared-features-docs.aoneahsan.com/getting-started/configuration) | tuning placements, variants and caps |
| [Guides](https://shared-features-docs.aoneahsan.com/guides/feature-flags) | implementing flags, campaigns, broadcasts or events |
| [API reference](https://shared-features-docs.aoneahsan.com/reference/api-overview) | you need an exact signature |
| [FAQ](https://shared-features-docs.aoneahsan.com/faq) | something behaved unexpectedly |
| [AI integration guide](https://github.com/aoneahsan/shared-features/blob/main/AI-INTEGRATION-GUIDE.md) | a coding agent is implementing against it |
| [CONTRIBUTING.md](https://github.com/aoneahsan/shared-features/blob/main/CONTRIBUTING.md) | you want to change the package itself |

<a id="changelog"></a>
## 🔄 Changelog&nbsp;[#](#changelog)

Latest release: **`0.1.14`** — inlined the brand SVG icons after `lucide-react` v1.11 removed its `Github`,
`Linkedin` and `Twitter` exports.

Full history, including unreleased changes on `main`:
[CHANGELOG.md](https://github.com/aoneahsan/shared-features/blob/main/CHANGELOG.md).

<a id="contributing"></a>
## 🤝 Contributing&nbsp;[#](#contributing)

Fork and open a pull request — see
[CONTRIBUTING.md](https://github.com/aoneahsan/shared-features/blob/main/CONTRIBUTING.md) for setup, coding
standards, commit conventions, and how to request collaborator access. `main` is protected: every change
lands through a reviewed PR with a green build.

<a id="repository"></a>
## 🗂️ Repository&nbsp;[#](#repository)

The repository holds two things. Only the first is published to npm.

```text
src/          the published library — components, hooks, services, types
dist/         build output (published)
assets/       brand logo (SVG master)
docs/         internal maintenance records — not published
website/      the marketing site; its own package.json, never published to npm
```

<a id="support"></a>
## 💬 Support&nbsp;[#](#support)

Questions and bugs: [open an issue](https://github.com/aoneahsan/shared-features/issues).

If this package saves you time, you can support its maintenance at
[aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=shared-features&project-identifier=shared-features).

<a id="license"></a>
## 📄 License&nbsp;[#](#license)

MIT © Ahsan Mahmood — see
[LICENSE](https://github.com/aoneahsan/shared-features/blob/main/LICENSE).

<a id="author"></a>
## 👤 Author&nbsp;[#](#author)

**Ahsan Mahmood** — [aoneahsan.com](https://aoneahsan.com) · [GitHub](https://github.com/aoneahsan) ·
[LinkedIn](https://linkedin.com/in/aoneahsan) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)

<a id="links"></a>
## 🔗 Links&nbsp;[#](#links)

| | |
|---|---|
| Documentation | https://shared-features-docs.aoneahsan.com |
| npm | https://www.npmjs.com/package/shared-features |
| Repository | https://github.com/aoneahsan/shared-features |
| Issues | https://github.com/aoneahsan/shared-features/issues |
| Changelog | https://github.com/aoneahsan/shared-features/blob/main/CHANGELOG.md |
| Contributing | https://github.com/aoneahsan/shared-features/blob/main/CONTRIBUTING.md |
| Support the project | https://aoneahsan.com/payment |

<a id="keywords"></a>
## 🏷️ Keywords&nbsp;[#](#keywords)

*feature-flags · feature-toggles · in-app-notifications · broadcasts · announcements · cross-promotion · ads · react · firebase · firestore*
