# Website - shared-features Admin Dashboard

Admin and operational dashboard for managing the shared-features package data.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build | Vite 7 |
| UI | Radix UI + Tailwind v4 |
| Charts | D3.js (ONLY - no Recharts/Chart.js) |
| State | Zustand |
| Mobile | Capacitor (iOS + Android) |
| Auth | Firebase (Google Auth) |
| Forms | react-hook-form + zod + @hookform/resolvers |

## Structure

```
website/
  src/
    components/    # React components
    pages/         # Route pages (marketing + admin)
    config/        # App configuration
    context/       # React context providers
    hooks/         # Custom hooks
    lib/           # Utility functions
    services/      # API/Firebase services
    stores/        # Zustand stores
    types/         # TypeScript definitions
  public/          # Static assets (favicon, manifest, robots.txt, sitemap.xml)
  android/         # Android native (Capacitor)
  ios/             # iOS native (Capacitor)
```

## Pages Overview

- **Marketing** (public): Home, Features, Docs, API Reference, Examples, Pricing, About, Contact, Legal pages
- **Admin** (authenticated): Feature Flags, Campaigns, Products, Broadcasts, Contact Info, Developer Info, Social Links, Address, Payment, Services, Skills, Testimonials, Projects, Analytics, Impressions
- **Required routes**: `/sitemap`, `/sitemap.xml`, `/feed`, `/feed.xml`

## Build Commands

```bash
yarn dev         # Development server
yarn build       # Production build
yarn preview     # Preview production build
```

## Layout Rules

- Homepage, legal pages, about, contact, sitemap, feed = **public layout** (AppLayout)
- Admin workspace pages = **dashboard layout** with sidebar
- Public pages stay public even when user is authenticated

## AI SEO Optimization (AIO)

Global guide: `~/.claude/AI-SEO-OPTIMIZATION-GUIDE.md`

| Feature | Status | Notes |
|---------|--------|-------|
| AI Crawler Access | Done | robots.txt allows GPTBot, ClaudeBot, PerplexityBot, etc. |
| Schema Markup | Needed | Add SoftwareApplication, Organization schemas |
| Meta Descriptions | Partial | Ensure under 160 chars, benefit-focused |
| Post-build SEO | Done | `postbuild-seo.ts` injects meta tags into static HTML |

## Implementation Status

- 47 pages rendered, 15 collections manageable, 6 D3 charts
- Build: zero errors, Lint: zero issues, TypeScript: zero errors
- Tracker: `docs/tracking/website-implementation-tracker.json`

## Rules

- Use Radix UI components exclusively (no raw HTML elements)
- D3.js for ALL charts (never Recharts/Chart.js)
- Responsive from 320px to 1920px
- Mobile-first approach
- `@capacitor/preferences` for storage (never localStorage)

---

**Last Updated**: 2026-04-02
