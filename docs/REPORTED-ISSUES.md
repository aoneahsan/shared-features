# Reported issues — shared-features

Open issues only — this is the fix queue. Fixed entries move to `docs/RESOLVED-ISSUES.md` with the
resolution date and the fixing version. Never delete an entry.

Greppable marker: `^### ISSUE-`   ·   Standard: `~/.claude/rules/project-issue-reporting.md`

**Last Updated:** 2026-07-25

---

### ISSUE-001 — Build emitted type declarations to `dist/src/**`, breaking every `types` entry point

- **Status:** FIXED IN TREE, UNPUBLISHED — the fix is on `main` and has not been released.
- **Affected:** the working tree between the `vite-plugin-dts` v5 upgrade and 2026-07-25. Published
  `0.1.14` is **not** affected — its tarball carries correct flat declarations.
- **Reporter:** package-standard audit, 2026-07-25.

**Symptom.** `yarn build` succeeded and printed no warning, but all seven declared type entry points
pointed at files that did not exist:

```
MISS  types                     ./dist/index.d.ts
MISS  . -> types                ./dist/index.d.ts
MISS  ./components -> types     ./dist/components/index.d.ts
MISS  ./hooks -> types          ./dist/hooks/index.d.ts
MISS  ./services -> types       ./dist/services/index.d.ts
MISS  ./types -> types          ./dist/types/index.d.ts
MISS  ./notifications -> types  ./dist/notifications/index.d.ts
7 of 21 MISSING
```

Declarations landed at `dist/src/index.d.ts` instead of `dist/index.d.ts`. A consumer would have installed
a package whose types silently fail to resolve on every import path.

**Root cause.** `vite-plugin-dts` v5 changed how it infers the declaration emit root. With
`include: ['src']` and no explicit `entryRoot` it preserved the `src/` path segment. `tsc
--emitDeclarationOnly` did the same, because `tsconfig.json` set `declarationDir` but no `rootDir`.

**Fix.** Pin the emit root in both places, because both steps emit declarations:

- `vite.config.ts` -> `dts({ entryRoot: 'src' })`
- `tsconfig.json` -> `"rootDir": "./src"`

**Why no gate caught it.** `typecheck`, `lint` and `build` all passed — none of them reads the `exports`
map. Only walking every declared subpath against the filesystem exposes it. That walk is now in the
release checklist in `CONTRIBUTING.md`.

**Remaining action.** The fix is unpublished. Publishing is the owner's decision.

---

### ISSUE-002 — `AI-INTEGRATION-GUIDE.md` documented an API that does not exist, and it ships to npm

- **Status:** FIXED IN TREE, UNPUBLISHED.
- **Affected:** every published version up to and including `0.1.14`. The file is in the `files` allowlist,
  so the wrong content sits in the public tarball.
- **Reporter:** package-standard audit, 2026-07-25.

**Symptom.** The guide is written for coding agents, so its errors become generated code that does not
compile. Checked against the built `.d.ts` files, it was wrong in nine places:

| Documented | Actual |
|---|---|
| `<AdPanel variant="small" />` | `variant` is `SmallPanelVariant` — `'small'` is not assignable |
| `<AdSlider variant autoRotate interval />` | `AdSlider` accepts only `placement`, `className`, `style` |
| `useOneTimeAdModal() -> { AdModalComponent }` | `{ shouldShow, markAsShown }` |
| `useUpdateAdModal() -> { UpdateModalComponent }` | `{ shouldShow, previousVersion, currentVersion, markAsShown }` |
| `<BroadcastBanner position="top" />` | `{ broadcast, onActionClick, onDismiss, className }` — no `position` |
| `<AnnouncementModal />` | requires `broadcast`, `isOpen`, `onClose`, `onActionClick` |
| `useBroadcasts() -> { loading, markAsRead }` | `{ isLoading, ... }`; there is no `markAsRead` |
| `trackImpression(campaignId, productId)` · `trackDismissal(...)` | `trackImpression` takes five arguments; `trackDismissal` does not exist — it is `trackClose` |
| `getCampaigns()` · types `Broadcast`, `Platform` | `fetchCampaigns()`; the types are `BroadcastNotification` and `ConsumerPlatform` / `NotificationPlatform` |

