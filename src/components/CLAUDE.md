# Components

Reusable UI components exported via `shared-features/components`.

## Subfolders

| Folder | Purpose | Key Components |
|--------|---------|----------------|
| `ads/` | Ad display components | AdBanner, AdCarousel, AdModal, AdPanel, AdSlider, AdUpdateModal, TopbarAdBanner |
| `ads/variants/` | Panel display variants | LargePanelVariants (5), SmallPanelVariants (5) |
| `notifications/` | Broadcast/announcement UI | BroadcastBanner, AnnouncementModal |
| `common/` | Profile/contact cards | ContactCard, DeveloperCard, etc. |

## Component Rules

1. **Radix UI only** - Use `@radix-ui/themes` primitives, never raw HTML elements
2. **Radix theme tokens** - Use theme colors/spacing, never hardcoded CSS values
3. **Lucide React icons** - Use `lucide-react` for all icons
4. **Named props** - Use named object props, not positional parameters
5. **Named exports** - No default exports. Export from folder `index.ts`
6. **Responsive** - All components must work from 320px to 1920px
7. **No app logic** - Components consume data via props, never fetch directly
8. **isInitialized() guard** - Document that consumers should check `isInitialized()` before rendering

## Adding a New Component

1. Create `.tsx` file in the appropriate subfolder
2. Use Radix UI primitives for all elements
3. Accept data via typed props (define types in `src/types/`)
4. Export from subfolder `index.ts`
5. Export from `components/index.ts`
6. Update `src/CLAUDE.md` feature areas table

## Ad Component Variants

- **Small variants** (5): Sidebar placements, compact layouts
- **Large variants** (5): Feature areas, full-width placements
- Variants are in `ads/variants/` and used by `AdPanel`

---

**Last Updated**: 2026-04-02
