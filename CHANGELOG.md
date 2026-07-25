# Changelog

All notable changes to `shared-features` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the version stays below `1.0.0` the public
API may still change in a minor release — see [Limitations](https://github.com/aoneahsan/shared-features#-limitations).

> **On the entries below `0.1.14`.** This changelog was written on 2026-07-25, after those versions had already
> shipped. Release notes were not recorded at the time, and the commits covering them carry no usable messages,
> so per-version detail cannot be reconstructed honestly. Those versions are listed with their real publish
> dates — read from the npm registry — and nothing more. Every release from `0.1.14` onward is described from
> the commits that produced it.

## [0.1.15] - 2026-07-25

Changes on `main` that have not been published to npm. `0.1.14` remains the published `latest`.

### Fixed

- `AdPanel` now honours its `variant` prop. It previously accepted `small_panel_1`…`small_panel_5` and
  ignored the value, rendering one hard-coded layout. An explicit prop wins; otherwise the campaign's own
  `variant` from the admin panel is used, falling back to `small_panel_2`. This matches how `AdSlider`
  already resolved variants.
- Type declarations are emitted at the paths the `exports` map declares. A `vite-plugin-dts` v5 upgrade
  changed the default emit root, moving every `.d.ts` under `dist/src/`, which left all seven `types` entry
  points pointing at files that did not exist. The build now pins the emit root to `src/`.

### Changed

- `description`, `homepage`, `funding` and `keywords` brought to the package metadata contract. `homepage`
  now points at the documentation site rather than the repository README anchor.
- `sideEffects: false` declared, so bundlers can tree-shake unused exports.
- TypeScript pinned to `~6.0.3`. The previous `^6.0.3` allowed 6.1+, which is outside the range
  `typescript-eslint` supports and breaks `yarn lint`.
- README rewritten to the documentation standard.

### Added

- `LICENSE`, `CHANGELOG.md` and `CONTRIBUTING.md`. The repository is public and previously had none of them.
- `LICENSE` and `CHANGELOG.md` added to the published `files` allowlist. npm includes a `LICENSE`
  automatically but never a changelog.

### Removed

- Source maps are no longer produced for published output: `declarationMap` is off, so the 44 `.d.ts.map`
  files that shipped in `0.1.14` are gone.

## [0.1.14] — 2026-04-27

### Fixed

- Brand icons in the common-features components are inlined SVGs. `lucide-react` v1.11 removed its `Github`,
  `Linkedin` and `Twitter` exports, which broke the build for consumers on that version.

### Changed

- Dependencies updated to their latest stable releases.

## Earlier releases

Published to npm on the dates below. See the note at the top of this file for why no detail accompanies them.

| Version | Published |
|---|---|
| `0.1.13` | 2026-02-11 |
| `0.1.12` | 2026-02-11 |
| `0.1.11` | 2026-02-10 |
| `0.1.10` | 2026-02-10 |
| `0.1.9` | 2026-02-10 |
| `0.1.8` | 2026-02-10 |
| `0.1.7` | 2026-02-10 |
| `0.1.6` | 2026-02-07 |
| `0.1.5` | 2026-02-07 |
| `0.1.4` | 2026-02-07 |
| `0.1.3` | 2026-02-06 |
| `0.1.2` | 2026-02-06 |
| `0.1.1` | 2026-02-05 |
| `0.1.0` | 2026-02-05 |
| `0.0.8` | 2026-01-21 |
| `0.0.7` | 2026-01-17 |
| `0.0.6` | 2026-01-17 |
| `0.0.5` | 2026-01-16 |
| `0.0.4` | 2026-01-15 |
| `0.0.3` | 2026-01-15 |
| `0.0.2` | 2026-01-15 |
| `0.0.1` | 2026-01-15 |

[Unreleased]: https://github.com/aoneahsan/shared-features/commits/main
[0.1.14]: https://www.npmjs.com/package/shared-features/v/0.1.14
