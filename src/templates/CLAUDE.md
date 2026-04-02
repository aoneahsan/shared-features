# Templates

Consumer-facing notification templates. These are **copy-paste reference implementations**, NOT compiled into the package.

## Important

- **Excluded from TypeScript declarations** (`tsconfig.json` excludes `src/templates`)
- **Excluded from build output** (`vite-plugin-dts` excludes `src/templates/**`)
- These files are examples for consuming apps to copy and adapt
- They are NOT importable from the published package

## Consumer Templates (`consumer/`)

| File | Purpose |
|------|---------|
| `NotificationBell.template.tsx` | Bell icon with unread count badge |
| `NotificationCard.template.tsx` | Individual notification card |
| `NotificationPanel.template.tsx` | Slide-out notification panel |
| `NotificationPreferences.template.tsx` | User notification settings UI |
| `PushPermissionPrompt.template.tsx` | Push notification opt-in prompt |
| `notificationService.template.ts` | Service layer for notification CRUD |
| `notificationsStore.template.ts` | Zustand store for notification state |
| `periodicReports.template.ts` | Scheduled report generation |
| `useOneSignal.template.ts` | OneSignal push notification integration |

## Rules

- Use `.template.tsx` / `.template.ts` suffix for all template files
- Templates should reference `shared-features` imports consumers will use
- Keep templates self-contained (no imports from other template files)
- Update templates when the package API changes

---

**Last Updated**: 2026-04-02
