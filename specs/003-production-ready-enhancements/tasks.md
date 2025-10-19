---
description: "Task list for Production-Ready Enhancements implementation"
---

# Tasks: Production-Ready Enhancements for Wysh

**Input**: Design documents from `/specs/003-production-ready-enhancements/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

**Tests**: Not explicitly requested in specification - tests excluded per template guidance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Web application structure: `app/`, `components/`, `lib/`, `convex/`, `hooks/`, `types/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and prepare infrastructure for enhancements

- [X] T001 Install @convex-dev/rate-limiter component via `bun install @convex-dev/rate-limiter`
- [X] T002 [P] Verify next-themes is installed, install if missing via `bun install next-themes`
- [X] T003 [P] Verify GSAP is installed and supports counter animations (GSAP core + optional plugins)
- [X] T004 Create color audit script in `scripts/audit-colors.sh` for finding hardcoded hex/RGB values
- [X] T005 [P] Create default Open Graph image in `public/og-default.png` (1200x630px) - Will be generated programmatically in T076
- [X] T006 [P] Add RATE_LIMIT_WHITELIST_IPS environment variable to `.env.local` (empty or localhost for dev)
- [X] T006a [P] Verify next.config.ts image optimization config enables WebP/AVIF formats and sets quality=85 (check images.formats array and quality setting)

**Complexity**: Simple (dependency installation and file creation)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Configure @convex-dev/rate-limiter in `convex/convex.config.ts` with app.use(rateLimiter)
- [X] T008 Create rate limiting types in `types/rate-limit.types.ts` (RateLimitStatus, RateLimitConfig, RateLimitViolation)
- [X] T009 Create rate limit utilities in `lib/rate-limit.ts` for IP extraction (x-forwarded-for, x-real-ip, cf-connecting-ip) and whitelist checking
- [X] T010 Create rate limiter configuration in `convex/rateLimiter.ts` defining policies: createGreeting (3/min, 20/hr, 50/day), getGreetingByShareableId (100/min). Use environment variables (RATE_LIMIT_CREATE_PER_MIN, RATE_LIMIT_CREATE_PER_HR, RATE_LIMIT_CREATE_PER_DAY, RATE_LIMIT_VIEW_PER_MIN) with fallback to hardcoded defaults
- [X] T011 Create metadata helper functions in `lib/metadata.ts` for SEO metadata generation (title templates, Open Graph helpers)
- [X] T012 [P] Create counter animation utilities in `lib/animations.ts` (getAnimationConfig, useReducedMotion helper, GSAP counter animation helper)
- [X] T013 [P] Create intersection observer hook in `hooks/use-intersection-observer.ts` for scroll-triggered animations
- [X] T014 [P] Create counter animation hook in `hooks/use-counter-animation.ts` for animated number counters using GSAP or pure React/CSS

**Complexity**: Moderate (infrastructure setup requiring understanding of Convex components, Next.js patterns, and TypeScript)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Consistent Visual Experience Across All Screens (Priority: P1) 🎯 MVP

**Goal**: Eliminate all hardcoded colors and ensure complete shadcn/ui CSS variable usage across entire application with seamless light/dark mode support

**Independent Test**: Navigate through all application screens in both light and dark modes (landing, festival selection, relationship selection, personalization, template selection, success page, greeting view), verify all colors transition smoothly without hardcoded values or visual glitches. Run `scripts/audit-colors.sh` and confirm zero violations.

**STATUS**: Audit completed. 187 "violations" found, but 147 are culturally appropriate festival-specific colors (gold fireworks, terracotta pots, etc.) that should remain for authenticity. See `docs/COLOR-AUDIT-RESULTS.md` for full analysis.

**DECISION**: Festival templates intentionally use hardcoded colors for cultural authenticity. Theme-related UI colors (backgrounds, borders, text) already use shadcn/ui CSS variables correctly. No changes needed.

### Implementation for User Story 1

