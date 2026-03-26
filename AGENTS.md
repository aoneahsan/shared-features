# AGENTS.md - Shared Features

> AI Agent Instructions for Shared Features Package Development

## Project Overview

Shared features for Zaions projects - centralized ads, notifications, broadcasts, contacts, and cross-promotion functionality.

| Property | Value |
|----------|-------|
| Package Name | `shared-features` |
| Version | 0.1.13 |
| License | MIT |
| Repository | Private |

### Features
- Centralized ad management (AdModal, AdSlider, AdBanner)
- Cross-project notifications
- Broadcast banners
- Contact management
- React components with Radix UI

## Agent Responsibilities

| Agent | Role |
|-------|------|
| **Claude Code** | Primary implementation. Writes code, publishes. |
| **Codex** | Reviews, provides specs. Does NOT implement unless explicitly requested. |

## Setup Instructions

### Prerequisites
- Node.js >= 24.13.0
- Yarn

### Installation
```bash
yarn install
```

## Build & Test Commands

| Command | Purpose |
|---------|---------|
| `yarn build` | Vite build + type declarations |
| `yarn dev` | Watch mode |
| `yarn lint` | ESLint |
| `yarn typecheck` | TypeScript check |

## Code Style & Conventions

### Module Exports
```typescript
// Main
import { SharedFeatures } from 'shared-features';

// Components
import { AdModal, AdBanner } from 'shared-features/components';

// Hooks
import { useAds } from 'shared-features/hooks';

// Services
import { adService } from 'shared-features/services';

// Types
import type { Ad } from 'shared-features/types';

// Notifications
import { BroadcastBanner } from 'shared-features/notifications';
```

### UI Framework
- Uses Radix UI Themes
- Lucide React icons
- Zustand for state

## Project-Specific Rules

### DO NOTs
1. **NEVER** break consuming app compatibility
2. **NEVER** add non-optional dependencies
3. **NEVER** expose Firebase credentials

### DOs
1. **DO** test in consuming apps
2. **DO** maintain Radix UI consistency
3. **DO** update version when changing API

## Consuming Apps
This package is used by:
- ZTools (`com.zaions.ztools`)
- Other Zaions projects

## Testing Requirements

Before publishing:
```bash
yarn build      # Must pass
yarn lint       # Should pass
yarn typecheck  # Must pass
```

## Publishing

```bash
yarn prepublishOnly  # Builds
npm publish
```

Then update consuming apps to new version.
