# Implementation Plan: Production-Ready Enhancements for Wysh

**Branch**: `003-production-ready-enhancements` | **Date**: 2025-10-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-production-ready-enhancements/spec.md`

**Note**: This implementation plan follows the `/speckit.plan` workflow with official documentation verification using Upstash Context7 MCP tool.

## Summary

Enhance Wysh to production-ready standards by implementing shadcn/ui theme consistency (eliminating hardcoded colors, ensuring light/dark mode support), adding homepage statistics section with animated counters (total greetings, views, festivals), implementing multi-tier rate limiting (IP-based: 3/min, 20/hr, 50/day), comprehensive SEO optimization (metadata API, Open Graph, Twitter Cards, sitemap, robots.txt), performance improvements (loading states, code splitting, image optimization), mobile-first enhancements (44px touch targets, reduced animations, responsive layouts), and accessibility compliance (WCAG AA, keyboard navigation, screen reader support). Technical approach uses Convex Rate Limiter component or Upstash Redis for rate limiting, Next.js Metadata API for SEO, Convex queries for statistics, Framer Motion for counter animations, and systematic color audit replacing all hardcoded values with shadcn/ui CSS variables.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Framework**: Next.js 15+ (App Router only, React 19+)
**Primary Dependencies**:
- shadcn/ui (CSS variables mode with Tailwind CSS v4)
- Convex (database, real-time queries, mutations)
- @convex-dev/rate-limiter (application-level rate limiting) **NEEDS INSTALLATION**
- GSAP 3.13+ (animations - already installed, will be used for counter animations)
- next-themes (theme management) **VERIFY IF INSTALLED**
- React Hook Form + zod (form validation - already installed)

**Storage**: Convex (NoSQL database with TypeScript schema, real-time subscriptions)
**Testing**: Manual QA, Mobile device testing (mid-range Android), Lighthouse CI, WCAG automated testing (axe-core)
**Target Platform**: Web (Vercel serverless deployment), Mobile-first (320px-2560px), iOS 14+, Android 9+, Modern browsers (Chrome, Safari, Firefox, Edge latest 2 versions)
**Project Type**: Web application (mobile-first responsive design)
**Performance Goals**:
- Lighthouse Performance: >90 mobile, >95 desktop
- First Contentful Paint: <1.5s (90% mobile on 4G)
- Largest Contentful Paint: <2.5s (95% page loads)
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms
- Animation: 60fps on mid-range Android (Snapdragon 600 series)
- Bundle size: <300KB initial load (compressed)

**Constraints**:
- Mobile-first CSS (no desktop-first breakpoints)
- No authentication (all greetings public)
- GSAP only for animations (no new animation libraries without justification)
- Solo developer simplicity (components <200 lines, minimal dependencies)
- Cultural authenticity (festival colors must align with traditions)
- Privacy by design (minimal data collection)

**Scale/Scope**:
- Target users: 10k+ concurrent users (festival peak periods)
- Expected greetings: 50k+ per major festival
- Route complexity: 7 public routes, 1 dynamic route pattern
- Component count: ~40 components (20 shadcn/ui, 20 custom)
- Festival templates: 7 (Diwali, Holi, Christmas, New Year, Pongal, Generic, future additions)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Solo Developer Simplicity** ✅
- Rate limiting uses official Convex component (@convex-dev/rate-limiter) - minimal setup
- SEO metadata uses Next.js built-in Metadata API - no external library needed
- Statistics section is simple Convex query aggregation - no complex data pipeline
- Color audit is systematic find-replace operation - low cognitive load
- All enhancements build on existing stack (no new major dependencies except rate limiter component)

**II. Mobile-First Performance** ✅
- Theme switching optimized via CSS variables (no JavaScript color computation)
- Statistics use intersection observer for scroll-triggered animations (performance-friendly)
- Rate limiting happens server-side (zero client bundle impact)
- Loading states prevent layout shifts (CLS optimization)
- Code splitting for heavy components maintains bundle budget
- Mobile-specific animation reductions preserve 60fps target

**III. Cultural Authenticity** ✅
- Existing festival templates remain unchanged (no cultural impact)
- Festival-specific colors continue to extend shadcn/ui theme (verified in globals.css)
- Relationship context engine unaffected by enhancements
- No new festival content introduced (only technical improvements)

**IV. MVP-First Delivery** ✅
- Feature implemented as vertical slices: Theme consistency → Stats → Rate limiting → SEO → Performance → Mobile → Accessibility
- Each slice ships independently and is testable
- No premature optimization (focusing on production-ready essentials)
- Real device testing required before merge (per constitution)
- WhatsApp preview testing mandatory for SEO changes

**V. Privacy by Design** ✅
- Rate limiting uses IP addresses (no user accounts)
- Statistics are aggregate only (total counts, no individual tracking)
- No new personal data collection introduced
- Open Graph images generated server-side (no user data in metadata)
- View counts remain internal (not exposed to users)

## Project Structure

### Documentation (this feature)

```
specs/003-production-ready-enhancements/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - Technology decisions and best practices
├── data-model.md        # Phase 1 output - Rate limit records, statistics aggregates
├── quickstart.md        # Phase 1 output - Developer setup for enhancements
├── contracts/           # Phase 1 output - API contracts for rate limiting
├── spec.md              # Feature specification (input)
└── checklists/          # Validation checklists
    └── requirements.md  # Requirements validation (completed)