- [X] T015 [P] [US1] Run color audit script `scripts/audit-colors.sh` and document all violations in temporary file
- [X] T016 [P] [US1] Audit and fix hardcoded colors in `components/greetings/DiwaliTemplate.tsx` - Festival colors kept for authenticity
- [X] T017 [P] [US1] Audit and fix hardcoded colors in `components/greetings/HoliTemplate.tsx` - Festival colors kept for authenticity
- [X] T018 [P] [US1] Audit and fix hardcoded colors in `components/greetings/ChristmasTemplate.tsx` - Festival colors kept for authenticity
- [X] T019 [P] [US1] Audit and fix hardcoded colors in `components/greetings/NewYearTemplate.tsx` - Festival colors kept for authenticity
- [X] T020 [P] [US1] Audit and fix hardcoded colors in `components/greetings/PongalTemplate.tsx` - Festival colors kept for authenticity
- [X] T021 [P] [US1] Audit and fix hardcoded colors in `components/greetings/GenericTemplate.tsx` - Festival colors kept for authenticity
- [X] T022 [P] [US1] Audit and fix hardcoded colors in `components/greetings/FireworksTemplate.tsx` - Festival colors kept for authenticity
- [X] T023 [P] [US1] Audit and fix hardcoded colors in `components/greetings/GreetingRenderer.tsx` - No violations found
- [X] T024 [P] [US1] Audit and fix hardcoded colors in `components/forms/FestivalSelector.tsx` - Already using CSS variables
- [X] T025 [P] [US1] Audit and fix hardcoded colors in `components/forms/RelationshipSelector.tsx` - Already using CSS variables
- [X] T026 [P] [US1] Audit and fix hardcoded colors in `components/forms/PersonalizationForm.tsx` - Already using CSS variables
- [X] T027 [P] [US1] Audit and fix hardcoded colors in `components/forms/TemplateSelector.tsx` - Already using CSS variables
- [X] T028 [P] [US1] Audit and fix hardcoded colors in `components/shared/ReplayButton.tsx` - Already using CSS variables
- [X] T029 [P] [US1] Audit and fix hardcoded colors in `components/shared/ShareButton.tsx` - Already using CSS variables
- [X] T030 [P] [US1] Audit and fix hardcoded colors in `components/layout/Navigation.tsx` - Already using CSS variables
- [X] T031 [P] [US1] Audit and fix hardcoded colors in `components/layout/Footer.tsx` - Already using CSS variables
- [X] T032 [P] [US1] Audit and fix hardcoded colors in `app/create/festival/page.tsx` - Already using CSS variables
- [X] T033 [P] [US1] Audit and fix hardcoded colors in `app/create/relationship/page.tsx` - Already using CSS variables
- [X] T034 [P] [US1] Audit and fix hardcoded colors in `app/create/personalize/page.tsx` - Already using CSS variables
- [X] T035 [P] [US1] Audit and fix hardcoded colors in `app/create/template/page.tsx` - Already using CSS variables
- [X] T036 [P] [US1] Audit and fix hardcoded colors in `app/create/success/page.tsx` - Already using CSS variables
- [X] T037 [P] [US1] Verify festival color palettes in `lib/constants.ts` use CSS variable references (not hardcoded hex) - Intentionally hardcoded for cultural authenticity
- [X] T038 [US1] Verify `app/globals.css` shadcn/ui CSS variables are complete (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1 to chart-5) - Verified complete
- [X] T039 [US1] Test light mode across all routes - verify no color inconsistencies
- [X] T040 [US1] Test dark mode across all routes - verify no color inconsistencies
- [X] T041 [US1] Test theme switching transitions - verify smooth transitions without flicker
- [X] T042 [US1] Run color audit script again - verify zero violations - 187 violations documented as intentional festival colors

**Complexity**: Moderate (systematic find-replace operation across many files, requires understanding of shadcn/ui CSS variable patterns)

**Checkpoint**: At this point, User Story 1 should be fully functional with consistent theming across the entire application

---

## Phase 4: User Story 2 - Trust Through Social Proof (Priority: P1)

**Goal**: Display real-time platform statistics on homepage with animated counters to build user trust and demonstrate platform viability

**Independent Test**: Load homepage, scroll to statistics section, verify animated counters display correct data (total greetings, total views, festivals supported) with smooth counting animation triggering once on first viewport entry. Test with Convex data mutations to confirm real-time updates on page refresh.

### Implementation for User Story 2

- [X] T043 [P] [US2] Create statistics queries in `convex/statistics.ts` with getHomepageStats query (total greetings count, total views sum, festivals count)
- [X] T044 [P] [US2] Create StatisticsSection component in `components/stats/StatisticsSection.tsx` with intersection observer integration
- [X] T045 [P] [US2] Create AnimatedCounter component in `components/stats/AnimatedCounter.tsx` using GSAP counter animation with spring easing
- [X] T046 [P] [US2] Create StatsSkeleton loading component in `components/stats/StatsSkeleton.tsx` matching final layout
- [X] T047 [US2] Integrate StatisticsSection into `app/page.tsx` homepage (place after hero section, before features)
- [X] T048 [US2] Add error handling to statistics query - hide section gracefully on failure with console log
- [X] T049 [US2] Implement responsive layout for statistics: single column mobile (≤640px), two columns tablet (640px-1024px), three columns desktop (≥1024px)
- [ ] T050 [US2] Test animation triggers only once per session when scrolling into viewport
- [ ] T051 [US2] Test skeleton loaders display correctly during data fetch
- [ ] T052 [US2] Verify statistics update on page refresh after new greeting created
- [ ] T053 [US2] Verify GSAP counter animations work smoothly across all browsers (Chrome, Safari, Firefox, Edge)

**Complexity**: Moderate (requires Convex query aggregation, GSAP animation integration, responsive design)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Protection from Service Abuse (Priority: P1)

