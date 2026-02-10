# shared-features Package

**Package Name**: `shared-features`
**Version**: 0.1.7
**NPM**: https://www.npmjs.com/package/shared-features

Centralized common features for Zaions projects. Manage ads, contacts, developer info, and more from aoneahsan.com admin panel.

---

## Features

### Implemented

| Feature | Types | Service | Hook | Component |
|---------|-------|---------|------|-----------|
| Feature Flags | `featureFlags.ts` | `featureFlags.ts` | `useFeatureFlags.ts` | - |
| Advertising | `campaigns.ts` | `campaigns.ts` | `useCampaigns.ts` | `ads/*` |
| Broadcasts | `notifications.ts` | `broadcasts.ts` | `useBroadcasts.ts` | `notifications/*` |
| Contact Info | `commonFeatures.ts` | `commonFeatures.ts` | `useContactInfo` | `ContactCard` |
| Developer Info | `commonFeatures.ts` | `commonFeatures.ts` | `useDeveloperInfo` | `DeveloperCard` |
| Social Links | `commonFeatures.ts` | `commonFeatures.ts` | `useSocialLinks` | `SocialLinksBar` |
| Address Info | `commonFeatures.ts` | `commonFeatures.ts` | `useAddressInfo` | `AddressCard` |
| Payment Options | `commonFeatures.ts` | `commonFeatures.ts` | `usePaymentOptions` | - |
| Services | `commonFeatures.ts` | `commonFeatures.ts` | `useServices` | `ServicesGrid` |
| Skills | `commonFeatures.ts` | `commonFeatures.ts` | `useSkills` | `SkillsDisplay` |
| Testimonials | `commonFeatures.ts` | `commonFeatures.ts` | `useTestimonials` | `TestimonialsGrid` |

---

## Package Structure

```
src/
├── components/
│   ├── ads/           # AdModal, AdSlider, AdBanner, etc.
│   ├── notifications/ # BroadcastBanner, AnnouncementModal
│   └── common/        # ContactCard, DeveloperCard, SocialLinksBar, etc.
├── hooks/
│   ├── useCampaigns.ts
│   ├── useBroadcasts.ts
│   ├── useFeatureFlags.ts
│   └── useCommonFeatures.ts
├── services/
│   ├── campaigns.ts
│   ├── broadcasts.ts
│   ├── featureFlags.ts
│   └── commonFeatures.ts
├── firebase/          # init.ts, config.ts
└── types/
    ├── campaigns.ts
    ├── notifications.ts
    ├── featureFlags.ts
    └── commonFeatures.ts
```

---

## Firestore Collections

| Collection | Type | Purpose |
|------------|------|---------|
| `zaions_feature_flags` | Singleton | Feature toggles & versioning |
| `zaions_campaigns` | Collection | Ad campaigns |
| `zaions_products` | Collection | Products catalog |
| `zaions_impressions` | Collection | Ad analytics |
| `zaions_broadcasts` | Collection | Notifications |
| `zaions_contact_info` | Singleton | Contact information |
| `zaions_developer_info` | Singleton | Developer profile |
| `zaions_social_links` | Collection | Social media links |
| `zaions_address_info` | Singleton | Physical address |
| `zaions_payment_options` | Collection | Payment methods |
| `zaions_services` | Collection | Professional services |
| `zaions_skills` | Collection | Skills list |
| `zaions_testimonials` | Collection | Client testimonials |

---

## Consumer Integration

```typescript
import { initSharedFeatures } from 'shared-features';

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
  projectId: 'consumer-project-id',
  projectName: 'Consumer Project Name',
  platform: 'web',
  featureVersions: { campaigns: 1, broadcasts: 1 },
});
```

---

## Common Errors Reference

**CRITICAL**: Review before making changes: `/home/ahsan/Documents/01-code/docs/troubleshooting/COMMON-ERRORS-TRACKER.md`

### Error Prevention

1. **NEVER Hardcode Configuration** - Consumer provides all config
2. **React Components Must Handle Uninitialized State** - Check `isInitialized()` after hooks
3. **Complete Firebase Config (7 Fields)** - All fields required

---

## Build Requirements

- `yarn build` must pass with 0 errors
- TypeScript declarations must be generated
- Both ESM and CJS outputs required

**Last Updated**: 2026-02-10

---

## Website

**Location**: `/website`
**Port**: 5944
**Stack**: React 19 + Vite 7 + Tailwind v4 + Radix UI + D3.js

### Website Features
- 47 total pages (Marketing, Dashboard, Admin)
- Full admin panel managing all 15 Firestore collections
- Google OAuth authentication (admin: aoneahsan@gmail.com)
- 6 D3.js analytics charts
- Complete documentation with code examples
- Interactive component demos
- SEO optimized (sitemap.xml, robots.txt, meta tags)

### Website Commands
```bash
cd website && yarn dev    # Start dev server on port 5944
cd website && yarn build  # Build for production
```

### Tracking
- **Plan**: `docs/website-plan/WEBSITE-MASTER-PLAN.md`
- **Tracker**: `docs/tracking/website-implementation-tracker.json`

---

## Package Update History

| Date | Version | Notes |
|------|---------|-------|
| 2026-02-10 | 0.1.7 | Extended AddressInfo type with apartment, landmark, googleMapsEmbedUrl, showMap, workingHours, additionalInfo, coordinates; Website with 47 pages |
| 2026-02-07 | 0.1.6 | Added portfolio field name fallbacks in docTo* functions, new types (platform/wallet PaymentType, extension/full-stack ProjectCategory, displayName/instructions on PaymentOption) |
| 2026-02-05 | 0.1.0 | Added all common features (contact, developer, social, address, payment, services, skills, testimonials) |
| 2026-02-05 | 0.0.9 | Added Feature Flags System |
| 2026-02-02 | 0.0.8 | Full update to latest versions |

---

## Comprehensive Audit Record

| Date | Audit Type | Status | Issues Found | Issues Resolved |
|------|------------|--------|--------------|-----------------|
| 2026-02-05 | Feature Addition | Passed | 0 | 0 |
| 2026-02-02 | Package Update | Passed | 0 | 1 |

### Last Audit Details
- **Package Manager**: yarn confirmed
- **Dependencies**: Up to date
- **Build**: Passes (0 errors)
- **Lint**: Passes (0 warnings)
- **TypeScript**: Passes (0 errors)
- **Features**: All common features implemented

### Next Audit Due: 2026-02-12 (7 days from last)
