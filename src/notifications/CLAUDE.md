# Notifications

Event-driven notification system exported via `shared-features/notifications`.

## Structure

```
notifications/
  index.ts          # Re-exports events/
  events/
    index.ts        # Re-exports registry, hook, templates
    registry.ts     # NotificationEventRegistry - event type definitions
    useNotificationEvents.ts  # Hook for consuming events
    templates/
      engine.ts     # Template variable interpolation engine
      standard.ts   # Standard notification templates
```

## Architecture

- **Registry** defines all possible notification event types
- **Templates** define how events render (title, body, icon, action)
- **Engine** interpolates variables into template strings
- **Hook** provides React integration for consuming events

## Rules

- New event types must be registered in `registry.ts`
- Templates must handle missing variables gracefully (show placeholder, not crash)
- Event names use `snake_case` convention
- All events must have at least a title template and body template

---

**Last Updated**: 2026-04-02


## Sub-agents & Skills — Main-Context-First (IRON-SOLID)
Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) do NOT have
access to `/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all
skill-relevant work in the **MAIN context**; use a sub-agent ONLY when a **custom** agent exists in
`.claude/agents/` for that job; a default `Explore`/`Plan` agent is allowed ONLY for read-only,
no-skill search/exploration. When a relevant skill is missing, **install/enable it** rather than
proceeding skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)