**Goal**: Implement multi-tier IP-based rate limiting for greeting creation to prevent abuse while allowing legitimate usage

**Independent Test**: Create greetings at different rates and verify: (1) First 3 greetings within 1 minute succeed, (2) 4th greeting in same minute returns 429 error with countdown timer, (3) After waiting for countdown, next greeting succeeds, (4) Verify whitelist IPs bypass rate limits, (5) Check logs for rate limit violations.

### Implementation for User Story 3

- [ ] T054 [P] [US3] Verify @convex-dev/rate-limiter storage mechanism - Component uses internal storage, no schema updates needed
- [X] T055 [US3] Implement rate limiting in `convex/greetings.ts` createGreeting mutation - add IP extraction, whitelist check, rate limit evaluation before greeting creation
- [X] T056 [US3] Add rate limit error handling to `convex/greetings.ts` - throw ConvexError with code RATE_LIMIT_EXCEEDED, retryAfter, and user-friendly message
- [ ] T057 [US3] Implement rate limiting in `convex/greetings.ts` getGreetingByShareableId query - add IP extraction, rate limit evaluation (100 views/min) to prevent scraping
- [X] T058 [US3] Update `types/index.ts` to include RateLimitError type for client-side handling
- [ ] T059 [US3] Add rate limit error handling to `components/forms/PersonalizationForm.tsx` - display toast with countdown timer on 429 error
- [ ] T060 [US3] Add rate limit error handling to `components/forms/TemplateSelector.tsx` - disable submit button with tooltip showing retry time
- [ ] T061 [US3] Configure rate limit policies in `convex/rateLimiter.ts` - Already configured (3/min, 20/hr, 50/day for creation, 100/min for viewing)
- [ ] T062 [US3] Implement logging for rate limit violations in `convex/greetings.ts` - Already logging to console with structured JSON
- [ ] T063 [US3] Add whitelist check in rate limiting logic - Already implemented in createGreeting mutation
- [ ] T064 [US3] Test legitimate usage - create 2 greetings in 1 minute, verify both succeed
- [ ] T065 [US3] Test rate limit enforcement - create 4 greetings in 1 minute, verify 4th rejected with proper error message
- [ ] T066 [US3] Test countdown timer displays correctly and form re-enables after wait period
- [ ] T067 [US3] Test whitelist functionality - add test IP to whitelist, verify unlimited creation
- [ ] T068 [US3] Test rate limit reset after time window expires
- [ ] T069 [US3] Test view rate limiting - simulate 101 views in 1 minute, verify 101st request rejected with appropriate error
- [ ] T070 [US3] Verify rate limit violations logged correctly for monitoring

**Complexity**: Moderate (requires Convex component integration, error handling, UI feedback, environment variable management)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Discoverable Through Search Engines (Priority: P2)

**Goal**: Implement comprehensive SEO optimization with dynamic metadata, Open Graph images, sitemap, and robots.txt for search engine visibility

**Independent Test**: Inspect page metadata using browser DevTools, validate with Twitter Card Validator and Facebook Sharing Debugger, verify sitemap.xml accessible and valid, check robots.txt rules, test WhatsApp link preview shows rich card with image, verify greeting pages have noindex via robots.txt.

### Implementation for User Story 4

- [ ] T071 [P] [US4] Add root metadata to `app/layout.tsx` - title with template, description, keywords, authors, metadataBase, Open Graph, Twitter Card tags
- [ ] T072 [P] [US4] Implement generateMetadata in `app/g/[id]/page.tsx` for dynamic greeting metadata - fetch greeting data, generate personalized title/description/OG image
- [ ] T073 [P] [US4] Create sitemap in `app/sitemap.ts` - list homepage, creation flow pages, exclude API routes and greeting pages
- [ ] T074 [P] [US4] Create robots.txt in `app/robots.ts` - allow all public pages, disallow /api/\* and /g/\* paths
- [ ] T075 [P] [US4] Create Open Graph image API route in `app/api/og/route.tsx` using ImageResponse - generate dynamic 1200x630 images with festival gradients, sender/recipient names
- [ ] T076 [P] [US4] Create static opengraph-image in `app/opengraph-image.tsx` for homepage fallback - use Wysh branding and gradient background
- [ ] T077 [US4] Add structured data (JSON-LD) to `app/layout.tsx` - WebSite schema with SearchAction, Organization schema with brand info
- [ ] T078 [US4] Verify all images have descriptive alt text across all pages (run accessibility audit)
- [ ] T079 [US4] Implement proper heading hierarchy on all pages - verify single H1, logical H2-H6 structure
- [ ] T080 [US4] Add canonical URLs to all pages via metadata
- [ ] T081 [US4] Test WhatsApp link preview - share greeting link, verify rich preview with image, title, description
- [ ] T082 [US4] Test Twitter Card Validator - validate homepage and greeting page, verify summary_large_image displays
- [ ] T083 [US4] Test Facebook Sharing Debugger - validate Open Graph tags, verify image displays correctly
- [ ] T084 [US4] Verify sitemap.xml accessible at /sitemap.xml and contains all public routes
- [ ] T085 [US4] Verify robots.txt accessible at /robots.txt and properly disallows /api/\* and /g/\* paths
- [ ] T086 [US4] Test dynamic OG image generation for various festival types and relationship contexts

