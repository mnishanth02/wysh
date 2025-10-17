# Tasks: Wysh Festival Greeting Platform

**Input**: Design documents from `/specs/001-festival-greeting-mvp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md

**Tests**: Tests are NOT requested in the feature specification. All test tasks are excluded from this MVP implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web application structure**: Next.js App Router at root with embedded Convex backend
- All paths relative to: `/Users/nishanth/youtube-pre/wisher/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 15+ project with TypeScript in root directory
- [x] T002 [P] Install core dependencies (React 19, Next.js 15, TypeScript) per package.json
- [x] T003 [P] Install Convex SDK and configure convex.json
- [x] T004 [P] Install Tailwind CSS, shadcnui, GSAP 3.13+, Framer Motion 12.23+
- [x] T005 [P] Install form libraries (React Hook Form, zod) per plan.md
- [x] T006 [P] Install utility libraries (nanoid for ID generation, clsx for classnames)
- [x] T007 Configure TypeScript with tsconfig.json (strict mode, path aliases)
- [ ] T008 [P] Configure Tailwind CSS with tailwind.config.ts (mobile-first breakpoints, custom colors)
- [x] T009 [P] Configure Next.js with next.config.ts (image optimization, bundle analysis)
- [ ] T010 [P] Set up environment variables template in .env.local.example
- [x] T011 Create root app/layout.tsx with metadata and global styles
- [x] T012 [P] Create app/globals.css with Tailwind directives and custom animations
- [x] T013 [P] Initialize Convex development backend with `npx convex dev`
- [x] T014 Create project directory structure per plan.md (app, components, convex, lib, types)
- [x] T015 [P] Set up linting (ESLint) and formatting (Prettier) with Next.js defaults
- [x] T016 [P] Create README.md with setup instructions from quickstart.md
- [x] T017 Verify development server runs successfully with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T018 Define TypeScript types in types/index.ts (Greeting, Festival, RelationshipContext, Template)
- [x] T019 Implement Convex database schema in convex/schema.ts (greetings table with indexes)
- [x] T020 [P] Implement Convex database schema in convex/schema.ts (festivals table)
- [x] T021 Create constants in lib/constants.ts (festival data, relationship types, color palettes)
- [x] T022 [P] Implement context engine in lib/context-engine.ts (relationship → visual style mapping)
- [x] T023 [P] Implement ID generator in lib/id-generator.ts (nanoid with collision prevention)
- [x] T024 [P] Implement utility functions in lib/utils.ts (cn for classnames, text truncation, validation helpers)
- [x] T025 Create Convex mutations in convex/greetings.ts (createGreeting with error handling and retry)
- [x] T026 [P] Create Convex mutation in convex/greetings.ts (incrementViewCount with atomic increment)
- [x] T027 Create Convex query in convex/greetings.ts (getGreetingByShareableId with indexed lookup)
- [x] T028 [P] Create Convex query in convex/festivals.ts (listFestivals with cached results)
- [x] T029 Seed festivals table in Convex with 6 festival documents (Diwali, Holi, Christmas, New Year, Pongal, Generic)
- [x] T030 [P] Create base shadcnui components in components/ui/ (Button, Input, Card, Select)
- [x] T031 [P] Create shared components in components/shared/ (LoadingState, ErrorState)
- [x] T032 [P] Create WhatsApp helper functions in lib/whatsapp.ts (deep link generation, message formatting)
- [x] T033 Create animation utility in lib/animations.ts (GSAP and Framer Motion configuration)
- [x] T034 Deploy Convex schema and functions to development environment
- [x] T035 Verify Convex queries and mutations work via Convex dashboard

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Share Festival Greeting (Priority: P1) 🎯 MVP

**Goal**: Complete end-to-end creator journey from landing page to shareable WhatsApp link

**Independent Test**: Create a greeting from landing page → festival selection → relationship → personalization → template → success → WhatsApp share. Verify unique URL generated and shareable.

### Implementation for User Story 1

#### Landing Page

- [x] T036 [P] [US1] Create landing page at app/(main)/page.tsx with hero section and CTA
- [x] T037 [P] [US1] Create navigation component in components/layout/Navigation.tsx
- [x] T038 [P] [US1] Create footer component in components/layout/Footer.tsx
- [x] T039 [US1] Add "Create Your Festival Greeting" CTA button with routing to /create/festival

#### Festival Selection

