# Contributing to shared-features

Thanks for taking the time. This document covers how the repository is governed, how to get a change merged,
and the standards a pull request is held to.

## Table of contents

- [Governance](#governance)
- [Becoming a contributor](#becoming-a-contributor)
- [Development setup](#development-setup)
- [Project layout](#project-layout)
- [Coding standards](#coding-standards)
- [Commit messages](#commit-messages)
- [Pull request process](#pull-request-process)
- [Reporting a bug](#reporting-a-bug)
- [Releases](#releases)
- [Support](#support)

## Governance

`main` is protected. Every change — including the maintainer's own, in normal course — lands through a pull
request that has:

- at least one approving review,
- a green CI check,
- no force-push and no branch deletion (both are blocked).

Only the repository admin can bypass the ruleset, and that exists for maintenance, not as the usual path.
Write access alone does **not** allow pushing straight to `main`; review is always required.

## Becoming a contributor

Two routes, and the first needs no permission from anyone:

1. **Fork and open a pull request.** This is the normal path and it is open to everybody. Fork the
   repository, branch from `main`, push to your fork, and open a PR against `main`.
2. **Request collaborator access.** If you expect to contribute repeatedly, open an issue titled
   *Contributor access request* describing what you plan to work on, or email
   [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com). Access is granted at the maintainer's discretion, and
   as noted above it still routes your work through review.

## Development setup

The repository uses Yarn. Node must match [`.nvmrc`](./.nvmrc).

```bash
nvm use                 # Node 24.13.0
yarn install
```

Verify your checkout before changing anything, so you know a later failure is yours:

```bash
yarn typecheck          # tsc --noEmit
yarn lint               # eslint src
yarn build              # vite build + declaration emit
```

All three must pass with zero errors before a pull request is opened. There is no test suite; correctness is
established by the type checker, the linter, a successful build, and review.

Do not start a watch or dev server as part of a contribution check — the one-shot commands above are the gate.

## Project layout

```
src/components/     ad, notification and common-feature React components
src/hooks/          React hooks for campaigns, broadcasts, feature flags
src/services/       Firestore reads/writes and analytics
src/notifications/  notification event registry and templates
src/firebase/       initialisation and configuration
src/types/          shared type definitions
src/templates/      copy-into-your-app reference templates (not published)
website/            the marketing site — a separate package, not part of the library
```

The published library is `src/` only. `website/` has its own `package.json` and is never published to npm.

### Entry points

Six subpaths are exported, each with its own `index.ts` barrel: the root, `./components`, `./hooks`,
`./services`, `./types` and `./notifications`. Adding or renaming one means updating **all** of
`src/<sub>/index.ts`, the `build.lib.entry` map in `vite.config.ts`, and the `exports` map in `package.json`.
Change one without the others and the subpath silently resolves to nothing.

## Coding standards

- **TypeScript strict mode.** No `any` in a public signature. Prefer `unknown` plus narrowing where a type
  genuinely cannot be known.
- **No `console.*`.** Use the logger in `src/utils/logger.ts`.
- **Peer dependencies stay peers.** React, React DOM, Firebase, Radix, Zustand and `lucide-react` belong to
  the host application. Never move one into `dependencies`; never import a package that is not already a
  declared peer or a bundled dependency.
- **Every peer is external.** A new peer must be added to `rollupOptions.external` in `vite.config.ts`, or it
  is bundled into `dist/` and the consumer ends up with two copies at runtime.
- **No source maps in published output.** `build.sourcemap` and `declarationMap` stay off.
- **Files stay under 500 lines.** Split before that.
- **JSDoc on every exported function, component and hook**, including an `@example` where the usage is not
  obvious from the signature.
- **No TODO or placeholder comments.** Implement it, or leave it out and open an issue.
- **Delete unused code** rather than renaming it with an underscore.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <subject>
```

Types in use: `feat`, `fix`, `docs`, `refactor`, `perf`, `build`, `chore`. Scope is the area touched — `ads`,
`broadcasts`, `hooks`, `services`, `types`, `deps`.

```
fix(ads): make AdPanel variant prop functional
feat(hooks): add useBellBroadcasts convenience hook
docs: document the notification event registry
```

Write the subject in the imperative, under about 72 characters, with no trailing period.

## Pull request process

1. Branch from `main`.
2. Make the change, keeping it to one concern. A PR touching three unrelated things is three PRs.
3. Run `yarn typecheck && yarn lint && yarn build`.
4. Add a `CHANGELOG.md` entry under `## [Unreleased]` in the right category (Added / Changed / Deprecated /
   Removed / Fixed / Security). Describe the user-visible effect, not the implementation.
5. If the change alters an exported signature, adds an export, or changes an entry point, say so explicitly
   in the PR description — that information decides the next version number.
6. Open the PR against `main` with a description covering what changed, why, and how you verified it.

Do not bump the version in `package.json`. Releases are cut by the maintainer.

## Reporting a bug

Open an issue at [github.com/aoneahsan/shared-features/issues](https://github.com/aoneahsan/shared-features/issues)
with the package version, the versions of the relevant peer dependencies, a minimal reproduction, and what
you expected instead. Firestore permission errors are worth reporting with the exact error text — the message
usually names the rule that rejected the read.

## Releases

The maintainer publishes to npm. A release bumps the version according to the public surface — a changed
exported signature, a removed subpath or a raised `engines` floor is a major — moves the `## [Unreleased]`
entries under the new version heading in `CHANGELOG.md`, and publishes only after `typecheck`, `lint` and
`build` pass and the packed tarball has been checked.

## Support

Questions and bugs belong in [GitHub issues](https://github.com/aoneahsan/shared-features/issues).

If this package saves you time and you would like to give something back, you can do that at
[aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=shared-features&project-identifier=shared-features).
It is entirely optional and has no bearing on whether your issue or pull request gets attention.
