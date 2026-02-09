# Shared Features - Website Master Plan

**Document Version:** 1.0
**Created:** 2026-02-09
**Package:** shared-features v0.1.6
**NPM:** https://www.npmjs.com/package/shared-features
**Reference Website:** native-update (same workspace)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Page Inventory & Sitemap](#3-page-inventory--sitemap)
4. [Section-by-Section Implementation Plan](#4-section-by-section-implementation-plan)
5. [Admin Panel Plan](#5-admin-panel-plan)
6. [Authentication System](#6-authentication-system)
7. [Analytics & Data Plan](#7-analytics--data-plan)
8. [SEO & Marketing Plan](#8-seo--marketing-plan)
9. [Design System & UI/UX Plan](#9-design-system--uiux-plan)
10. [Validation Rules & Success Checkpoints](#10-validation-rules--success-checkpoints)
11. [Implementation Phases](#11-implementation-phases)

---

## 1. Executive Summary

### What We're Building

A production-grade marketing & management website for the `shared-features` npm package. This website will:

- **Market** the package to React/Capacitor developers
- **Document** all 3 systems (Feature Flags, Advertising, Broadcasts) + 11 common features
- **Demonstrate** live components with interactive previews
- **Manage** all Firestore data through an admin panel (campaigns, broadcasts, feature flags, contact info, developer info, social links, etc.)
- **Provide** analytics dashboard for campaign/broadcast performance
- **Serve** as the central hub for aoneahsan.com/zaions ecosystem

### Reference Architecture

Modeled after the `native-update` website with:
- Same tech stack (React 19 + Vite + Tailwind v4 + Radix UI)
- Same layout patterns (Marketing + Dashboard + Admin)
- Enhanced with live component previews (unique to this package)
- Admin panel for ALL Firestore collections (the core differentiator)

### Target Users

| User Type | What They Need |
|-----------|---------------|
| **Developers** | Docs, code examples, API reference, installation guide |
| **Project Managers** | Feature overview, pricing, integration effort estimate |
| **Admin (aoneahsan@gmail.com)** | Full CRUD for all collections, analytics, feature flag management |
| **Open Source Contributors** | Code access page, contribution guide |

---

## 2. Tech Stack & Architecture

### Core Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Build Tool | Vite | 7.x |
| Language | TypeScript | 5.9.x |
| Styling | Tailwind CSS | v4 |
| UI Primitives | Radix UI (individual packages) | Latest |
| Variant Styling | class-variance-authority (CVA) | 0.7.x |
| Animations | Framer Motion | 12.x |
| Routing | React Router DOM | v7 |
| State Management | Zustand | 5.x |
| Backend | Firebase (Firestore, Auth, Analytics, Hosting) | 12.x |
| Icons | Lucide React + Radix Icons | Latest |
| Charts | D3.js | v7 |
| Code Display | react-syntax-highlighter | 16.x |
| Markdown | react-markdown + remark-gfm | Latest |
| Forms | react-hook-form + zod + @hookform/resolvers | Latest |
| Class Utils | clsx + tailwind-merge | Latest |

### Project Structure

```
website/
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── apple-touch-icon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI components (Button, Card, Input, etc.)
│   │   ├── layout/          # Header, Footer, MarketingLayout
│   │   ├── auth/            # ProtectedRoute, AdminRoute
│   │   ├── dashboard/       # DashboardLayout, DashboardSidebar
│   │   ├── admin/           # AdminLayout, AdminSidebar
│   │   ├── docs/            # CodeBlock, CollapsibleSection, ApiTable
│   │   ├── demo/            # LivePreview, ComponentPlayground
│   │   ├── marketing/       # HeroSection, FeatureCard, PricingCard, TestimonialCard
│   │   └── common/          # SEO Helmet, AnalyticsTracker, ScrollToTop
│   ├── pages/
│   │   ├── marketing/       # Home, Features, Docs, Pricing, About, Contact, legal
│   │   ├── auth/            # Login
│   │   ├── dashboard/       # Overview, Settings
│   │   └── admin/           # All admin CRUD pages
│   ├── hooks/               # Custom hooks
│   ├── services/            # Firebase services, auth service
│   ├── stores/              # Zustand stores
│   ├── context/             # AuthContext
│   ├── lib/                 # Utils, firebase config, analytics, formatters
│   ├── types/               # TypeScript types
│   ├── config/              # Environment config, constants
│   ├── App.tsx
│   ├── router.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── postcss.config.js
└── package.json
```

### Dev Server Port: 5944

### Environment Variables Required

```env
# Firebase (Website's own project OR shared with aoneahsan.com)
VITE_FIREBASE_API_KEY=[REQUIRED]
VITE_FIREBASE_AUTH_DOMAIN=[REQUIRED]
VITE_FIREBASE_PROJECT_ID=[REQUIRED]
VITE_FIREBASE_STORAGE_BUCKET=[REQUIRED]
VITE_FIREBASE_MESSAGING_SENDER_ID=[REQUIRED]
VITE_FIREBASE_APP_ID=[REQUIRED]
VITE_FIREBASE_MEASUREMENT_ID=[OPTIONAL]

# Google OAuth
VITE_GOOGLE_CLIENT_ID=[REQUIRED]
```

---

## 3. Page Inventory & Sitemap

### Marketing Pages (Public - with Header/Footer)

| # | Route | Page | Purpose |
|---|-------|------|---------|
| 1 | `/` | HomePage | Hero, feature highlights, code preview, CTA |
| 2 | `/features` | FeaturesPage | Detailed breakdown of all 3 systems + 11 common features |
| 3 | `/features/advertising` | AdvertisingDetailPage | Deep dive into ad system with live demos |
| 4 | `/features/broadcasts` | BroadcastsDetailPage | Deep dive into broadcast system with demos |
| 5 | `/features/feature-flags` | FeatureFlagsDetailPage | Deep dive into feature flag system |
| 6 | `/features/common` | CommonFeaturesDetailPage | Deep dive into 11 common feature modules |
| 7 | `/docs` | DocsPage | Installation, setup, quickstart, full API reference |
| 8 | `/docs/api` | ApiReferencePage | Complete API docs (hooks, services, components, types) |
| 9 | `/docs/examples` | ExamplesPage | Code examples for each system |
| 10 | `/demos` | DemosPage | Interactive live component previews |
| 11 | `/pricing` | PricingPage | Free/open-source pricing, support options |
| 12 | `/changelog` | ChangelogPage | Version history with release notes |
| 13 | `/about` | AboutPage | Mission, developer story, ecosystem overview |
| 14 | `/contact` | ContactPage | Contact options, support channels |
| 15 | `/privacy` | PrivacyPage | Privacy policy |
| 16 | `/terms` | TermsPage | Terms of service |
| 17 | `/cookies` | CookiePolicyPage | Cookie policy |
| 18 | `/data-deletion` | DataDeletionPage | Account/data deletion instructions |
| 19 | `/security` | SecurityPage | Security practices |
| 20 | `/sitemap` | SitemapPage | Searchable page directory with Fuse.js |
| 21 | `/code-access` | CodeAccessPage | GitHub access request (open source, restricted) |

### Auth Pages (No Header/Footer)

| # | Route | Page | Purpose |
|---|-------|------|---------|
| 22 | `/login` | LoginPage | Google OAuth login |

### Dashboard Pages (Protected - Authenticated Users)

| # | Route | Page | Purpose |
|---|-------|------|---------|
| 23 | `/dashboard` | DashboardOverview | Welcome, quick stats, recent activity |
| 24 | `/dashboard/settings` | SettingsPage | User preferences, theme, notifications |

### Admin Pages (Protected - Admin Only: aoneahsan@gmail.com)

| # | Route | Page | Purpose |
|---|-------|------|---------|
| 25 | `/admin` | AdminOverview | Platform stats, feature flag status, quick actions |
| 26 | `/admin/feature-flags` | FeatureFlagsAdminPage | Toggle features, set versions, maintenance mode |
| 27 | `/admin/campaigns` | CampaignsAdminPage | CRUD campaigns, view metrics |
| 28 | `/admin/campaigns/:id` | CampaignDetailAdminPage | Edit single campaign, view analytics |
| 29 | `/admin/products` | ProductsAdminPage | CRUD products catalog |
| 30 | `/admin/products/:id` | ProductDetailAdminPage | Edit single product |
| 31 | `/admin/broadcasts` | BroadcastsAdminPage | CRUD broadcasts, scheduling |
| 32 | `/admin/broadcasts/:id` | BroadcastDetailAdminPage | Edit single broadcast |
| 33 | `/admin/contact` | ContactInfoAdminPage | Edit contact information |
| 34 | `/admin/developer` | DeveloperInfoAdminPage | Edit developer profile |
| 35 | `/admin/social-links` | SocialLinksAdminPage | CRUD social media links |
| 36 | `/admin/address` | AddressInfoAdminPage | Edit physical address |
| 37 | `/admin/payment-options` | PaymentOptionsAdminPage | CRUD payment methods |
| 38 | `/admin/services` | ServicesAdminPage | CRUD professional services |
| 39 | `/admin/skills` | SkillsAdminPage | CRUD skills list |
| 40 | `/admin/testimonials` | TestimonialsAdminPage | CRUD client testimonials |
| 41 | `/admin/projects` | ProjectsAdminPage | CRUD portfolio projects |
| 42 | `/admin/analytics` | AnalyticsAdminPage | Campaign/broadcast analytics dashboard |
| 43 | `/admin/impressions` | ImpressionsAdminPage | View raw impression data |

### Error Pages

| # | Route | Page |
|---|-------|------|
| 44 | `*` | NotFoundPage (404) |
| 45 | - | UnauthorizedPage (401) |
| 46 | - | ForbiddenPage (403) |
| 47 | - | ServerErrorPage (500) |

**Total Pages: 47**

---

## 4. Section-by-Section Implementation Plan

Each section is evaluated from 5 perspectives with validation rules and success checkpoints.

---

### SECTION A: Project Foundation & Configuration

#### Part A.1: Project Initialization

**What:** Create website directory, initialize Vite + React 19 + TypeScript project, install all dependencies.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Vite 7.x, React 19, TypeScript strict, proper tsconfig, path aliases (@/), ESM output |
| **Designer** | Tailwind v4 with @tailwindcss/vite plugin, PostCSS, custom CSS variables in index.css |
| **SEO** | index.html with proper meta tags, Open Graph, Twitter Card, structured data |
| **Analytics** | Firebase Analytics initialization, Microsoft Clarity script (bundled), Amplitude setup |
| **Project Lead** | All config files created, dev server on port 5944, build produces 0 errors |

**Validation Rules:**
- [ ] `yarn dev` starts on port 5944
- [ ] `yarn build` completes with 0 errors and 0 warnings
- [ ] `yarn lint` passes with 0 issues
- [ ] TypeScript strict mode enabled
- [ ] Path alias @/ resolves correctly
- [ ] .env.example has all required variables documented
- [ ] .gitignore configured for private repository

**Success Checkpoint:** Dev server runs, build passes, all config files present.

#### Part A.2: Design System Setup

**What:** Create base UI component library (Button, Card, Input, Select, Dialog, Table, Badge, Alert, Textarea, Container, Separator).

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | CVA-based variants, proper TypeScript props, composable (Card + CardHeader + CardTitle + CardContent) |
| **Designer** | Brand color palette (emerald/teal primary, violet/purple accent), Plus Jakarta Sans + Inter + JetBrains Mono fonts, smooth hover/focus transitions, dark mode support via CSS variables |
| **SEO** | Semantic HTML elements inside components (section, article, nav, main) |
| **Analytics** | N/A for base components |
| **Project Lead** | All 11+ base components created, exported, typed, responsive |

**Brand Color Rationale:** Emerald/teal represents growth, connectivity, and trust - perfect for a package that connects multiple projects. Violet/purple accent represents creativity and premium quality.

**Validation Rules:**
- [ ] Every component has TypeScript interface for props
- [ ] Every component supports className override
- [ ] Button has 7+ variants (default, primary, secondary, outline, ghost, danger, link)
- [ ] Card is composable (6 sub-components)
- [ ] All components responsive at 320px-1920px
- [ ] Color palette defined in CSS variables (brand-50 to brand-950, accent-50 to accent-950)
- [ ] 3 font families loaded (display, body, mono)
- [ ] Animations defined (fade-in, slide-up, slide-down, scale-in, float)

**Success Checkpoint:** All base components render correctly, no TypeScript errors.

#### Part A.3: Layout Components

**What:** Create Header, Footer, MarketingLayout, DashboardLayout, AdminLayout.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | React Router Outlet pattern, responsive sidebar toggle, active link highlighting |
| **Designer** | Sticky header with glassmorphism blur, 4-column footer, collapsible sidebar, smooth transitions |
| **SEO** | Semantic nav, proper heading hierarchy, footer links for crawlers |
| **Analytics** | Track navigation events in header/sidebar clicks |
| **Project Lead** | All 3 layouts functional, mobile hamburger menu works |

**Validation Rules:**
- [ ] Header: Logo, 6 nav links, CTA button, mobile hamburger, sticky on scroll
- [ ] Footer: 4 columns (Product, Resources, Legal, Connect), social icons, copyright, support link
- [ ] MarketingLayout: Header + Outlet + Footer
- [ ] DashboardLayout: Sidebar + TopBar + Outlet, sidebar collapses on mobile
- [ ] AdminLayout: Different nav items than Dashboard, admin badge visible
- [ ] All layouts responsive 320px-1920px
- [ ] Scroll-to-top on route change implemented
- [ ] Active route highlighted in nav

**Success Checkpoint:** All 3 layouts render, navigation works across all breakpoints.

#### Part A.4: Routing & Auth Foundation

**What:** Set up React Router v7, Firebase Auth (Google OAuth), ProtectedRoute, AdminRoute, AuthContext.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Lazy loading for all pages, ProtectedRoute wraps dashboard, AdminRoute checks isAdmin |
| **Designer** | Login page with centered card, Google button styling, loading states |
| **SEO** | Public pages accessible without auth, proper 404 handling |
| **Analytics** | Track login events, page views, auth state changes |
| **Project Lead** | Auth flow complete: login → dashboard (user) or admin (admin), logout → home |

**Validation Rules:**
- [ ] Google OAuth popup works
- [ ] User document created in Firestore on first login (uid, email, displayName, photoURL, isAdmin, timestamps)
- [ ] isAdmin = true ONLY for aoneahsan@gmail.com
- [ ] ProtectedRoute redirects to /login if unauthenticated
- [ ] AdminRoute redirects to /dashboard if not admin
- [ ] All marketing pages accessible without auth
- [ ] Lazy loading implemented for every page
- [ ] Loading spinner shown during auth check

**Success Checkpoint:** Complete auth flow works, admin access restricted to correct email.

---

### SECTION B: Marketing Pages

#### Part B.1: Home Page

**What:** The primary landing page showcasing the package value proposition.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Framer Motion animations, code preview block with syntax highlighting, npm install command with copy button |
| **Designer** | Animated hero with floating geometric shapes, gradient text, feature grid (3 systems), "How It Works" 4-step timeline, testimonial section, CTA with gradient background, playful & bold design |
| **SEO** | H1: "Shared Features", H2s for each section, meta description targeting "react shared features npm", structured data (SoftwareApplication schema), canonical URL |
| **Analytics** | Track: hero CTA clicks, npm copy clicks, feature card clicks, scroll depth |
| **Project Lead** | Page loads in <2s, all sections visible, mobile-perfect |

**Content Sections:**
1. **Hero** - Tagline: "One Package. Every Project. All Features." + subtitle + npm install + CTA buttons (Get Started, View Docs)
2. **3 Systems Showcase** - Feature Flags, Advertising, Broadcasts with icon + description + link
3. **11 Common Features Grid** - Contact, Developer, Social, Address, Payment, Services, Skills, Testimonials, Projects with icons
4. **Code Preview** - 3-tab code block (Install → Initialize → Use Component)
5. **How It Works** - 4 steps: Install → Configure → Use Components → Manage from Admin
6. **Stats Bar** - "30+ Hooks", "50+ Services", "8 Components", "3 Systems"
7. **Ecosystem Section** - "Powers the Zaions Ecosystem" with project logos
8. **CTA Section** - "Ready to unify your projects?" + Get Started button

**Validation Rules:**
- [ ] Hero renders with animations on load
- [ ] Code block has 3 tabs with syntax highlighting
- [ ] npm install copy button works
- [ ] All CTA buttons link to correct pages
- [ ] Stats numbers are accurate to package
- [ ] Mobile: single column, text readable, CTAs accessible
- [ ] Page weight < 500KB (excluding fonts)
- [ ] Lighthouse performance > 90

**Success Checkpoint:** Page is visually stunning, all interactions work, fully responsive.

#### Part B.2: Features Page

**What:** Comprehensive feature breakdown with links to detail pages.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Each feature links to detail page, code snippets for each, props tables |
| **Designer** | Icon-based feature cards, alternating layout (text-left/image-right), hover effects, category tabs |
| **SEO** | H1: "Features", H2 for each system, H3 for each feature, internal links to detail pages |
| **Analytics** | Track feature card clicks, tab switches, CTA clicks |
| **Project Lead** | All 3 systems + 11 common features listed with complete information |

**Content Structure:**
1. **Hero Section** - "Everything You Need" heading
2. **Tabbed System Overview** - 3 tabs: Feature Flags | Advertising | Broadcasts
3. **Common Features Grid** - 11 cards with icons, titles, descriptions
4. **Comparison Table** - Before shared-features vs After
5. **CTA** - "Start using shared-features today"

**Validation Rules:**
- [ ] All 3 systems described with at least 5 bullet points each
- [ ] All 11 common features listed with icon + description
- [ ] Each card links to correct detail page
- [ ] Tabs switch smoothly with animation
- [ ] Comparison table is responsive (cards on mobile, table on desktop)
- [ ] Internal links use proper React Router navigation

**Success Checkpoint:** All features visible, tabs functional, links navigate correctly.

#### Part B.3: Feature Detail Pages (4 pages)

**What:** Deep dive pages for each system: Advertising, Broadcasts, Feature Flags, Common Features.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Complete code examples, hook usage, service usage, props documentation, TypeScript types |
| **Designer** | Live component previews where possible (Ad variants, broadcast banners), mockup screenshots, animated diagrams |
| **SEO** | Unique title/description per page, breadcrumbs, internal linking, code blocks with language tags |
| **Analytics** | Track code copy events, demo interactions, time on page |
| **Project Lead** | Each page has: overview, use cases, code examples, API reference, live demo |

**Per Page Structure:**
1. Breadcrumb navigation
2. Hero with system icon + title + description
3. Key Features (card grid)
4. Use Cases section
5. Live Demo / Interactive Preview
6. Code Examples (Install → Configure → Use)
7. API Reference table (hooks, services, props)
8. Related Features links
9. CTA to docs

**Validation Rules (per page):**
- [ ] Breadcrumb shows: Home > Features > [System Name]
- [ ] At least 3 code examples per page
- [ ] API reference table lists all relevant hooks/services
- [ ] Live demo works for ad components (Advertising page)
- [ ] Live demo works for broadcast components (Broadcasts page)
- [ ] Feature flags page shows toggle simulation
- [ ] Common features page shows all 11 feature cards with expand/collapse
- [ ] All code blocks have copy-to-clipboard
- [ ] Each page has unique meta title and description

**Success Checkpoint:** All 4 detail pages complete with demos and code examples.

#### Part B.4: Documentation Page

**What:** Comprehensive installation, setup, and API reference documentation.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Step-by-step install, initSharedFeatures config, every hook/service/component documented with props/return types |
| **Designer** | Left sidebar TOC (sticky), smooth scroll to sections, collapsible sections, code blocks with language tabs |
| **SEO** | Heading hierarchy (H1-H4), code blocks with language hints, FAQ schema markup, long-form content for "shared features npm" keyword |
| **Analytics** | Track section views, code copy events, search within docs, time per section |
| **Project Lead** | Docs cover 100% of public API, no missing sections |

**Documentation Structure:**
1. **Getting Started**
   - Installation (yarn/npm/pnpm)
   - Quick Start (3-step setup)
   - Configuration Reference
2. **Feature Flags**
   - Setup & Configuration
   - Using useFeatureFlags hook
   - Feature availability checks
   - Maintenance mode
3. **Advertising System**
   - Campaign setup
   - Using ad components (5 components)
   - Ad placements & variants
   - Frequency capping
   - Analytics tracking
4. **Broadcasts System**
   - Broadcast types (banner, modal, toast, bell)
   - Using broadcast components
   - Scheduling
   - Dismissal tracking
5. **Common Features (11 modules)**
   - Contact Info
   - Developer Info
   - Social Links
   - Address Info
   - Payment Options
   - Services
   - Skills
   - Testimonials
   - Projects
6. **API Reference**
   - All Hooks (30+)
   - All Services (50+)
   - All Components (8+)
   - All Types
7. **Advanced**
   - Custom collection names
   - Real-time subscriptions
   - Caching strategy
   - Mobile (Capacitor) setup

**Validation Rules:**
- [ ] TOC sidebar lists all sections, sticky on scroll
- [ ] Every public hook documented with: signature, options, return type, example
- [ ] Every public service documented with: signature, parameters, return type, example
- [ ] Every component documented with: props table, usage example, variants
- [ ] All TypeScript types/interfaces listed
- [ ] Code blocks have syntax highlighting and copy buttons
- [ ] Search within docs works (Fuse.js)
- [ ] Download entire docs as markdown option
- [ ] Mobile: TOC collapses into top dropdown

**Success Checkpoint:** 100% API coverage documented, all code examples runnable.

#### Part B.5: API Reference Page

**What:** Dedicated searchable API reference with all hooks, services, components, and types.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Searchable, filterable by category (hooks/services/components/types), TypeScript signatures |
| **Designer** | Table-based layout, expandable rows for details, search bar at top, category pills |
| **SEO** | Unique page for "shared-features api reference" keyword, structured code examples |
| **Analytics** | Track searches, filter selections, most-viewed APIs |
| **Project Lead** | Every exported member documented |

**Validation Rules:**
- [ ] Search filters API entries in real-time
- [ ] Category filter works (Hooks, Services, Components, Types)
- [ ] Each entry shows: name, category, description, signature
- [ ] Expandable detail view shows: full docs, example code, related items
- [ ] Responsive table (cards on mobile)

**Success Checkpoint:** All 90+ API members listed, search and filter work.

#### Part B.6: Demos Page

**What:** Interactive playground where users can see components in action.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Live rendering of actual package components with mock data, code view alongside |
| **Designer** | Split-screen: preview left, code right (stacked on mobile), variant selector, theme toggle |
| **SEO** | "shared-features demo" keyword, screenshots for social sharing |
| **Analytics** | Track demo interactions, variant selections, time spent, most-viewed demos |
| **Project Lead** | All 8 components demoed with multiple variants |

**Demo Sections:**
1. Ad Components (5): AdPanel, AdSlider, AdModal, AdUpdateModal, AdBanner
2. Notification Components (2): BroadcastBanner, AnnouncementModal
3. Common Feature Components: ContactCard, DeveloperCard, SocialLinksBar, AddressCard, SkillsDisplay, TestimonialsGrid, ServicesGrid, FooterSection

**Validation Rules:**
- [ ] Each component renders with realistic mock data
- [ ] Variant selector changes component appearance
- [ ] Code panel shows exact code needed to render
- [ ] Copy code button works
- [ ] Components are interactive (close buttons, click handlers work)
- [ ] Mobile: stacked layout, preview full-width above code

**Success Checkpoint:** All components render in demos, code is copyable.

#### Part B.7: Pricing Page

**What:** Free/open-source pricing with support/donation option.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Clear: free & open source, feature checklist |
| **Designer** | Single pricing card with checkmarks, gradient border, support section below |
| **SEO** | "shared-features pricing free" keyword, FAQ schema |
| **Analytics** | Track support link clicks, NPM link clicks |
| **Project Lead** | No paid tiers (zero-cost principle), support link present |

**Validation Rules:**
- [ ] Price shown as "$0 / Free Forever"
- [ ] Feature checklist shows all included features (15+ items)
- [ ] Support link goes to aoneahsan.com/payment with correct query params
- [ ] NPM package link present
- [ ] GitHub access link present
- [ ] FAQ section with 4+ questions

**Success Checkpoint:** Pricing page complete, support link has correct query params.

#### Part B.8: Changelog Page

**What:** Version history with categorized changes.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Semantic versioning, categorized (features, improvements, fixes, breaking changes) |
| **Designer** | Timeline layout, version badges, category color coding, expandable entries |
| **SEO** | "shared-features changelog" keyword, structured data |
| **Analytics** | Track version expand/collapse, link clicks |
| **Project Lead** | All versions from 0.0.1 to current documented |

**Validation Rules:**
- [ ] All published versions listed (0.0.1 through 0.1.6)
- [ ] Each entry has: version, date, highlights, categorized changes
- [ ] Categories color-coded: green (feature), blue (improvement), orange (fix), red (breaking)
- [ ] Latest version highlighted at top
- [ ] Timeline visual on desktop, cards on mobile

**Success Checkpoint:** All versions documented, timeline renders correctly.

#### Part B.9: About Page

**What:** Mission statement, developer story, ecosystem overview.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Links to all ecosystem projects, tech stack overview |
| **Designer** | Photo/avatar section, mission cards, ecosystem diagram, gradient backgrounds |
| **SEO** | "Ahsan Mahmood developer" keyword, Person schema markup |
| **Analytics** | Track external link clicks, ecosystem project clicks |
| **Project Lead** | Complete story, all ecosystem projects listed |

**Validation Rules:**
- [ ] Developer photo/avatar displayed
- [ ] Mission statement present
- [ ] Ecosystem section shows all Zaions projects
- [ ] Links to portfolio (aoneahsan.com), GitHub, LinkedIn, NPM
- [ ] Contact section with email/phone/whatsapp

**Success Checkpoint:** About page tells a compelling story, all links work.

#### Part B.10: Contact Page

**What:** Multiple contact channels and support options.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Direct links to email, GitHub issues, NPM page |
| **Designer** | Contact cards with icons, hover effects, copy-to-clipboard for email/phone |
| **SEO** | LocalBusiness schema, "contact shared-features" keyword |
| **Analytics** | Track contact method clicks, copy events |
| **Project Lead** | All contact methods present, no broken links |

**Validation Rules:**
- [ ] Email: aoneahsan@gmail.com (clickable mailto + copy)
- [ ] Phone/WhatsApp: +923046619706 (clickable + copy)
- [ ] GitHub Issues link
- [ ] NPM package link
- [ ] LinkedIn link
- [ ] Portfolio link
- [ ] Support/Donation link with correct query params

**Success Checkpoint:** All contact methods functional, copy buttons work.

#### Part B.11: Legal Pages (5 pages)

**What:** Privacy Policy, Terms of Service, Cookie Policy, Data Deletion, Security.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Structured with clear sections, accessible language |
| **Designer** | Card-based sections with icons, consistent styling across all 5 pages |
| **SEO** | "shared-features privacy policy" keywords, proper heading hierarchy |
| **Analytics** | Track page views only |
| **Project Lead** | All 5 legal pages present with accurate content |

**Validation Rules:**
- [ ] Privacy Policy: data collection, usage, sharing, retention, rights, contact
- [ ] Terms: acceptance, usage rights, limitations, termination, liability
- [ ] Cookie Policy: what cookies, why, how to manage, third-party
- [ ] Data Deletion: instructions for data removal, timeline, contact
- [ ] Security: practices, reporting vulnerabilities, response timeline
- [ ] All pages have "Last Updated" date
- [ ] All pages have developer contact info
- [ ] GDPR/CCPA compliant language

**Success Checkpoint:** All 5 legal pages complete with proper legal language.

#### Part B.12: Sitemap Page

**What:** Searchable page directory with fuzzy search.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Fuse.js for fuzzy search, categorized grid |
| **Designer** | Card UI with icon + title + description + tags, search bar with instant results |
| **SEO** | Internal linking to all pages, "shared-features sitemap" |
| **Analytics** | Track searches, card clicks |
| **Project Lead** | All 47 pages listed and searchable |

**Validation Rules:**
- [ ] All pages listed with icon, title, description, tags
- [ ] Fuzzy search filters in real-time
- [ ] Categories: Marketing, Documentation, Admin, Legal, Auth
- [ ] Each card links to correct page
- [ ] Mobile: single column cards

**Success Checkpoint:** All pages discoverable via search, categories visible.

#### Part B.13: Code Access Page

**What:** GitHub access request information (open source but restricted).

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Clear explanation of access model, application process |
| **Designer** | Card with steps, email template, FAQ section |
| **SEO** | "shared-features open source" keyword |
| **Analytics** | Track email link clicks |
| **Project Lead** | Application process clearly documented |

**Validation Rules:**
- [ ] Open source model explained
- [ ] Application process (email) documented
- [ ] NPM package link as alternative
- [ ] FAQ section about access

**Success Checkpoint:** Clear access model communicated.

#### Part B.14: Examples Page

**What:** Real-world code examples for different use cases.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Complete, runnable examples with comments |
| **Designer** | Code blocks with syntax highlighting, example cards with descriptions |
| **SEO** | "shared-features examples react" keyword, code snippets for Google |
| **Analytics** | Track code copy events, example views |
| **Project Lead** | At least 6 examples covering all major features |

**Examples to Include:**
1. Basic Setup (React + Vite)
2. Feature Flags in Action
3. Ad Campaign Display
4. Broadcast Notifications
5. Contact/Developer Cards in Footer
6. Full Integration (all systems)

**Validation Rules:**
- [ ] 6+ complete examples
- [ ] Each has description, code, expected output
- [ ] Copy-to-clipboard on all code blocks
- [ ] Examples are accurate to current API

**Success Checkpoint:** All examples render, code is copyable and accurate.

---

### SECTION C: Error Pages

#### Part C.1: Error Pages (4 pages)

**What:** 404, 401, 403, 500 error pages with themed design.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Proper HTTP semantics, go-back buttons with absolute routes |
| **Designer** | Fun, branded illustrations (SVG), playful copy, consistent theme |
| **SEO** | 404 returns proper status code, no indexing of error pages |
| **Analytics** | Track error page visits with referrer |
| **Project Lead** | All 4 error pages created and themed |

**Validation Rules:**
- [ ] 404: "Page Not Found" with search suggestion and home link
- [ ] 401: "Sign In Required" with login button
- [ ] 403: "Access Denied" with home/dashboard link
- [ ] 500: "Something Went Wrong" with retry and home link
- [ ] All have go-back button
- [ ] All use brand colors and consistent design

**Success Checkpoint:** All 4 error pages render beautifully.

---

### SECTION D: Authentication & User System

#### Part D.1: Login Page

**What:** Google OAuth-only login page.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Firebase Auth, Google provider, signInWithPopup, user doc creation |
| **Designer** | Centered card, Google brand button, logo, tagline, loading spinner |
| **SEO** | noindex on login page |
| **Analytics** | Track login attempts, successes, failures |
| **Project Lead** | Login → redirect to dashboard (or admin for admin user) |

**Validation Rules:**
- [ ] Google sign-in popup opens
- [ ] User document created in Firestore on first login
- [ ] isAdmin = true for aoneahsan@gmail.com only
- [ ] Redirect after login: admin → /admin, user → /dashboard
- [ ] Loading spinner during auth
- [ ] Error message on failure
- [ ] Already logged in → redirect to dashboard

**Success Checkpoint:** Complete login flow works, admin detection correct.

---

### SECTION E: Dashboard

#### Part E.1: Dashboard Overview

**What:** Authenticated user welcome page with stats.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Fetch user document, display stats, recent activity |
| **Designer** | Welcome card with avatar, stat cards, recent activity list |
| **SEO** | noindex on dashboard pages |
| **Analytics** | Track dashboard visits |
| **Project Lead** | Shows relevant info based on user role |

**Validation Rules:**
- [ ] User greeting with displayName
- [ ] Last login date shown
- [ ] Quick links to relevant sections
- [ ] Admin users see "Go to Admin Panel" CTA

**Success Checkpoint:** Dashboard loads with user data.

#### Part E.2: Settings Page

**What:** User preferences management.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | react-hook-form + zod, Firestore update, theme persistence |
| **Designer** | Card-based settings groups, toggle switches, select dropdowns |
| **SEO** | noindex |
| **Analytics** | Track settings changes |
| **Project Lead** | All settings save correctly to Firestore |

**Settings Groups:**
1. Profile (display name, photo - read only from Google)
2. Appearance (theme: light/dark/auto)
3. Notifications (email, in-app toggles)
4. Account (data export, account deletion)

**Validation Rules:**
- [ ] Theme toggle works immediately
- [ ] Settings persist across sessions (Firestore)
- [ ] Account deletion request sends email
- [ ] Form validates with zod

**Success Checkpoint:** All settings save and persist.

---

### SECTION F: Admin Panel (THE CORE)

This is the most critical section - the admin panel manages ALL Firestore collections.

#### Part F.1: Admin Overview

**What:** Platform-wide statistics and quick actions dashboard.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Aggregate queries from all collections, real-time counts |
| **Designer** | Stats cards grid, quick action buttons, status indicators, recent activity feed |
| **SEO** | noindex |
| **Analytics** | Track admin actions |
| **Project Lead** | Single glance shows entire platform status |

**Stats to Display:**
- Total Campaigns (active/paused/ended)
- Total Broadcasts (active/scheduled/ended)
- Total Impressions (last 7 days / 30 days / all time)
- Feature Flags Status (enabled/disabled count)
- Common Features Status (configured/not configured)

**Quick Actions:**
- Create Campaign
- Create Broadcast
- Toggle Maintenance Mode
- Refresh All Caches

**Validation Rules:**
- [ ] All stats load from Firestore
- [ ] Quick action buttons navigate to correct pages
- [ ] Status indicators use color coding (green/yellow/red)
- [ ] Loads in < 3 seconds

**Success Checkpoint:** Admin overview shows all platform stats.

#### Part F.2: Feature Flags Admin

**What:** Toggle features, manage versions, maintenance mode.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Read/write zaions_feature_flags singleton, real-time updates |
| **Designer** | Switch toggles for each feature, version inputs, maintenance mode card with warning styling |
| **SEO** | noindex |
| **Analytics** | Track flag toggles, version changes |
| **Project Lead** | All 11 features manageable, maintenance mode toggleable |

**Form Fields:**
- Global Enabled (switch)
- Current API Version (input)
- Supported API Versions (multi-input)
- Maintenance Mode (switch)
- Maintenance Message (textarea)
- Maintenance End Time (datetime)
- Per-Feature Config (11 rows):
  - Feature Name | Enabled (switch) | Version (input) | Min Version | Max Version | Deprecation Message | Requires Auth (switch) | Available Platforms (multi-select) | Available Projects (multi-input)

**Validation Rules:**
- [ ] All 11 features listed with current config
- [ ] Toggle switches update Firestore immediately
- [ ] Version changes validated (semver format)
- [ ] Maintenance mode shows warning banner when enabled
- [ ] Changes are timestamped with updatedBy
- [ ] react-hook-form + zod validation

**Success Checkpoint:** All feature flags editable, changes reflect in Firestore.

#### Part F.3: Campaigns Admin (CRUD)

**What:** Full CRUD for advertising campaigns.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | List/Create/Edit/Delete campaigns, filter by status, sort by priority |
| **Designer** | Table with action buttons, create/edit modal or separate page, status badges, metrics columns |
| **SEO** | noindex |
| **Analytics** | Track CRUD operations |
| **Project Lead** | Complete campaign lifecycle management |

**List View Columns:**
- Name | Product | Status (badge) | Priority | Placements | Start Date | End Date | Impressions | Clicks | Actions

**Create/Edit Form Fields:**
- productId (select from products)
- name (text)
- status (select: active/paused/scheduled/ended)
- targeting: platforms (multi-select), audiences (multi-select), projects (multi-input)
- placements (multi-select from 8 types)
- priority (1-100 slider)
- frequency: frequencyDays (number), maxImpressions (number)
- timeline: startDate (datetime), endDate (datetime)
- creative: customTitle, customTagline, customDescription, customCta, customIcon, customColor, customFeatures (multi-input)

**Validation Rules:**
- [ ] List view loads all campaigns with pagination
- [ ] Filter by status works
- [ ] Sort by priority/date works
- [ ] Create campaign with all fields → saves to Firestore
- [ ] Edit campaign → updates Firestore
- [ ] Delete campaign → confirms then removes
- [ ] Metrics shown: impressions, clicks, closes
- [ ] All form fields validated with zod
- [ ] Product selector fetches from zaions_products

**Success Checkpoint:** Full CRUD lifecycle works for campaigns.

#### Part F.4: Campaign Detail Admin

**What:** Single campaign view with analytics.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Load campaign + product + impressions, D3 charts |
| **Designer** | Stats cards, line chart (impressions over time), pie chart (platform breakdown), edit button |
| **SEO** | noindex |
| **Analytics** | Track chart interactions |
| **Project Lead** | Complete campaign analytics visible |

**Validation Rules:**
- [ ] Campaign details display correctly
- [ ] Associated product info shown
- [ ] Impression chart renders with D3
- [ ] Platform breakdown pie chart renders
- [ ] Edit button navigates to edit form
- [ ] Back button returns to campaigns list

**Success Checkpoint:** Campaign analytics render with D3 charts.

#### Part F.5: Products Admin (CRUD)

**What:** Full CRUD for products catalog.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | List/Create/Edit/Delete products, image handling |
| **Designer** | Card grid view + table view toggle, product preview card |
| **SEO** | noindex |
| **Analytics** | Track CRUD operations |
| **Project Lead** | All products manageable |

**Form Fields:**
- name, tagline, description, type (select), url, color, features (multi-input), icon, storeUrls (appStore, playStore, webStore), enabled (switch)

**Validation Rules:**
- [ ] List/grid views work with toggle
- [ ] Create product saves to Firestore
- [ ] Edit product updates Firestore
- [ ] Delete confirms then removes
- [ ] Product preview shows how it looks in ad
- [ ] All fields validated with zod

**Success Checkpoint:** Full CRUD for products works.

#### Part F.6: Broadcasts Admin (CRUD)

**What:** Full CRUD for broadcast notifications.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | List/Create/Edit/Delete broadcasts, scheduling |
| **Designer** | Table with status badges, priority indicators, create/edit form, live preview of broadcast |
| **SEO** | noindex |
| **Analytics** | Track CRUD operations |
| **Project Lead** | Complete broadcast lifecycle management |

**Form Fields:**
- title, message (textarea), type (select: info/success/warning/error/etc), category (select)
- targetProjects (multi-input), targetPlatforms (multi-select), targetAudience (select)
- status (select: draft/scheduled/active/ended)
- startDate, endDate (datetime)
- priority (select: urgent/high/normal/low)
- dismissible (switch)
- variant (select: banner/modal/toast/bell)

**Validation Rules:**
- [ ] List view with status/priority badges
- [ ] Create with scheduling support
- [ ] Edit existing broadcasts
- [ ] Delete with confirmation
- [ ] Live preview shows how broadcast looks in each variant
- [ ] Scheduling: startDate/endDate validated (end > start)
- [ ] Analytics shown: impressions, clicks per broadcast

**Success Checkpoint:** Full broadcast CRUD with scheduling works.

#### Part F.7: Contact Info Admin

**What:** Edit singleton contact information document.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Read/write zaions_contact_info (or portfolio_contact_info) singleton |
| **Designer** | Single form card, save button, success feedback |
| **SEO** | noindex |
| **Analytics** | Track save events |
| **Project Lead** | All contact fields editable |

**Form Fields:**
- email, supportEmail, phone, whatsapp, telegram, skype
- freelanceAvailable (switch)
- workingHours, timezone, preferredContact (select), responseTime

**Validation Rules:**
- [ ] Form loads current data from Firestore
- [ ] Email fields validated as email
- [ ] Phone fields validated as phone format
- [ ] Save updates Firestore with timestamp
- [ ] Success toast on save
- [ ] react-hook-form + zod validation

**Success Checkpoint:** Contact info editable and persists.

#### Part F.8: Developer Info Admin

**What:** Edit singleton developer profile document.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Read/write developer info singleton |
| **Designer** | Form with sections, avatar preview, bio with character count |
| **SEO** | noindex |
| **Analytics** | Track save events |
| **Project Lead** | Complete developer profile manageable |

**Form Fields:**
- name, title, tagline, bio (textarea), shortBio (textarea)
- avatar (URL input + preview), website, github, linkedin, twitter
- yearsOfExperience (number), location
- availableForHire (switch), resumeUrl

**Validation Rules:**
- [ ] All fields load from Firestore
- [ ] Avatar URL shows preview image
- [ ] Bio character count displayed
- [ ] URL fields validated
- [ ] Saves with timestamp

**Success Checkpoint:** Developer info editable and persists.

#### Part F.9: Social Links Admin (CRUD)

**What:** Full CRUD for social media links.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | List/Create/Edit/Delete, drag-to-reorder |
| **Designer** | Sortable list with platform icons, add/edit dialog |
| **SEO** | noindex |
| **Analytics** | Track CRUD operations |
| **Project Lead** | All social platforms supported |

**Form Fields:**
- platform (select from 20 options), url, displayName, username, icon, order, isActive (switch), showIn (multi-select: header/footer/contact/profile)

**Validation Rules:**
- [ ] All existing links listed with platform icons
- [ ] Create new link with platform selector
- [ ] Edit existing links
- [ ] Delete with confirmation
- [ ] Reorder via order field (or drag-and-drop)
- [ ] URL validated per platform format
- [ ] Active/inactive toggle

**Success Checkpoint:** Social links CRUD with reordering works.

#### Part F.10: Address Info Admin

**What:** Edit singleton address document.

**Form Fields:**
- label, streetAddress, city, state, postalCode, country, fullAddress (auto-composed), googleMapsUrl, isPublic (switch)

**Validation Rules:**
- [ ] All fields load and save
- [ ] Google Maps URL validated
- [ ] Full address auto-composes from parts
- [ ] isPublic toggle works

**Success Checkpoint:** Address info editable and persists.

#### Part F.11: Payment Options Admin (CRUD)

**What:** Full CRUD for payment methods.

**Form Fields:**
- type (select: bank/paypal/stripe/wise/crypto/upi/venmo/cashapp/platform/wallet/other)
- name, displayName, description, instructions (textarea), icon, isActive (switch), isPrimary (switch), order
- details (dynamic fields based on type: BankDetails or CryptoDetails or key-value pairs)

**Validation Rules:**
- [ ] All payment options listed
- [ ] Create with type-specific detail fields
- [ ] Edit existing options
- [ ] Delete with confirmation
- [ ] Only one primary option at a time
- [ ] Dynamic form fields based on type selection

**Success Checkpoint:** Payment options CRUD with dynamic fields works.

#### Part F.12: Services Admin (CRUD)

**What:** Full CRUD for professional services.

**Form Fields:**
- title, description (textarea), shortDescription, category (text), icon, features (multi-input), technologies (multi-input), priceRange, isActive (switch), isFeatured (switch), order

**Validation Rules:**
- [ ] All services listed with category grouping
- [ ] Create/Edit/Delete works
- [ ] Featured toggle highlights service
- [ ] Multi-input for features/technologies

**Success Checkpoint:** Services CRUD works.

#### Part F.13: Skills Admin (CRUD)

**What:** Full CRUD for skills list.

**Form Fields:**
- name, category, level (select: beginner/intermediate/advanced/expert), yearsOfExperience (number), icon, color, isActive (switch), isFeatured (switch), order

**Validation Rules:**
- [ ] Skills listed by category
- [ ] Level selector with visual indicator
- [ ] Create/Edit/Delete works
- [ ] Color picker for skill color

**Success Checkpoint:** Skills CRUD works.

#### Part F.14: Testimonials Admin (CRUD)

**What:** Full CRUD for client testimonials.

**Form Fields:**
- authorName, authorTitle, authorCompany, authorAvatar (URL), authorLinkedin
- content (textarea), shortContent, rating (1-5 slider), projectName, projectUrl
- date, isActive (switch), isFeatured (switch), order

**Validation Rules:**
- [ ] All testimonials listed with rating display
- [ ] Create/Edit/Delete works
- [ ] Rating slider (1-5 stars)
- [ ] Preview card shows how testimonial will look

**Success Checkpoint:** Testimonials CRUD with star rating works.

#### Part F.15: Projects Admin (CRUD)

**What:** Full CRUD for portfolio projects.

**Form Fields:**
- title, slug (auto-generated), description (textarea), shortDescription
- category (select: web/mobile/extension/full-stack/package/other)
- status (select: planning/in-progress/completed/maintained/archived)
- thumbnailUrl, images (multi-input URLs), technologies (multi-input), features (multi-input)
- links: website, github, playStore, appStore, npm, demo
- clientName, startDate, endDate
- isActive (switch), isFeatured (switch), order

**Validation Rules:**
- [ ] All projects listed with status badges
- [ ] Create/Edit/Delete works
- [ ] Slug auto-generates from title
- [ ] Multiple image URLs supported
- [ ] Multi-input for technologies/features
- [ ] Links section with platform-specific fields

**Success Checkpoint:** Projects CRUD with all fields works.

#### Part F.16: Analytics Admin Dashboard

**What:** Comprehensive analytics dashboard with D3.js charts.

| Perspective | Requirements |
|-------------|-------------|
| **Developer** | Query zaions_impressions, aggregate data, D3 visualizations |
| **Designer** | Full-width charts, date range picker, metric cards, export options |
| **SEO** | noindex |
| **Analytics** | Track date range changes, export clicks |
| **Project Lead** | All important metrics visualized |

**Charts to Implement:**
1. **Impressions Over Time** - Line chart (daily/weekly/monthly)
2. **Clicks vs Impressions** - Dual-axis line chart
3. **Platform Distribution** - Pie/donut chart
4. **Top Campaigns** - Horizontal bar chart
5. **Project Distribution** - Pie chart (which consumer projects generate most traffic)
6. **Broadcast Performance** - Bar chart (impressions/clicks per broadcast)

**Metrics Cards:**
- Total Impressions | Total Clicks | CTR% | Total Broadcasts Sent | Active Campaigns | Avg Frequency

**Validation Rules:**
- [ ] Date range picker (7d, 30d, 90d, custom)
- [ ] All 6 charts render with D3.js
- [ ] Metric cards show accurate data
- [ ] Loading skeletons during data fetch
- [ ] Export data as CSV option
- [ ] Responsive charts (resize on window change)

**Success Checkpoint:** All 6 charts render with real data.

#### Part F.17: Impressions Admin

**What:** Raw impressions data viewer with filtering.

**Table Columns:**
- Date | Campaign | Product | Project | Platform | Action | Device ID | Variant

**Features:**
- Filter by: campaign, product, project, platform, action, date range
- Sort by any column
- Pagination (50 per page)
- Export as CSV

**Validation Rules:**
- [ ] Table loads with pagination
- [ ] All filters work
- [ ] Sort by each column works
- [ ] CSV export works
- [ ] Date range filter works

**Success Checkpoint:** Impressions table with full filtering works.

---

## 5. Admin Panel Plan

### Firestore Collections Managed

| Collection | Type | Admin Page | CRUD |
|------------|------|-----------|------|
| zaions_feature_flags | Singleton | Feature Flags Admin | Read/Update |
| zaions_campaigns | Collection | Campaigns Admin | Full CRUD |
| zaions_products | Collection | Products Admin | Full CRUD |
| zaions_impressions | Collection | Impressions Admin | Read/Delete |
| zaions_broadcasts | Collection | Broadcasts Admin | Full CRUD |
| zaions_broadcast_events | Collection | Analytics Admin | Read only |
| portfolio_contact_info | Singleton | Contact Info Admin | Read/Update |
| portfolio_developer_info | Singleton | Developer Info Admin | Read/Update |
| portfolio_social_links | Collection | Social Links Admin | Full CRUD |
| portfolio_address_info | Singleton | Address Info Admin | Read/Update |
| portfolio_payment_options | Collection | Payment Options Admin | Full CRUD |
| portfolio_services | Collection | Services Admin | Full CRUD |
| portfolio_skills | Collection | Skills Admin | Full CRUD |
| testimonials | Collection | Testimonials Admin | Full CRUD |
| portfolio_projects | Collection | Projects Admin | Full CRUD |

### Admin Sidebar Navigation

```
Admin Panel
├── Overview
├── ─── Feature Management ───
├── Feature Flags
├── ─── Advertising ───
├── Campaigns
├── Products
├── Impressions
├── ─── Communications ───
├── Broadcasts
├── ─── Profile & Info ───
├── Contact Info
├── Developer Info
├── Social Links
├── Address
├── ─── Portfolio ───
├── Payment Options
├── Services
├── Skills
├── Testimonials
├── Projects
├── ─── Insights ───
└── Analytics Dashboard
```

---

## 6. Authentication System

### Auth Flow

```
User visits /login
  → Clicks "Sign in with Google"
  → Firebase signInWithPopup(GoogleAuthProvider)
  → On success:
    → Check if user doc exists in 'users' collection
    → If not: create user doc with defaults
    → Check email === 'aoneahsan@gmail.com' → set isAdmin: true
    → Update lastLogin timestamp
    → Redirect: isAdmin ? '/admin' : '/dashboard'
  → On failure:
    → Show error toast
```

### User Document Schema

```typescript
interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'google';
  emailVerified: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  updatedAt: Timestamp;
  isAdmin: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    emailNotifications: boolean;
  };
}
```

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users: read/write own doc
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Admin-only collections (write)
    match /zaions_{collection}/{document=**} {
      allow read: if true;  // Public read for consumer packages
      allow write: if request.auth != null && request.auth.token.email == 'aoneahsan@gmail.com';
    }

    // Portfolio collections (write)
    match /portfolio_{collection}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'aoneahsan@gmail.com';
    }

    // Testimonials
    match /testimonials/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'aoneahsan@gmail.com';
    }

    // Impressions (public write for package consumers)
    match /zaions_impressions/{document=**} {
      allow read: if request.auth != null && request.auth.token.email == 'aoneahsan@gmail.com';
      allow create: if true;
    }

    // Broadcast events (public write)
    match /zaions_broadcast_events/{document=**} {
      allow read: if request.auth != null && request.auth.token.email == 'aoneahsan@gmail.com';
      allow create: if true;
    }
  }
}
```

---

## 7. Analytics & Data Plan

### Analytics Platforms

| Platform | Purpose | Implementation |
|----------|---------|---------------|
| Firebase Analytics | Event tracking | Bundled SDK |
| Microsoft Clarity | Session replay, heatmaps | Bundled script (NO CDN for extension compat) |
| Amplitude | Product analytics | Bundled npm package |

### Events to Track

| Category | Event | Properties |
|----------|-------|-----------|
| Navigation | page_view | page_path, page_title |
| Auth | login_attempt | provider |
| Auth | login_success | provider, isAdmin |
| Auth | login_failure | provider, error |
| Auth | logout | - |
| Marketing | hero_cta_click | button_label |
| Marketing | npm_copy | - |
| Marketing | feature_card_click | feature_name |
| Marketing | pricing_cta_click | action |
| Docs | docs_section_view | section_id |
| Docs | code_copy | section_id, language |
| Docs | docs_search | query |
| Demo | demo_interaction | component, variant, action |
| Admin | admin_crud | collection, action (create/update/delete) |
| Admin | feature_flag_toggle | feature_id, new_state |
| Admin | analytics_export | format, date_range |
| External | external_link_click | url, label |
| Support | support_link_click | - |

### Data Display Architecture

```
Analytics Admin Page
├── Date Range Selector (7d / 30d / 90d / Custom)
├── Metric Cards Row
│   ├── Total Impressions
│   ├── Total Clicks
│   ├── CTR %
│   ├── Active Campaigns
│   ├── Active Broadcasts
│   └── Avg Frequency Days
├── Charts Grid
│   ├── Impressions Over Time (D3 Line Chart)
│   ├── Click-Through Rate Trend (D3 Line Chart)
│   ├── Platform Distribution (D3 Donut Chart)
│   ├── Top Campaigns by Impressions (D3 Bar Chart)
│   ├── Project Distribution (D3 Donut Chart)
│   └── Broadcast Performance (D3 Grouped Bar Chart)
└── Raw Data Table (with export)
```

---

## 8. SEO & Marketing Plan

### Technical SEO

| Item | Implementation |
|------|---------------|
| Meta Tags | Dynamic per page (title, description, og:title, og:description, og:image, twitter:card) |
| Canonical URLs | Set per page |
| robots.txt | Allow all marketing pages, disallow /dashboard, /admin, /login |
| sitemap.xml | Static XML with all marketing pages |
| Structured Data | SoftwareApplication (home), Person (about), FAQ (pricing, docs), BreadcrumbList (all) |
| Open Graph Image | Custom SVG for each key page |
| Twitter Cards | summary_large_image for all pages |
| Heading Hierarchy | H1 per page, H2 for sections, H3 for subsections |
| Internal Linking | Every page links to at least 3 other pages |
| Image Alt Text | Descriptive alt on all SVG/images |
| URL Structure | Clean, descriptive slugs |

### Target Keywords

| Page | Primary Keyword | Secondary Keywords |
|------|----------------|-------------------|
| Home | shared features npm package | react shared features, cross-project features, firebase react package |
| Features | shared features react components | ad components react, broadcast notifications react |
| Docs | shared-features documentation | react feature flags, in-app advertising react |
| Pricing | shared-features pricing free | free npm package react, open source react tools |
| API Ref | shared-features api reference | react hooks firebase, shared features hooks |
| Demos | shared-features demo | react component playground, ad component demo |
| Changelog | shared-features changelog | shared features version history |

### Content Strategy

1. **Long-form docs page** (3000+ words) targeting "react shared features" queries
2. **Structured code examples** with language tags for Google code search
3. **FAQ sections** on pricing and docs for featured snippets
4. **Changelog** for "shared-features latest version" queries
5. **NPM README** links back to website for all docs

### Marketing Assets

| Asset | Format | Purpose |
|-------|--------|---------|
| og-image.svg | 1200x630 | Social sharing |
| apple-touch-icon.svg | 180x180 | iOS bookmarks |
| favicon.svg | 32x32 | Browser tab |
| npm-banner.svg | 1024x500 | NPM README header |

---

## 9. Design System & UI/UX Plan

### Brand Identity

| Element | Value |
|---------|-------|
| Primary Color | Emerald/Teal (#10B981 → brand-500) |
| Accent Color | Violet/Purple (#8B5CF6 → accent-500) |
| Display Font | "Plus Jakarta Sans" |
| Body Font | "Inter var" |
| Mono Font | "JetBrains Mono" / "Fira Code" |
| Border Radius | lg (8px) default, xl (12px) cards, 2xl (16px) hero elements |
| Shadow Style | Soft shadows with color tinting |

### Color Palette (CSS Variables)

```css
--brand-50: #ecfdf5   --accent-50: #f5f3ff
--brand-100: #d1fae5  --accent-100: #ede9fe
--brand-200: #a7f3d0  --accent-200: #ddd6fe
--brand-300: #6ee7b7  --accent-300: #c4b5fd
--brand-400: #34d399  --accent-400: #a78bfa
--brand-500: #10b981  --accent-500: #8b5cf6
--brand-600: #059669  --accent-600: #7c3aed
--brand-700: #047857  --accent-700: #6d28d9
--brand-800: #065f46  --accent-800: #5b21b6
--brand-900: #064e3b  --accent-900: #4c1d95
--brand-950: #022c22  --accent-950: #2e1065
```

### Animation Guidelines

| Animation | Use | Duration |
|-----------|-----|----------|
| fade-in | Page load elements | 0.5s |
| slide-up | Cards, content blocks | 0.6s with stagger |
| scale-in | Modals, dialogs | 0.3s |
| float | Hero decorative elements | 6s infinite |
| hover-lift | Interactive cards | 0.2s |

### Responsive Breakpoints

| Name | Width | Layout Changes |
|------|-------|---------------|
| xs | 320px | Single column, compact padding |
| sm | 375px | Single column, standard padding |
| md | 480px | Single/two column where appropriate |
| tablet | 640px | Two column grids, sidebar visible |
| lg | 1024px | Full layout, three column grids |
| xl | 1280px | Max-width container, spacious layout |

### Component Variants (CVA)

Each base component supports these variant dimensions:
- **Size**: sm, md, lg
- **Variant**: default, primary, secondary, outline, ghost, danger, link
- **State**: default, hover, focus, active, disabled, loading

### UI/UX Principles for This Project

1. **Code-first aesthetic**: Monospace fonts in hero, terminal-style code blocks
2. **Developer-friendly**: Dark code blocks with syntax highlighting
3. **Playful but professional**: Floating shapes, gradients, but clean layout
4. **Information density**: Devs want info fast - no excessive whitespace
5. **Interactive demos**: Let users see before they install
6. **Copy-paste ready**: Every code example has one-click copy

---

## 10. Validation Rules & Success Checkpoints

### Global Validation Rules (Apply to EVERY page)

| # | Rule | Check |
|---|------|-------|
| 1 | Responsive 320px-1920px | No horizontal scroll at any breakpoint |
| 2 | Touch targets 44x44px min | All buttons/links on mobile |
| 3 | Text readable (14px min, 16px body) | No truncated or overflow text |
| 4 | Loading states | Skeleton or spinner for async content |
| 5 | Error states | User-friendly error messages |
| 6 | Empty states | "No data" messages where applicable |
| 7 | Keyboard navigation | Tab through all interactive elements |
| 8 | Scroll to top | On every route change |
| 9 | Analytics tracking | Every user action tracked |
| 10 | Go back button | Every page except "/" |

### Build Validation (Every Change)

```bash
# Must all pass with 0 errors/warnings
yarn build          # 0 errors
yarn lint           # 0 warnings
yarn typecheck      # 0 errors
```

### Section-Level Success Checkpoints

| Section | Checkpoint | Criteria |
|---------|-----------|----------|
| A (Foundation) | Project runs | Dev server, build, lint all pass |
| B (Marketing) | All pages render | 21 marketing pages load without errors |
| C (Errors) | Error pages work | All 4 error pages render with correct styling |
| D (Auth) | Auth works | Login/logout/admin detection functional |
| E (Dashboard) | Dashboard loads | Overview and settings pages functional |
| F (Admin) | Full CRUD works | All 15 collections manageable from admin |
| G (Analytics) | Charts render | All 6 D3 charts show data |
| H (SEO) | SEO complete | Meta tags, sitemap.xml, robots.txt, structured data |

### Final Validation Checklist

- [ ] All 47 pages render without errors
- [ ] All 15 Firestore collections manageable from admin
- [ ] Google Auth works (login, admin detection, logout)
- [ ] All 6 D3 charts render in analytics
- [ ] All code examples are accurate and copyable
- [ ] All component demos work
- [ ] Responsive at all breakpoints (320px, 375px, 480px, 640px, 768px, 1024px, 1280px, 1920px)
- [ ] Build: 0 errors, 0 warnings
- [ ] Lint: 0 issues
- [ ] TypeScript: 0 errors
- [ ] SEO: meta tags on all pages, sitemap.xml, robots.txt
- [ ] Analytics: all events tracked
- [ ] Support link: correct URL with query params
- [ ] Legal pages: all 5 present with accurate content
- [ ] Error pages: all 4 styled and functional
- [ ] .env.example: all variables documented
- [ ] Firebase rules: security rules deployed

---

## 11. Implementation Phases

### Phase 1: Foundation (Parts A.1 - A.4)
- Project init, design system, layouts, routing, auth
- **Deliverable:** Skeleton app with auth working, all layouts rendering

### Phase 2: Marketing Core (Parts B.1 - B.6)
- Home, Features, Feature Detail pages, Docs, API Reference, Demos
- **Deliverable:** Complete marketing presence with docs and demos

### Phase 3: Marketing Extended (Parts B.7 - B.14 + C.1)
- Pricing, Changelog, About, Contact, Legal pages, Sitemap, Code Access, Examples, Error pages
- **Deliverable:** All public pages complete

### Phase 4: Auth & User Dashboard (Parts D.1 + E.1 - E.2)
- Login, Dashboard Overview, Settings
- **Deliverable:** Authenticated user experience working

### Phase 5: Admin Core (Parts F.1 - F.6)
- Admin Overview, Feature Flags, Campaigns CRUD, Campaign Detail, Products CRUD, Broadcasts CRUD
- **Deliverable:** Core admin panel managing the 3 main systems

### Phase 6: Admin Common Features (Parts F.7 - F.15)
- Contact, Developer, Social Links, Address, Payment Options, Services, Skills, Testimonials, Projects
- **Deliverable:** All common features manageable from admin

### Phase 7: Analytics & Polish (Parts F.16 - F.17)
- Analytics Dashboard with D3 charts, Impressions viewer, final SEO, final testing
- **Deliverable:** Complete website ready for deployment

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-09 | Initial comprehensive plan |