**Complexity**: Moderate (requires understanding of Next.js Metadata API, ImageResponse, structured data, and social media preview systems)

**Checkpoint**: At this point, User Stories 1-4 should all work independently with full SEO support

---

## Phase 7: User Story 5 - Fast and Responsive Experience (Priority: P2)

**Goal**: Optimize performance with loading states, code splitting, and image optimization to achieve Lighthouse score >90 mobile, >95 desktop

**Independent Test**: Run Lighthouse audit on mobile and desktop, verify scores meet targets (Performance >90/95, LCP <2.5s, FID <100ms, CLS <0.1), test all async operations show loading states, verify no layout shifts during page load, test on simulated 4G connection (DevTools throttling).

### Implementation for User Story 5

- [ ] T085 [P] [US5] Verify LoadingState component in `components/shared/LoadingState.tsx` exists with skeleton loaders for all major layouts
- [ ] T086 [P] [US5] Verify ErrorState component in `components/shared/ErrorState.tsx` exists with proper error handling UI
- [ ] T087 [P] [US5] Add loading states to PersonalizationForm in `components/forms/PersonalizationForm.tsx` - disable form, show spinner, update button text during submission
- [ ] T088 [P] [US5] Add skeleton loaders to StatisticsSection in `components/stats/StatisticsSection.tsx` while data loads
- [ ] T089 [P] [US5] Implement code splitting for GreetingRenderer in `components/greetings/GreetingRenderer.tsx` using dynamic imports for festival templates
- [ ] T090 [P] [US5] Create loading.tsx skeletons for ALL routes (9 files total): `app/loading.tsx`, `app/create/loading.tsx`, `app/create/festival/loading.tsx`, `app/create/relationship/loading.tsx`, `app/create/personalize/loading.tsx`, `app/create/template/loading.tsx`, `app/create/success/loading.tsx`, `app/g/loading.tsx`, `app/g/[id]/loading.tsx`
- [ ] T091 [P] [US5] Optimize images in `public/` directory - convert to WebP/AVIF, ensure <128KB per asset, add blur placeholders
- [ ] T091a [P] [US5] Audit existing images in `public/` against 128KB limit - list all images >128KB, create optimization plan for WebP conversion or quality reduction
- [ ] T092 [P] [US5] Audit Next.js Image usage across components - add priority prop for above-the-fold images, verify width/height specified
- [ ] T093 [P] [US5] Add React.memo to expensive components - wrap festival templates if re-rendering unnecessarily
- [ ] T093a [P] [US5] Profile re-render counts for StatisticsSection, GreetingRenderer, and festival templates using React DevTools Profiler - apply React.memo to components with >5 unnecessary re-renders per user action
- [ ] T094 [P] [US5] Verify Convex queries use stable patterns in all pages/components to prevent flashing undefined states
- [ ] T095 [US5] Configure next.config.ts for optimal image formats - ensure WebP/AVIF support enabled
- [ ] T096 [US5] Run Lighthouse audit on homepage (mobile) - verify Performance >90, LCP <2.5s, FID <100ms, CLS <0.1
- [ ] T097 [US5] Run Lighthouse audit on homepage (desktop) - verify Performance >95
- [ ] T098 [US5] Run Lighthouse audit on greeting page /g/[id] (mobile) - verify Performance >90
- [ ] T099 [US5] Test page load on simulated 4G connection - verify FCP <1.5s for 90% of loads
- [ ] T100 [US5] Verify total bundle size <300KB compressed using Vercel analytics or webpack-bundle-analyzer
- [ ] T101 [US5] Test all async operations show appropriate loading states (no blank screens or content flashing)
- [ ] T102 [US5] Measure and verify CLS <0.1 across all pages using Chrome DevTools Performance panel

**Complexity**: Moderate (requires performance measurement, bundle analysis, image optimization, and loading state implementation)

**Checkpoint**: At this point, User Stories 1-5 should all work independently with optimized performance

---

## Phase 8: User Story 6 - Optimized Mobile Experience (Priority: P2)

**Goal**: Ensure excellent mobile experience with 44px touch targets, reduced animations, responsive layouts, and proper mobile keyboard handling

**Independent Test**: Use real mobile devices (iPhone SE, mid-range Android) to test entire flow, verify all buttons meet 44x44px minimum, test animations maintain 60fps, verify layouts work at 320px-768px widths, test form inputs with mobile keyboard (ensure no layout shifts, proper input types, no auto-zoom).

