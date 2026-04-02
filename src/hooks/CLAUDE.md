# Hooks

Custom React hooks exported via `shared-features/hooks`.

## Hook Inventory

| Hook | Service Dependency | Returns |
|------|--------------------|---------|
| `useCampaigns.ts` | `services/campaigns.ts`, `services/analytics.ts` | `{ campaigns, loading, error }` + ad modal helpers |
| `useBroadcasts.ts` | `services/broadcasts.ts` | `{ broadcasts, loading, markAsRead, dismiss }` |
| `useFeatureFlags.ts` | `services/featureFlags.ts` | `{ flags, loading, checkFlag, isEnabled }` |
| `useCommonFeatures.ts` | `services/commonFeatures.ts` | 9 sub-hooks for each profile data type |

## Hook Conventions

1. **`use` prefix** - All hooks start with `use` (React convention)
2. **Return objects** - Return named objects `{ data, loading, error }`, not arrays
3. **Wrap services** - Hooks are React wrappers around services, adding state/lifecycle
4. **Handle loading** - Always expose `loading` boolean for UI skeleton states
5. **Handle errors** - Catch service errors, expose via `error` field or log silently
6. **Memoize** - Use `useMemo`/`useCallback` for computed values and callbacks

## Dependency Array Rules

- Do NOT add stable refs to dependency arrays (useState setters, useRef.current)
- Use `eslint-disable-next-line react-hooks/exhaustive-deps` for intentional omissions with a comment explaining why
- Service function references are stable - don't add them to deps

## Adding a New Hook

1. Create `useXxx.ts` in this folder
2. Import service functions from `@/services/`
3. Return a typed object (define return type in `@/types/`)
4. Export from `hooks/index.ts`
5. Update `src/CLAUDE.md` feature areas table

---

**Last Updated**: 2026-04-02
