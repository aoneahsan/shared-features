# shared-features

**Package**: `shared-features` v0.1.14 | **NPM**: npmjs.com/package/shared-features
**Purpose**: Centralized shared product features for Zaions projects (ads, broadcasts, profile data, feature flags, analytics, notification events)

## Task Speed Over Docs (IRON-SOLID — BEHAVIORAL)

Finish the real task fast + correctly FIRST; docs/trackers/sync are a footnote (≤~20% of effort) — never let recording outpace the fix. HARD STOP when doc work outpaces the change → ship, then ONE line if anything. No new summary/status/completion files unless asked; edit/delete over add; delete stale docs. Full rule: `~/.claude/CLAUDE.md`. (Est. 2026-06-19)

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

- Build/Typecheck/Lint: All passing as of 2026-06-23 (v0.1.14). `yarn typecheck` 0 errors, `yarn build` clean (ESM + CJS + d.ts, 6 entry points), `yarn lint` 0 warnings. No `test` script defined (no automated test suite).
- 2026-06-23 finalization: fixed `AdPanel` documented `variant` prop (was a no-op TODO) to render via `getSmallPanelVariant` like `AdSlider`; refreshed README Current State.
- Holds (do not bump): firebase pinned at 12.x major, zustand at major 5.

## Manual / User-Only Tasks

The ONE place for human-only work (npm publish, docs-site Firebase deploy, DNS): **`docs/MANUAL-TASKS.md`**. The agent appends; only you tick items off. Global spec: `~/.claude/rules/manual-tasks.md`.

## Documentation Site

Companion docs site lives in a separate PUBLIC repo: **`shared-features-docs`** (`github.com/aoneahsan/shared-features-docs`, local `01-code/projects/shared-features-docs`) — Docusaurus 3, full API/component/hook/service reference. Finalization tracker: `docs/project-finalization/00-tracker.json`.

## Full Codebase + SEO/AEO/Content Audit

- **Last run**: 2026-05-05
- **Next eligible run**: 2026-05-12 (7-day minimum interval)
- **Tracker**: `full-audit-tracker.json` (root) — read this BEFORE running the audit prompt again. If `last_run_date` is within 7 days, skip the run.
- **Last run fixes**: sitemap.xml lastmod, /feed page + /feed.xml, SitemapPage feed banner, centralized logger (`src/utils/logger.ts`), campaigns.ts console spam removed.

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
- Required blocks: Identity & Distribution (NPM `shared-features`, consumer list), inline SVG logo, palette, Update History, Vision/Mission, Tech Stack, Feature Catalog (modules), Hidden Facts, Resume bullets, Social angles, SEO/AEO metadata, Hashtags
- Tracker: `/home/ahsan/Documents/01-code/docs/tracking/portfolio-info-files-update-tracker.json`
- Last applied: 2026-06-05
- Mirrored in `AGENTS.md`

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
