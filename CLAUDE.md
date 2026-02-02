# shared-features Package

**Package Name**: `shared-features`
**Version**: 0.0.3
**NPM**: https://www.npmjs.com/package/shared-features

Centralized common features for Zaions projects. Manage ads, contacts, feature requests, and more from aoneahsan.com admin panel.

---

## Common Errors Reference

**CRITICAL**: Review before making changes: `/home/ahsan/Documents/01-code/docs/troubleshooting/COMMON-ERRORS-TRACKER.md`

### Package-Specific Error Prevention

#### 1. NEVER Hardcode Configuration
```typescript
// WRONG - Never do this
export const FIREBASE_CONFIG = { projectId: "aoneahsan-com" };

// CORRECT - Consumer provides all config
export interface SharedFeaturesConfig {
  firebaseConfig: FirebaseConfig; // ALL 7 fields from consumer's env vars
}
```

#### 2. React Components Must Handle Uninitialized State
```typescript
// CORRECT Pattern for all components
export function AdComponent() {
  // 1. ALL hooks first
  const [state, setState] = useState();
  const { data } = useHook();

  // 2. Check initialization AFTER hooks
  if (!isInitialized()) {
    return null;
  }

  // 3. Safe to use getConfig() now
  const config = getConfig();
}
```

#### 3. Complete Firebase Config (7 Fields)
Consumer must provide ALL fields:
- `apiKey`, `authDomain`, `projectId`, `storageBucket`
- `messagingSenderId`, `appId`, `measurementId`

---

## Package Structure

```
src/
├── components/ads/     # AdModal, AdSlider, AdBanner, AdUpdateModal, AdPanel
├── hooks/              # useCampaigns, useOneTimeAdModal, useUpdateAdModal
├── services/           # campaigns.ts, analytics.ts
├── firebase/           # init.ts, config.ts
└── types/              # campaigns.ts
```

## Development

```bash
yarn build          # Build package
yarn link           # Register for local development
```

## Consumer Integration

```typescript
// Consumer's main.tsx
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
});
```

---

## Build Requirements

- `yarn build` must pass with 0 errors
- TypeScript declarations must be generated
- Both ESM and CJS outputs required

**Last Updated**: 2026-01-23

---

## Comprehensive Audit Record

| Date | Audit Type | Status | Issues Found | Issues Resolved |
|------|------------|--------|--------------|-----------------|
| 2026-01-23 | Full Audit | Passed with issues | 2 | 0 |

### Last Audit Details
- **Package Manager**: yarn confirmed
- **Dependencies**: Updated to latest
- **Build**: Passes (0 errors)
- **Lint**: FAILED - No eslint.config.js (ESLint v9 requires flat config)
- **Features**: Core features complete (ads, broadcasts, notifications)
- **TODOs**: 9 found (1 in AdPanel.tsx, 8 in templates - intentional placeholders)
- **Coming Soon**: 5 items in index.ts (contacts, feature requests, payment, social links, developer info)
- **SEO**: N/A (npm package)
- **OG Assets**: N/A (npm package)

### Outstanding Issues
1. ESLint config needs to be created (eslint.config.js for ESLint v9)
2. 5 "coming soon" features documented but not implemented

### Next Audit Due: 2026-01-30 (7 days from last)
