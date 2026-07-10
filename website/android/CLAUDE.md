# Shared Features Website - Android

Capacitor Android native project for the shared-features admin dashboard.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Capacitor 8 |
| Language | Kotlin/Java |
| Build | Gradle |
| Min SDK | 22 |
| Target SDK | 35 |

---

## Structure

```
android/
├── app/              # Main Android app module
├── capacitor-cordova-android-plugins/  # Plugin bridges
├── build.gradle      # Project-level build config
└── gradle/           # Gradle wrapper
```

---

## Build Commands

```bash
# From website folder
yarn cap sync android     # Sync web assets
yarn cap open android     # Open in Android Studio
yarn cap run android      # Run on device/emulator
```

---

**Last Updated**: 2026-03-27


## Sub-agents & Skills — Main-Context-First (IRON-SOLID)
Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) do NOT have
access to `/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all
skill-relevant work in the **MAIN context**; use a sub-agent ONLY when a **custom** agent exists in
`.claude/agents/` for that job; a default `Explore`/`Plan` agent is allowed ONLY for read-only,
no-skill search/exploration. When a relevant skill is missing, **install/enable it** rather than
proceeding skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)
