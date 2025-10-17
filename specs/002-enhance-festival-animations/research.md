# Phase 0 Research: Enhanced Festival Greeting Animations# Phase 0 Research: Enhanced Festival Greeting Animations



**Date**: 2025-10-17 | **Branch**: `002-enhance-festival-animations` | **Prerequisite**: `plan.md`**Date**: 2025-10-17 | **Branch**: `002-enhance-festival-animations` | **Prerequisite**: `plan.md`



## Research Objective## Research Objective



Resolve technical unknowns and establish best practices before Phase 1 design begins. Five research areas examined with Decision and Rationale for each.Resolve technical unknowns and establish best practices before Phase 1 design begins. Five research areas examined with Decision and Rationale for each.



------



## 1. GSAP Plugins & DrawSVG Availability## 1. GSAP Plugins & DrawSVG Availability



**Question**: Is GSAP DrawSVG plugin available and production-ready for animating SVG paths (Pongal kolam pattern drawing)? What fallback techniques exist?**Question**: Is GSAP DrawSVG plugin available and production-ready for animating SVG paths (Pongal kolam pattern drawing)? What fallback techniques exist?



**Research Context**:**Research Context**:



- Wysh currently uses GSAP 3.13.0 (confirmed in package.json)- Wysh currently uses GSAP 3.13.0 (confirmed in package.json)

- DrawSVG would provide smooth SVG path animation (strokeDasharray-based)- DrawSVG would provide smooth SVG path animation (strokeDasharray-based)

- Pongal kolam requires intricate path animation (~30-100 path segments)- Pongal kolam requires intricate path animation (~30-100 path segments)



**Findings**:**Findings**:



- GSAP 3.13+ includes DrawSVG plugin (available via @gsap/bonus or standalone)- GSAP 3.13+ includes DrawSVG plugin (available via @gsap/bonus or standalone)

- DrawSVG is production-ready and widely used for SVG path animations- DrawSVG is production-ready and widely used for SVG path animations

- Fallback: strokeDasharray + strokeDashoffset via CSS/GSAP (native browser support, no plugin needed)- Fallback: strokeDasharray + strokeDashoffset via CSS/GSAP (native browser support, no plugin needed)

- Fallback performance: Acceptable for Pongal kolam (no more than 100 paths, GPU-accelerated with transform3d)- Fallback performance: Acceptable for Pongal kolam (no more than 100 paths, GPU-accelerated with transform3d)



**Decision**: ✅ Use DrawSVG plugin for primary implementation (smoother animation API). Implement strokeDasharray fallback for browsers without DrawSVG support.**Decision**: ✅ Use DrawSVG plugin for primary implementation (smoother animation API). Implement strokeDasharray fallback for browsers without DrawSVG support (rare, but increases robustness).



**Rationale**:**Rationale**:



- DrawSVG optimized for SVG path animation (cleaner timeline code)- DrawSVG optimized for SVG path animation (cleaner timeline code)

- Already have GSAP installed; DrawSVG adds minimal overhead- Already have GSAP installed; DrawSVG adds minimal overhead

- Fallback ensures graceful degradation- Fallback ensures graceful degradation

- Reduces complexity in timeline creation vs manual strokeDasharray management- Reduces complexity in timeline creation vs. manual strokeDasharray management



**Implementation Notes**:**Implementation Notes**:



- Register DrawSVG in `lib/animations/gsap-config.ts` via `gsap.registerPlugin(DrawSVG)`- Register DrawSVG in `lib/animations/gsap-config.ts` via `gsap.registerPlugin(DrawSVG)`

- Wrap kolam drawing in conditional: try DrawSVG, fallback to strokeDasharray- Wrap kolam drawing in conditional: try DrawSVG, fallback to strokeDasharray

- Test both paths on real mobile devices- Test both paths on real mobile devices



------



## 2. Canvas vs WebGL Performance Comparison## 2. Canvas vs WebGL Performance Comparison



