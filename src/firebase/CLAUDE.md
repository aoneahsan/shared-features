# Firebase

Firebase initialization and configuration. NOT exported as a sub-entry - accessed via main entry.

## Files

| File | Purpose |
|------|---------|
| `init.ts` | `initSharedFeatures()`, `getSharedFeaturesApp()`, `getSharedFeaturesDb()`, `getSharedFeaturesAuth()`, `getDeviceId()` |
| `config.ts` | `getConfig()`, `isInitialized()` - package state management |

## Architecture

- Package creates its OWN Firebase app instance (separate from consuming app's Firebase)
- Named app: `shared-features` (not the default app)
- Config passed via `initSharedFeatures()` - NEVER hardcoded
- Device ID generated per-device for analytics tracking

## Security Rules

- NEVER expose Firebase credentials in source code
- All config comes from consuming app's environment variables
- `getConfig()` returns the active config or throws if not initialized
- `isInitialized()` is a safe boolean check consumers should use before rendering

## Environment Variables (Consumer Side)

```
VITE_SHARED_FEATURES_API_KEY
VITE_SHARED_FEATURES_AUTH_DOMAIN
VITE_SHARED_FEATURES_PROJECT_ID
VITE_SHARED_FEATURES_STORAGE_BUCKET
VITE_SHARED_FEATURES_MESSAGING_SENDER_ID
VITE_SHARED_FEATURES_APP_ID
VITE_SHARED_FEATURES_MEASUREMENT_ID
```

## Rules

- Never import `firebase/app` directly in services - use `getSharedFeaturesDb()`
- Never create additional Firebase app instances
- Debug logging gated behind `getConfig().debug`

---

**Last Updated**: 2026-04-02


## Sub-agents & Skills — Main-Context-First (IRON-SOLID)
Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) do NOT have
access to `/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all
skill-relevant work in the **MAIN context**; use a sub-agent ONLY when a **custom** agent exists in
`.claude/agents/` for that job; a default `Explore`/`Plan` agent is allowed ONLY for read-only,
no-skill search/exploration. When a relevant skill is missing, **install/enable it** rather than
proceeding skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)
