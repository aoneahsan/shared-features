# Services

Firestore data services exported via `shared-features/services`.

## Service Files

| File | Purpose | Firestore Collections |
|------|---------|----------------------|
| `campaigns.ts` | Campaign/product data fetching, caching, filtering | `zaions_campaigns`, `zaions_products` |
| `analytics.ts` | Impression/click/CTR tracking | `zaions_impressions` |
| `broadcasts.ts` | Broadcast fetch, subscribe, dismiss | `zaions_broadcasts`, `zaions_broadcast_events` |
| `featureFlags.ts` | Flag checking, version control, maintenance mode | `zaions_feature_flags` |
| `commonFeatures.ts` | Profile data (9 feature types) | `zaions_contact_info`, `zaions_developer_info`, `zaions_social_links`, `zaions_address_info`, `zaions_payment_options`, `zaions_services`, `zaions_skills`, `zaions_testimonials` |
| `admin-notifications.ts` | Admin CRUD for broadcasts/templates | `zaions_broadcasts`, `zaions_notification_templates` |
| `admin-commonFeatures.ts` | Admin CRUD for profile data | All common feature collections |

## Service Patterns

### Consumer vs Admin Split

- **Consumer services** (no `admin-` prefix): Read-only, cached, optimized for end users
- **Admin services** (`admin-` prefix): Full CRUD, used only by admin dashboard (website)

### Firestore Access Pattern

```typescript
import { getSharedFeaturesDb } from '@/firebase/init';
import { collection, getDocs, query, where } from 'firebase/firestore';

const db = getSharedFeaturesDb();
const q = query(collection(db, 'zaions_campaigns'), where('active', '==', true));
const snapshot = await getDocs(q);
```

### Caching Pattern

Services cache Firestore results in memory to reduce reads. Cache invalidation happens on:
- Manual refresh calls
- Real-time listener updates (where applicable)
- App re-initialization

### Debug Logging

```typescript
if (getConfig().debug) {
  console.log('[shared-features] Service operation:', details);
}
```

## All Firestore Collections

`zaions_feature_flags`, `zaions_campaigns`, `zaions_products`, `zaions_impressions`, `zaions_broadcasts`, `zaions_broadcast_events`, `zaions_notification_templates`, `zaions_contact_info`, `zaions_developer_info`, `zaions_social_links`, `zaions_address_info`, `zaions_payment_options`, `zaions_services`, `zaions_skills`, `zaions_testimonials`

## Rules

- Always use `getSharedFeaturesDb()` - never create a separate Firestore instance
- All collection names use `zaions_` prefix
- Consumer services must handle missing/empty data gracefully (return empty arrays/null)
- Admin services may throw on errors (admin UI handles error display)

---

**Last Updated**: 2026-04-02


## Sub-agents & Skills — Main-Context-First (IRON-SOLID)
Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) do NOT have
access to `/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all
skill-relevant work in the **MAIN context**; use a sub-agent ONLY when a **custom** agent exists in
`.claude/agents/` for that job; a default `Explore`/`Plan` agent is allowed ONLY for read-only,
no-skill search/exploration. When a relevant skill is missing, **install/enable it** rather than
proceeding skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)
