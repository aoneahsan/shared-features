# AGENTS.md — website/android/

**Last optimized:** 2026-10-20
**Next routine optimization:** 2026-11-19

## Scope

Generated Capacitor Android shell for `com.aoneahsan.sharedfeatures`.

## Rules

Treat web code and `apps-config.yaml` as the sources of truth. Apply identity changes through `yarn sync:apps-config`, sync Capacitor before Gradle work, and never commit signing material. Do not publish during this pass.

## Verify

Run the applicable package or website gates from the owning manifest directory.

## Context record

Reviewed against the active tree on 2026-10-20. Inherits the repository root guide.
