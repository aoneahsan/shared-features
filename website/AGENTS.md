# AGENTS.md - Website

Agent instructions for the shared-features admin dashboard website.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `yarn dev` | Start dev server |
| `yarn build` | Production build (must pass with 0 errors) |
| `yarn preview` | Preview production build |

## Tech Stack Rules

- **UI**: Radix UI Themes - never use raw HTML elements
- **Charts**: D3.js ONLY - never Recharts, Chart.js, or others
- **State**: Zustand stores in `src/stores/`
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Storage**: @capacitor/preferences (never localStorage)
- **Routing**: React Router (check `router.tsx` for route structure)
- **Icons**: Lucide React

## Page Categories

| Category | Layout | Auth Required |
|----------|--------|---------------|
| Marketing (Home, Features, Docs, etc.) | Public (AppLayout) | No |
| Legal (Privacy, Terms, etc.) | Public (AppLayout) | No |
| Admin (Manage collections) | Dashboard (sidebar) | Yes |
| Sitemap/Feed | Public | No |

## Adding a New Admin Page

1. Create page component in `src/pages/admin/`
2. Add route in `router.tsx` under authenticated routes
3. Add sidebar navigation entry
4. Use dashboard layout with sidebar
5. Use Radix UI components for all UI
6. Add to sitemap if public-facing

## Adding a New Marketing Page

1. Create page component in `src/pages/`
2. Add route in `router.tsx` under public routes
3. Use public AppLayout (NO sidebar)
4. Ensure responsive from 320px to 1920px
5. Add to sitemap and navigation

## Code Conventions

- Absolute imports with `@/` alias
- Named exports only
- Max 500 lines per file
- Responsive design (320px - 1920px)
- Touch targets: 44x44px min on mobile

---

## Package Manager Hierarchy: nvm → npm (global) → yarn (local) (IRON-SOLID)

Three tiers, each tool ONLY for its tier — for the best, most reproducible dev results:
- **`nvm`** → install/update Node.js (which bundles `npm`): `nvm install --lts`. Use nvm to get/update `npm` itself.
- **`npm`** → ALL global packages: `npm install -g yarn` (install yarn globally if missing) + `npm install -g <pkg>` (every other global CLI).
- **`yarn`** → ALL local project work: `yarn`, `yarn add <pkg>`, `yarn add -D <pkg>` inside the project.

❌ NEVER use `npm`/`pnpm` for LOCAL installs. NEVER use `pnpm` at all. ✅ Only `yarn.lock` in the project — delete `package-lock.json` and `pnpm-lock.yaml`.

---

## Gitignore Hygiene (IRON-SOLID)
`.gitignore` stays current with the project structure — ignore only recoverable artifacts (build/`dist`/`www`/`node_modules`/logs/caches/IDE), never lose source. Custom rules always present: `*.ignore.*`, `project-record-ignore/`. This is a **PRIVATE** repo -> `.env`/secrets/keystores ARE tracked in git.
Full rule + private/public protocol: `~/.claude/rules/project-config.md`.
Gitignore Last Verified: 2026-06-24

---

**Last Updated**: 2026-04-02
