# CLAUDE.md — src/services/

**Last optimized:** 2026-10-20
**Next routine optimization:** 2026-11-19

## Scope

Consumer reads, analytics writes, and admin services for `zaions_` Firestore collections.

## Rules

Use the shared database accessor and existing collection constants. Consumer calls return safe empty results when appropriate; admin calls surface actionable errors. Do not write to production during this maintenance pass.

## Verify

Run the applicable package or website gates from the owning manifest directory.

## Context record

Reviewed against the active tree on 2026-10-20. Inherits the repository root guide.
