# Implementation Plan: Enhanced Festival Greeting Animations

**Branch**: `002-enhance-festival-animations` | **Date**: 2025-10-17 | **Spec**: `/specs/002-enhance-festival-animations/spec.md`
**Input**: Feature specification from `/specs/002-enhance-festival-animations/spec.md`

## Summary

Enhance Wysh greeting card animations for Diwali, New Year, and Pongal festivals with professional, high-performance animations using GSAP 3.13+. Each festival will have unique, culturally authentic animations with particle systems, motion paths, and timeline orchestration. The implementation adapts animations based on relationship context (professional/family/friends/romantic) and maintains 60fps performance on mid-range Android devices while respecting accessibility preferences (prefers-reduced-motion).

**Core Deliverables**:

- Three festival animation templates (Diwali, New Year, Pongal) with distinct visual themes
- Reusable Fireworks template for multi-context use
- Relationship context adaptation system for tone/intensity/color adjustments
- Performance monitoring with adaptive quality degradation
- Full accessibility support (play/pause, prefers-reduced-motion, keyboard nav)

## Technical Context

**Language/Version**: TypeScript 5.6+ with React 18.2+ (Next.js 15+)

**Primary Dependencies**:

- GSAP 3.13+ (core library already installed: `^3.13.0`)
- @gsap/react 2.1.2+ (already installed for useGSAP hook)
- Canvas API for particle rendering (native)
- SVG for static elements (native)

**Storage**: N/A (animations code-generated, no persistent data)

**Testing**: Jest + React Testing Library (existing Wysh setup)

**Target Platform**: Mobile-first (mid-range Android 2021+), responsive to desktop

**Project Type**: Web application (Next.js 15+ with App Router)

**Performance Goals**: 60fps animations on Snapdragon 600+ devices, < 2MB page weight, < 2s load on 4G

**Constraints**:

- Max 500KB per animation template (code + assets)
- Max 8-12s animation duration per festival
- 200-500 particles for fireworks (scaling based on device)
- WCAG AA color contrast for all text
- Graceful degradation for prefers-reduced-motion

**Scale/Scope**:

- 3 primary festival templates + 1 reusable Fireworks template
- 5 user stories (3 P1 festival animations, 2 P2 enhancements)
- 74 functional requirements across animation system, performance, accessibility, integration
- Estimated 6-week implementation (phased delivery)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **I. Solo Developer Simplicity**: Code organization uses existing Wysh patterns (components/greetings, lib/animations). New particle system class maintains single responsibility (<200 LOC). GSAP configuration centralized in gsap-config.ts for clarity.

✅ **II. Mobile-First Performance**: Target 60fps on mid-range Android with adaptive quality system. Tests on real devices required (not emulator). Page weight budget < 2MB enforced. All animations use GSAP with force3D GPU acceleration.

✅ **III. Cultural Authenticity**: Each festival has documented color symbolism (Diwali: saffron/gold, New Year: vibrant multi-color, Pongal: warm harvest tones). SVG kolam pattern requires validation for cultural accuracy. Already using lib/context-engine for relationship-aware tone adjustment.

✅ **IV. MVP-First Delivery**: Specification prioritizes 3 P1 festival stories (independently testable MVPs) before 2 P2 enhancement stories. Fireworks template as P2 optional enhancement doesn't block P1 delivery.

✅ **V. Privacy by Design**: Animations store no PII. Only user-provided names/messages displayed (already handled by context-engine). No tracking/analytics in animation code.

## Project Structure

### Documentation (this feature)

specs/002-enhance-festival-animations/

- plan.md: This file (implementation planning)
- research.md: Phase 0 research findings (to be generated)
- data-model.md: Phase 1 data model and contracts (to be generated)
- quickstart.md: Phase 1 developer setup guide (to be generated)
- contracts/: Phase 1 API/component contracts (to be generated)
- checklists/requirements.md: Specification quality checklist
- spec.md: Feature specification

### Source Code (Wysh project - existing + new)

**Existing Structure**:

```text
components/greetings/
├── ChristmasTemplate.tsx
├── DiwaliTemplate.tsx       # Existing: needs enhancement
├── GenericTemplate.tsx
├── GreetingRenderer.tsx     # Master router component
├── HoliTemplate.tsx
├── NewYearTemplate.tsx      # Existing: needs enhancement
└── PongalTemplate.tsx       # Existing: needs enhancement

lib/
├── animations.ts            # Existing: GSAP configuration
├── context-engine.ts        # Existing: relationship context (will integrate)
├── constants.ts             # Existing: festival data
├── performance.ts           # Existing: performance monitoring
└── ...other libs

public/
└── (SVG assets to be added)
```