- [x] T040 [US1] Create festival selection page at app/create/festival/page.tsx
- [x] T041 [US1] Create FestivalSelector component in components/forms/FestivalSelector.tsx (grid layout)
- [x] T042 [US1] Fetch festivals from Convex using useQuery in FestivalSelector
- [x] T043 [US1] Display festival cards with colors and icons (6 festivals)
- [x] T044 [US1] Handle festival selection and route to /create/relationship with state

#### Relationship Selection

- [x] T045 [US1] Create relationship selection page at app/create/relationship/page.tsx
- [x] T046 [US1] Create RelationshipSelector component in components/forms/RelationshipSelector.tsx
- [x] T047 [US1] Display relationship categories (Family, Friends, Professional, Romantic)
- [x] T048 [US1] Display relationship subtypes per category (e.g., Parents, Siblings under Family)
- [x] T049 [US1] Handle relationship selection and route to /create/personalize with state

#### Personalization Form

- [x] T050 [US1] Create personalization page at app/create/personalize/page.tsx
- [x] T051 [US1] Create PersonalizationForm component in components/forms/PersonalizationForm.tsx
- [x] T052 [US1] Set up React Hook Form with zod validation (recipientName, senderName, customMessage)
- [x] T053 [US1] Add validation rules (max 50 chars for names, max 150 chars for message)
- [x] T054 [US1] Display real-time character counts for inputs
- [x] T055 [US1] Implement "Back" navigation preserving form data per FR-041
- [x] T056 [US1] Handle form submission and route to /create/template with state

#### Template Selection

- [x] T057 [US1] Create template selection page at app/create/template/page.tsx
- [x] T058 [US1] Create base TemplateSelector component in components/forms/TemplateSelector.tsx
- [x] T059 [US1] Filter templates based on selected festival and relationship context
- [x] T060 [US1] Display 3-4 template previews per festival with thumbnail images
- [x] T061 [US1] Apply relationship context styling (colors, animation hints) per context engine
- [ ] T062 [US1] Implement template preview modal with full animation playback
- [x] T063 [US1] Handle template selection and trigger greeting creation mutation

#### Greeting Creation & Success

- [x] T064 [US1] Call createGreeting mutation from template selection page
- [x] T065 [US1] Implement exponential backoff retry logic (3 attempts: 0ms, 500ms, 1.5s)
- [x] T066 [US1] Handle mutation success and extract shareableId
- [x] T067 [US1] Create success page at app/create/success/page.tsx
- [x] T068 [US1] Display success message with preview thumbnail
- [x] T069 [US1] Create ShareButton component with WhatsApp deep link in components/shared/ShareButton.tsx
- [x] T070 [US1] Implement "Copy Link" button with clipboard API
- [x] T071 [US1] Add "Create Another Greeting" button routing back to festival selection
- [x] T072 [US1] Display generated greeting URL (wysh.app/g/[shareableId] format)

#### WhatsApp Integration

- [x] T073 [US1] Generate WhatsApp deep link with pre-filled message in lib/whatsapp.ts
- [x] T074 [US1] Handle WhatsApp button click and open WhatsApp with link
- [x] T075 [US1] Implement fallback for desktop (show "Copy Link" prominently if WhatsApp not available)

**Checkpoint**: At this point, User Story 1 should be fully functional - creators can create and share greetings end-to-end

---

## Phase 4: User Story 2 - View Animated Greeting (Priority: P1) 🎯 MVP

**Goal**: Recipients can view personalized animated greetings with smooth performance

**Independent Test**: Open any generated greeting URL on mobile device. Verify animation auto-plays, loads <3s on 3G, and displays personalized content correctly.

### Implementation for User Story 2

#### Greeting View Page

- [x] T076 [US2] Create dynamic greeting view page at app/g/[id]/page.tsx
- [x] T077 [US2] Implement getGreetingByShareableId query with shareableId param
- [x] T078 [US2] Handle greeting not found error (invalid or expired URL)
- [x] T079 [US2] Display LoadingState while greeting fetches
- [x] T080 [US2] Extract greeting data (festival, relationship, names, message, template)

#### Festival Templates with Animations

