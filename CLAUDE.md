# shared-features

**Package**: `shared-features` v0.1.13 | **NPM**: npmjs.com/package/shared-features
**Purpose**: Centralized shared product features for Zaions projects (ads, broadcasts, profile data, feature flags, analytics, notification events)

---

## CRITICAL: File Freshness Rule (IRON-SOLID)

**Every CLAUDE.md and AGENTS.md file in this project MUST be updated at least once every 3 days.**

On EVERY Claude Code session start in this project:
1. Check `Last Updated` date on root CLAUDE.md and AGENTS.md
2. If older than 3 days from today, update immediately before any other work
3. Verify nested CLAUDE.md/AGENTS.md files are current (spot-check 2-3)
4. Update `Last Updated` dates after any content changes

**Why**: Stale documentation causes AI agents to make wrong assumptions, waste context on outdated patterns, and produce incompatible code. Fresh docs = better dev results.

---

## Build & Verify (Run Before Every Publish)

```bash
yarn build       # Vite build + type declarations (MUST pass)
yarn typecheck   # TypeScript strict check (MUST pass)
yarn lint        # ESLint (SHOULD pass)
```

## Current Verified State

- Build/Typecheck/Lint: All passing as of 2026-03-24
- Next audit due: 2026-04-05

---

## Core Working Rules

1. **Reusable infrastructure** - This package serves ALL Zaions projects. Never add app-specific logic
2. **Backward compatibility** - NEVER break consuming app imports. Deprecate before removing
3. **Docs in sync** - When exports/features change, update README.md, this file, and portfolio file in same pass
4. **yarn only** - Use `yarn` for all package management. Never npm/pnpm locally
5. **Peer dependencies** - All React/Firebase/Radix/Zustand deps are peers, never bundled

## Portfolio File Rule

- Maintain one file: `SHARED-FEATURES_portfolio-info_YYYY-MM-DD.md`
- Refresh after 7+ days or on major release
- Max 10 update-history records
- When portfolio changes, update README.md and this CLAUDE.md together

## Version Bump Checklist

When updating version, update ALL of these:
1. `package.json` version field
2. Root CLAUDE.md version reference (this file)
3. AGENTS.md version reference
4. README.md if version is mentioned
5. Portfolio file if due for refresh
6. Run `yarn build && yarn typecheck` to verify

## Publishing Workflow

```bash
# 1. Bump version in package.json
# 2. Update docs (this file, AGENTS.md, README)
# 3. Build and verify
yarn build && yarn typecheck && yarn lint
# 4. Publish
npm publish
# 5. Update consuming apps to new version
```

---

## Nested Documentation Map

| Path | Contains |
|------|----------|
| `AGENTS.md` | Agent responsibilities, code conventions, compatibility rules |
| `src/CLAUDE.md` | Source structure, feature areas, export patterns, adding features |
| `src/AGENTS.md` | Agent rules for source code work |
| `src/components/CLAUDE.md` | Component development rules, Radix UI patterns |
| `src/services/CLAUDE.md` | Service layer rules, Firestore collections, admin/consumer split |
| `src/hooks/CLAUDE.md` | Hook conventions, return patterns, dependency arrays |
| `src/types/CLAUDE.md` | Type definitions, naming, export patterns |
| `src/firebase/CLAUDE.md` | Firebase init, config, security rules |
| `src/notifications/CLAUDE.md` | Event system, templates, registry |
| `src/templates/CLAUDE.md` | Consumer templates, copy-paste pattern |
| `website/CLAUDE.md` | Website stack, structure, SEO, build commands |
| `website/AGENTS.md` | Agent rules for website development |
| `docs/CLAUDE.md` | Documentation structure, update history, audit records |

---

## Consuming Apps

This package is used by:
- **ZTools** (`com.zaions.ztools`) - Primary consumer
- **Other Zaions projects** - Via `yarn add shared-features`

Integration guide for consumers: `AI-INTEGRATION-GUIDE.md`

---

**Last Updated**: 2026-04-02
