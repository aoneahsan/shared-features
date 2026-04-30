# shared-features — Portfolio Info

Reference Date: 2026-04-30
Project Type: NPM package — centralized shared product features for the Ahsan/Zaions project ecosystem (ads, broadcasts, profile data, feature flags, analytics, notification events)
Project Slug: shared-features
Primary Email Reference: aoneahsan@gmail.com
Current Version Reviewed: 0.1.13+
Last Portfolio Update: 2026-04-30
Next Eligible Update After: 2026-05-07

---

## Identity & Distribution (Authoritative)

| Field | Value |
| --- | --- |
| Project Slug | `shared-features` |
| Public Brand Name | shared-features |
| NPM Package | https://www.npmjs.com/package/shared-features |
| Repository | private (working repo) |
| License | MIT |
| Type | TypeScript NPM package + Vite-built type declarations |
| Author | Ahsan Mahmood — aoneahsan@gmail.com |
| Payment / Support URL | https://aoneahsan.com/payment?project-id=shared-features&project-identifier=shared-features |
| Consumed By | aoneahsan-portfolio, and other Ahsan/Zaions projects |

---

## Brand Assets

### Logo (SVG — inline)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="shared-features">
  <defs>
    <linearGradient id="sf-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="92" height="92" rx="22" fill="url(#sf-grad)"/>
  <circle cx="32" cy="48" r="10" fill="#FFFFFF"/>
  <circle cx="64" cy="32" r="10" fill="#FFFFFF"/>
  <circle cx="64" cy="64" r="10" fill="#FFFFFF"/>
  <path d="M40 48 L56 32 M40 48 L56 64" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
</svg>
```

### Color Palette

| Role | Token | Hex |
| --- | --- | --- |
| Primary | Slate 800 | `#1E293B` |
| Secondary | Sky 500 | `#0EA5E9` |
| Surface — Light | Slate 50 | `#F8FAFC` |
| Surface — Dark | Slate 900 | `#0F172A` |

---

## Update History (max 10)

| Date | Type | Notes |
| --- | --- | --- |
| 2026-04-30 | Material refresh | Added Identity & Distribution table (NPM `shared-features`), inline slate→sky SVG logo (graph node motif), expanded module inventory (ads, broadcasts, profile data, feature flags, analytics, notification events), and consumer-list confirmation. |
| 2026-03-24 | Created | Initial dated portfolio file. |

---

## One-Line Summary

`shared-features` is the NPM package that centralizes cross-cutting product features for the Ahsan/Zaions project ecosystem — advertising panels, broadcast banners, profile data utilities, feature-flag helpers, analytics adapters, and notification-event types — so consuming apps import shared logic instead of duplicating it.

## Elevator Pitch

`shared-features` is the package every other Ahsan project imports. It exposes typed adapters for product features that recur across projects: cross-promotion ad panels, broadcast banners, user profile data utilities, feature-flag helpers, analytics events, and notification event contracts. Backwards-compatibility is contractually preserved (deprecate-before-remove), Vite emits both ESM and type declarations, and the package is published to NPM as `shared-features`.

## What This Project Is About

A reusable infrastructure package. It does not own app-specific business logic — it owns the cross-cutting types and helpers that every Ahsan project would otherwise reinvent. Consuming apps install it from NPM, import the modules they need, and stay aligned with the rest of the ecosystem.

## Vision

Be the centralised, contract-stable feature surface that every Ahsan/Zaions project depends on — so cross-project upgrades happen in one place, not 30.

## Mission

- Centralize cross-cutting product features in one typed, NPM-published package.
- Strict backwards-compatibility — deprecate before removing.
- Dual ESM + types output via Vite.
- Build / typecheck / lint must all pass before every publish.
- Refresh consuming apps when the package gains material features.

## Core Value Proposition

- One place to fix or upgrade cross-cutting features for an entire portfolio.
- Strict deprecation discipline — consuming apps never break on minor bumps.
- Typed contracts (TypeScript declarations shipped) — IDE + CI catch breakage early.
- Already powering production projects (e.g. `aoneahsan-portfolio` consumes `shared-features@0.1.14`).

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript (strict) |
| Build | Vite (ESM + d.ts emission) |
| Lint | ESLint |
| Tests | Vitest (where applicable) |
| Distribution | NPM |
| Package Manager (local) | yarn |

## Best Features (Modules)

- **Ads / Cross-promotion** — advertising panel data + display contracts.
- **Broadcasts** — system-wide broadcast banner contracts.
- **Profile data** — user-profile utility helpers.
- **Feature flags** — typed helpers for gating features.
- **Analytics adapters** — event-type contracts shared across analytics providers.
- **Notification events** — push/in-app notification event types.

## Hidden Facts and High-Value Talking Points

- Already a consumed dependency in `aoneahsan-portfolio` (`shared-features@0.1.14` listed in `package.json`).
- Strict reusable-infrastructure rule — refuses app-specific logic by policy.
- Deprecate-before-remove backwards-compatibility contract preserved.
- Vite emits both ESM and types for clean consumer experience.

## Strong Resume Bullet Ideas

- Authored and publish `shared-features` on NPM, a centralized cross-cutting features package (advertising, broadcasts, profile data, feature flags, analytics adapters, notification events) consumed by every Ahsan/Zaions project to eliminate duplication and centralize upgrades.
- Maintain a strict reusable-infrastructure boundary (no app-specific logic) and a deprecate-before-remove backwards-compatibility contract so consuming apps never break on minor bumps.

## Social Post Angles

- Why every multi-project portfolio needs a shared-features NPM package.
- Deprecate-before-remove as a backwards-compatibility contract.
- Building a typed analytics-event surface once, reusing it everywhere.

## Suggested SEO Keywords

- shared-features NPM package
- TypeScript reusable feature package
- analytics events package
- feature flag package
- broadcast banners NPM
- cross-project feature library
- typed notification events package

## Social Hashtags

### Generic
#Aoneahsan #AhsanMahmood #Zaions #BestOpenSourceCommunityProject #TopFree #SaaSApp

### Top 20
#SharedFeatures #NPMPackage #ReusableInfrastructure #TypeScript #FeatureFlags #AnalyticsEvents #NotificationEvents #ViteBuild #ProductEngineering #PlatformEngineering #LibraryDesign #BackwardsCompatibility #BuildInPublic #DeveloperTools #MonorepoAlternative #EcosystemEngineering #CrossPromotion #BroadcastBanners #ProfileUtilities #SaaSDevelopment

## Known Constraints

- Last full audit on 2026-03-24 — next audit was due 2026-04-05; freshness rule active.
- The package is private-repo-sourced; only the NPM-published artifact is public.

## File Usage Rule

Refresh weekly (MANDATORY); 3-day skip floor; max 10 history records. Filename always carries last-updated date. Final destination: `~/Documents/ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/packages/SHARED-FEATURES_portfolio-info_<YYYY-MM-DD>.md`.