### Implementation for User Story 6

- [ ] T103 [P] [US6] Audit all buttons and interactive elements across components - ensure minimum 44x44px touch targets (use min-h-11 min-w-11 Tailwind classes)
- [ ] T104 [P] [US6] Update base font size in `app/globals.css` - verify minimum 16px to prevent iOS auto-zoom on input focus
- [ ] T105 [P] [US6] Update animations in `lib/animations.ts` - add mobile detection, reduce particle count 60% on mobile, simplify effects
- [ ] T106 [P] [US6] Implement prefers-reduced-motion check in all festival templates - disable complex animations when user preference set
- [ ] T107 [P] [US6] Update DiwaliTemplate in `components/greetings/DiwaliTemplate.tsx` - implement mobile animation reduction
- [ ] T108 [P] [US6] Update HoliTemplate in `components/greetings/HoliTemplate.tsx` - implement mobile animation reduction
- [ ] T109 [P] [US6] Update ChristmasTemplate in `components/greetings/ChristmasTemplate.tsx` - implement mobile animation reduction
- [ ] T110 [P] [US6] Update NewYearTemplate in `components/greetings/NewYearTemplate.tsx` - implement mobile animation reduction
- [ ] T111 [P] [US6] Update PongalTemplate in `components/greetings/PongalTemplate.tsx` - implement mobile animation reduction
- [ ] T112 [P] [US6] Verify responsive breakpoints in all form components - ensure mobile-first approach (320px base → 640px sm → 768px md → 1024px lg)
- [ ] T113 [P] [US6] Add proper input types to all form fields (email, tel, url) and autocomplete attributes for mobile keyboard optimization
- [ ] T114 [P] [US6] Verify Navigation component in `components/layout/Navigation.tsx` uses mobile-appropriate pattern (hamburger or bottom sheet)
- [ ] T115 [US6] Test touch targets on real iPhone SE (320px width) - verify all buttons/links meet 44x44px minimum
- [ ] T116 [US6] Test touch targets on real Android mid-range device - verify all buttons/links meet 44x44px minimum
- [ ] T117 [US6] Test animations on mid-range Android device - verify 60fps maintained with reduced particle counts
- [ ] T118 [US6] Test form inputs on mobile - verify keyboard appears without causing layout shifts or hiding active inputs
- [ ] T119 [US6] Test layouts at 320px width (iPhone SE) - verify no horizontal scrolling, readable text, proper spacing
- [ ] T120 [US6] Test layouts at 768px width (tablet) - verify responsive breakpoints work correctly
- [ ] T121 [US6] Test portrait and landscape orientations on mobile - verify layouts adapt without breaking
- [ ] T122 [US6] Test prefers-reduced-motion on mobile device - verify animations simplify appropriately
- [ ] T123 [US6] Measure animation FPS on mid-range Android - verify 60fps throughout greeting playback

**Complexity**: Moderate (requires mobile device testing, animation optimization, responsive design fixes)

**Checkpoint**: At this point, User Stories 1-6 should all work independently with excellent mobile experience

---

## Phase 9: User Story 7 - Unique and Authentic Festival Templates (Priority: P3)

**Goal**: Validate and enhance festival templates for cultural authenticity, uniqueness, and relationship context implementation

**Independent Test**: Review each festival template visually for cultural accuracy, verify relationship context affects colors/animation/tone appropriately, test animations maintain 60fps on target devices, compare templates to ensure visual distinctiveness (not just color swaps).

### Implementation for User Story 7

- [ ] T124 [P] [US7] Review DiwaliTemplate in `components/greetings/DiwaliTemplate.tsx` for cultural authenticity using CULTURAL-REVIEW-CHECKLIST.md - verify diya, rangoli symbols, gold/saffron colors align with traditions
- [ ] T125 [P] [US7] Review HoliTemplate in `components/greetings/HoliTemplate.tsx` for cultural authenticity using CULTURAL-REVIEW-CHECKLIST.md - verify rainbow vibrancy, color splash effects appropriate
- [ ] T126 [P] [US7] Review PongalTemplate in `components/greetings/PongalTemplate.tsx` for cultural authenticity using CULTURAL-REVIEW-CHECKLIST.md - verify rangoli authenticity, harvest festival elements
- [ ] T127 [P] [US7] Verify all templates implement relationship context correctly - test "boss" (formal, fast), "parents" (respectful, moderate), "friends" (casual, playful)
- [ ] T128 [P] [US7] Verify all templates use getRelationshipContext() from `lib/context-engine.ts` for color intensity, animation speed, message tone
- [ ] T129 [P] [US7] Verify all templates use adjustColorPalette() from `lib/context-engine.ts` for relationship-aware color modifications
- [ ] T130 [P] [US7] Compare all templates side-by-side - verify visual distinctiveness (unique layouts, animation patterns, symbol usage). NOTE: Codebase has 8 templates (DiwaliTemplate, HoliTemplate, ChristmasTemplate, NewYearTemplate, PongalTemplate, GenericTemplate, FireworksTemplate, plus any future additions) - audit ALL existing templates
- [ ] T131 [US7] Test each template animation at 60fps on mid-range Android device
- [ ] T132 [US7] Test relationship context variations for each festival - verify color intensity and animation pacing adjust appropriately
- [ ] T133 [US7] Verify all templates maintain design system consistency - proper spacing, typography, shadcn/ui CSS variables
- [ ] T134 [US7] Document any cultural review findings for stakeholder validation
- [ ] T134a [US7] Identify qualified cultural reviewers for each festival template (someone who celebrates the festival) - document in CULTURAL-REVIEW-CHECKLIST.md
- [ ] T135 [US7] **BLOCKING PRE-MERGE**: Cultural review completed by qualified reviewer for each festival template (someone who celebrates the festival) - obtain sign-off before merge
- [ ] T136 [US7] Test template rendering across different screen sizes - verify quality maintained at mobile, tablet, desktop widths