**Question**: For particle systems (fireworks, confetti, sparkles), is Canvas 2D or WebGL better for 60fps animation on mid-range Android?**Question**: For particle systems (fireworks, confetti, sparkles), is Canvas 2D or WebGL better for 60fps animation on mid-range Android?



**Research Context**:**Research Context**:



- Target: Snapdragon 600-series devices (2021+)- Target: Snapdragon 600-series devices (2021+)

- Particle count: 200-500 particles per animation- Particle count: 200-500 particles per animation

- Animation duration: 8-12 seconds- Animation duration: 8-12 seconds

- Performance goal: 60fps with graceful degradation to 30fps- Performance goal: 60fps with graceful degradation to 30fps



**Findings**:**Findings**:



**Canvas 2D**:**Canvas 2D**:



- Simpler API, native browser support- Simpler API, native browser support

- Typical limit: 500-1000 particles at 60fps on mid-range devices- Typical limit: 500-1000 particles at 60fps on mid-range devices

- CPU-bound (rendering done on main thread)- CPU-bound (rendering done on main thread)

- Sufficient for Wysh particle counts (200-500)- Sufficient for Wysh particle counts (200-500)



**WebGL**:**WebGL**:



- GPU-accelerated, higher particle capacity- GPU-accelerated, higher particle capacity

- Steeper learning curve (shader programming)- Steeper learning curve (shader programming)

- Overkill for Wysh's particle budget- Overkill for Wysh's particle budget

- Three.js overhead adds 200KB+ to bundle (conflicts with <2MB budget)- Three.js overhead adds 200KB+ to bundle (conflicts with <2MB budget)



**Babylon.js**: Similar overhead to Three.js, not justified**Babylon.js**: Similar overhead to Three.js, not justified



**Decision**: ✅ Use Canvas 2D for primary implementation. WebGL available as future optimization if needed.**Decision**: ✅ Use Canvas 2D for primary implementation. WebGL available as future optimization if needed.



**Rationale**:**Rationale**:



- Canvas 2D sufficient for 200-500 particles- Canvas 2D sufficient for 200-500 particles

- Simpler codebase aligns with Wysh simplicity principle- Simpler codebase aligns with Wysh simplicity principle

- Reduces bundle size (no Three.js/Babylon.js)- Reduces bundle size (no Three.js/Babylon.js)

- Easier to debug and maintain- Easier to debug and maintain

- Real-device testing will validate 60fps target- Real-device testing will validate 60fps target



**Implementation Notes**:**Implementation Notes**:



- Create `ParticleSystem` class in `lib/animations/particle-physics.ts` using native Canvas API- Create `ParticleSystem` class in `lib/animations/particle-physics.ts` using native Canvas API

- Use `requestAnimationFrame` for smooth 60fps rendering- Use `requestAnimationFrame` for smooth 60fps rendering

- Implement device detection to degrade quality (particle count) on low-end devices- Implement device detection to degrade quality (particle count) on low-end devices

- Include FPS monitor in `lib/animations/performance-monitor.ts`- Include FPS monitor in `lib/animations/performance-monitor.ts`



------



## 3. Mobile Device Testing Strategy## 3. Mobile Device Testing Strategy



**Question**: How should we validate 60fps performance on mid-range Android devices? What devices/tools are recommended?**Question**: How should we validate 60fps performance on mid-range Android devices? What devices/tools are recommended?



**Research Context**:**Research Context**:



- Target devices: Snapdragon 600-series (Samsung Galaxy A, OnePlus N10 5G, Redmi Note 10)- Target devices: Snapdragon 600-series (Samsung Galaxy A series 2021+, OnePlus N10 5G, Redmi Note 10)

- Testing environment: Chrome DevTools + real devices preferred (emulator misses performance issues)- Testing environment: Chrome DevTools + real devices preferred (emulator misses performance issues)

- Performance validation: FPS monitoring, frame timing analysis- Performance validation: FPS monitoring, frame timing analysis



**Findings**:**Findings**:



**Chrome DevTools**:**Chrome DevTools**:



- Performance tab: Timeline recording with FPS overlay- Performance tab: Timeline recording with FPS overlay

- Lighthouse: Simulates slow throttling (not accurate for real devices)- Lighthouse: Simulates slow throttling (not accurate for real devices)

- Network throttling: Useful for <2s load time validation- Network throttling: Useful for <2s load time validation

- CPU throttling: Adjustable, but emulation imperfect- CPU throttling: Adjustable, but emulation imperfect



**Real Device Testing** (Highly Recommended):**Real Device Testing** (Highly Recommended):



- Use actual mid-range Android phones (e.g., Redmi Note 10, Samsung Galaxy A12)- Use actual mid-range Android phones (e.g., Redmi Note 10, Samsung Galaxy A12)

- Enable Chrome DevTools remote debugging: `chrome://inspect`- Enable Chrome DevTools remote debugging: `chrome://inspect`

- Record Performance timeline on real device (most accurate)- Record Performance timeline on real device (most accurate)

- Identify "jank" (dropped frames) patterns- Identify "jank" (dropped frames) patterns



**Frame Timing Analysis**:**Frame Timing Analysis**:



- Target: 60fps = 16.67ms per frame- Target: 60fps = 16.67ms per frame

- Acceptable: 80%+ frames under 20ms (accounts for jitter)- Acceptable: 80%+ frames under 20ms (accounts for jitter)

- Unacceptable: Sustained frames >33ms (visible stuttering)- Unacceptable: Sustained frames >33ms (visible stuttering)



**Decision**: ✅ Implement multi-tier testing strategy: (1) Chrome DevTools on dev machine, (2) Real device testing with frame-by-frame analysis, (3) Automated Lighthouse CI check.**Decision**: ✅ Implement multi-tier testing strategy: (1) Chrome DevTools on dev machine, (2) Real device testing with frame-by-frame analysis, (3) Automated Lighthouse CI check.



**Rationale**:**Rationale**:



- Real device testing catches performance issues emulator misses- Real device testing catches performance issues emulator misses

- Chrome DevTools provides quick feedback during development- Chrome DevTools provides quick feedback during development

- Lighthouse CI ensures regressions caught before production- Lighthouse CI ensures regressions caught before production

- Aligns with Wysh's mobile-first performance principle- Aligns with Wysh's mobile-first performance principle



**Implementation Notes**:**Implementation Notes**:



- Add performance monitoring script to detect dropped frames at runtime- Add performance monitoring script to detect dropped frames at runtime

- Log frame timing data for analysis- Log frame timing data for analysis

- Document tested device models and results in `MOBILE-PERFORMANCE-TESTING.md`- Document tested device models and results in `MOBILE-PERFORMANCE-TESTING.md`

- Create GitHub Actions workflow for Lighthouse CI (post-MVP)- Create GitHub Actions workflow for Lighthouse CI (post-MVP)



------



## 4. SVG Asset Optimization## 4. SVG Asset Optimization



**Question**: How to minimize SVG file sizes for static festival elements (diyas, pots, rangoli patterns) while maintaining visual quality?**Question**: How to minimize SVG file sizes for static festival elements (diyas, pots, rangoli patterns) while maintaining visual quality?



**Research Context**:**Research Context**:



- SVG assets needed: ~10 files (diwali: diya, rangoli; newyear: confetti shapes, fireworks; pongal: pot, kolam, sugarcane, sun)- SVG assets needed: ~10 files (diwali: diya, rangoli; newyear: confetti shapes, fireworks; pongal: pot, kolam, sugarcane, sun)

- File size budget: <50KB total for all SVG assets (part of <2MB page weight)- File size budget: <50KB total for all SVG assets (part of <2MB page weight)

- Quality requirement: WCAG AA compliant, clean rendering on mobile- Quality requirement: WCAG AA compliant, clean rendering on mobile



**Findings**:**Findings**:



**SVGO (SVG Optimizer)**:**SVGO (SVG Optimizer)**:



- Removes metadata, optimizes paths, reduces decimal precision- Removes metadata, optimizes paths, reduces decimal precision

- Typical reduction: 30-60% file size decrease- Typical reduction: 30-60% file size decrease

- Already used by many Next.js projects- Already used by many Next.js projects

- Configuration: Configurable via `.svgorc.js`- Configuration: Configurable via `.svgorc.js`



**Inline vs External SVGs**:**Inline vs External SVGs**:



- Small SVGs (<2KB): Inline into component (reduces HTTP requests)- Small SVGs (<2KB): Inline into component (reduces HTTP requests)

- Larger SVGs (2-10KB): External files with Next.js image optimization- Larger SVGs (2-10KB): External files with Next.js image optimization

- Trade-off: Inline increases JS bundle, external increases HTTP overhead- Trade-off: Inline increases JS bundle, external increases HTTP overhead



**Next.js Optimization**:**Next.js Optimization**:



- Built-in `next/image` with SVG support- Built-in `next/image` with SVG support

- Automatic format conversion (WebP, AVIF) not applicable to SVG- Automatic format conversion (WebP, AVIF) not applicable to SVG

- Manual SVGO integration via Next.js config possible- Manual SVGO integration via Next.js config possible



**Decision**: ✅ Use SVGO for all SVGs + hybrid inline/external strategy: inline simple shapes (<1KB), external for complex patterns.**Decision**: ✅ Use SVGO for all SVGs + hybrid inline/external strategy: inline simple shapes (<1KB), external for complex patterns.



**Rationale**:**Rationale**:



- SVGO standard tool for SVG optimization (widely adopted)- SVGO standard tool for SVG optimization (widely adopted)

- Hybrid approach balances performance (inline for small assets) with maintainability (external for complex)- Hybrid approach balances performance (inline for small assets) with maintainability (external for complex)

- Next.js image optimization covers raster fallbacks if needed- Next.js image optimization covers raster fallbacks if needed

- Keeps <2MB budget realistic- Keeps <2MB budget realistic



**Implementation Notes**:**Implementation Notes**:



- Install `svgo` as dev dependency: `bun add -D svgo`- Install `svgo` as dev dependency: `bun add -D svgo`

- Create `.svgorc.js` with quality settings (disable removeUselessDefs to preserve SVG structure)- Create `.svgorc.js` with quality settings (disable removeUselessDefs to preserve SVG structure)

- Create `public/festivals/` directory with optimized SVGs- Create `public/festivals/` directory with optimized SVGs

- Inline small SVGs into component code using React import- Inline small SVGs into component code using React import

- Use Next.js `<Image>` for raster preview/fallback if needed- Use Next.js `<Image>` for raster preview/fallback if needed



------



## 5. Relationship Context Integration## 5. Relationship Context Integration



**Question**: How to leverage existing `lib/context-engine.ts` for animation parameter adjustment without duplicating code?**Question**: How to leverage existing `lib/context-engine.ts` for animation parameter adjustment without duplicating code?



**Research Context**:**Research Context**:



- Wysh already has `getRelationshipContext()` that maps relationship type (professional/family/friends/romantic) to context- Wysh already has `getRelationshipContext()` that maps relationship type (professional/family/friends/romantic) to context

- Current usage: Text tone, color intensity adjustments- Current usage: Text tone, color intensity adjustments

- Goal: Extend to animation speed, particle count, duration adjustments- Goal: Extend to animation speed, particle count, duration adjustments



**Findings**:**Findings**:



**Existing Patterns** (examined `lib/context-engine.ts`):**Existing Patterns** (examined `lib/context-engine.ts`):



- `getRelationshipContext()` returns object with: `{colorIntensity, messageTone, pacing}`- `getRelationshipContext()` returns object with: `{colorIntensity, messageTone, pacing}`

- `adjustColorPalette()` modifies hex colors based on relationship- `adjustColorPalette()` modifies hex colors based on relationship

