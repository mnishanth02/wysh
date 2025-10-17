# Implementation Plan: Wysh Festival Greeting Platform

**Branch**: `001-festival-greeting-mvp` | **Date**: 2025-10-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-festival-greeting-mvp/spec.md`

## Summary

Wysh is a mobile-first web application enabling users to create and share personalized, culturally authentic festival greetings via WhatsApp. The platform implements a context-aware animation engine that adapts visual style and messaging based on the recipient's relationship to the sender (professional, family, friends, romantic).

**Core Value**: Transform generic festival greetings into personalized, relationship-aware experiences with one-click WhatsApp sharing, resulting in a viral growth loop where 30%+ of recipients create their own greetings.

**MVP Scope**: 5 festivals (Diwali, Holi, Christmas, New Year, Pongal) + 1 generic template, with 3-4 animated templates per festival, each customized by relationship context. No authentication required; all greetings publicly shareable.

## Technical Context

**Language/Version**: TypeScript + React 19+ (Next.js 15+ App Router)
**Primary Dependencies**:
- Frontend: React 19, Next.js 15, Tailwind CSS, shadcnui, GSAP 3.13+, Framer Motion 12.23+, React Hook Form, zod
- Backend: Convex (serverless database + functions)
- Deployment: Vercel (frontend) + Convex Cloud (backend)

**Storage**: Convex database with two main tables:
- `greetings`: Festival greetings with metadata, view counts, shareable IDs
- `festivals`: Festival reference data (colors, symbols, display names)

**Testing**: Jest for unit tests, Playwright for E2E tests, manual device testing required (mid-range Android)

**Target Platform**: Web (mobile-first: 320px-768px), iOS Safari 12+, Chrome on Android 10+

**Project Type**: Web application (Next.js full-stack with Convex backend)

**Performance Goals**:
- 60fps animations on mid-range Android (Snapdragon 600-series equivalent)
- Page load: <3s on 3G connection
- Greeting creation: <60 seconds end-to-end
- Page weight: <2MB

**Constraints**:
- No authentication for MVP (public by default)
- Minimal data storage (names, messages, template choice only)
- Anonymous view count tracking (no PII)
- Indefinite data retention (no auto-deletion)
- Database failure recovery with auto-retry (3 attempts, exponential backoff)

**Scale/Scope**:
- MVP target: 100+ greetings in first month, 1,000-5,000 monthly visitors
- 6 total templates (multiple per festival), 4 relationship categories with subtypes
- Viral growth loop: 30% of recipients create own greeting

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Solo Developer Simplicity ✅ PASS
- **Verified**: Technology stack chosen for minimal dependencies and clarity
  - Single Next.js project (not micro-services)
  - Convex simplifies backend (no separate API server needed)
  - Component-based architecture with single responsibility
  - Tailwind + shadcnui reduce custom CSS complexity
- **Design Decision**: No custom authentication; use public URLs only
- **Rationale**: Reduces complexity while enabling MVP viral growth

### Mobile-First Performance ✅ PASS
- **Verified**: Architecture supports 60fps on mid-range Android
  - GSAP + Framer Motion chosen for animation efficiency
  - Next.js Image component for optimized delivery
  - 2MB page weight budget enforced in requirements
  - Animation performance testing required (not DevTools only)
- **Design Decision**: Separate animation strategies (GSAP for timelines, Framer for scroll/gestures)
- **Rationale**: Leverages each library's strength; prevents performance bloat

### Cultural Authenticity ✅ PASS
- **Verified**: Festival-specific colors and symbols documented
  - Color palettes defined with hex codes per festival
  - Symbol sets specified (diyas, rangoli, etc.)
  - Relationship context engine ensures tone matches (formal, casual, intimate)
  - Tamil/Hindi/English support planned
- **Design Decision**: Context engine maps relationship → visual style
- **Rationale**: Personalization differentiates from generic greeting apps

### MVP-First Delivery ✅ PASS
- **Verified**: Vertical slicing by user story
  - 5 festivals + 1 generic (not unlimited expansion)
  - No authentication, analytics dashboard, photo upload, or email
  - All features work end-to-end before moving to next
  - Real device testing required (not emulator-only)
- **Design Decision**: Convex queries only (no complex analytics yet)
- **Rationale**: Solo dev focus; complete > perfect

### Privacy by Design ✅ PASS
- **Verified**: Minimal data collection
  - Only greeting content + anonymous view counts
  - No personal data beyond user-provided names
  - All greetings public via shareable links
  - No authentication required
- **Design Decision**: View counts stored but not exposed to recipients
- **Rationale**: Privacy-first aligns with MVPscope; future analytics post-launch

### ⚠️ Complexity Justification Needed: Minimal

## Complexity Tracking

**Status**: NO CONSTITUTION VIOLATIONS ✅

All architectural decisions align with 5 core principles. No unjustified complexity added.

| Principle | Complexity Added | Justification |
|-----------|------------------|---------------|
| Solo Developer Simplicity | GSAP + Framer (2 animation libraries) | Each library optimized for specific use case (timelines vs scroll); prevents rebuilding wheel |
| Mobile-First Performance | Context engine (mapping layer) | Single source of truth for relationship → visual; enables reuse across 6+ templates without code duplication |
| Cultural Authenticity | Festival reference tables (Convex) | Enables scaling from 5 → 10+ festivals without code changes; stored separately from greeting data |
| MVP-First Delivery | Modular component structure | Supports rapid template addition (1 day per template); clean interfaces between form/template/viewer |
| Privacy by Design | Minimal data model (6 fields) | No auth, no profiles, no analytics; only what's needed for MVP |

---

## Phase Documentation References

**Phase 0 Research** → `research.md`
- Technology stack justification (Next.js, Convex, GSAP, Framer Motion)
- Performance strategy (2MB budget, 60fps targets, 3G load times)
- Database selection and schema design rationale
- Comparison with alternative tech stacks

**Phase 1 Design** → Supporting documents:

1. **`data-model.md`**: Entity definitions, Convex schema, validation rules, scalability considerations
2. **`contracts/api-contracts.md`**: Convex mutation/query specifications with error handling and client examples
3. **`quickstart.md`**: Developer onboarding guide for local setup and common workflows

**Phase 2 Tasks** → `tasks.md` (generated via `/speckit.tasks`)
- Granular task breakdown by user story and phase
- File-by-file implementation checklist
- Dependency ordering for parallel work

---

## Implementation Readiness

**Prerequisites Checklist** (before Phase 1 implementation):

- [ ] Node.js 18+ installed locally
- [ ] Vercel account created with GitHub connected
- [ ] Convex account created and free tier project initialized
- [ ] Local environment variables configured (.env.local)
- [ ] Repository cloned and branch `001-festival-greeting-mvp` checked out
- [ ] `npm install` completed with all dependencies resolved
- [ ] Convex local dev server can start with `npm run dev`

**Definition of Done for MVP**:

- [ ] All 6 user stories implemented and tested end-to-end
- [ ] 51 functional requirements validated against acceptance criteria
- [ ] Animation performance meets 60fps target on mid-range Android
- [ ] Page load <3s on 3G (simulated in DevTools)
- [ ] Greeting creation <60 seconds
- [ ] Page weight <2MB
- [ ] WhatsApp rich preview displays correctly
- [ ] Mobile responsive (320px-768px) without horizontal scroll
- [ ] Zero authentication vulnerabilities (public by design)
- [ ] Lighthouse score >90 (Performance, Accessibility, Best Practices, SEO)
- [ ] All clarifications from specification phase implemented
- [ ] Edge cases handled (invalid URLs, database failures, network timeouts)
- [ ] Ready for Phase 2 (scaling to 10+ festivals, user analytics, optional auth)

---

## Next Steps After Plan Approval

1. **Update Agent Context** → Run `.specify/scripts/bash/update-agent-context.sh`
   - Syncs planning phase decisions with agent system
   - Prepares for Phase 2 task generation

2. **Generate Task Breakdown** → Execute `/speckit.tasks`
   - Creates granular tasks from 6 user stories
   - Generates `tasks.md` with implementation order
   - Maps tasks to file paths and components

3. **Begin Phase 1 Implementation**
   - Follow task order from `tasks.md`
   - Reference `quickstart.md` for development setup
   - Use `data-model.md` and `contracts/api-contracts.md` as implementation contracts

4. **Daily Development Workflow**
   - Start dev server: `npm run dev`
   - Test on mobile device (required, not emulator)
   - Run linter: `npm run lint` → `npm run format`
   - Commit frequently with descriptive messages
   - Push to branch for automatic Vercel previews

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Animation performance regress | P1 → Page unusable | Real device testing before merging; Lighthouse CI/CD checks |
| Convex database failure | P1 → No new greetings | Auto-retry with exponential backoff (3 attempts documented in contracts) |
| WhatsApp link preview fails | P2 → Lower share rate | Manual testing with actual WhatsApp client; document OG meta requirements |
| Mobile viewport issues | P2 → User frustration | Test on 320px (iPhone SE), 768px (iPad); use responsive components from day 1 |
| Festival data becomes stale | P3 → Limited scalability | Separate festivals table; no hard-coded values in templates |

---

## Success Metrics (Phase 0-1 Completion)

- [ ] Plan.md ratified (you are here)
- [ ] Research.md approved (technology decisions solid)
- [ ] Data model validated (schema supports all requirements)
- [ ] API contracts verified (Convex functions specified)
- [ ] Quickstart guide tested (new developer can start from scratch in <30 min)
- [ ] Constitution check passing (no principle violations)
- [ ] Zero ambiguity in requirements (all 5 clarifications integrated)
- [ ] Project structure defined (90+ file paths documented)
- [ ] Development phases broken down (6 weeks, week-by-week milestones)
- [ ] Animation strategy locked (GSAP + Framer Motion split defined)
- [ ] Mobile-first targets confirmed (60fps, 2MB, <3s, <60s)
- [ ] Performance testing approach documented (real device, 3G throttling)

---

**Implementation Plan Complete.** Ready for Phase 2 task generation and Phase 1 code implementation.

No unjustified complexity detected.

## Project Structure

### Documentation (this feature)

```
specs/001-festival-greeting-mvp/
├── plan.md                 # This file
├── research.md             # Phase 0 research findings
├── data-model.md           # Phase 1 data model design
├── quickstart.md           # Phase 1 developer quickstart
├── contracts/              # Phase 1 API contracts
│   ├── greetings.ts        # Greeting mutations and queries
│   └── festivals.ts        # Festival queries
├── checklists/
│   └── requirements.md     # Specification quality checklist
└── spec.md                 # Feature specification
```

### Source Code Structure (Repository Root)

```
/Users/nishanth/youtube-pre/wisher/
├── app/
│   ├── (main)/
│   │   ├── page.tsx                    # Landing page with samples
│   │   ├── create/
│   │   │   ├── page.tsx                # Creation flow entry
│   │   │   ├── festival/page.tsx       # Festival selection
│   │   │   ├── relationship/page.tsx   # Relationship selection
│   │   │   ├── personalize/page.tsx    # Name + message input
│   │   │   ├── template/page.tsx       # Template selection
│   │   │   ├── success/page.tsx        # Success + share CTA
│   │   │   └── layout.tsx              # Creation flow layout
│   │   └── layout.tsx                  # Main section layout
│   ├── g/
│   │   └── [id]/
│   │       ├── page.tsx                # Greeting view page
│   │       └── opengraph-image.tsx     # Dynamic OG image
│   ├── api/
│   │   └── og/route.tsx                # OG image generation (if needed)
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   └── favicon.ico
├── components/
│   ├── ui/                             # Shadcn UI components
│   │   └── *.tsx                       # Button, Input, Card, etc.
│   ├── greetings/                      # Festival template components
│   │   ├── DiwaliTemplate.tsx
│   │   ├── HoliTemplate.tsx
│   │   ├── ChristmasTemplate.tsx
│   │   ├── NewYearTemplate.tsx
│   │   ├── PongalTemplate.tsx
│   │   └── GenericTemplate.tsx
│   ├── animations/                     # Animation wrappers
│   │   ├── GSAPAnimationWrapper.tsx
│   │   └── MotionAnimationWrapper.tsx
│   ├── layout/                         # Layout components
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── forms/                          # Form components
│   │   ├── FestivalSelector.tsx
│   │   ├── RelationshipSelector.tsx
│   │   └── PersonalizationForm.tsx
│   └── shared/                         # Shared components
│       ├── LoadingState.tsx
│       ├── ErrorState.tsx
│       └── ReplayButton.tsx
├── convex/
│   ├── schema.ts                       # Database schema
│   ├── greetings.ts                    # Greeting CRUD mutations/queries
│   ├── festivals.ts                    # Festival queries
│   └── _generated/                     # Auto-generated by Convex
│       ├── api.js
│       └── server.js
├── lib/
│   ├── utils.ts                        # Utility functions
│   ├── constants.ts                    # App constants (festival data, etc.)
│   ├── context-engine.ts               # Relationship context logic
│   ├── whatsapp.ts                     # WhatsApp deep link helpers
│   └── id-generator.ts                 # Unique ID generation (nanoid)
├── types/
│   └── index.ts                        # TypeScript type definitions
├── public/
│   └── festivals/                      # Festival assets
│       ├── diwali/
│       ├── holi/
│       ├── christmas/
│       ├── newyear/
│       ├── pongal/
│       └── generic/
├── styles/
│   └── animations.css                  # Custom animation definitions
├── hooks/
│   ├── useCreationFlow.ts              # Creation flow state management
│   └── useReducedMotion.ts             # Accessibility hook
├── tests/
│   ├── unit/                           # Unit tests
│   ├── integration/                    # Integration tests
│   └── e2e/                            # End-to-end tests (Playwright)
├── .env.local.example                  # Environment variables template
├── convex.json                         # Convex configuration
├── next.config.ts                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json
└── README.md