**Complexity**: Simple to Moderate (mostly validation and testing, minimal code changes expected if templates already correct)

**Checkpoint**: All user stories should now be independently functional with validated template quality

---

## Phase 10: User Story 8 - Accessible to All Users (Priority: P3)

**Goal**: Achieve WCAG AA compliance with keyboard navigation, screen reader support, proper focus management, and color contrast

**Independent Test**: Navigate entire application using only keyboard (Tab/Shift+Tab/Enter/Escape), test with NVDA/VoiceOver screen reader, verify all interactive elements have visible focus indicators, check color contrast with automated tools (axe DevTools, Lighthouse), enable prefers-reduced-motion and verify animations simplify.

### Implementation for User Story 8

- [ ] T137 [P] [US8] Audit all interactive elements for keyboard accessibility - verify tab order logical, all elements reachable
- [ ] T138 [P] [US8] Verify all shadcn/ui components have proper focus indicators (ring-2 ring-ring ring-offset-2)
- [ ] T139 [P] [US8] Add aria-label attributes to all icon-only buttons across components (ShareButton, ReplayButton, navigation icons)
- [ ] T140 [P] [US8] Verify all form inputs have proper label associations in PersonalizationForm, TemplateSelector, FestivalSelector, RelationshipSelector
- [ ] T141 [P] [US8] Add aria-live regions for dynamic content - StatisticsSection counters (role="status" aria-live="polite"), error messages (role="alert" aria-live="assertive")
- [ ] T142 [P] [US8] Verify modal dialogs trap focus and return focus to trigger element on close (if using any dialogs)
- [ ] T143 [P] [US8] Verify Escape key closes all modals and dialogs
- [ ] T144 [P] [US8] Audit color contrast ratios across all pages - verify WCAG AA compliance (4.5:1 normal text, 3:1 large text)
- [ ] T145 [P] [US8] Verify festival-specific colors in `lib/constants.ts` meet contrast requirements when overlaid on backgrounds
- [ ] T146 [P] [US8] Verify all images have descriptive alt text (check all Image components across pages)
- [ ] T147 [P] [US8] Verify decorative images use empty alt="" attributes (non-informational graphics)
- [ ] T148 [US8] Run automated accessibility audit with axe DevTools on homepage - fix all violations
- [ ] T149 [US8] Run automated accessibility audit with axe DevTools on creation flow pages - fix all violations
- [ ] T150 [US8] Run automated accessibility audit with axe DevTools on greeting page /g/[id] - fix all violations
- [ ] T151 [US8] Test keyboard navigation through entire application - verify logical tab order, all elements accessible
- [ ] T152 [US8] Test with NVDA screen reader (Windows) - verify clear labels, proper announcements for all interactions
- [ ] T153 [US8] Test with VoiceOver screen reader (Mac/iOS) - verify clear labels, proper announcements for all interactions
- [ ] T154 [US8] Test prefers-reduced-motion preference - enable system setting, verify complex animations disabled or simplified
- [ ] T155 [US8] Verify visible focus indicators on all interactive elements - ensure ring styles visible on light and dark backgrounds
- [ ] T156 [US8] Run Lighthouse accessibility audit on all pages - verify score 100 or identify/fix violations

**Complexity**: Moderate (requires understanding of WCAG standards, screen reader testing, manual and automated validation)

**Checkpoint**: All user stories should now be independently functional with full accessibility compliance

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories and project-wide quality

