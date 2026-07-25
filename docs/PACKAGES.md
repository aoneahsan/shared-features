# Package inventory — shared-features

Every `package.json` unit in this repository, what each dependency is for, and every intentional pin.
Keep this accurate on **every** add, remove or upgrade.

**Last Updated:** 2026-07-25

## Manifests in this repository

| Path | Name | Published? |
|---|---|---|
| `package.json` | `shared-features` | ✅ published to npm |
| `website/package.json` | `shared-features-website` | ❌ marketing site, never published |

Two manifests, two distinct names. `npm publish` must only ever run from the repository root — the website is
a separate application that happens to live in the same repository.

## Published library — runtime

**No runtime dependencies.** Everything the library needs at runtime is a peer, supplied by the host app.

## Published library — peer dependencies

A library imposes its dependencies on every consumer, so anything the host app already owns stays a peer.
Each is also listed in `rollupOptions.external` in `vite.config.ts`; a peer that is not external gets bundled
and the consumer ends up running two copies.

| Package | Range | Used for | Optional |
|---|---|---|---|
| `react` | `>=19.2.3` | every component and hook | no |
| `react-dom` | `>=19.2.3` | rendering | no |
| `firebase` | `>=12.8.0` | `firebase/app`, `firebase/firestore`, `firebase/auth` — every read and write | no |
| `@radix-ui/themes` | `>=3.2.1` | the UI primitives every shipped component is built from | no |
| `@radix-ui/react-icons` | `>=1.3.2` | icons inside ad and broadcast components | no |
| `lucide-react` | `>=0.562.0` | icons inside the common-feature components | no |
| `zustand` | `>=5.0.10` | internal dismissal and frequency-cap state | no |
| `@capacitor/preferences` | `>=8.0.0` | native persistence; falls back to `localStorage` | **yes** — `peerDependenciesMeta.optional` |

## Published library — dev dependencies

| Package | Why |
|---|---|
| `typescript` | compiler and declaration emit |
| `vite` · `@vitejs/plugin-react` | the library build (ESM + CJS) |
| `vite-plugin-dts` | declaration emit during the vite build |
| `eslint` · `typescript-eslint` · `@typescript-eslint/*` | linting |
| `eslint-plugin-react` · `eslint-plugin-react-hooks` | React rules |
| `globals` | ESLint environment globals |
| `@types/react` · `@types/react-dom` | React types |
| every peer, mirrored | so the package can typecheck, lint and build against them locally |

Each peer dependency has a matching `devDependency`. That is deliberate — without it the package cannot
compile itself.

## Intentional pins

| Package | Pin | Reason |
|---|---|---|
| `typescript` | `~6.0.3` | Fleet-wide block. TypeScript 7 is the native port and exposes no JS compiler API, which breaks `typescript-eslint` (its `typescript-estree` peer is `<6.1.0`). The tilde keeps the toolchain inside 6.0.x. Global ledger: `~/.claude/rules/package-version-known-issues.md`. Changed from `^6.0.3` on 2026-07-25 — the caret allowed 6.1+ and would have broken `yarn lint`. |

## Engines

`node >=24.13.0`, matching `.nvmrc`. This is a **build-time** requirement — the published output is browser
code and carries no Node runtime requirement of its own.

## Build output

`yarn build` runs `vite build` then `tsc --emitDeclarationOnly`. Both must emit declarations relative to
`src/`, or the `exports` map's `types` targets resolve to nothing:

- `vite.config.ts` → `dts({ entryRoot: 'src' })`
- `tsconfig.json` → `"rootDir": "./src"`

This was broken on 2026-07-25 by a `vite-plugin-dts` v5 upgrade that changed the default emit root, and is
now pinned explicitly in both places. See `docs/REPORTED-ISSUES.md` → ISSUE-001.

Source maps are off in published output: `build.sourcemap: false` and `declarationMap: false`.

Current packed output: **142 kB packed · 771 kB unpacked · 78 files** (`npm pack --dry-run`, 2026-07-25).

## Published files

`files` is an allowlist — never an `.npmignore`, which would ship whatever it forgot:

```json
["dist", "README.md", "CHANGELOG.md", "LICENSE", "AI-INTEGRATION-GUIDE.md"]
```

`CHANGELOG.md` must stay listed. npm includes `README`, `LICENSE` and `package.json` automatically but never
a changelog.

## Website (`website/`)

Its own application with its own dependency set, not published to npm and not covered by this library's
contract. Audit it separately when working there.

## Verify

```bash
yarn typecheck && yarn lint && yarn build   # gates
npm pack --dry-run                          # what would ship
```