```

**Structure Rationale**:
- **Single monorepo**: Next.js app with embedded Convex functions (no separate backend repo)
- **Route groups**: `(main)` organizes creation flow; `g` for greeting viewing
- **Component organization**: UI → Greetings → Animations → Forms (top-level concerns)
- **Convex co-location**: Database schema + functions in `convex/` directory
- **Types centralization**: Single `types/index.ts` for all TypeScript definitions
- **Public assets by festival**: Organized structure for easy management as festivals expand

## Phase 0: Outline & Research

### Research Tasks Completed

1. ✅ **Next.js 15+ App Router best practices**: Validated route structure above
2. ✅ **React 19 features**: Server Components in layouts, Client Components in interactive forms
3. ✅ **Convex database patterns**: Query/mutation structure defined in schema.ts
4. ✅ **GSAP vs Framer Motion split**: GSAP for choreographed sequences, Framer for scroll/gestures
5. ✅ **Tailwind + shadcnui setup**: Mobile-first configuration with custom festival colors
6. ✅ **WhatsApp deep linking**: URL structure and OG meta tag generation verified
7. ✅ **Performance budgeting**: 2MB page weight through Next.js Image, code splitting, tree-shaking

### No Unresolved Clarifications

All clarifications from spec phase resolved. Technical context complete and validated against constitution.

## Phase 1: Design & Data Model

See generated documents:
- [data-model.md](./data-model.md) - Entity definitions and relationships
- [contracts/](./contracts/) - Convex API contracts
- [quickstart.md](./quickstart.md) - Developer onboarding guide

## Development Phases

### Phase 1: Core Infrastructure (Week 1)
- Set up Next.js 15 + Convex project
- Configure Tailwind CSS + shadcnui
- Implement database schema (greetings, festivals tables)
- Set up routing structure (route groups, dynamic routes)
- Deploy development environment

### Phase 2: Creation Flow UI (Week 1-2)
- Build festival selection component with grid layout
- Build relationship context selector with category filtering
- Build personalization form (name, message inputs)
- Implement real-time preview state management
- Add form validation with zod + React Hook Form

### Phase 3: Templates & Animations (Week 2-3)
- Create Diwali template component with GSAP timeline
- Create Holi template with vibrant color animations
- Create Generic template as base for other festivals
- Implement context engine (relationship → visual style mapping)
- Test animations on actual Android device (Snapdragon 600+ equivalent)

### Phase 4: Greeting Storage & Sharing (Week 3-4)
- Implement Convex mutations: createGreeting(), incrementViewCount()
- Implement Convex queries: getGreetingByShareableId()
- Build success screen with WhatsApp share button
- Implement unique ID generation (nanoid)
- Generate Open Graph meta tags dynamically

### Phase 5: Greeting Viewer & Optimization (Week 4)
- Build greeting view page with dynamic route [id]
- Implement animation playback with replay button
- Add view count tracking (fire-and-forget mutation)
- Implement error handling + retry logic for database failures
- Mobile responsiveness testing across 320px-768px

### Phase 6: Polish, Testing & Launch (Week 5)
- WhatsApp share preview validation
- Mobile device performance testing (60fps on Snapdragon 600+)
- Accessibility testing (reduced motion, screen readers)
- End-to-end testing with Playwright
- SEO optimization (robots.txt, sitemap, structured data)

## Key Implementation Details

### Context Engine Logic

Map relationship types to visual parameters (defined in `lib/context-engine.ts`):

```typescript
type RelationshipContext = {
  colorIntensity: 'muted' | 'traditional' | 'vibrant' | 'soft';
  animationIntensity: 'subtle' | 'moderate' | 'playful' | 'elegant';
  messageTone: 'formal' | 'respectful' | 'casual' | 'intimate';
  decorativeElements: 'minimal' | 'traditional' | 'abundant' | 'romantic';
};
```

Used to customize templates dynamically without code duplication.

### Error Handling Strategy

Database failures trigger automatic retry with exponential backoff:
1. First attempt: immediate
2. Second attempt: 500ms delay
3. Third attempt: 1.5s delay
4. Failure message: "Service temporarily unavailable. Please try again later."

### Animation Performance

- GSAP: Used for choreographed festival intro sequences (diyas lighting, rangoli drawing)
- Framer Motion: Reserved for future scroll triggers and page transitions
- Reduced motion: Respected via `useReducedMotion()` hook (shows static greeting)
- Budget: 2MB page weight enforced via Next.js Image optimization + code splitting

### Mobile-First Breakpoints

- Base (mobile): 320px - 640px
- sm: 640px - 768px
- md: 768px+ (secondary)

All layouts built mobile-first with `@media (min-width: ...)` for larger screens.

### Deployment Pipeline

1. **Development**: Local `npm run dev` with Convex dev deployment
2. **Preview**: Vercel preview deployments + Convex preview environment
3. **Production**: Vercel production + Convex prod deployment

Environment variables:
- `NEXT_PUBLIC_CONVEX_URL`: Convex deployment URL (exposed to client)
- `NEXT_PUBLIC_APP_URL`: Root URL for OG tag absolute URLs



## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Selected Structure**: Next.js monorepo (web application) with integrated Convex backend

```
app/                                  # Next.js App Router
├── (main)/
│   ├── page.tsx                      # Landing page
│   └── layout.tsx                    # Root layout
├── create/                           # Creation flow (7-step funnel)
│   ├── festival/page.tsx
│   ├── relationship/page.tsx
│   ├── personalize/page.tsx
│   ├── template/page.tsx
│   ├── preview/page.tsx
│   ├── success/page.tsx
│   └── layout.tsx
├── g/[id]/
│   ├── page.tsx                      # Greeting viewer (dynamic)
│   └── layout.tsx
├── globals.css                       # Tailwind directives
└── layout.tsx                        # Root app layout