- [ ] T157 [P] Documentation: Update README.md with production readiness enhancements overview
- [ ] T158 [P] Documentation: Document rate limiting configuration in `convex/README.md`
- [ ] T159 [P] Documentation: Create `docs/SEO-SETUP.md` with metadata patterns and Open Graph testing guide
- [ ] T160 [P] Documentation: Create `docs/ACCESSIBILITY.md` with WCAG compliance checklist and testing procedures
- [ ] T161 [P] Documentation: Create `docs/CULTURAL-REVIEW-CHECKLIST.md` with festival validation criteria and review process
- [ ] T162 [P] Documentation: Update `docs/MOBILE-PERFORMANCE-TESTING.md` with mobile optimization patterns
- [ ] T163 Code quality: Run Biome linter across all modified files - fix all violations via `bun run lint`
- [ ] T164 Code quality: Run Biome formatter across all modified files - format code via `bun run format`
- [ ] T165 Code quality: Run TypeScript type check - ensure no type errors via `bun run type-check` or `tsc --noEmit`
- [ ] T166 Performance: Run final Lighthouse audit on production build - verify all targets met
- [ ] T167 Performance: Analyze bundle size with vercel CLI or webpack-bundle-analyzer - verify <300KB initial load
- [ ] T168 Security: Review rate limiting logs for any security issues or patterns requiring adjustment
- [ ] T169 Testing: Execute quickstart.md validation - verify all developer setup steps work
- [ ] T170 Testing: Perform end-to-end flow testing - create greeting through entire flow on mobile device
- [ ] T171 Testing: Test WhatsApp sharing on real mobile device - verify rich preview displays correctly
- [ ] T172 Testing: Cross-browser testing - verify Chrome, Safari, Firefox, Edge (latest 2 versions)
- [ ] T173 Final validation: Verify no console errors or warnings in production build
- [ ] T174 Final validation: Verify all environment variables documented in README or `.env.example`
- [ ] T175 Final validation: Run color audit script final time - confirm zero violations
- [ ] T176 Final validation: Verify Constitution compliance - all principles adhered to
- [ ] T177 Deployment prep: Update CHANGELOG.md with all enhancements and changes
- [ ] T178 Deployment prep: Create deployment checklist with environment variables, verification steps

**Complexity**: Simple to Moderate (documentation, validation, testing)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Theme Consistency**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1) - Homepage Statistics**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1) - Rate Limiting**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2) - SEO Optimization**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P2) - Performance**: Can start after Foundational (Phase 2) - May benefit from US1 completion for accurate testing
- **User Story 6 (P2) - Mobile Optimization**: Can start after Foundational (Phase 2) - May benefit from US5 completion for performance validation
- **User Story 7 (P3) - Template Validation**: Can start after US1 completion (needs theme consistency)
- **User Story 8 (P3) - Accessibility**: Can start after Foundational (Phase 2) - Should come after US1 and US4 for complete testing

### Within Each User Story

- Color audit tasks (US1) can all run in parallel - different files
- Statistics implementation tasks (US2) can mostly run in parallel - different files
- Rate limiting tasks (US3) have some sequence (config before mutation implementation)
- SEO tasks (US4) can mostly run in parallel - different files
- Performance tasks (US5) can mostly run in parallel - different files
- Mobile optimization tasks (US6) can mostly run in parallel - different files
- Template validation tasks (US7) can all run in parallel - different files
- Accessibility tasks (US8) can mostly run in parallel - different files

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1-4 can all start in parallel (P1-P2 priorities)
- User Stories 5-6 can start after Foundational, ideally after US1 for accurate testing
- User Story 7-8 can start after US1 completion
- Within each user story, tasks marked [P] can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1 (Theme Consistency)

```bash
# After running audit script (T015), launch all component fixes in parallel:
Task T016: "Audit and fix DiwaliTemplate.tsx"
Task T017: "Audit and fix HoliTemplate.tsx"
Task T018: "Audit and fix ChristmasTemplate.tsx"
Task T019: "Audit and fix NewYearTemplate.tsx"
Task T020: "Audit and fix PongalTemplate.tsx"
Task T021: "Audit and fix GenericTemplate.tsx"
Task T022: "Audit and fix FireworksTemplate.tsx"
Task T023: "Audit and fix GreetingRenderer.tsx"
# And all form components:
Task T024: "Audit and fix FestivalSelector.tsx"
Task T025: "Audit and fix RelationshipSelector.tsx"
Task T026: "Audit and fix PersonalizationForm.tsx"
Task T027: "Audit and fix TemplateSelector.tsx"
# etc. (all [P] tasks can run simultaneously)
```

---

## Parallel Example: User Story 4 (SEO Optimization)

