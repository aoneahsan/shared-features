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