- `adjustAnimationDuration()` modifies duration based on relationship- `adjustAnimationDuration()` modifies duration based on relationship



**Current Integration Points**:**Current Integration Points**:



- Existing templates (DiwaliTemplate.tsx) call `getRelationshipContext()` for text styling- Existing templates (DiwaliTemplate.tsx) call `getRelationshipContext()` for text styling

- Could extend same function to return animation-specific params (particleCount, timelineScale, etc.)- Could extend same function to return animation-specific params (particleCount, timelineScale, etc.)



**Minimal Refactoring Approach**:**Minimal Refactoring Approach**:



- Extend `getRelationshipContext()` return type with optional animation params- Extend `getRelationshipContext()` return type with optional animation params

- Create wrapper function: `getAnimationContext()` that calls existing function + adds animation params- Create wrapper function: `getAnimationContext()` that calls existing function + adds animation params

- Backward compatible (existing code continues working)- Backward compatible (existing code continues working)



**Decision**: ✅ Extend existing `getRelationshipContext()` with optional animation parameters. Create `lib/animations/context-adapter.ts` as thin wrapper for animation-specific logic.**Decision**: ✅ Extend existing `getRelationshipContext()` with optional animation parameters. Create `lib/animations/context-adapter.ts` as thin wrapper for animation-specific logic.



**Rationale**:**Rationale**:



- Reuses existing context-engine infrastructure- Reuses existing context-engine infrastructure

- Minimizes code duplication (DRY principle)- Minimizes code duplication (DRY principle)

- Maintains backward compatibility- Maintains backward compatibility

- Aligns with Wysh's simplicity principle (single source of truth)- Aligns with Wysh's simplicity principle (single source of truth)

- Clear separation of concerns (animation adapter layer)- Clear separation of concerns (animation adapter layer)



**Implementation Notes**:**Implementation Notes**:



- Update `types/index.ts` RelationshipContext interface to include optional animation fields- Update `types/index.ts` RelationshipContext interface to include optional animation fields

- Create `lib/animations/context-adapter.ts` exporting `getAnimationContext(relationshipType)`- Create `lib/animations/context-adapter.ts` exporting `getAnimationContext(relationshipType)`

- Function returns: `{particleIntensity: 'low'|'medium'|'high', animationSpeed: 0.8-1.2, colorPalette: string[]}`- Function returns: `{particleIntensity: 'low'|'medium'|'high', animationSpeed: 0.8-1.2, colorPalette: string[]}`

- Integrate into each festival template (DiwaliTemplate, NewYearTemplate, PongalTemplate)- Integrate into each festival template (DiwaliTemplate, NewYearTemplate, PongalTemplate)

- No changes needed to existing `lib/context-engine.ts` (preserve as-is for stability)- No changes needed to existing `lib/context-engine.ts` (preserve as-is for stability)



------



## Summary: Research Decisions & Rationale## Summary: Research Decisions & Rationale



| Research Area | Decision | Rationale | Risk Mitigation || Research Area | Decision | Rationale | Risk Mitigation |

|---------------|----------|-----------|-----------------||---------------|----------|-----------|-----------------|

| GSAP Plugins | Use DrawSVG + strokeDasharray fallback | Optimized API + graceful degradation | Fallback tested on all browsers || GSAP Plugins | Use DrawSVG + strokeDasharray fallback | Optimized API + graceful degradation | Fallback tested on all browsers |

| Canvas vs WebGL | Canvas 2D only | Sufficient for 200-500 particles, simpler, smaller bundle | FPS monitor detects if insufficient || Canvas vs WebGL | Canvas 2D only | Sufficient for 200-500 particles, simpler, smaller bundle | FPS monitor detects if insufficient |

| Mobile Testing | Real device + DevTools + Lighthouse CI | Catches performance issues early, aligns with principle | Pre-commit hook validates 60fps || Mobile Testing | Real device + DevTools + Lighthouse CI | Catches performance issues early, aligns with principle | Pre-commit hook validates 60fps |