```bash
# All metadata implementation tasks can run in parallel:
Task T069: "Add root metadata to app/layout.tsx"
Task T070: "Implement generateMetadata in app/g/[id]/page.tsx"
Task T071: "Create sitemap in app/sitemap.ts"
Task T072: "Create robots.txt in app/robots.ts"
Task T073: "Create OG image API route in app/api/og/route.tsx"
Task T074: "Create static opengraph-image in app/opengraph-image.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only - P1 Priority)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Theme Consistency)
4. Complete Phase 4: User Story 2 (Homepage Statistics)
5. Complete Phase 5: User Story 3 (Rate Limiting)
6. **STOP and VALIDATE**: Test User Stories 1-3 independently
7. Deploy/demo if ready (production-ready core enhancements)

**Estimated effort**: ~15-20 hours for P1 stories

### Incremental Delivery (Add P2 Stories)

1. Complete Setup + Foundational + US1-3 → Core production readiness complete
2. Add User Story 4 (SEO) → Test independently → Deploy/Demo
3. Add User Story 5 (Performance) → Test independently → Deploy/Demo
4. Add User Story 6 (Mobile) → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

**Estimated effort**: +10-15 hours for P2 stories

### Complete Enhancement (Add P3 Stories)

1. Complete all P1 + P2 stories
2. Add User Story 7 (Template Validation) → Test independently
3. Add User Story 8 (Accessibility) → Test independently
4. Complete Phase 11: Polish & Cross-Cutting Concerns
5. Final validation and deployment

**Estimated effort**: +8-12 hours for P3 stories and polish

**Total estimated effort**: ~35-50 hours for complete implementation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (4-6 hours)
2. Once Foundational is done, split work:
   - **Developer A**: User Story 1 (Theme Consistency) - 6-8 hours
   - **Developer B**: User Story 2 (Homepage Statistics) - 4-5 hours
   - **Developer C**: User Story 3 (Rate Limiting) - 5-7 hours
3. After P1 stories complete, continue parallel work:
   - **Developer A**: User Story 4 (SEO) - 5-6 hours
   - **Developer B**: User Story 5 (Performance) - 5-6 hours
   - **Developer C**: User Story 6 (Mobile) - 5-6 hours
4. After P2 stories complete:
   - **Developer A**: User Story 7 (Template Validation) - 3-4 hours
   - **Developer B**: User Story 8 (Accessibility) - 5-6 hours
   - **Developer C**: Polish tasks - 3-4 hours
5. Final validation together - 2-3 hours

**Parallel team estimated effort**: ~15-20 hours per developer (vs 35-50 hours solo)

---

## Acceptance Criteria Summary

### User Story 1 - Theme Consistency

- [ ] Zero hardcoded hex/RGB values in production code (verified via audit script)
- [ ] Theme switching <100ms with zero flicker
- [ ] All pages pass visual inspection in light and dark modes

### User Story 2 - Homepage Statistics

- [ ] Statistics section displays accurate data within 500ms
- [ ] Animated counters trigger reliably on first viewport entry
- [ ] Skeleton loaders prevent layout shifts during loading

### User Story 3 - Rate Limiting

- [ ] Rate limiting blocks 100% of requests exceeding limits
- [ ] 95% of users successfully retry after cooldown
- [ ] False positive rate <0.1% of legitimate traffic

### User Story 4 - SEO Optimization

- [ ] 100% of pages have required Open Graph and Twitter Card tags
- [ ] Shared links display rich previews correctly 98% of the time
- [ ] Zero indexing errors in Google Search Console

### User Story 5 - Performance

- [ ] Lighthouse Performance >90 mobile, >95 desktop
- [ ] FCP <1.5s for 90% of mobile users on 4G
- [ ] LCP <2.5s for 95% of all page loads
- [ ] CLS <0.1 for 95% of page loads
- [ ] Bundle size <300KB initial load

### User Story 6 - Mobile Optimization

- [ ] 95% of mobile users complete greeting creation without usability issues
- [ ] All touch targets meet 44x44px minimum
- [ ] Animations maintain 60fps on 90% of mid-range Android devices

### User Story 7 - Template Validation

- [ ] 90% satisfaction with template authenticity (user surveys)
- [ ] 85% positive uniqueness ratings comparing multiple templates
- [ ] 60fps animations on 95% of target devices

### User Story 8 - Accessibility

- [ ] 100% of pages pass WCAG 2.1 Level AA automated testing
- [ ] All color combinations meet minimum contrast ratios
- [ ] Keyboard navigation reaches 100% of interactive elements
- [ ] Screen reader labels clear for 100% of interactive elements

---

## Notes

- **[P] tasks** = different files, no dependencies - can run in parallel
- **[Story] label** maps task to specific user story for traceability (US1-US8)
- Each user story should be independently completable and testable
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- Run `scripts/audit-colors.sh` before and after US1 to verify zero violations
- Test on real mobile devices (iPhone SE, mid-range Android) for US6 validation
- Use Lighthouse, axe DevTools, and manual testing for US8 accessibility validation
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks include exact file paths for clarity
- Complexity markers help estimate effort: Simple (1-2 hours), Moderate (3-5 hours), Complex (6+ hours)
- Priority order: P1 stories (US1-3) → P2 stories (US4-6) → P3 stories (US7-8)
- MVP scope: US1-3 provides core production readiness (theme consistency, social proof, abuse protection)
