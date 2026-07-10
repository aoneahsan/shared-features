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


## Sub-agents & Skills — Main-Context-First (IRON-SOLID)
Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) do NOT have
access to `/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all
skill-relevant work in the **MAIN context**; use a sub-agent ONLY when a **custom** agent exists in
`.claude/agents/` for that job; a default `Explore`/`Plan` agent is allowed ONLY for read-only,
no-skill search/exploration. When a relevant skill is missing, **install/enable it** rather than
proceeding skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)