```

### Source Code (repository root)

```text
wysh/
├── app/
│   ├── page.tsx                              # MODIFY: Add statistics section
│   ├── g/[id]/
│   │   └── page.tsx                          # MODIFY: Add dynamic metadata with generateMetadata
│   ├── layout.tsx                            # MODIFY: Add root metadata
│   ├── globals.css                           # VERIFY: Check shadcn/ui CSS variables (already correct)
│   ├── sitemap.ts                            # CREATE: Generate sitemap.xml
│   ├── robots.ts                             # CREATE: Generate robots.txt
│   ├── opengraph-image.tsx                   # CREATE: Dynamic Open Graph image generation
│   └── create/
│       ├── festival/page.tsx                 # AUDIT: Replace hardcoded colors
│       ├── relationship/page.tsx             # AUDIT: Replace hardcoded colors
│       ├── personalize/page.tsx              # AUDIT: Replace hardcoded colors
│       ├── template/page.tsx                 # AUDIT: Replace hardcoded colors
│       └── success/page.tsx                  # AUDIT: Replace hardcoded colors
├── components/
│   ├── ui/                                   # NO CHANGE: shadcn/ui components (already correct)
│   ├── greetings/
│   │   ├── DiwaliTemplate.tsx                # AUDIT: Replace hardcoded colors
│   │   ├── HoliTemplate.tsx                  # AUDIT: Replace hardcoded colors
│   │   ├── ChristmasTemplate.tsx             # AUDIT: Replace hardcoded colors
│   │   ├── NewYearTemplate.tsx               # AUDIT: Replace hardcoded colors
│   │   ├── PongalTemplate.tsx                # AUDIT: Replace hardcoded colors
│   │   ├── GenericTemplate.tsx               # AUDIT: Replace hardcoded colors
│   │   └── GreetingRenderer.tsx              # AUDIT: Replace hardcoded colors
│   ├── forms/
│   │   ├── FestivalSelector.tsx              # AUDIT: Replace hardcoded colors
│   │   ├── RelationshipSelector.tsx          # AUDIT: Replace hardcoded colors
│   │   ├── PersonalizationForm.tsx           # AUDIT: Replace hardcoded colors + ADD loading states
│   │   └── TemplateSelector.tsx              # AUDIT: Replace hardcoded colors
│   ├── shared/
│   │   ├── LoadingState.tsx                  # VERIFY: Skeleton loaders exist
│   │   ├── ErrorState.tsx                    # VERIFY: Error handling
│   │   ├── ReplayButton.tsx                  # AUDIT: Replace hardcoded colors
│   │   └── ShareButton.tsx                   # AUDIT: Replace hardcoded colors
│   ├── layout/
│   │   ├── Navigation.tsx                    # AUDIT: Replace hardcoded colors
│   │   └── Footer.tsx                        # AUDIT: Replace hardcoded colors
│   └── stats/
│       └── StatisticsSection.tsx             # CREATE: Homepage statistics with animated counters
├── convex/
│   ├── schema.ts                             # MODIFY: Add rate limit schema (if using Convex storage)
│   ├── greetings.ts                          # MODIFY: Add rate limiting to createGreeting mutation
│   ├── statistics.ts                         # CREATE: Queries for total greetings, views, festivals
│   ├── rateLimiter.ts                        # CREATE: Rate limit configuration and logic
│   └── convex.config.ts                      # MODIFY: Install @convex-dev/rate-limiter component
├── lib/
│   ├── constants.ts                          # VERIFY: Festival colors use CSS variables
│   ├── context-engine.ts                     # NO CHANGE: Relationship context unaffected
│   ├── rate-limit.ts                         # CREATE: Rate limiting utilities and IP extraction
│   ├── metadata.ts                           # CREATE: Helper functions for SEO metadata generation
│   └── animations.ts                         # MODIFY: Add counter animation utilities
├── hooks/
│   ├── use-counter-animation.ts              # CREATE: Hook for animated number counters
│   └── use-intersection-observer.ts          # CREATE: Hook for scroll-triggered animations
├── types/
│   ├── index.ts                              # MODIFY: Add RateLimitStatus, Statistics types
│   └── rate-limit.types.ts                   # CREATE: Rate limiting TypeScript interfaces
└── public/
        └── og-default.png                        # CREATE: Default Open Graph image
```

**File Count Estimate**:

- Modify: 25 files (color audit + rate limiting + metadata)
- Create: 12 files (statistics, rate limiting, SEO, hooks)
- Total: 37 files affected

```text
```

**File Count Estimate**:

- Modify: 25 files (color audit + rate limiting + metadata)
- Create: 12 files (statistics, rate limiting, SEO, hooks)
- Total: 37 files affected

**Structure Decision**: Web application following Next.js 15+ App Router conventions. All components reside in `components/` with subdirectories by function (ui, greetings, forms, shared, layout, stats). Convex backend functions in `convex/` directory. Utilities and helpers in `lib/`. TypeScript types in `types/`. Public assets in `public/`. This structure aligns with Solo Developer Simplicity principle (flat, predictable organization) and Next.js best practices.

## Complexity Tracking

**No violations**. All enhancements follow constitution principles:

- @convex-dev/rate-limiter is official Convex component (minimal complexity)
- Next.js Metadata API is built-in (no new library)
- Color audit is systematic find-replace (low cognitive load)
- Statistics section is simple query aggregation (straightforward implementation)
- All components remain under 200 lines (enforced via code review)