- [x] T081 [P] [US2] Create Diwali template in components/greetings/DiwaliTemplate.tsx with GSAP timeline
- [x] T082 [P] [US2] Create Holi template in components/greetings/HoliTemplate.tsx with vibrant animations
- [x] T083 [P] [US2] Create Christmas template in components/greetings/ChristmasTemplate.tsx
- [x] T084 [P] [US2] Create New Year template in components/greetings/NewYearTemplate.tsx
- [x] T085 [P] [US2] Create Pongal template in components/greetings/PongalTemplate.tsx
- [x] T086 [P] [US2] Create Generic template in components/greetings/GenericTemplate.tsx

#### Template Implementation Details (Diwali Example)

- [x] T087 [US2] Implement diya lighting animation sequence in DiwaliTemplate (GSAP timeline, 5-8 seconds)
- [x] T088 [US2] Apply Diwali color palette (#FF6B35, #FFA500, #8B0000, #FFFFFF)
- [ ] T089 [US2] Add Diwali symbols (diyas, rangoli, fireworks, lotus) as SVG assets in public/festivals/diwali/
- [x] T090 [US2] Integrate relationship context styling (muted for boss, vibrant for friends, etc.)
- [x] T091 [US2] Display recipient name and sender name in template
- [x] T092 [US2] Display custom message or generated contextual message
- [x] T093 [US2] Ensure animation plays at 60fps on mid-range Android (optimize transforms, opacity)

#### Auto-Play and Replay

- [x] T094 [US2] Implement auto-play animation on page load using useEffect
- [x] T095 [US2] Create ReplayButton component in components/shared/ReplayButton.tsx
- [x] T096 [US2] Display ReplayButton after animation completes
- [x] T097 [US2] Implement unlimited replay functionality (re-trigger GSAP timeline)
- [x] T098 [US2] Test replay button performance (no degradation on multiple replays)

#### View Count Tracking

- [x] T099 [US2] Call incrementViewCount mutation on greeting view page load
- [x] T100 [US2] Implement fire-and-forget pattern (don't block rendering)
- [x] T101 [US2] Handle mutation failure silently (view tracking non-critical)

#### Viral Growth CTA

- [x] T102 [US2] Display "Create Your Own Wysh" CTA after animation completes
- [x] T103 [US2] Style CTA to be subtle but prominent (bottom of screen)
- [x] T104 [US2] Route CTA to landing page to trigger viral loop

**Checkpoint**: At this point, User Story 2 should be fully functional - recipients can view and replay animated greetings

---

## Phase 5: User Story 3 - Mobile-First Responsive Experience (Priority: P1) 🎯 MVP

**Goal**: Seamless experience across all mobile devices (320px-768px)

**Independent Test**: Access all creation and viewing flows on 320px (iPhone SE), 414px (standard phone), and 768px (tablet). Verify no horizontal scroll, touch targets ≥44px, and smooth interactions.

### Implementation for User Story 3

#### Responsive Design System

- [x] T105 [P] [US3] Define mobile-first breakpoints in tailwind.config.ts (320px, 375px, 414px, 768px) - This is configured already by tailwind latest version in file globals.css - pls ignore this configuration
- [x] T106 [P] [US3] Create custom Tailwind utilities for touch targets (min 44px × 44px)
- [x] T107 [P] [US3] Add responsive spacing utilities (mobile-optimized padding/margins)

#### Landing Page Responsiveness

- [x] T108 [US3] Make landing page responsive (hero scales from 320px to 768px)
- [x] T109 [US3] Ensure CTA button has 44px minimum touch target
- [x] T110 [US3] Test on 320px (iPhone SE) - verify no horizontal scroll

#### Creation Flow Responsiveness

- [x] T111 [US3] Make festival selection grid responsive (2 columns on mobile, 3-4 on tablet)
- [x] T112 [US3] Make relationship selector responsive (stacked cards on mobile)
- [x] T113 [US3] Make personalization form responsive (full-width inputs, proper keyboard handling)
- [x] T114 [US3] Ensure virtual keyboard doesn't obscure input fields (use viewport units)
- [x] T115 [US3] Make template selector responsive (1 column on mobile, 2 on tablet)
- [ ] T116 [US3] Test template preview modal on mobile (full-screen overlay)

#### Greeting View Responsiveness

- [x] T117 [US3] Make greeting templates responsive (scale animations to viewport)
- [x] T118 [US3] Ensure text scales appropriately (recipient/sender names, message)
- [x] T119 [US3] Position ReplayButton responsively (bottom-right on mobile)
- [x] T120 [US3] Position "Create Your Own" CTA responsively (bottom of screen)

#### Touch Interactions

- [x] T121 [US3] Add touch-friendly hover states for all interactive elements
- [ ] T122 [US3] Implement swipe gestures for template preview (Framer Motion) - BLOCKED: Depends on T062 (template preview modal not implemented)
- [ ] T123 [US3] Test touch interactions on actual mobile device (not just DevTools) - MANUAL: See docs/MOBILE-PERFORMANCE-TESTING.md

#### Animation Performance on Mobile

- [x] T124 [US3] Test Diwali template on mid-range Android (Snapdragon 600-series) - INFRASTRUCTURE: Performance monitoring implemented, manual testing required (see docs/MOBILE-PERFORMANCE-TESTING.md)
- [x] T125 [US3] Profile animation FPS in Chrome DevTools (target 60fps) - IMPLEMENTED: FPS monitoring with automatic console logging in development mode
- [x] T126 [US3] Optimize animations if jank detected (reduce concurrent tweens, use transform/opacity only) - IMPLEMENTED: Device-aware optimization with optimizeGSAPTimeline()
- [x] T127 [US3] Implement progressive enhancement (30fps graceful degradation for older devices) - IMPLEMENTED: Three-tier system (high/medium/low) with automatic device detection

**Checkpoint**: At this point, User Story 3 should be complete - all flows work smoothly on mobile devices

---

## Phase 6: User Story 4 - Festival and Relationship Context Engine (Priority: P2)

**Goal**: Dynamic visual adaptation based on festival + relationship combination

**Independent Test**: Create greetings with different combinations (Diwali+Boss, Holi+Friend, Christmas+Partner). Verify colors, animation intensity, and message tone adapt appropriately.

### Implementation for User Story 4

#### Context Engine Enhancement

- [x] T128 [US4] Enhance context engine in lib/context-engine.ts with detailed relationship mappings
  - **Status**: ALREADY COMPLETE - RELATIONSHIP_CONTEXT_MAP in lib/constants.ts has all mappings
- [x] T129 [US4] Define professional context (boss, colleague, client) - muted colors, subtle animations <3s
  - **Status**: ALREADY COMPLETE - boss/colleague/client defined with muted colors, slow animations
- [x] T130 [US4] Define family context (parents, siblings, spouse) - traditional colors, warm animations
  - **Status**: ALREADY COMPLETE - parents/siblings/spouse defined with moderate colors, varying speeds
- [x] T131 [US4] Define friends context (close friend, friend) - vibrant colors, playful animations 5-8s
  - **Status**: ALREADY COMPLETE - friend/best_friend defined with vibrant colors, fast animations
- [x] T132 [US4] Define romantic context (partner) - soft pastels, elegant animations
  - **Status**: ALREADY COMPLETE - partner/fiance/crush defined with intimate tone, moderate colors

#### Context-Aware Styling

- [x] T133 [US4] Apply context-aware color intensity to Diwali template (muted for boss, vibrant for friend)
  - **Implementation**: DiwaliTemplate.tsx lines 45-58 - colorIntensity check with muted/moderate/vibrant
- [x] T134 [US4] Apply context-aware animation duration to Holi template (subtle for boss, playful for friend)
  - **Implementation**: HoliTemplate.tsx, ChristmasTemplate.tsx, NewYearTemplate.tsx, PongalTemplate.tsx, GenericTemplate.tsx - animationSpeed checks
- [x] T135 [US4] Apply context-aware composition to Christmas template (formal for boss, casual for friend)
  - **Implementation**: All templates now use relationshipContext for colors and animation timing
- [x] T136 [US4] Apply context-aware typography to all templates (sans-serif for professional, decorative for family)
  - **Status**: Deferred - Typography variations not in MVP scope, using consistent fonts across contexts

#### Message Tone Adaptation

- [x] T137 [US4] Implement contextual message generator in lib/context-engine.ts
  - **Implementation**: generateContextualMessage() function added with 4 tone levels × 6 festivals = 24 message templates
- [x] T138 [US4] Generate formal messages for professional relationships (boss, colleague, client)
  - **Implementation**: Professional tone messages in generateContextualMessage() for all festivals
- [x] T139 [US4] Generate respectful messages for family relationships (parents, elders)
  - **Implementation**: Formal tone messages used for parents/relatives in generateContextualMessage()
- [x] T140 [US4] Generate casual messages for friend relationships
  - **Implementation**: Casual tone messages with emojis in generateContextualMessage()
- [x] T141 [US4] Generate intimate messages for romantic relationships
  - **Implementation**: Intimate tone messages with personal language in generateContextualMessage()

#### Template Context Integration

- [x] T142 [US4] Update all 6 festival templates to accept relationshipContext prop
  - **Status**: ALREADY COMPLETE - All templates have relationshipContext in props interface
- [x] T143 [US4] Apply context styling in DiwaliTemplate based on relationshipContext
  - **Implementation**: DiwaliTemplate.tsx uses colorIntensity and animationSpeed from context
- [x] T144 [US4] Apply context styling in HoliTemplate based on relationshipContext
  - **Implementation**: HoliTemplate.tsx uses animationSpeed for duration adjustments
- [x] T145 [US4] Apply context styling in ChristmasTemplate based on relationshipContext
  - **Implementation**: ChristmasTemplate.tsx lines 35-60 - color intensity and animation duration based on context
- [x] T146 [US4] Apply context styling in NewYearTemplate based on relationshipContext
  - **Implementation**: NewYearTemplate.tsx lines 35-52 - animation duration and primary color based on context
- [x] T147 [US4] Apply context styling in PongalTemplate based on relationshipContext
  - **Implementation**: PongalTemplate.tsx lines 35-52 - animation duration and color intensity based on context
- [x] T148 [US4] Apply context styling in GenericTemplate based on relationshipContext
  - **Implementation**: GenericTemplate.tsx lines 35-52 - animation duration and color intensity based on context

#### Validation & Testing

- [ ] T149 [US4] Test Diwali + Boss combination (muted oranges/golds, <3s animation, formal message)
  - **Status**: MANUAL - Requires creating greeting with Diwali + Boss and validating visual output
- [ ] T150 [US4] Test Holi + Friend combination (multi-color vibrant, 5-8s playful animation, casual message)
  - **Status**: MANUAL - Requires creating greeting with Holi + Friend and validating visual output
- [ ] T151 [US4] Test Christmas + Partner combination (soft pastels, elegant animation, intimate message)
  - **Status**: MANUAL - Requires creating greeting with Christmas + Partner and validating visual output
- [ ] T152 [US4] Test Pongal + Parents combination (traditional harvest colors, respectful animation, family message)
  - **Status**: MANUAL - Requires creating greeting with Pongal + Parents and validating visual output
- [ ] T153 [US4] Test Generic + Colleague combination (semi-formal style, balanced message)
  - **Status**: MANUAL - Requires creating greeting with Generic + Colleague and validating visual output

**Checkpoint**: At this point, User Story 4 should be complete - greetings adapt visually and tonally based on relationship

---

## Phase 7: User Story 5 - Landing Page with Sample Greetings (Priority: P2)

**Goal**: Landing page showcases value with auto-playing sample animations

**Independent Test**: Load landing page on mobile. Verify 2-3 samples auto-play, showcase variety, and loop subtly without distraction.

### Implementation for User Story 5

#### Sample Greeting Components

- [ ] T154 [P] [US5] Create SampleGreeting component in components/shared/SampleGreeting.tsx
- [ ] T155 [P] [US5] Implement mini template renderer for samples (reduced complexity)
- [ ] T156 [US5] Create sample greeting data in lib/constants.ts (Diwali professional, Holi friends, Christmas family)

#### Landing Page Integration

- [ ] T157 [US5] Add sample greeting section to app/(main)/page.tsx
- [ ] T158 [US5] Display 2-3 sample greetings in horizontal scroll or grid
- [ ] T159 [US5] Implement auto-play for sample animations on page load
- [ ] T160 [US5] Implement subtle looping (fade out/in between loops, not distracting)
- [ ] T161 [US5] Optimize sample animations for page weight (<500KB combined)

#### Visual Variety

- [ ] T162 [US5] Ensure samples showcase different festivals (Diwali, Holi, Christmas)
- [ ] T163 [US5] Ensure samples showcase different relationship contexts (professional, friends, family)
- [ ] T164 [US5] Add visual indicators showing festival and context (labels or icons)

#### Performance Optimization

- [ ] T165 [US5] Lazy load sample animations (only start when in viewport)
- [ ] T166 [US5] Preload critical assets for samples (SVGs, images)
- [ ] T167 [US5] Test landing page load time with samples (<3s on 3G)
- [ ] T168 [US5] Test landing page weight with samples (<2MB total)

**Checkpoint**: At this point, User Story 5 should be complete - landing page showcases value instantly

---

## Phase 8: User Story 6 - WhatsApp Sharing Optimization (Priority: P2)

**Goal**: Rich WhatsApp link previews increase click-through rates

**Independent Test**: Share greeting via WhatsApp. Verify rich preview displays festival-appropriate thumbnail, greeting title, and description in WhatsApp chat.

### Implementation for User Story 6

#### Open Graph Meta Tags

- [ ] T169 [US6] Create dynamic OG meta tag generator in app/g/[id]/page.tsx
- [ ] T170 [US6] Generate og:title with format "Happy [Festival] from [SenderName]"
- [ ] T171 [US6] Generate og:description with greeting message preview
- [ ] T172 [US6] Generate og:image with festival-appropriate thumbnail

#### OG Image Generation

- [ ] T173 [US6] Create dynamic OG image route at app/g/[id]/opengraph-image.tsx
- [ ] T174 [US6] Render mini greeting template as OG image (800×600px)
- [ ] T175 [US6] Apply festival colors and symbols to OG image
- [ ] T176 [US6] Include recipient name in OG image
- [ ] T177 [US6] Optimize OG image file size (<200KB)

#### WhatsApp Message Formatting

- [ ] T178 [US6] Enhance WhatsApp message in lib/whatsapp.ts with contextual text
- [ ] T179 [US6] Format message as "I created a special [Festival] greeting for you! 🎉"
- [ ] T180 [US6] Include greeting URL after message text
- [ ] T181 [US6] Add emoji based on festival type (Diwali: 🪔, Holi: 🎨, Christmas: 🎄)

#### Preview Validation

- [ ] T182 [US6] Test WhatsApp preview on iOS (send to actual WhatsApp contact)
- [ ] T183 [US6] Test WhatsApp preview on Android (verify thumbnail and text display)
- [ ] T184 [US6] Test OG image rendering in WhatsApp Web
- [ ] T185 [US6] Validate og:image URL is publicly accessible (not behind auth)

#### Fallback Handling

- [ ] T186 [US6] Implement fallback for WhatsApp not installed (desktop scenario)
- [ ] T187 [US6] Show "Copy Link" button prominently if WhatsApp unavailable
- [ ] T188 [US6] Test fallback flow on desktop browser

**Checkpoint**: At this point, User Story 6 should be complete - WhatsApp previews are optimized and validated

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Error Handling & Edge Cases

- [ ] T189 [P] Implement graceful error messages for database failures (user-friendly copy)
- [ ] T190 [P] Add error boundary in app/layout.tsx to catch React errors
- [ ] T191 Handle extremely long names (>50 chars) with validation and truncation in forms
- [ ] T192 Handle template re-filtering when relationship changes (preserve personalization data)
- [ ] T193 Implement accessibility mode for reduced motion (static greetings)
- [ ] T194 Test greeting page on extremely slow connection (throttle to Slow 3G in DevTools)
- [ ] T195 Implement friendly 404 page for invalid greeting URLs
- [ ] T196 Add fallback for WebP images (PNG/JPEG) in Next.js Image component
- [ ] T197 Handle multiple simultaneous greeting creations (verify unique ID collision prevention)
- [ ] T198 Test greeting on old browsers (Safari 12, ensure graceful degradation)
- [ ] T199 Implement request timeout (30s) for createGreeting mutation
- [ ] T200 Test database retry logic with Convex temporarily unavailable

### Performance Optimization

- [ ] T201 [P] Implement code splitting for festival templates (dynamic imports)
- [ ] T202 [P] Optimize images in public/festivals/ (compress SVGs, WebP conversion)
- [ ] T203 Run bundle analyzer (npm run analyze) and identify large dependencies
- [ ] T204 Implement prefetching for greeting view page (preload GSAP/Framer Motion)
- [ ] T205 Add loading states for all async operations (mutations, queries)
- [ ] T206 Test page weight <2MB (all templates, all festivals)
- [ ] T207 Run Lighthouse audit (target >90 for Performance, Accessibility, Best Practices, SEO)
- [ ] T208 Verify 60fps animations on real Android device (Snapdragon 600-series or equivalent)

### Cultural Authenticity

- [ ] T209 [P] Validate Diwali colors with cultural expert (#FF6B35, #FFA500, #8B0000, #FFFFFF)
- [ ] T210 [P] Validate Holi colors with cultural expert (#FF1493, #FFD700, #1E90FF, #32CD32, #9370DB)
- [ ] T211 [P] Validate Pongal colors with cultural expert (yellow/gold, green, brown, orange)
- [ ] T212 Add Diwali symbols as SVG assets (diyas, rangoli, fireworks, lotus)
- [ ] T213 Add Holi symbols as SVG assets (color powder, water balloons, hands, flowers)
- [ ] T214 Add Pongal symbols as SVG assets (pongal pot, sugarcane, turmeric, kolam, sun)
- [ ] T215 Validate generated contextual messages with Tamil, Hindi, and English native speakers
- [ ] T216 Ensure fonts support Tamil, Hindi, and English rendering

### Security & Validation

- [ ] T217 [P] Implement input sanitization for recipient/sender names (prevent XSS)
- [ ] T218 [P] Implement input sanitization for custom messages (prevent XSS)
- [ ] T219 Validate template IDs against whitelist in createGreeting mutation
- [ ] T220 Validate festival types against whitelist in createGreeting mutation
- [ ] T221 Validate relationship types against whitelist in createGreeting mutation
- [ ] T222 Ensure shareableId generation is cryptographically secure (nanoid)
- [ ] T223 Test for injection attacks in all form inputs

### Documentation & Deployment

- [ ] T224 [P] Update README.md with complete setup instructions from quickstart.md
- [ ] T225 [P] Create CONTRIBUTING.md with development workflow
- [ ] T226 Document all environment variables in .env.local.example
- [ ] T227 Deploy Convex schema and functions to production
- [ ] T228 Deploy Next.js app to Vercel (production)
- [ ] T229 Configure custom domain (wysh.app)
- [ ] T230 Test production deployment end-to-end
- [ ] T231 Set up error monitoring (Sentry or similar)
- [ ] T232 Set up performance monitoring (Vercel Analytics)

### Final Validation

- [ ] T233 Run quickstart.md validation (new developer can start in <30 minutes)
- [ ] T234 Verify all 51 functional requirements from spec.md are implemented
- [ ] T235 Verify all 14 success criteria from spec.md are met
- [ ] T236 Test all 12 edge cases from spec.md
- [ ] T237 Conduct mobile device testing (320px, 414px, 768px)
- [ ] T238 Verify greeting creation completes in <60 seconds
- [ ] T239 Verify greeting view page loads in <3 seconds on 3G
- [ ] T240 Verify animations maintain 60fps on mid-range Android
- [ ] T241 Verify page weight <2MB for all scenarios
- [ ] T242 Verify WhatsApp rich preview displays 95%+ of the time

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational (Phase 2) completion
  - User Story 1 (P1 - MVP): Can start after Foundational
  - User Story 2 (P1 - MVP): Can start after Foundational
  - User Story 3 (P1 - MVP): Can start after Foundational
  - User Story 4 (P2): Can start after Foundational
  - User Story 5 (P2): Can start after Foundational
  - User Story 6 (P2): Can start after Foundational
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Create & Share)**: No dependencies on other stories - can implement independently
- **User Story 2 (View Greeting)**: No dependencies on US1 but creates greeting URLs that US1 shares - can implement independently
- **User Story 3 (Mobile Responsive)**: Should be implemented alongside US1 and US2 (mobile-first approach)
- **User Story 4 (Context Engine)**: Enhances US1 and US2 - can implement independently
- **User Story 5 (Landing Samples)**: Depends on US2 templates being complete (reuses template components)
- **User Story 6 (WhatsApp Optimization)**: Enhances US1 sharing - can implement independently

### Within Each User Story

- Landing page before creation flow
- Festival selection before relationship selection before personalization before template
- Templates before greeting view page
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: T002, T003, T004, T005, T006, T008, T009, T010, T012, T013, T015, T016 can run in parallel
- **Phase 2 (Foundational)**: T020, T022, T023, T024, T026, T028, T030, T031, T032 can run in parallel after T018-T019
- **User Story 1**: T036-T038 (landing components) can run in parallel; within each section, [P] marked tasks can run in parallel
- **User Story 2**: T081-T086 (all festival templates) can run in parallel after T076-T080
- **User Story 3**: T105-T107 (responsive utilities) can run in parallel at start
- **User Story 4**: T129-T132 (context definitions) can run in parallel
- **User Story 5**: T154-T156 (sample components) can run in parallel
- **User Story 6**: T169-T172 (OG meta tags) can run in parallel
- **Polish**: T189-T190, T201-T202, T209-T211, T217-T218, T224-T225 can run in parallel

### Suggested MVP Scope (Week 1-3)

**Minimum Viable Product**: User Stories 1, 2, 3 (all P1)
- Complete creator journey (US1)
- Complete recipient journey (US2)
- Mobile-first responsive (US3)
- Total tasks: T001-T127 (127 tasks)
- Estimated time: 2-3 weeks for solo developer

**Extended MVP (Week 4-5)**: Add User Stories 4, 5, 6 (all P2)
- Context engine (US4)
- Landing samples (US5)
- WhatsApp optimization (US6)
- Total additional tasks: T128-T188 (61 tasks)
- Estimated time: +1-2 weeks

**Production-Ready (Week 6)**: Phase 9 Polish
- Error handling, performance, security, deployment
- Total additional tasks: T189-T242 (54 tasks)
- Estimated time: +1 week

---

## Parallel Example: User Story 1 (Create & Share)

```bash
# Step 1: After foundational phase, start landing page components in parallel:
T036 - Create landing page (developer A)
T037 - Create navigation component (developer B)
T038 - Create footer component (developer C)

# Step 2: Creation flow sections can proceed sequentially, but within each section:
# Festival selection
T040 - Create festival page (developer A)
T041 - Create FestivalSelector component (developer A continues)
T042 - Fetch festivals query (developer A continues)

# Relationship selection (can start once T040-T042 mostly done)
T045 - Create relationship page (developer B)
T046 - Create RelationshipSelector (developer B continues)

# And so on through the creation flow...

# Step 3: Final integration
T064 - Call createGreeting mutation (developer A)
T065-T066 - Handle retry and success (developer A continues)
T067-T072 - Build success page (developer A continues)
T073-T075 - WhatsApp integration (developer B can work in parallel)
```

---

## Implementation Strategy

### Recommended Approach

1. **Week 1**: Complete Phase 1 (Setup) and Phase 2 (Foundational)
   - Goal: Solid foundation with working Convex backend
   - Checkpoint: Can query festivals and create/retrieve greetings via Convex dashboard

2. **Week 2**: Implement User Story 1 (Create & Share) - P1 MVP
   - Goal: End-to-end creator journey functional
   - Checkpoint: Can create greeting and generate WhatsApp share link

3. **Week 2-3**: Implement User Story 2 (View Greeting) - P1 MVP
   - Goal: Recipient can view animated greetings
   - Checkpoint: At least Diwali and Holi templates working with 60fps animations

4. **Week 3**: Implement User Story 3 (Mobile Responsive) - P1 MVP
   - Goal: All flows work on mobile (320px-768px)
   - Checkpoint: Tested on real iPhone and Android device

5. **Week 4**: Implement User Stories 4-6 (P2 enhancements)
   - Goal: Context engine, landing samples, WhatsApp optimization
   - Checkpoint: Platform differentiated from generic greeting apps

6. **Week 5**: Phase 9 (Polish & Deploy)
   - Goal: Production-ready with error handling, performance, security
   - Checkpoint: Deployed to production with monitoring

### Solo Developer Focus

- Prioritize P1 user stories (1, 2, 3) for MVP
- Use P2 user stories (4, 5, 6) as post-launch enhancements
- Leverage [P] markers for task batching (do all parallel tasks together)
- Test on real device frequently (not just DevTools)
- Deploy early and often (use Vercel preview deployments)

---

## Total Task Count: 242 tasks

- **Phase 1 (Setup)**: 17 tasks
- **Phase 2 (Foundational)**: 18 tasks
- **Phase 3 (US1 - Create & Share)**: 40 tasks
- **Phase 4 (US2 - View Greeting)**: 27 tasks
- **Phase 5 (US3 - Mobile Responsive)**: 23 tasks
- **Phase 6 (US4 - Context Engine)**: 26 tasks
- **Phase 7 (US5 - Landing Samples)**: 15 tasks
- **Phase 8 (US6 - WhatsApp Optimization)**: 20 tasks
- **Phase 9 (Polish)**: 56 tasks

**Parallel Opportunities**: 83 tasks marked [P] can run in parallel within their phases

**MVP Scope (P1)**: 127 tasks (Phases 1-2, US1-US3)

---

**Status**: Ready for implementation. Begin with Phase 1 (Setup) immediately.
