# AGENTS.md - shared-features

> AI agent instructions for shared-features package development

## Task Speed Over Docs (IRON-SOLID — BEHAVIORAL)

Finish the real task fast + correctly FIRST; docs/trackers/sync are a footnote (≤~20% of effort) — never let recording outpace the fix. HARD STOP when doc work outpaces the change → ship, then ONE line if anything. No new summary/status/completion files unless asked; edit/delete over add; delete stale docs. Full rule: `~/.claude/CLAUDE.md`. (Est. 2026-06-19)

## Project Identity

| Property | Value |
|----------|-------|
| Package | `shared-features` v0.1.14 |
| License | MIT |
| Node | >= 24.13.0 |
| Build | Vite (library mode) + tsc declarations |
| Repo | github.com/aoneahsan/shared-features (PRIVATE) |
| Docs site | github.com/aoneahsan/shared-features-docs (PUBLIC, Docusaurus) |
| Manual tasks | `docs/MANUAL-TASKS.md` (npm publish, docs deploy — user-only) |
| Verified | 2026-06-23 — typecheck/lint/build all green (v0.1.14) |

---

## CRITICAL: File Freshness Enforcement

**On EVERY session start, agents MUST:**
1. Check `Last Updated` on root CLAUDE.md and this file
2. If either is older than 3 days, update before doing any other work
3. Spot-check 2-3 nested CLAUDE.md/AGENTS.md files for staleness
4. After any doc changes, update `Last Updated` dates

---

## Features

- Centralized ad management (AdModal, AdSlider, AdBanner, AdCarousel, TopbarAdBanner)
- Cross-project notifications and broadcasts
- Broadcast banners and announcement modals
- Contact/profile data management (9 data types)
- React components with Radix UI + feature flag system

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

## Git Commit Strategy — ONE Commit Per Prompt (IRON-SOLID)

**Never make 20/50/100 small commits for a single user request. ONE commit per prompt is the standard.**

| Rule | Requirement |
|------|-------------|
| **Commit frequency** | ONE commit at the END of the full task, not per-file or per-change |
| **Scope** | Complete the ENTIRE prompt/module/task fully, THEN commit everything together |
| **NO intermediate commits** | Do NOT commit after each file edit, each module, or each small change — wait until the ENTIRE prompt is done |
| **Push** | Always push after commit — local and server MUST be fully in sync |
| **Conflicts** | If remote has changes: commit local first, pull (rebase), resolve conflicts, push |

**Workflow at the end of every prompt:**
1. Complete ALL work for the user's prompt — no intermediate commits during the work
2. `git add` the relevant changed files (prefer specific files over `git add -A`)
3. `git commit` with ONE descriptive message covering the whole task
4. `git pull --rebase origin main` (resolve conflicts if any)
5. `git push origin main`
6. Confirm local and server are fully in sync before ending the response

**Why:** Multiple small commits per prompt create noisy git history, make reverts harder, and are annoying to review. One clean commit per task is the standard.

**Exception:** Only split commits if the user explicitly asks for separate commits, or if changes span truly independent modules that should be tracked separately.

---

## Portfolio Info File — Weekly Update Rule (IRON-SOLID)

- Canonical portfolio info file: `/home/ahsan/Documents/ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/packages/SHARED-FEATURES_portfolio-info_2026-06-05.md`
- Update at least once per week (and on any material change). Keep the last-updated date in the filename.
- Keep a max-10-entry update history inside the file. On each refresh: prepend today's row, delete the previous dated file, write the new one.
- Required blocks: Identity & Distribution, inline SVG logo, palette, Update History, Vision/Mission, Tech Stack, Feature Catalog, Hidden Facts, Resume bullets, Social angles, SEO/AEO metadata, Hashtags
- Tracker: `/home/ahsan/Documents/01-code/docs/tracking/portfolio-info-files-update-tracker.json`
- Last applied: 2026-06-05
- Mirrored in `CLAUDE.md`

---

## Package Manager Hierarchy: nvm → npm (global) → yarn (local) (IRON-SOLID)

Three tiers, each tool ONLY for its tier — for the best, most reproducible dev results:
- **`nvm`** → install/update Node.js (which bundles `npm`): `nvm install --lts`. Use nvm to get/update `npm` itself.
- **`npm`** → ALL global packages: `npm install -g yarn` (install yarn globally if missing) + `npm install -g <pkg>` (every other global CLI).
- **`yarn`** → ALL local project work: `yarn`, `yarn add <pkg>`, `yarn add -D <pkg>` inside the project.

❌ NEVER use `npm`/`pnpm` for LOCAL installs. NEVER use `pnpm` at all. ✅ Only `yarn.lock` in the project — delete `package-lock.json` and `pnpm-lock.yaml`.

