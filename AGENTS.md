# AGENTS.md — shared-features

**Last Updated:** 2026-10-20

**Last optimized:** 2026-10-20
**Next routine optimization:** 2026-11-19

## Scope

Public TypeScript package for feature flags, cross-promotion, broadcasts, notification events, and shared
profile data. The repository also contains a Capacitor admin and marketing app under `website/`; the deployed
public documentation lives in the separate public `shared-features-docs` repository.

| Item | Current value |
|---|---|
| npm package | `shared-features@0.1.16` |
| Node | `>=24.13.0`; `.nvmrc` is authoritative |
| Package manager | Yarn only |
| Package entries | root, components, hooks, services, types, notifications |
| App | `website/`, React 19 + Vite 8 + Capacitor 8 |
| Docs | `/home/ahsan/Documents/01-code/projects/shared-features-docs` |

## Start here

Read the nearest guide pair, the affected source, and the relevant public docs. Historical plans and completed
trackers are evidence; do not load them for routine work. The current fleet pass does not repair or deploy the
legacy Firebase backend because this product is scheduled for Supabase redevelopment.

## Commands

Package:

```bash
yarn install --immutable
yarn typecheck
yarn lint
yarn build
yarn pack --dry-run
```

Website, from `website/`:

```bash
yarn install --immutable
yarn typecheck
yarn lint
yarn build
yarn sync:apps-config
```

## Package invariants

- Preserve all six public entry points and existing exports within the current version line.
- Keep consumer-owned libraries as peer dependencies and externalize them from the bundle.
- Keep declaration files at the paths in `package.json`; ship no source maps.
- Use the named Firebase app created by `src/firebase/`; do not create another default instance.
- Keep all collections under the `zaions_` prefix and keep consumer services safe on empty data.
- Treat the package source and built declarations as the authority for examples and API claims.
- Never install, import, vendor, or copy an owner-created client package, including `@perkforce/tool-kit`.
- Never commit environment values, service-account files, private keys, tokens, or credentials.

## Website and native boundaries

Public, legal, sitemap, and feed routes use the public layout. Authenticated management routes use the admin
layout. Keep `@trapezedev/configure`, `apps-config.yaml`, and the exact script
`"sync:apps-config": "trapeze run apps-config.yaml"`. Run Trapeze after native identity changes. Do not write
to or deploy the old Firebase backend during this maintenance pass.

## Release and publishing

Run package and website gates before a package release. Verify packed exports and declarations before npm
publish. Build and inspect the companion Docusaurus site in a controlled browser before its Pages commit.
Native and store releases require their platform-specific gates.

## Context record

The root, source domains, package docs, website, website source, Android, and iOS guide pairs were reviewed on
2026-10-20. Routine context work is ineligible before 2026-11-19 unless the tree changes materially or an
instruction is proven stale.

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint in this repository and each independent nested repository, fetch and merge the designated upstream, push the documented working branch, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the exact repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.
