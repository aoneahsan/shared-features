# Documentation - shared-features

Package documentation, planning, tracking, and historical records.

## Structure

| Folder | Purpose |
|--------|---------|
| `tracking/` | Progress trackers (website implementation, Capacitor rollout) |
| `website-plan/` | Website master plan and architecture docs |

## Tracker Files

| File | Tracks |
|------|--------|
| `tracking/website-implementation-tracker.json` | Website completion (100% complete, 38/38 parts) |
| `tracking/capacitor-rollout-note-2026-03-01.md` | Capacitor migration notes |

## Package Update History

| Date | Version | Notes |
|------|---------|-------|
| 2026-03-24 | 0.1.13 | Refreshed docs, verified build/typecheck/lint, added root portfolio maintenance rule |
| 2026-02-11 | 0.1.12 | Updated TopbarAdBanner and AdCarousel sizing/behavior |
| 2026-02-10 | 0.1.8 | Added dismissible topbar banner placement |
| 2026-02-10 | 0.1.7 | Extended AddressInfo and website expansion notes |
| 2026-02-07 | 0.1.6 | Added portfolio field fallbacks and new type extensions |
| 2026-02-05 | 0.1.0 | Added common profile/contact/service features |
| 2026-02-05 | 0.0.9 | Added feature flags system |
| 2026-02-02 | 0.0.8 | Full update to latest versions |

## Audit Records

| Date | Audit Type | Status | Issues Found | Issues Resolved |
|------|-----------|--------|--------------|-----------------|
| 2026-04-02 | CLAUDE.md/AGENTS.md optimization | Passed | 0 | 0 |
| 2026-03-24 | Portfolio + Docs Refresh | Passed | 0 | 0 |
| 2026-02-05 | Feature Addition | Passed | 0 | 0 |
| 2026-02-02 | Package Update | Passed | 0 | 1 |

### Last Audit Details (2026-04-02)

- Package Manager: yarn confirmed
- Dependencies: no dependency audit performed in this pass
- Build: passes
- Lint: passes
- TypeScript: passes
- CLAUDE.md/AGENTS.md: Split and optimized for context efficiency
- Nested docs created for all src/ subdirectories + website

### Next Audit Due: 2026-04-05

## Rules

- Update this file when new versions are published
- Add audit records after any verification pass
- Keep tracker files current with implementation progress
- Website master plan in `website-plan/` is the source of truth for website architecture

---

**Last Updated**: 2026-04-02