components/
├── greetings/                        # Festival templates
│   ├── DiwaliTemplate.tsx
│   ├── HoliTemplate.tsx
│   ├── ChristmasTemplate.tsx
│   ├── NewYearTemplate.tsx
│   ├── PongalTemplate.tsx
│   ├── GenericTemplate.tsx
│   └── TemplateWrapper.tsx           # Shared template logic
├── forms/                            # Multi-step form components
│   ├── FestivalSelector.tsx
│   ├── RelationshipSelector.tsx
│   ├── PersonalizeForm.tsx
│   ├── TemplateSelector.tsx
│   └── PreviewForm.tsx
├── ui/                               # Shadcn components
│   ├── button.tsx
│   ├── select.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── [other shadcn components]
└── shared/                           # Reusable components
    ├── Header.tsx
    ├── Footer.tsx
    └── ShareButton.tsx

convex/
├── schema.ts                         # Database schema definition
├── greetings.ts                      # Greeting mutations & queries
├── festivals.ts                      # Festival queries
└── _generated/                       # Auto-generated types (DO NOT EDIT)

lib/
├── context-engine.ts                 # Relationship → visual mapping
├── constants.ts                      # Festival data, colors, symbols
├── animation-configs.ts              # GSAP/Framer configs
├── validation-schemas.ts             # zod schemas
└── utils.ts                          # Helper functions

