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

**Last Updated**: 2026-04-02
