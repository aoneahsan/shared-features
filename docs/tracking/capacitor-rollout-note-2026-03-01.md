# Capacitor/Capawesome/Trapeze rollout note (2026-03-01)

- Project: `shared-features` (nested target: `website/`)
- Implemented for nested `website/` app:
  - `capacitor.config.ts` with app id `com.aoneahsan.sharedfeatures`
  - hostname configured as `shared-features.aoneahsan.com`
  - `apps-config.yaml` for Android package / iOS bundle IDs
  - Added Capacitor Android/iOS + CLI and Trapeze dependencies
  - Added mobile scripts (`cap:*`, `sync:apps-config`, `mobile:sync`)
  - Added native platform folders: `website/android`, `website/ios`

## Verification

Commands executed in `website/`:

```bash
yarn install
yarn typecheck
yarn lint
yarn build
npx cap add android
npx cap add ios
yarn mobile:sync
```

Outcome:

- Typecheck: pass
- Lint: pass (warnings only)
- Build: pass
- Capacitor sync: pass
- Trapeze apply: pass

