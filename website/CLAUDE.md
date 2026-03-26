# Shared Features - Website

Admin and operational dashboard for shared-features package.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build | Vite 7 |
| UI | Radix UI + Tailwind v4 |
| Charts | D3.js |
| Mobile | Capacitor |

---

## Structure

```
website/
├── src/          # Website source
├── public/       # Static assets
├── android/      # Android native
├── ios/          # iOS native
├── dist/         # Build output
```

---

## Purpose

Admin interface for managing:
- Feature flags
- Advertising campaigns
- Broadcasts/notifications
- Common profile data

---

## Build Commands

```bash
# From website folder
yarn dev       # Development
yarn build     # Production build
yarn preview   # Preview build
```

---

**Last Updated**: 2026-03-27
