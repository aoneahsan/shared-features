# AGENTS.md - Source Code

Agent instructions for working within `src/`.

## Before Modifying Any File

1. Read the file first - understand existing patterns
2. Check the folder's CLAUDE.md for domain-specific rules
3. Ensure exports flow through the correct `index.ts`
4. Run `yarn build && yarn typecheck` after changes

## Code Patterns

### Named Exports Only
```typescript
// CORRECT
export function getCampaigns() { ... }
export const useCampaigns = () => { ... };

// WRONG - no default exports
export default function getCampaigns() { ... }
```

### JSDoc on Public Functions
```typescript
/**
 * Fetches active campaigns for the current project.
 * @param options - Filter options for campaigns
 * @returns Array of active Campaign objects
 */
export async function getCampaigns(options?: CampaignFilterOptions): Promise<Campaign[]> { ... }
```

### Error Handling Pattern
```typescript
try {
  const result = await someFirestoreCall();
  return result;
} catch (error) {
  if (getConfig().debug) {
    console.error('[shared-features] Operation failed:', error);
  }
  return fallbackValue;
}
```

### Index Re-export Pattern
Every folder's `index.ts` re-exports its public API:
```typescript
// services/index.ts
export { getCampaigns, getCampaignById } from './campaigns';
export { trackImpression, trackClick } from './analytics';
// ... etc
```

## Review Checklist

Before completing any source change:
- [ ] Exports added to folder `index.ts`
- [ ] Types defined/updated in `types/`
- [ ] No default exports introduced
- [ ] No hardcoded Firebase config values
- [ ] No app-specific logic added
- [ ] `yarn build` passes
- [ ] `yarn typecheck` passes

---

**Last Updated**: 2026-04-02