| SVG Optimization | SVGO + hybrid inline/external | Standard tool, balanced performance/maintainability | File size budgets documented || SVG Optimization | SVGO + hybrid inline/external | Standard tool, balanced performance/maintainability | File size budgets documented |

| Context Integration | Extend existing getRelationshipContext() | DRY, backward compatible, single source of truth | No breaking changes to context-engine || Context Integration | Extend existing getRelationshipContext() | DRY, backward compatible, single source of truth | No breaking changes to context-engine |



------



## Status: Research Complete ✅## Status: Research Complete ✅



All five research areas documented with Decision, Rationale, and Implementation Notes.All five research areas documented with Decision, Rationale, and Implementation Notes.



**Next Phase**: Phase 1 Design (`data-model.md`, `contracts/`, `quickstart.md`)**Next Phase**: Phase 1 Design (`data-model.md`, `contracts/`, `quickstart.md`)



**Blocking Issues**: None. Ready to proceed with design phase.**Blocking Issues**: None. Ready to proceed with design phase.



**Additional Notes**:**Additional Notes**:



- No additional clarifications needed from specification- No additional clarifications needed from specification

- All technology choices align with Wysh constitution principles- All technology choices align with Wysh constitution principles

- Implementation can begin immediately after Phase 1 contracts defined- Implementation can begin immediately after Phase 1 contracts defined


**Question**: Is GSAP DrawSVG plugin available and production-ready for animating SVG paths (Pongal kolam pattern drawing)? What fallback techniques exist?

**Research Context**:

- Wysh currently uses GSAP 3.13.0 (confirmed in package.json)
- DrawSVG would provide smooth SVG path animation (strokeDasharray-based)
- Pongal kolam requires intricate path animation (~30-100 path segments)

**Findings**:

- GSAP 3.13+ includes DrawSVG plugin (available via @gsap/bonus or standalone)
- DrawSVG is production-ready and widely used for SVG path animations
- Fallback: strokeDasharray + strokeDashoffset via CSS/GSAP (native browser support, no plugin needed)
- Fallback performance: Acceptable for Pongal kolam (no more than 100 paths, GPU-accelerated with transform3d)

**Decision**: ✅ Use DrawSVG plugin for primary implementation (smoother animation API). Implement strokeDasharray fallback for browsers without DrawSVG support (rare, but increases robustness).

**Rationale**:

- DrawSVG optimized for SVG path animation (cleaner timeline code)
- Already have GSAP installed; DrawSVG adds minimal overhead
- Fallback ensures graceful degradation
- Reduces complexity in timeline creation vs. manual strokeDasharray management

**Implementation Notes**:

- Register DrawSVG in `lib/animations/gsap-config.ts` via `gsap.registerPlugin(DrawSVG)`
- Wrap kolam drawing in conditional: try DrawSVG, fallback to strokeDasharray
- Test both paths on real mobile devices

---

## 2. Canvas vs WebGL Performance Comparison

**Question**: For particle systems (fireworks, confetti, sparkles), is Canvas 2D or WebGL better for 60fps animation on mid-range Android?

**Research Context**:
- Target: Snapdragon 600-series devices (2021+)
- Particle count: 200-500 particles per animation
- Animation duration: 8-12 seconds
- Performance goal: 60fps with graceful degradation to 30fps

**Findings**:
- **Canvas 2D**:
  - Simpler API, native browser support
  - Typical limit: 500-1000 particles at 60fps on mid-range devices
  - CPU-bound (rendering done on main thread)
  - Sufficient for Wysh particle counts (200-500)

- **WebGL**:
  - GPU-accelerated, higher particle capacity
  - Steeper learning curve (shader programming)
  - Overkill for Wysh's particle budget
  - Three.js overhead adds 200KB+ to bundle (conflicts with <2MB budget)

- **Babylon.js**: Similar overhead to Three.js, not justified

**Decision**: ✅ Use Canvas 2D for primary implementation. WebGL available as future optimization if needed.

