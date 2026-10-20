# AGENTS.md — website/src/

**Last optimized:** 2026-10-20
**Next routine optimization:** 2026-11-19

## Scope

Website React source: routes, layouts, pages, services, state, analytics, and native service adapters.

## Rules

Check `router.tsx` before route changes. Keep public pages public while signed in, protect management routes, use the shared UI components, and route environment access through `config/env.ts`. No hardcoded provider values.

## Verify

Run the applicable package or website gates from the owning manifest directory.

## Context record

Reviewed against the active tree on 2026-10-20. Inherits the repository root guide.