It also linked `./README.md` relatively, which is dead when npm renders the file outside the repository.

**Fix.** Rewritten from the built declarations, every signature verified, all links absolute.

---

### ISSUE-003 — README documented an API that does not exist

- **Status:** FIXED IN TREE, UNPUBLISHED.
- **Affected:** every published version up to and including `0.1.14`.
- **Reporter:** package-standard audit, 2026-07-25.

**Symptom.** The README's headline broadcast example did not compile:

```tsx
<BroadcastBanner broadcasts={broadcasts} onDismiss={dismissBroadcast} onClick={trackClick} />
```

`BroadcastBanner` takes a single `broadcast`, and the callback is `onActionClick`, not `onClick`. The
plural component is `BroadcastBanners`.

Also wrong: broadcast priorities were listed as `low | medium | high | urgent` — the real
`NotificationPriority` is `urgent | high | normal | low` (`normal`, not `medium`); the documented
`UseBroadcastsResult` type does not exist (it is `UseBroadcastsReturn`, with a different `trackClick`
signature); and the `AdPlacement` table omitted `topbar_banner`.

**Fix.** README rewritten to the house standard with every signature read from the built declarations.

---

### ISSUE-004 — `.d.ts.map` files shipped in the published tarball

- **Status:** FIXED IN TREE, UNPUBLISHED.
- **Affected:** published `0.1.14` — 44 `.d.ts.map` files in the tarball.
- **Reporter:** package-standard audit, 2026-07-25.

**Symptom.** `tsconfig.json` had `declarationMap: true`, so declaration source maps were emitted and swept
in by the `dist` entry in `files`. This violates the standing rule that published output ships no source
maps: the maps expose the source tree layout, and they reference `../src/**` paths absent from the tarball,
so they resolve to nothing anyway.

**Fix.** `declarationMap: false`. Packed output dropped from 147 files / 1.9 MB unpacked to 78 files /
754 kB.

---

### ISSUE-005 — Library fixes have sat unpublished on `main` since 2026-04-27

- **Status:** OPEN — needs a publish decision from the owner.
- **Reporter:** package-standard audit, 2026-07-25.

**Symptom.** `0.1.14` was published on 2026-04-27 (source: npm registry `time` field). Since then `main`
has accumulated library changes no consumer has received. The most user-visible is commit `bf7c321`
(2026-06-23): `AdPanel` accepted a `variant` prop of `small_panel_1`...`small_panel_5` and **ignored it**,
always rendering one hard-coded layout. Fixed in the tree, unreleased.

Anyone installing `shared-features` today gets the version where `AdPanel`'s documented `variant` prop does
nothing.

**Why this matters beyond this package.** A green `typecheck`/`lint`/`build` says nothing about whether the
tree and the registry agree. Only comparing built output against the published tarball does. The inverse of
this — publishing *from* a stale tree — is the `strata-storage@2.8.2` failure.

**Action.** Cut a release. The version bump and publish are the owner's call; this audit deliberately did
not bump the version.

---

### ISSUE-006 — No CI runs on push or pull request

- **Status:** OPEN — deliberate, recorded so it stays a decision rather than an oversight.
- **Reporter:** package-standard audit, 2026-07-25.

**Symptom.** `.github/workflows/placeholder.yml` is `workflow_dispatch`-only and does nothing. The
repository is now public, and `~/.claude/rules/public-repo-governance.md` requires a `main` ruleset whose
required status check is a real CI job. With no CI job there is no check to require, so an outside
contributor's pull request cannot be gated on anything automated.

**Fix (when the owner wants it).** Replace the placeholder with a job named `Package` running
`yarn install --immutable`, `yarn typecheck`, `yarn lint`, `yarn build`; then create the ruleset with
`required_status_checks: [{ context: "Package" }]`.

Not done in this pass: adding a workflow that spends Actions minutes is an owner decision, and the ruleset
must name a CI job that actually exists or every non-owner merge is blocked forever.
