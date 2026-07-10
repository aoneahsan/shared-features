# Shared Features Website - iOS

Capacitor iOS native project for the shared-features admin dashboard.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Capacitor 8 |
| Language | Swift |
| Build | Xcode |
| Min iOS | 14.0 |

---

## Structure

```
ios/
├── App/                          # Main iOS app
│   ├── App/                      # Swift source files
│   └── App.xcodeproj/            # Xcode project
└── capacitor-cordova-ios-plugins/  # Plugin bridges
```

---

## Build Commands

```bash
# From website folder
yarn cap sync ios         # Sync web assets
yarn cap open ios         # Open in Xcode
yarn cap run ios          # Run on simulator/device
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
