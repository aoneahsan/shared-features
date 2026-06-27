# shared-features — Portfolio Info

Reference Date: 2026-06-26
Project Type: NPM package (TypeScript / React 19 library, Vite library-mode build, dual ESM + CJS + `.d.ts`, 6 subpath entry points) for the Ahsan/Zaions ecosystem — centralizes feature flags, cross-promotion advertising, in-app broadcasts/notifications, and 9 common profile-data domains. Ships with a companion Capacitor (Android + iOS) + Radix UI marketing/admin website with full 4-platform telemetry and Sentry observability.
Project Slug: shared-features
Primary Email Reference: aoneahsan@gmail.com
Current Version Reviewed: 0.1.14 (package) · website 1.0.0
Last Portfolio Update: 2026-06-26
Next Eligible Update After: 2026-07-03

---

## Identity & Distribution (Authoritative)

| Field | Value |
| --- | --- |
| Project Slug | `shared-features` |
| Public Brand Name | shared-features |
| NPM Package | `shared-features` — https://npmjs.com/package/shared-features (v0.1.14, public) |
| Public URL (Live) | https://npmjs.com/package/shared-features (npm is the public face; admin panel that manages package data lives at aoneahsan.com; dedicated marketing site in `website/` — public deploy URL not yet confirmed) |
| Repository | https://github.com/aoneahsan/shared-features (`git@github.com:aoneahsan/shared-features.git`, remote `o`, branch `main`) — private |
| License | MIT (declared in `package.json`; `@license MIT` in source headers) |
| Entry Points (exports) | 6 subpaths — `.` (root), `./components`, `./hooks`, `./services`, `./types`, `./notifications`; each dual `import` (ESM `.js`) / `require` (CJS `.cjs`) + `.d.ts` types |
| Build Output | `dist/index.js` (ESM) + `dist/index.cjs` (CJS) + `dist/index.d.ts` (types), 45 modules transformed |
| Peer Dependencies | `react` >=19.2.3, `react-dom` >=19.2.3, `firebase` >=12.8.0, `@radix-ui/themes` >=3.2.1, `@radix-ui/react-icons` >=1.3.2, `lucide-react` >=0.562.0, `zustand` >=5.0.10; `@capacitor/preferences` >=8.0.0 (**optional**) |
| Capacitor App ID (Android) | not yet published / not confirmed (companion website is Capacitor-wrapped — Android configured in `website/`, no shipped appId in master record) |
| iOS Bundle ID / Scheme | not yet published / not confirmed (prepared in `website/ios/`, not shipped) |
| Android URL (Play Store) | not yet published |
| iOS URL (App Store) | not yet published |
| Browser Extension | N/A |
| Engines / Toolchain | Node `>=24.13.0` · packageManager `yarn@4.14.1` (Berry) |
| Author | Ahsan Mahmood — aoneahsan@gmail.com — https://aoneahsan.com |
| Payment / Support URL | https://aoneahsan.com/payment?project-id=shared-features&project-identifier=shared-features |
| Agent-Readable Pricing | N/A (free MIT package) |
| Consumed By | ZTools (`com.zaions.ztools`, primary consumer), aoneahsan-portfolio, and other Ahsan/Zaions projects via `yarn add shared-features` |

> **Asks for next refresh:**
> - Confirm the companion `website/` public deploy URL (is it live, and at what domain?).
> - Confirm the companion website's Capacitor Android appId + iOS bundle ID if/when the mobile build ships.
> - Confirm whether the GitHub repo stays private or flips public (the npm artifact is already public).

---

## Brand Assets

