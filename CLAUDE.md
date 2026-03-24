# shared-features Package

**Package Name**: `shared-features`
**Version**: `0.1.13`
**NPM**: `https://www.npmjs.com/package/shared-features`
**Last Updated**: `2026-03-24`

Centralized shared product features for Zaions projects, including advertising campaigns, broadcasts, common profile/contact data, feature flags, analytics helpers, and consumer-facing notification event tooling.

## Current Verified State

- Reviewed on: `2026-03-24`
- Build: `yarn build` passed
- Typecheck: `yarn typecheck` passed
- Lint: `yarn lint` passed

## Implemented Feature Areas

| Area | Types | Service | Hook | Components / Templates |
| --- | --- | --- | --- | --- |
| Feature Flags | `featureFlags.ts` | `featureFlags.ts` | `useFeatureFlags.ts` | - |
| Advertising Campaigns | `campaigns.ts` | `campaigns.ts`, `analytics.ts` | `useCampaigns.ts` | `ads/*` |
| Broadcasts / Notifications | `notifications.ts` | `broadcasts.ts`, `admin-notifications.ts` | `useBroadcasts.ts` | `notifications/*`, `notifications/events/*` |
| Common Profile Data | `commonFeatures.ts` | `commonFeatures.ts`, `admin-commonFeatures.ts` | `useCommonFeatures.ts` | `components/common/*` |
| Firebase Initialization | - | `firebase/init.ts`, `firebase/config.ts` | - | - |
| Consumer Notification Templates | notification-related types | template helpers | - | `templates/consumer/*` |

## Package Structure

```text
src/
  components/
    ads/
    notifications/
    common/
  hooks/
  services/
  notifications/events/
  templates/consumer/
  firebase/
  types/
```

## Working Rules

- Keep docs aligned with the actual package version and verified repo state.
- Use `yarn` as the default workflow for this package.
- When shared modules, exports, or feature areas change, update `README.md`, this file, and the root portfolio file in the same pass.
- Preserve the package’s role as reusable cross-project infrastructure rather than app-specific implementation.

## Firestore-Oriented Data Areas

- `zaions_feature_flags`
- `zaions_campaigns`
- `zaions_products`
- `zaions_impressions`
- `zaions_broadcasts`
- `zaions_broadcast_events`
- `zaions_notification_templates`
- `zaions_contact_info`
- `zaions_developer_info`
- `zaions_social_links`
- `zaions_address_info`
- `zaions_payment_options`
- `zaions_services`
- `zaions_skills`
- `zaions_testimonials`

## Root Portfolio File Maintenance Rule

- Maintain exactly one current root portfolio info file for this package.
- File naming format: `SHARED-FEATURES_portfolio-info_YYYY-MM-DD.md`
- Refresh the portfolio file only after at least 7 days have passed unless a major release or material capability change happens sooner.
- Keep at most 10 update-history records inside the portfolio file.
- When the portfolio file changes, update `README.md` and this `CLAUDE.md` in the same pass.

## Website

- Location: `/website`
- Stack: React 19 + Vite 7 + Tailwind v4 + Radix UI + D3.js
- Current package docs mention the website as the admin and operational layer around these shared features

## Package Update History

| Date | Version | Notes |
| --- | --- | --- |
| 2026-03-24 | 0.1.13 | Refreshed docs, verified build/typecheck/lint, added root portfolio maintenance rule |
| 2026-02-11 | 0.1.12 | Updated TopbarAdBanner and AdCarousel sizing/behavior |
| 2026-02-10 | 0.1.8 | Added dismissible topbar banner placement |
| 2026-02-10 | 0.1.7 | Extended AddressInfo and website expansion notes |
| 2026-02-07 | 0.1.6 | Added portfolio field fallbacks and new type extensions |
| 2026-02-05 | 0.1.0 | Added common profile/contact/service features |
| 2026-02-05 | 0.0.9 | Added feature flags system |
| 2026-02-02 | 0.0.8 | Full update to latest versions |

## Comprehensive Audit Record

| Date | Audit Type | Status | Issues Found | Issues Resolved |
| --- | --- | --- | --- | --- |
| 2026-03-24 | Portfolio + Docs Refresh | Passed | 0 | 0 |
| 2026-02-05 | Feature Addition | Passed | 0 | 0 |
| 2026-02-02 | Package Update | Passed | 0 | 1 |

### Last Audit Details

- Package Manager: yarn confirmed
- Dependencies: no dependency audit performed in this pass
- Build: passes
- Lint: passes
- TypeScript: passes
- Features: current feature surface reflected in docs

### Next Audit Due: 2026-03-31