**New Directory Structure** (for Phase 2 implementation):

```text
components/greetings/
│   │   ├── SparkleParticles.tsx
│   │   └── RangoliDraw.tsx
│   ├── newyear/
│   │   ├── CountdownTimer.tsx
│   │   ├── FireworkBurst.tsx
│   │   ├── ConfettiSystem.tsx
│   │   └── TextExplosion.tsx
│   ├── pongal/
│   │   ├── KolamDrawing.tsx
│   │   ├── PongalPot.tsx
│   │   ├── SugarcaneSway.tsx
│   │   ├── SunRise.tsx
│   │   └── RiceGrains.tsx
│   └── shared/
│       ├── ParticleCanvas.tsx
│       ├── TextReveal.tsx
│       └── ContextAdapter.tsx
├── particles/               # NEW: Particle system library
│   ├── ParticleSystem.ts
│   ├── ParticleEmitter.ts
│   └── ParticleConfig.ts
├── templates/               # NEW: Refactored template organization
│   ├── BaseTemplate.tsx     # Shared template logic
│   ├── DiwaliTemplate.tsx
│   ├── NewYearTemplate.tsx
│   └── PongalTemplate.tsx
└── ui/
    └── AnimationControls.tsx # Play/pause, accessibility

lib/animations/             # NEW: Animation utilities subdirectory

- gsap-config.ts           # GSAP initialization & plugins
- timeline-factory.ts      # Reusable timeline creation
- particle-physics.ts      # Physics calculations
- festival-themes.ts       # NEW: Festival color configs
- performance-monitor.ts   # FPS & quality adaptation

public/festivals/           # NEW: SVG assets

- diwali/: diya.svg, rangoli-pattern.svg, sparkle.svg
- newyear/: confetti-shapes.svg, firework-base.svg
- pongal/: pot.svg, kolam.svg, sugarcane.svg, sun.svg

types/

- animation.types.ts       # NEW: Animation-specific types
- particle.types.ts        # NEW: Particle system types
```

**Structure Decision**: Adopt Option 2 (Web application refactoring). Existing Wysh uses a flat component structure. We're refactoring `components/greetings/` to use subdirectories for animation subcomponents (diwali/, newyear/, pongal/, shared/, particles/) while preserving existing templates at root level during migration. New lib utilities go into `lib/animations/` subdirectory. This maintains backward compatibility while organizing new code by festival context.

## Phase 0: Research & Analysis

**Objective**: Resolve technical unknowns and establish best practices.

**Research Tasks**:

1. **GSAP Plugins & DrawSVG Availability**
   - Task: Verify GSAP DrawSVG plugin availability for Pongal kolam animation, or identify fallback SVG animation approach
   - Decision: Use strokeDasharray/strokeDashoffset technique if DrawSVG unavailable (already supported in existing gsap-config.ts)

2. **Canvas vs WebGL Performance Comparison**
   - Task: Compare Canvas 2D vs WebGL for particle rendering on mid-range Android devices
   - Decision: Canvas 2D (native, simpler) for initial implementation; WebGL available for future optimization if needed

3. **Mobile Device Testing Strategy**
   - Task: Identify available mid-range Android devices for performance validation (Snapdragon 600-series equivalent)
   - Decision: Test on real devices using Chrome DevTools with mobile device throttling; document device models used

4. **SVG Asset Optimization**
   - Task: Research SVGO (SVG optimizer) integration with Next.js build pipeline
   - Decision: Use SVGO to minimize SVG file sizes; inline small SVGs (<2KB) to reduce HTTP requests

5. **Relationship Context Integration**
   - Task: Review existing lib/context-engine.ts to understand color/intensity adaptation patterns
   - Decision: Reuse existing getRelationshipContext() function for animation parameter adjustment

**Outcome**: Generate `research.md` with all findings and technology decisions documented.

## Phase 1: Design & Architecture

**Prerequisite**: research.md complete

**Deliverables**:

### 1.1 Data Model (`data-model.md`)

Key Entities:

- **AnimationTemplate**: Festival animation component with timeline, particle config, text styling
- **ParticleSystem**: Canvas-based particle renderer with emitter config, physics
- **AnimationTimeline**: GSAP timeline orchestrating all animation phases
- **RelationshipContextAdapter**: Maps relationship type to animation intensity/colors/duration
- **ReducedMotionVariant**: Simplified animation respecting prefers-reduced-motion

### 1.2 Component Contracts (`contracts/`)

