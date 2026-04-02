# Source - shared-features

Package source code. All public API surfaces live here.

## Feature Areas

| Area | Types | Service | Hook | Components |
|------|-------|---------|------|------------|
| Feature Flags | `types/featureFlags.ts` | `services/featureFlags.ts` | `hooks/useFeatureFlags.ts` | - |
| Advertising | `types/campaigns.ts` | `services/campaigns.ts`, `services/analytics.ts` | `hooks/useCampaigns.ts` | `components/ads/*` |
| Broadcasts | `types/notifications.ts` | `services/broadcasts.ts`, `services/admin-notifications.ts` | `hooks/useBroadcasts.ts` | `components/notifications/*` |
| Common Profile | `types/commonFeatures.ts` | `services/commonFeatures.ts`, `services/admin-commonFeatures.ts` | `hooks/useCommonFeatures.ts` | `components/common/*` |
| Firebase Init | - | `firebase/init.ts`, `firebase/config.ts` | - | - |
| Notification Events | notification types | event helpers | - | `notifications/events/*` |
| Consumer Templates | notification types | template helpers | - | `templates/consumer/*` |

## Module Structure

```
src/
  index.ts              # Root exports (init, config, re-exports all below)
  components/           # UI components (ads, notifications, common)
  hooks/                # React hooks (4 hooks)
  services/             # Firestore services (7 services + index)
  types/                # TypeScript definitions (4 type files + index)
  notifications/        # Event system (registry, hooks, templates)
  templates/            # Consumer copy-paste templates (excluded from tsc)
  firebase/             # Firebase app init and config
  config/               # Package configuration (support URLs)
  stores/               # Zustand stores (placeholder)
  utils/                # Utility functions (placeholder)
```

## Export Architecture

6 entry points defined in `vite.config.ts` and `package.json`:

| Entry | Path | Exports |
|-------|------|---------|
| Main | `shared-features` | Init functions, config, + re-exports all below |
| Components | `shared-features/components` | Ad components, notification UI, common UI |
| Hooks | `shared-features/hooks` | useCampaigns, useBroadcasts, useFeatureFlags, useCommonFeatures |
| Services | `shared-features/services` | All Firestore services + analytics |
| Types | `shared-features/types` | All TypeScript interfaces/types |
| Notifications | `shared-features/notifications` | Event registry, hooks, templates |

## Adding a New Export

1. Create the file in the correct folder
2. Export from the folder's `index.ts`
3. Verify it flows through to the entry point
4. Run `yarn build` to confirm it appears in `dist/`
5. Run `yarn typecheck` to confirm declarations generate

## Import Rules

- Use `@/` alias for absolute imports within src (e.g., `import { getConfig } from '@/firebase/config'`)
- Never use relative paths that go up more than one level (no `../../`)
- Peer dependencies are externalized - import them directly (e.g., `import { Flex } from '@radix-ui/themes'`)

## Key Files

| File | Purpose |
|------|---------|
| `index.ts` | Root package exports |
| `vite-env.d.ts` | Vite type augmentations |

---

**Last Updated**: 2026-04-02
