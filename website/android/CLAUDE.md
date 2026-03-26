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
