<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Type: MAJOR (Initial constitution establishment)
Date: 2025-10-17

Principles Established:
- I. Solo Developer Simplicity (Code Quality & Architecture)
- II. Mobile-First Performance (Performance & UX)
- III. Cultural Authenticity (Cultural Authenticity)
- IV. MVP-First Delivery (Development Approach)
- V. Privacy by Design (Data & Privacy)

Sections Added:
- Technology Stack Constraints
- Quality Gates & Testing Standards
- Governance

Templates Status:
✅ plan-template.md - Aligned (structure matches project type)
✅ spec-template.md - Aligned (user story prioritization matches MVP-first)
✅ tasks-template.md - Aligned (phased approach supports incremental delivery)

Follow-up Actions:
- None required for initial constitution
-->

# Wysh Constitution

## Core Principles

### I. Solo Developer Simplicity

#### Code Quality & Architecture for sustainable solo development

Wysh MUST maintain a codebase optimized for a single developer's cognitive load and long-term maintainability:

- **Readability First**: Code MUST be self-documenting with clear, intention-revealing names for functions, components, and variables
- **Single Responsibility**: Components MUST focus on one concern; components exceeding 200 lines require justification
- **Minimal Dependencies**: Built-in solutions MUST be preferred over external libraries; each new dependency requires explicit justification documenting why a built-in alternative is insufficient
- **Convention Adherence**: Next.js 15+ App Router conventions MUST be followed; deviations require documentation explaining the architectural benefit
- **Cognitive Load Management**: Features MUST be implemented as small, composable units that can be understood in isolation

**Rationale**: Solo developers lack the bandwidth for complex abstractions or extensive documentation. Simple, readable code reduces context-switching costs and enables faster iteration cycles.

### II. Mobile-First Performance

#### Performance optimization for the 85%+ mobile user base

Wysh MUST prioritize mobile device performance as the primary success metric:

- **60fps Animation Standard**: All animations MUST maintain 60fps on mid-range Android devices (tested on devices with Snapdragon 600-series or equivalent); degradation to 30fps is acceptable only with progressive enhancement fallbacks
- **Page Weight Budget**: Greeting view pages MUST not exceed 2MB total page weight (including all assets, scripts, and styles)
- **Mobile-First CSS**: All styling MUST be written mobile-first with progressive enhancement for larger screens; desktop-first breakpoints are prohibited
- **Animation Performance Testing**: Every animated component MUST be profiled on actual mobile hardware before merging; browser DevTools performance testing alone is insufficient
- **Asset Optimization**: All images MUST use Next.js Image component with appropriate formats (WebP with fallbacks); animated assets MUST be evaluated for file size impact

**Rationale**: WhatsApp sharing dominates mobile contexts. Smooth animations on mid-range Android devices ensure the cultural experience feels premium, not janky, for the majority user base.

### III. Cultural Authenticity

#### Respectful representation of Indian festival traditions

Wysh MUST honor the cultural significance of festivals and relationships:

- **Color Symbolism**: Color palettes MUST align with traditional festival meanings (e.g., Diwali: saffron/gold for prosperity, Holi: vibrant multi-color for joy); each palette requires documentation of cultural significance
- **Language Support**: Tamil, Hindi, and English text rendering MUST be tested with actual content in each language; font choices MUST support proper rendering of Tamil and Devanagari scripts
- **Visual Authenticity**: Festival symbols (diyas, rangoli, kolam, flowers) MUST be culturally accurate; designs require review by someone familiar with the festival traditions
- **Relationship Context**: Tone and formality levels MUST align with Indian social norms (e.g., professional greetings more formal than Western equivalents, family greetings emphasize respect for elders)
- **Cultural Review Gate**: Each new festival template MUST pass review by at least one person who celebrates that festival

**Rationale**: Wysh's value lies in creating culturally resonant experiences. Generic or culturally insensitive designs undermine trust and sharing virality in target communities.

### IV. MVP-First Delivery

#### Incremental feature completion over scope expansion

Wysh MUST prioritize shipping complete, tested features over adding new functionality:

- **Vertical Slices**: Each feature MUST work end-to-end before starting the next feature; no half-built features in main branch
- **MVP Festival Set**: Launch MUST focus on 5 festivals (Diwali, Holi, Christmas, New Year, Pongal) plus one generic template; additional festivals added only after MVP launch
- **Feature Completion Definition**: A feature is complete only when it works on mobile devices, passes WhatsApp preview testing, and includes proper Open Graph meta tags
- **No Premature Optimization**: Authentication, user accounts, and analytics beyond view counts are explicitly deferred until post-MVP
- **Real Device Testing**: Features MUST be tested on at least one actual mobile device before being considered complete; emulator-only testing is insufficient

**Rationale**: Solo development requires ruthless prioritization. Incomplete features create technical debt; complete MVP features create user value and enable iterative learning.

### V. Privacy by Design

#### Minimal data collection aligned with auth-free MVP