### Logo (SVG — inline)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="shared-features logo">
  <defs>
    <linearGradient id="sf-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="92" height="92" rx="22" fill="url(#sf-grad)"/>
  <!-- shared graph: one source node fanning out to three consumers -->
  <circle cx="32" cy="48" r="10" fill="#FFFFFF"/>
  <circle cx="64" cy="30" r="9" fill="#7DD3FC"/>
  <circle cx="64" cy="48" r="9" fill="#FFFFFF"/>
  <circle cx="64" cy="66" r="9" fill="#7DD3FC"/>
  <path d="M40 46 L56 31 M41 48 L55 48 M40 50 L56 65" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
</svg>
```

> Motif: one source node (the package) fanning out to three consumer nodes (the apps that import it) — the literal "one library, many apps" idea.

### Color Palette

| Role | Token | Hex | Usage |
| --- | --- | --- | --- |
| Primary | Slate 800 | `#1E293B` | Logo base, headings, package brand |
| Secondary / Accent | Sky 500 | `#0EA5E9` | Links, gradient terminus, CTAs |
| Accent Light | Sky 300 | `#7DD3FC` | Consumer-node highlights, hover states |
| Surface — Light | Slate 50 | `#F8FAFC` | Light-mode backgrounds |
| Surface — Dark | Slate 900 | `#0F172A` | Dark-mode backgrounds |

> The companion website is built on **Radix UI Themes** (theme-token driven, dark-mode capable); the package's own UI components accept Radix theme tokens rather than hardcoding colors, so they re-tint to each host app's accent.

---

## Update History (max 10 records)

| Date | Type | Notes |
| --- | --- | --- |
| 2026-06-26 | Links/IDs refresh | links/identifiers/contact reconciled from master JSON (PROJECT-LINKS-IDENTIFIERS-CONTACT.json): NPM/Public URL normalized to https://npmjs.com/package/shared-features; store/extension/app-id fields kept honestly unpublished; MIT, author, payment URL confirmed. |
| 2026-06-05 | Verification refresh | Weekly portfolio refresh. Re-ran `npm-check-updates` → **no-op, all deps already at latest stable** (last real bump was 2026-05-29). Re-verified all gates GREEN at v0.1.14: `yarn typecheck` 0 errors, `yarn build` clean (ESM + CJS + d.ts, 45 modules transformed in ~5.8s), `yarn lint` 0 warnings. Confirmed no `test` script exists (package has no automated test suite). Recorded holds (firebase 12.14, zustand major 5) in CLAUDE.md/AGENTS.md. Refreshed both docs (Last Updated, portfolio path, ncu date → 2026-06-05). Identity unchanged: npm `shared-features` v0.1.14, MIT, repo remote `o`/main. |
| 2026-05-29 | Material refresh | Portfolio-wide refresh pass. Ran `npm-check-updates -u` → 7 dev-dep minor/patch bumps (firebase 12.13→12.14, eslint 10.4.0→10.4.1, typescript-eslint stack 8.59→8.60, lucide-react 1.16→1.17, zustand 5.0.13→5.0.14); `yarn install` reconciled; `yarn typecheck` + `yarn build` both PASS (ESM + CJS + d.ts dist, 45 modules). Documented the companion `website/` as a Capacitor (Android+iOS) + Radix + RHF/Zod app, not just docs. |
| 2026-05-06 | Material refresh | Reflects 2026-05-05 full code+SEO+AEO+content audit (11 files, ~480 insertions) and 2026-05-06 marketing-website analytics milestone — 4-platform telemetry (Firebase + Amplitude + Clarity + GA) + Sentry + ErrorBoundary wired in (6 files, ~430 insertions). |
| 2026-04-30 | Material refresh | Added Identity & Distribution table (NPM `shared-features`), inline slate→sky SVG logo (graph node motif), expanded module inventory (ads, broadcasts, profile data, feature flags, analytics, notification events), consumer-list confirmation. |
| 2026-03-24 | Created | Initial dated portfolio file. |

---

## One-Line Summary

`shared-features` is the MIT-licensed, NPM-published TypeScript/React library that every Ahsan/Zaions project imports to get the same three cross-cutting systems — feature flags, cross-promotion advertising, and in-app broadcasts/notifications — plus nine reusable profile-data domains, all administered centrally from one Firestore-backed admin panel.

## Elevator Pitch

`shared-features` is the package every other Ahsan project imports instead of reinventing the same plumbing. It ships three production systems — version-aware feature flags (`zaions_feature_flags`), cross-product advertising campaigns with impression tracking (`zaions_campaigns` / `zaions_products` / `zaions_impressions`), and in-app broadcasts/announcements/alerts (`zaions_broadcasts` and friends) — alongside nine common profile-data domains (contact, developer, social, address, payment, services, skills, testimonials, and more). Everything is administered from a single admin panel at aoneahsan.com, so a banner, ad, or feature toggle changes once and propagates to every consuming app. The library publishes to NPM as `shared-features`, builds dual ESM + CommonJS + `.d.ts` via Vite library mode across six subpath entry points, keeps React/Firebase/Radix/Zustand as peers (zero bundling), and holds a strict deprecate-before-remove contract so consumers never break on minor bumps.

## What This Project Is About

This is reusable infrastructure, not an app. By policy it refuses app-specific business logic — it owns only the cross-cutting types, services, hooks, and UI components that a fleet of separate projects would otherwise each rebuild. A consuming app installs it from NPM, initializes it once with its own Firebase config, and imports the modules it needs: `shared-features` (init + config), `/components` (ad and notification UI), `/hooks` (campaigns, broadcasts, feature flags, common features), `/services` (Firestore data layer), `/types`, and `/notifications` (event registry). The accompanying `website/` is a Capacitor-wrapped (Android + iOS) Radix UI marketing/documentation surface that already ships full production observability — 4-platform telemetry plus Sentry and a React ErrorBoundary — so the library's public face is operationally mature, not a static README.

## Vision

Be the single, contract-stable feature surface every Ahsan/Zaions project depends on — so a cross-project upgrade, ad change, or announcement happens in one place, not thirty.

## Mission

Centralize cross-cutting product features in one typed, NPM-published library; preserve strict backward compatibility (deprecate before removing, never break the six entry points); emit clean dual ESM + CJS + type declarations via Vite; keep every heavy runtime dependency a peer; pass build + typecheck + lint before every publish; and keep consuming apps in lockstep when the package gains material features.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript (strict mode) |
| Runtime model | React 19 library (peer), Firebase 12 (peer) — nothing bundled |
| Build | Vite 8 library mode (ESM + CJS) + `tsc --emitDeclarationOnly` for `.d.ts` |
| Output | Dual `index.js` (ESM) / `index.cjs` (CJS) + `.d.ts`, 6 subpath exports (root, /components, /hooks, /services, /types, /notifications), 45 modules |
| UI (components) | Radix UI Themes + `@radix-ui/react-icons` + Lucide React icons (theme-token driven) |
| State | Zustand (peer, major 5) |
| Data | Cloud Firestore (`zaions_`-prefixed collections), admin-managed |
| Storage | `@capacitor/preferences` (optional peer) — never localStorage |
| Lint | ESLint 10 + typescript-eslint 8.60 |
| Package manager | yarn 4.14.1 (Berry) |
| Node | `>=24.13.0` |
| Companion website | Vite + React 19 + Radix UI + react-hook-form + Zod, Capacitor (Android + iOS), Amplitude + Firebase Analytics + Microsoft Clarity + GA telemetry, Sentry + ErrorBoundary, postbuild SEO script |

> **What it does NOT do (honest framing):** it is not a standalone app and ships no app-specific business logic; it bundles no runtime dependencies (host apps must provide React/Firebase/Radix/Zustand as peers); it has **no automated test suite** (verification is typecheck + build + lint + manual smoke-test in a consuming app); it has no public download/star metrics worth quoting; and the companion mobile build is configured but not yet published to any store.

## Feature Catalog

**System 1 — Feature Flags** (`zaions_feature_flags`, admin at `/admin/settings`)
- Version-aware remote feature toggles across all consuming apps; maintenance mode; deprecation + upgrade-required signaling.
- Hooks: `useFeatureFlags`, `useFeature`, `useFeatureGate`, `useFeatureFlagsSubscription` (real-time), `useSharedFeaturesOperational`; `featureFlags` service.
- Per-consumer `featureVersions` config so apps opt into specific feature API versions.

**System 2 — Advertising Campaigns** (`zaions_campaigns`, `zaions_products`, `zaions_impressions`, admin at `/admin/campaigns`)
- Cross-promotion of Zaions products inside other apps (footer/sidebar ads, welcome modals, version-update carousels, cross-sell).
- Ad components: `AdPanel`, `AdSlider`, `AdModal`, `AdUpdateModal`, `AdBanner` — 10 display variants (5 compact / 5 feature-area).
- Frequency capping, impression/click/close tracking + analytics; hooks `useCampaigns`, `useOneTimeAdModal`, `useUpdateAdModal`; 8 placement slots (popup, options, onetime modal, update modal, notification, footer, sidebar, home banner).

**System 3 — Broadcasts / In-App Notifications** (`zaions_broadcasts`, `zaions_broadcast_events`, `zaions_notification_templates`, admin at `/admin/notifications`)
- 4 delivery variants (banner, modal, toast, bell) × 4 priority levels (low/medium/high/urgent); immediate or scheduled delivery; reusable templates.
- Components + hooks: `BroadcastBanner`, `useBroadcasts`, `useBannerBroadcasts`, `useModalBroadcasts`, `useToastBroadcasts`; `broadcasts` + `admin-notifications` services; view/click/dismiss tracking.
- Notification event system: registry + event helpers (`shared-features/notifications`) and consumer copy-paste templates (`src/templates/consumer/`).

**Common Profile Data (9 domains)** (`zaions_contact_info`, `zaions_developer_info`, `zaions_social_links`, `zaions_address_info`, `zaions_payment_options`, `zaions_services`, `zaions_skills`, `zaions_testimonials`, `zaions_projects`)
- `useCommonFeatures` hook + `commonFeatures` / `admin-commonFeatures` services — one source of truth for contact, developer, social, address, payment, services, skills, and testimonial data shared across every site.

**Platform**
- Firebase init/config helpers with multi-platform target (`web` | `android` | `ios` | `extension`) and device-id support; `initSharedFeatures`, `getSharedFeaturesApp/Db/Auth`, `getConfig`, `isInitialized`.
- Centralized logger (`src/utils/logger.ts`) replacing console spam.
- Companion website: sitemap.xml + `/feed` + feed.xml, SEO postbuild, 4-platform telemetry, Sentry, ErrorBoundary.

## Install + Usage

```bash
yarn add shared-features
# peers (host app provides these — none are bundled):
yarn add react react-dom firebase @radix-ui/themes @radix-ui/react-icons zustand lucide-react
yarn add @capacitor/preferences   # optional, mobile only
```

```typescript
import { initSharedFeatures } from 'shared-features';
import { AdPanel } from 'shared-features/components';
import { useBroadcasts, useFeatureFlags } from 'shared-features/hooks';

initSharedFeatures({
  firebaseConfig: { /* aoneahsan.com Firebase config from admin */ },
  projectId: 'ztools',
  projectName: 'ZTools',
  platform: 'web', // 'android' | 'ios' | 'extension'
});

// Drop a cross-promo ad slot:
<AdPanel placement="sidebar_panel" />;
```

## Hidden Facts & Unique Angles

- **One admin panel, every app.** Change an ad, banner, or feature flag once at aoneahsan.com and it propagates to all consumers — no redeploys of individual apps.
- **Strict reusable-infrastructure boundary by policy.** The package refuses app-specific logic; this is an explicit IRON-SOLID rule in its CLAUDE.md/AGENTS.md, not just a convention.
- **Deprecate-before-remove backward-compatibility contract.** Six public entry points must stay stable; required peers can't be added without a major bump — so consuming apps never break on a minor.
- **Zero runtime dependencies.** React, Firebase, Radix UI, Zustand, and `lucide-react` are all peers; `@capacitor/preferences` is an optional peer. The published artifact bundles none of them.
- **Dual-format, six-entry output.** Vite library mode emits both ESM (`index.js`) and CommonJS (`index.cjs`) plus `.d.ts` for each of root, /components, /hooks, /services, /types, /notifications.
- **The "docs site" is actually a mobile app.** The companion `website/` is a Capacitor Android + iOS build with Radix UI, react-hook-form/Zod forms, 4-platform telemetry, Sentry, and an ErrorBoundary — operational maturity beyond a static page.
- **Already a live dependency.** Consumed in production by ZTools and aoneahsan-portfolio via NPM.
- **2026-06-05 verification green.** Weekly refresh found deps already at latest stable (ncu no-op since the 2026-05-29 bump); typecheck + build (45 modules, ESM+CJS+d.ts) + lint all clean.

## Benefits for Users

- **For the portfolio owner:** fix or upgrade a cross-cutting feature once and ship it everywhere; run all cross-promotion and announcements from a single console.
- **For consuming-app developers:** typed imports with IDE autocomplete and CI type-checking; no reinventing ad slots, broadcast banners, feature flags, or profile-data plumbing.
- **For end users of consuming apps:** consistent ad/announcement UX, timely in-app notices, and accurate, centrally-maintained contact/developer/social/payment info across every Zaions product.
- **For AI coding agents:** a dedicated `AI-INTEGRATION-GUIDE.md` gives Claude/Cursor/Copilot a copy-paste integration path (install, peers, env vars, init, component usage).

## Value & Potential

Most multi-project portfolios accumulate duplicated "glue" code — ad widgets, banner systems, feature toggles, contact blocks — copied and slowly drifting across repos. `shared-features` collapses that into one versioned, contract-stable library, turning N copies into one upgrade point. It is already proven in production (ZTools, aoneahsan-portfolio), is published openly on NPM under MIT, and its Capacitor-wrapped companion website gives it a marketing/admin surface and a path to mobile distribution. The architecture (peer-only deps, six stable entry points, deprecate-before-remove) is exactly the pattern a small team or agency needs to manage a fleet of products without per-app maintenance tax.

## Resume / CV Bullets

- Authored and publish `shared-features` on NPM (MIT) — a TypeScript/React 19 library centralizing three cross-cutting systems (version-aware feature flags, cross-promotion advertising with impression tracking, and in-app broadcasts/notifications) plus nine shared profile-data domains, consumed in production by ZTools and the developer portfolio.
- Designed a six-entry, dual-format (ESM + CommonJS + `.d.ts`) Vite library-mode build (45 modules) with React/Firebase/Radix/Zustand kept strictly as peer dependencies, so the published artifact bundles zero runtime deps.
- Enforced a deprecate-before-remove backward-compatibility contract across six stable public entry points, guaranteeing consuming apps never break on minor version bumps.
- Modeled all data on a single Firestore admin panel (`zaions_`-prefixed collections) so ads, banners, and feature toggles change in one place and propagate to every consuming app without per-app redeploys.
- Built a Capacitor (Android + iOS) Radix UI companion website with 4-platform telemetry (Firebase Analytics + Amplitude + Microsoft Clarity + GA), Sentry error tracking, a React ErrorBoundary, and an SEO postbuild pipeline (sitemap.xml, /feed, feed.xml).
- Maintained centralized-logger discipline and strict lint/typecheck/build gates before every publish; verified weekly dependency hygiene with `npm-check-updates` (2026-05-29 bump to firebase 12.14 / eslint 10.4.1 / typescript-eslint 8.60 / zustand 5.0.14; 2026-06-05 confirmed all current) with zero breakage.
- Shipped an `AI-INTEGRATION-GUIDE.md` so AI coding agents can integrate the library into React + Capacitor projects from a single reference.

## LinkedIn / Portfolio Paragraph

`shared-features` is the NPM library I built so every project in my portfolio stops reinventing the same plumbing. It ships three production systems — version-aware feature flags, cross-product advertising campaigns with impression tracking, and in-app broadcasts/announcements — plus nine shared profile-data domains, all administered from one Firestore-backed console so a banner, ad, or toggle changes once and propagates everywhere. It builds dual ESM + CommonJS with full TypeScript declarations across six stable entry points (45 modules), keeps React, Firebase, Radix UI, and Zustand as peer dependencies (zero bundling), and enforces a deprecate-before-remove contract so consuming apps never break on a minor bump. It's already a live dependency in ZTools and my developer portfolio, and its Capacitor-wrapped companion website ships 4-platform telemetry, Sentry, and a React ErrorBoundary — operational maturity beyond a docs page.

## Social Content Angles (for ChatGPT content project)

- "Why every multi-project portfolio eventually needs a `shared-features` package — and what goes in it."
- "Deprecate-before-remove: how a backward-compatibility contract keeps a fleet of apps from breaking on a minor bump."
- "One admin panel, every app: changing an ad or feature flag once and watching it propagate."
- "Vite library mode: shipping dual ESM + CommonJS + `.d.ts` across six subpath entry points."
- "Peer dependencies done right — publishing a React/Firebase library that bundles zero runtime deps."
- "The 'docs site' that's secretly a Capacitor Android + iOS app with Sentry and 4-platform analytics."
- "Centralizing nine kinds of profile data (contact, social, payment, testimonials) so they never drift across sites."
- "Building an in-app broadcast/announcement system once and reusing it across a product fleet."
- "An AI-integration guide in every package: making your library trivial for Claude/Cursor/Copilot to adopt."
- "Dependency-upgrade discipline: ncu + yarn + typecheck/build/lint gate, demonstrated weekly on a real library."

## Top 20 Hashtags

#SharedFeatures #NPMPackage #ReusableInfrastructure #TypeScript #React19 #FeatureFlags #InAppNotifications #CrossPromotion #ViteLibraryMode #PeerDependencies #BackwardsCompatibility #PlatformEngineering #LibraryDesign #DeveloperTools #Firebase #Firestore #RadixUI #Capacitor #BuildInPublic #MonorepoAlternative

## SEO / AEO Metadata

- Meta description (150–160 chars): shared-features is an MIT TypeScript/React NPM library centralizing feature flags, cross-promotion ads, and in-app broadcasts across all Zaions apps.
- Primary keywords: shared-features npm package, reusable React feature library, feature flag package, in-app notifications library, cross-promotion ads package, TypeScript Vite library.
- Long-tail / GEO keywords (AI-search): how to share feature flags across multiple React apps, central admin panel for in-app announcements, npm package for cross-product advertising with impression tracking, Vite library mode dual ESM CommonJS with type declarations, peer-dependency-only React Firebase library, deprecate-before-remove backward compatibility contract.
- Suggested og:title: shared-features — one library, every Zaions app
- Suggested og:description: Feature flags, cross-promotion ads, and in-app broadcasts in one MIT TypeScript/React NPM package — administered from a single Firestore console, consumed across a product fleet.

## Generic Hashtags (always include in posts)

#Aoneahsan #AhsanMahmood #Zaions #BestOpenSourceCommunityProject #TopFree #SaaSApp
