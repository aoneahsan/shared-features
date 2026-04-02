# AGENTS.md - shared-features

> AI agent instructions for shared-features package development

## Project Identity

| Property | Value |
|----------|-------|
| Package | `shared-features` v0.1.13 |
| License | MIT |
| Node | >= 24.13.0 |
| Build | Vite (library mode) + tsc declarations |
| Repo | github.com/aoneahsan/shared-features |

---

## CRITICAL: File Freshness Enforcement

**On EVERY session start, agents MUST:**
1. Check `Last Updated` on root CLAUDE.md and this file
2. If either is older than 3 days, update before doing any other work
3. Spot-check 2-3 nested CLAUDE.md/AGENTS.md files for staleness
4. After any doc changes, update `Last Updated` dates

---

## Agent Responsibilities

| Agent | Role |
|-------|------|
| **Claude Code** | Primary implementation, builds, publishes, updates docs |
| **Codex** | Reviews, specs. Does NOT implement unless explicitly requested |

## Setup & Commands

```bash
yarn install          # Install dependencies
yarn build            # Vite build + type declarations
yarn dev              # Watch mode for development
yarn lint             # ESLint check
yarn typecheck        # TypeScript strict check
npm publish           # Publish to npm (after build)
```

## Code Conventions

### Module Export Pattern

6 entry points - every public API must be exported through the correct path:

```typescript
// Main entry
import { initSharedFeatures, getConfig } from 'shared-features';

// Sub-entries
import { AdPanel, AdBanner } from 'shared-features/components';
import { useCampaigns, useBroadcasts } from 'shared-features/hooks';
import { getCampaigns, trackImpression } from 'shared-features/services';
import type { Campaign, Broadcast } from 'shared-features/types';
import { NotificationEventRegistry } from 'shared-features/notifications';
```

### File Conventions

- Max 500 lines per file
- JSDoc on all public functions
- Absolute imports with `@/` alias (maps to `src/`)
- Named exports only (no default exports)
- TypeScript strict mode enforced

### UI Framework

- **Radix UI Themes** for all UI components
- **Lucide React** for icons
- **Zustand** for state management
- Components must accept Radix theme tokens, not hardcoded colors

## Compatibility Rules (IRON-SOLID)

1. **NEVER break consuming app imports** - All 6 export entry points must remain stable
2. **NEVER add required peer dependencies** without major version bump
3. **NEVER expose Firebase credentials** in code or types
4. **NEVER bundle peer dependencies** - React, Firebase, Radix, Zustand stay external
5. **Deprecate before removing** - Mark with `@deprecated` JSDoc, remove in next major
6. **Test in consuming apps** before publishing any version change

## Adding New Features Workflow

1. Define types in `src/types/` (or extend existing type file)
2. Create service in `src/services/` with Firestore integration
3. Create hook in `src/hooks/` wrapping the service
4. Create component in `src/components/` if UI is needed
5. Export from the correct `index.ts` files (folder + root)
6. Update `vite.config.ts` entry points if adding new sub-entry
7. Update `package.json` exports map if adding new sub-entry
8. Run `yarn build && yarn typecheck && yarn lint`
9. Update README.md, CLAUDE.md, and AGENTS.md

## Firestore Collection Naming

All collections use `zaions_` prefix: `zaions_feature_flags`, `zaions_campaigns`, `zaions_products`, `zaions_impressions`, `zaions_broadcasts`, `zaions_broadcast_events`, `zaions_notification_templates`, `zaions_contact_info`, `zaions_developer_info`, `zaions_social_links`, `zaions_address_info`, `zaions_payment_options`, `zaions_services`, `zaions_skills`, `zaions_testimonials`

## Testing Requirements

Before every publish:
- `yarn build` MUST pass (zero errors)
- `yarn typecheck` MUST pass (zero errors)
- `yarn lint` SHOULD pass (zero warnings)
- Manual test in at least one consuming app (ZTools preferred)

## What NOT to Do

- Do not add app-specific business logic
- Do not add runtime dependencies (everything is peer)
- Do not create `.sh` scripts or `scripts/` folder
- Do not modify `src/templates/` TypeScript declarations (excluded in tsconfig)
- Do not use localStorage (use `@capacitor/preferences`)
- Do not hardcode Firebase config values

---

**Last Updated**: 2026-04-02