**Animation Component Interface**:

```typescript
interface AnimationTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

interface ParticleSystemProps {
  colors: string[];
  intensity: 'low' | 'medium' | 'high';
  onComplete?: () => void;
}
```

**Particle System Class**:

```typescript
class ParticleSystem {
  emitBurst(x: number, y: number, count: number, config: BurstConfig): void;
  update(deltaTime: number): void;
  render(): void;
  start(): void;
  stop(): void;
}
```

### 1.3 Developer Quickstart (`quickstart.md`)

Getting started guide covering:

- Environment setup (Node 18+, bun, existing tools)
- GSAP configuration and plugin registration
- Creating animation components following patterns
- Performance testing on mobile devices
- Accessibility testing (prefers-reduced-motion, keyboard nav)

## Phase 2: Implementation (6 Weeks)

### Week 1: Infrastructure

- [ ] Create lib/animations/gsap-config.ts with plugin registration
- [ ] Create lib/animations/particle-physics.ts with ParticleSystem class
- [ ] Create lib/animations/performance-monitor.ts with FPS tracking
- [ ] Create lib/animations/festival-themes.ts with color palettes
- [ ] Create components/greetings/particles/ directory structure
- [ ] Create types/animation.types.ts and types/particle.types.ts

### Week 2: Diwali Template Enhancement

- [ ] Create components/greetings/animations/diwali/FireworkSystem.tsx
- [ ] Create components/greetings/animations/diwali/DiyaLighting.tsx
- [ ] Create components/greetings/animations/diwali/SparkleParticles.tsx
- [ ] Create components/greetings/animations/diwali/RangoliDraw.tsx
- [ ] Create public/festivals/diwali/ SVG assets
- [ ] Integrate with existing DiwaliTemplate.tsx

### Week 3: New Year Template Enhancement

- [ ] Create components/greetings/animations/newyear/CountdownTimer.tsx
- [ ] Create components/greetings/animations/newyear/FireworkBurst.tsx
- [ ] Create components/greetings/animations/newyear/ConfettiSystem.tsx
- [ ] Create components/greetings/animations/newyear/TextExplosion.tsx
- [ ] Create public/festivals/newyear/ SVG assets
- [ ] Integrate with existing NewYearTemplate.tsx

### Week 4: Pongal Template Enhancement

- [ ] Create components/greetings/animations/pongal/KolamDrawing.tsx
- [ ] Create components/greetings/animations/pongal/PongalPot.tsx
- [ ] Create components/greetings/animations/pongal/SugarcaneSway.tsx
- [ ] Create components/greetings/animations/pongal/SunRise.tsx
- [ ] Create components/greetings/animations/pongal/RiceGrains.tsx
- [ ] Create public/festivals/pongal/ SVG assets
- [ ] Integrate with existing PongalTemplate.tsx

### Week 5: Polish & Optimization

- [ ] Implement components/greetings/shared/ContextAdapter.tsx for relationship adaptation
- [ ] Implement components/greetings/shared/TextReveal.tsx for shared text animation
- [ ] Create components/greetings/shared/ParticleCanvas.tsx for reusable canvas component
- [ ] Performance testing on real Android devices
- [ ] Implement quality degradation for low-end devices
- [ ] Add prefers-reduced-motion support across all animations

### Week 6: Integration & Testing

- [ ] Create components/ui/AnimationControls.tsx (play/pause/replay)
- [ ] Create optional Fireworks template (reusable across contexts)
- [ ] End-to-end testing in creation flow
- [ ] Cross-browser compatibility testing
- [ ] Accessibility testing (keyboard nav, screen reader, WCAG AA)
- [ ] Documentation & code comments

## Technical Dependencies Already Installed

- ✅ GSAP 3.13.0 (@gsap/react 2.1.2)
- ✅ React 18+, Next.js 15+, TypeScript 5.6+
- ✅ Tailwind CSS 4
- ✅ Biome for linting (no ESLint/Prettier)

## Key Integration Points

1. **GreetingRenderer.tsx**: Route selected festival template to appropriate animation
2. **lib/context-engine.ts**: Use for relationship-aware animation parameter adjustment
3. **lib/constants.ts**: Reference festival color palettes (update with new animation data)
4. **types/index.ts**: Extend with animation types

## Success Metrics

- ✅ 60fps animation on Snapdragon 600+ devices
- ✅ < 2MB page weight for greeting view
- ✅ < 2s load time on 4G connection
- ✅ WCAG AA color contrast compliance
- ✅ Prefers-reduced-motion support functional
- ✅ All 74 functional requirements implemented and tested