---

## Package Upgrades: Use `npm-check-updates`

For dependency upgrades use `npx -y npm-check-updates -u && yarn install` (latest STABLE), NOT `yarn upgrade --latest`. Full rule in global `~/.claude/CLAUDE.md`. Last applied: 2026-06-05 (no-op — all deps already current). Holds: firebase 12.14, zustand major 5.

---

## Full Codebase + SEO/AEO/Content Audit

- **Last run**: 2026-05-05
- **Next eligible run**: 2026-05-12 (7-day minimum interval)
- **Tracker**: `full-audit-tracker.json` at project root
- Before re-running the audit prompt: read the tracker. If `last_run_date` is within 7 days, skip and tell the user.
- Mirrored in `CLAUDE.md`

## Share Feature — Web + Mobile Contract (IRON-SOLID)

All user-facing "share" actions follow the global contract: **web** (any browser, incl. mobile web) opens an in-app `WebShareModal` — a social grid (X, Facebook, LinkedIn, WhatsApp, Telegram, Reddit, Email web-intents) + a copy-link button; **native** (Capacitor) uses the OS share sheet via `@capacitor/share`. The web-vs-native split is decided at button-click via `Capacitor.isNativePlatform()`. ❌ Never use `navigator.share` as the primary web path with a silent clipboard fallback. **Full spec: `~/.claude/rules/share-feature.md`.**

---

**Last Updated**: 2026-06-23


---

## SEO + AEO + Ranking (Global Playbook) — IRON-SOLID

When the user asks "fix SEO of this project", "is this SEO ready", "why isn't this ranking", "improve AI search visibility", "submit to search engines", or similar, run the global diagnostic + fix playbook at `~/.claude/rules/seo-aeo-ranking.md` end-to-end. It captures every lesson learned across projects: GSC indexing-funnel diagnosis (Discovered/Crawled-not-indexed), per-page-uniqueness floor for programmatic sites (1000+ words, distinct title/meta, FAQ + HowTo + Article schema), SPA prerendering so AI crawlers (GPTBot, ClaudeBot, PerplexityBot) see the same content as users, robots.txt AI-bot allowlist, machine-readable files (llms.txt, pricing.md, IndexNow), third-party citation strategy (Wikipedia/Reddit/Product Hunt), and the multi-session content-enrichment workflow.

**Last applied**: not yet — run the §10 drop-in fix sequence on first invocation, then update this date and any project-specific tracker (e.g. `docs/tracking/*-seo-content-tracker.json`).

<!-- project-links:start -->
## Links

- Live: https://www.npmjs.com/package/shared-features
- NPM: https://www.npmjs.com/package/shared-features

_URL source of truth: `01-code/projects/project-live-urls.json` (auto-generated — do not hand-edit between these markers)._
<!-- project-links:end -->

---

## Gitignore Hygiene (IRON-SOLID)
`.gitignore` stays current with the project structure — ignore only recoverable artifacts (build/`dist`/`www`/`node_modules`/logs/caches/IDE), never lose source. Custom rules always present: `*.ignore.*`, `project-record-ignore/`. This is a **PRIVATE** repo -> `.env`/secrets/keystores ARE tracked in git.
Full rule + private/public protocol: `~/.claude/rules/project-config.md`.
Gitignore Last Verified: 2026-06-24

## Source maps — disabled by default — RULE
Never generate source maps for this project unless the owner (aoneahsan) explicitly requests them.
Production / build / published output must ship WITHOUT source maps — no `.map` files and no
`//# sourceMappingURL` in shipped assets.

- **Vite**: `build.sourcemap: false` in `vite.config.*`.
- **Rollup**: `output.sourcemap: false` on every output.
- **Webpack**: production `devtool: false` (dev-only inline maps for local debugging are allowed).
- **tsup**: `sourcemap: false`.
- **tsconfig** (library / `tsc` builds): `"sourceMap": false`, `"inlineSourceMap": false`, `"declarationMap": false`.

Dev-only inline source maps for local debugging are fine; never emit source maps in production / published
output. Do NOT re-enable production source maps or delete these settings. Only the owner, by an explicit
request, may turn production source maps on (e.g. a one-off Sentry upload).


## Sub-agents & Skills — Main-Context-First (IRON-SOLID)
Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) do NOT have
access to `/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all
skill-relevant work in the **MAIN context**; use a sub-agent ONLY when a **custom** agent exists in
`.claude/agents/` for that job; a default `Explore`/`Plan` agent is allowed ONLY for read-only,
no-skill search/exploration. When a relevant skill is missing, **install/enable it** rather than
proceeding skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)