Wysh MUST minimize data collection and respect user privacy:

- **No Authentication Required**: MVP MUST be fully functional without user accounts or login
- **Minimal Data Storage**: Only greeting content (festival type, recipient name, sender name, custom message, template choice) and view count MUST be stored in Convex
- **Public by Default**: All greetings MUST be accessible via shareable links; no private/protected greetings in MVP
- **No Personal Data**: Email addresses, phone numbers, and identifying information beyond user-provided names MUST NOT be collected
- **Simple Analytics Only**: Only view counts per greeting MUST be tracked; user behavior analytics deferred to post-MVP

**Rationale**: Auth-free sharing reduces friction for viral WhatsApp distribution. Minimal data collection simplifies compliance and builds user trust.

## Technology Stack Constraints

### Non-Negotiable Technology Decisions

The following technology choices are fixed and MUST NOT be deviated from without constitution amendment:

- **Framework**: Next.js 15+ (App Router only; Pages Router prohibited)
- **React Version**: React 19+
- **Language**: TypeScript (strict mode enabled)
- **Database**: Convex (Convex client for real-time, Convex backend for mutations)
- **Animation - Timeline**: GSAP (for sequential, timeline-based animations)
- **Animation - Gestures/Scroll**: Framer Motion (for scroll triggers and gesture-based animations)
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Deployment**: Vercel (zero-config requirement)

**Rationale for Animation Split**: GSAP excels at timeline-based animations (festival intro sequences). Framer Motion excels at scroll/gesture interactions (parallax, card reveals). Using both leverages their strengths without library bloat.

### Technology Evaluation Criteria

For future amendments, new technologies may be considered only if:

1. They solve a problem not addressed by existing stack
2. Bundle size impact is documented and justified
3. Mobile performance impact is profiled on target devices
4. Learning curve is justified for solo developer context

## Quality Gates & Testing Standards

### Pre-Merge Requirements

Every feature MUST pass these quality gates before merging:

### 1. WhatsApp Preview Testing

- Greeting MUST be shared to WhatsApp and preview verified
- Open Graph meta tags MUST render correct image, title, and description
- Preview image MUST be culturally appropriate and visually clear at thumbnail size

### 2. Mobile Device Validation

- Feature MUST be tested on at least one mid-range Android device (physical, not emulator)
- Animation frame rates MUST be measured and documented
- Touch interactions MUST be responsive with no lag

### 3. Cultural Validation

- If feature involves festival content: MUST be reviewed by someone familiar with that festival
- Color choices MUST be documented with cultural significance
- Text translations (Tamil/Hindi) MUST be reviewed by native speakers

### 4. Relationship Context Testing

- Greeting tone MUST be tested with at least 5 different relationship contexts (e.g., parent, colleague, friend, spouse, sibling)
- Formality levels MUST feel natural, not forced

### 5. Performance Budget Compliance

- Page weight MUST be measured and documented
- Lighthouse performance score MUST be ≥ 85 on mobile simulation
- Animation performance MUST be profiled in Chrome DevTools

**Testing Philosophy**: Wysh prioritizes real-world validation (actual WhatsApp shares, physical devices, cultural reviewers) over automated test coverage. Unit tests are optional for MVP; integration testing happens through quality gates.

## Governance

### Constitution Authority

This constitution supersedes all other development practices, documentation, and guidelines. When conflicts arise between this document and other resources (README, inline comments, external documentation), the constitution takes precedence.

### Amendment Process

Amendments to this constitution require:

1. **Documentation**: Proposed change with rationale and impact analysis
2. **Version Bump**: Following semantic versioning rules (see below)
3. **Template Synchronization**: Updates to plan-template.md, spec-template.md, tasks-template.md to reflect new principles or quality gates
4. **Migration Plan**: If amendment affects existing code, provide refactoring steps

### Versioning Policy

Constitution version follows MAJOR.MINOR.PATCH format:

- **MAJOR**: Backward-incompatible changes (e.g., removing a principle, changing technology stack constraints)
- **MINOR**: New principles added or existing sections materially expanded (e.g., adding new quality gate)
- **PATCH**: Clarifications, wording improvements, typo fixes with no semantic impact

### Compliance Review

- All feature specifications (specs/*/spec.md) MUST include a "Constitution Alignment" section verifying compliance with principles
- All implementation plans (specs/*/plan.md) MUST include a "Constitution Check" gate before Phase 0 research
- Pull requests MUST reference which principles are validated by the changes

### Complexity Justification

Any violation of Solo Developer Simplicity principle (e.g., introducing a new dependency, creating a component > 200 lines, deviating from Next.js conventions) MUST include:

1. Written justification in implementation plan
2. Alternative approaches considered and rejected with reasons
3. Mitigation plan for increased complexity (documentation, testing, etc.)

**Version**: 1.0.0 | **Ratified**: 2025-10-17 | **Last Amended**: 2025-10-17
