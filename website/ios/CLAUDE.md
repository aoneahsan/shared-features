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
