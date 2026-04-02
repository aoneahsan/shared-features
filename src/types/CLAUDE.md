# Types

TypeScript type definitions exported via `shared-features/types`.

## Type Files

| File | Defines |
|------|---------|
| `campaigns.ts` | Campaign, Product, AdVariant, Platform, SharedFeaturesConfig, analytics types |
| `notifications.ts` | Broadcast, NotificationTemplate, BroadcastEvent, notification display types |
| `featureFlags.ts` | FeatureFlag, FlagCondition, VersionConstraint, maintenance mode types |
| `commonFeatures.ts` | ContactInfo, DeveloperInfo, SocialLinks, AddressInfo, PaymentOptions, Services, Skills, Testimonials |
| `index.ts` | Re-exports all type files |

## Conventions

1. **Interfaces for objects** - Use `interface` for data shapes (Campaign, Broadcast, etc.)
2. **Types for unions/aliases** - Use `type` for union types, mapped types, utility types
3. **No enums** - Use string literal unions instead: `type Platform = 'web' | 'android' | 'ios' | 'extension'`
4. **Export everything** - All types must be exported (consumers need them for typing)
5. **JSDoc on interfaces** - Document each interface and its fields
6. **Optional fields explicit** - Use `field?: type` for optional, never `field: type | undefined`

## Adding New Types

1. Add to existing file if it fits the domain (campaigns, notifications, etc.)
2. Create new file only for a genuinely new domain area
3. Export from `types/index.ts`
4. Verify with `yarn typecheck`

---

**Last Updated**: 2026-04-02