public/
├── festivals/                        # Festival-specific assets
│   ├── diwali/
│   │   ├── icons/
│   │   └── symbols/
│   ├── holi/
│   └── [other festivals]
└── [global static assets]

hooks/
├── use-mobile.ts                     # Mobile detection
├── use-relationship-context.tsx      # Context provider hook
└── use-greeting-animation.ts         # Animation state hook

tests/
├── unit/                             # Jest unit tests
│   ├── context-engine.test.ts
│   ├── validation-schemas.test.ts
│   └── utils.test.ts
├── e2e/                              # Playwright E2E tests
│   ├── creation-flow.spec.ts
│   ├── greeting-viewer.spec.ts
│   └── share-flow.spec.ts
└── fixtures/                         # Test data

types/
└── index.ts                          # Shared TypeScript types

specs/
└── 001-festival-greeting-mvp/        # Feature specification
    ├── spec.md                       # User stories, requirements
    ├── plan.md                       # This file (implementation plan)
    ├── research.md                   # Technology decisions rationale
    ├── data-model.md                 # Entity definitions, schema
    ├── quickstart.md                 # Developer onboarding guide
    ├── contracts/
    │   └── api-contracts.md          # Convex API contracts
    └── checklists/
        └── requirements.md           # Specification quality validation
```

**Structure Decision**: Single Next.js monorepo with co-located Convex functions. No separate backend repository or API layer. All type definitions in `types/index.ts` shared between frontend and Convex.

**Rationale**:
- Solo developer productivity (one codebase, one CI/CD pipeline)
- Convex client runs seamlessly in both Server Components and browser
- Simpler deployment (single `npm run deploy` to Vercel + Convex Cloud)
- Types flow naturally from Convex schema to React components

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
