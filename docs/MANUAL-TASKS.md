# Manual / User-Only Tasks — shared-features

> The ONE place for everything only you (the human) can do. Fixed path: `docs/MANUAL-TASKS.md`.
> Global spec: `~/.claude/rules/manual-tasks.md`. Last updated: 2026-06-23

This is a published npm **package** plus a companion **docs site**. The agent does all
buildable/verifiable work; the items below need your hands (npm auth, hosting deploy, DNS).

## Pending manual tasks

| # | Task | Why only you | Detailed runbook | Status |
|---|------|--------------|------------------|--------|
| 1 | Publish the next `shared-features` version to npm | Needs npm auth + maintainer release decision | `yarn build && yarn typecheck && yarn lint` (all green) → bump `package.json` version → `npm publish` | ☐ Not started |
| 2 | Deploy `shared-features-docs` to Firebase Hosting | Needs Firebase auth + the `shared-features-docs` Hosting site to exist | `cd ../shared-features-docs && yarn build && npx -y firebase-tools@latest deploy --only hosting:shared-features-docs` | ☐ Not started |
| 3 | Create the Firebase Hosting site target `shared-features-docs` | Needs Firebase Console access | Firebase Console → Hosting → Add site `shared-features-docs` → `firebase target:apply hosting shared-features-docs shared-features-docs` | ☐ Not started |
| 4 | Point custom domain `shared-features-docs.aoneahsan.com` (or chosen subdomain) | Needs DNS + Firebase domain verification | Firebase Hosting → Add custom domain → add the DNS records at your registrar | ☐ Not started |
| 5 | (Optional) Enable GitHub Pages for `shared-features-docs` | Needs repo Settings access | Repo Settings → Pages → Source: GitHub Actions (the `deploy.yml` workflow is included) | ☐ Not started |
| 6 | Add `VITE_SHARED_FEATURES_*` Firebase env values where the in-repo `website/` is deployed | Needs the aoneahsan.com Firebase web config (secret) | Copy `website/.env.example` → real `.env`; values from the aoneahsan.com Firebase project | ☐ Not started |

## Notes

- The package itself ships **green** (typecheck + lint + build all exit 0 as of 2026-06-23).
- `src/templates/consumer/*` placeholders are intentional copy-paste fill-in points for consuming
  apps — do NOT "complete" them in the package.
- No real secrets are tracked in this repo (only `website/.env.example`); no keystores.

## Completed manual tasks

(none yet)
