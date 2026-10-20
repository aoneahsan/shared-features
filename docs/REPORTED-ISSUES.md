# Reported Issues — shared-features

**Last updated:** 2026-10-20

### ISSUE-006 — no automatic package CI

**Status:** OPEN · **Impact:** repository contribution checks

The package repository keeps an inert, manual-only placeholder workflow. Local immutable install,
typecheck, lint, build, and pack verification are required before every release. A future CI pass can replace
the placeholder with the same gates and then require that job through the repository ruleset.