**Rationale**:
- Canvas 2D sufficient for 200-500 particles
- Simpler codebase aligns with Wysh simplicity principle
- Reduces bundle size (no Three.js/Babylon.js)
- Easier to debug and maintain
- Real-device testing will validate 60fps target

**Implementation Notes**:
- Create `ParticleSystem` class in `lib/animations/particle-physics.ts` using native Canvas API
- Use `requestAnimationFrame` for smooth 60fps rendering
- Implement device detection to degrade quality (particle count) on low-end devices
- Include FPS monitor in `lib/animations/performance-monitor.ts`

---

## 3. Mobile Device Testing Strategy

**Question**: How should we validate 60fps performance on mid-range Android devices? What devices/tools are recommended?

**Research Context**:
- Target devices: Snapdragon 600-series (Samsung Galaxy A series 2021+, OnePlus N10 5G, Redmi Note 10)
- Testing environment: Chrome DevTools + real devices preferred (emulator misses performance issues)
- Performance validation: FPS monitoring, frame timing analysis

**Findings**:
- **Chrome DevTools**:
  - Performance tab: Timeline recording with FPS overlay
  - Lighthouse: Simulates slow throttling (not accurate for real devices)
  - Network throttling: Useful for <2s load time validation
  - CPU throttling: Adjustable, but emulation imperfect

- **Real Device Testing** (Highly Recommended):
  - Use actual mid-range Android phones (e.g., Redmi Note 10, Samsung Galaxy A12)
  - Enable Chrome DevTools remote debugging: `chrome://inspect`
  - Record Performance timeline on real device (most accurate)
  - Identify "jank" (dropped frames) patterns

- **Frame Timing Analysis**:
  - Target: 60fps = 16.67ms per frame
  - Acceptable: 80%+ frames under 20ms (accounts for jitter)
  - Unacceptable: Sustained frames >33ms (visible stuttering)

**Decision**: ✅ Implement multi-tier testing strategy: (1) Chrome DevTools on dev machine, (2) Real device testing with frame-by-frame analysis, (3) Automated Lighthouse CI check.

**Rationale**:
- Real device testing catches performance issues emulator misses
- Chrome DevTools provides quick feedback during development
- Lighthouse CI ensures regressions caught before production
- Aligns with Wysh's mobile-first performance principle

**Implementation Notes**:
- Add performance monitoring script to detect dropped frames at runtime
- Log frame timing data for analysis
- Document tested device models and results in `MOBILE-PERFORMANCE-TESTING.md`
- Create GitHub Actions workflow for Lighthouse CI (post-MVP)

---

## 4. SVG Asset Optimization

**Question**: How to minimize SVG file sizes for static festival elements (diyas, pots, rangoli patterns) while maintaining visual quality?

**Research Context**:
- SVG assets needed: ~10 files (diwali: diya, rangoli; newyear: confetti shapes, fireworks; pongal: pot, kolam, sugarcane, sun)
- File size budget: <50KB total for all SVG assets (part of <2MB page weight)
- Quality requirement: WCAG AA compliant, clean rendering on mobile

**Findings**:
- **SVGO (SVG Optimizer)**:
  - Removes metadata, optimizes paths, reduces decimal precision
  - Typical reduction: 30-60% file size decrease
  - Already used by many Next.js projects
  - Configuration: Configurable via `.svgorc.js`

- **Inline vs External SVGs**:
  - Small SVGs (<2KB): Inline into component (reduces HTTP requests)
  - Larger SVGs (2-10KB): External files with Next.js image optimization
  - trade-off: Inline increases JS bundle, external increases HTTP overhead

- **Next.js Optimization**:
  - Built-in `next/image` with SVG support
  - Automatic format conversion (WebP, AVIF) not applicable to SVG
  - Manual SVGO integration via Next.js config possible

**Decision**: ✅ Use SVGO for all SVGs + hybrid inline/external strategy: inline simple shapes (<1KB), external for complex patterns.

**Rationale**:
- SVGO standard tool for SVG optimization (widely adopted)
- Hybrid approach balances performance (inline for small assets) with maintainability (external for complex)
- Next.js image optimization covers raster fallbacks if needed
- Keeps <2MB budget realistic

**Implementation Notes**:
- Install `svgo` as dev dependency: `bun add -D svgo`
- Create `.svgorc.js` with quality settings (disable removeUselessDefs to preserve SVG structure)
- Create `public/festivals/` directory with optimized SVGs
- Inline small SVGs into component code using React import
- Use Next.js `<Image>` for raster preview/fallback if needed

---

## 5. Relationship Context Integration

**Question**: How to leverage existing `lib/context-engine.ts` for animation parameter adjustment without duplicating code?

**Research Context**:
- Wysh already has `getRelationshipContext()` that maps relationship type (professional/family/friends/romantic) to context
- Current usage: Text tone, color intensity adjustments
- Goal: Extend to animation speed, particle count, duration adjustments

**Findings**:
- **Existing Patterns** (examined `lib/context-engine.ts`):
  - `getRelationshipContext()` returns object with: `{colorIntensity, messageTone, pacing}`
  - `adjustColorPalette()` modifies hex colors based on relationship
  - `adjustAnimationDuration()` modifies duration based on relationship

- **Current Integration Points**:
  - Existing templates (DiwaliTemplate.tsx) call `getRelationshipContext()` for text styling
  - Could extend same function to return animation-specific params (particleCount, timelineScale, etc.)

- **Minimal Refactoring Approach**:
  - Extend `getRelationshipContext()` return type with optional animation params
  - Create wrapper function: `getAnimationContext()` that calls existing function + adds animation params
  - Backward compatible (existing code continues working)

**Decision**: ✅ Extend existing `getRelationshipContext()` with optional animation parameters. Create `lib/animations/context-adapter.ts` as thin wrapper for animation-specific logic.

**Rationale**:
- Reuses existing context-engine infrastructure
- Minimizes code duplication (DRY principle)
- Maintains backward compatibility
- Aligns with Wysh's simplicity principle (single source of truth)
- Clear separation of concerns (animation adapter layer)

**Implementation Notes**:
- Update `types/index.ts` RelationshipContext interface to include optional animation fields
- Create `lib/animations/context-adapter.ts` exporting `getAnimationContext(relationshipType)`
- Function returns: `{particleIntensity: 'low'|'medium'|'high', animationSpeed: 0.8-1.2, colorPalette: string[]}`
- Integrate into each festival template (DiwaliTemplate, NewYearTemplate, PongalTemplate)
- No changes needed to existing `lib/context-engine.ts` (preserve as-is for stability)

---

## Summary: Research Decisions & Rationale

| Research Area | Decision | Rationale | Risk Mitigation |
|---------------|----------|-----------|-----------------|
| GSAP Plugins | Use DrawSVG + strokeDasharray fallback | Optimized API + graceful degradation | Fallback tested on all browsers |
| Canvas vs WebGL | Canvas 2D only | Sufficient for 200-500 particles, simpler, smaller bundle | FPS monitor detects if insufficient |
| Mobile Testing | Real device + DevTools + Lighthouse CI | Catches performance issues early, aligns with principle | Pre-commit hook validates 60fps |
| SVG Optimization | SVGO + hybrid inline/external | Standard tool, balanced performance/maintainability | File size budgets documented |
| Context Integration | Extend existing getRelationshipContext() | DRY, backward compatible, single source of truth | No breaking changes to context-engine |

---

## Status: Research Complete ✅

All five research areas documented with Decision, Rationale, and Implementation Notes.

**Next Phase**: Phase 1 Design (`data-model.md`, `contracts/`, `quickstart.md`)

**Blocking Issues**: None. Ready to proceed with design phase.

**Additional Notes**:
- No additional clarifications needed from specification
- All technology choices align with Wysh constitution principles
- Implementation can begin immediately after Phase 1 contracts defined
