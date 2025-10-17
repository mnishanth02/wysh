# Tasks: Enhanced Festival Greeting Animations

**Branch**: `002-enhance-festival-animations` | **Generated**: 2025-10-17
**Input**: Design documents from `/specs/002-enhance-festival-animations/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Feature Summary**: Enhance Wysh greeting card animations for Diwali, New Year, and Pongal festivals with professional, high-performance animations using GSAP 3.13+. Each festival will have unique, culturally authentic animations with particle systems, motion paths, and timeline orchestration that adapt based on relationship context.

**Organization**: Tasks are grouped by user story (US1-US6) to enable independent implementation and testing. Each user story is a complete, testable increment.

**Path Convention**: Wysh uses Next.js 15+ App Router structure:
- Components: `components/greetings/`, `components/ui/`
- Libraries: `lib/`, `lib/animations/`
- Types: `types/`
- Assets: `public/festivals/`

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1=Diwali, US2=New Year, US3=Pongal, US4=Context Adaptation, US5=Preview, US6=Fireworks)
- All tasks include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, directory structure, and foundational animation utilities

**Duration**: Week 1 (Days 1-2)

- [X] T001 Create animation subdirectory structure: `lib/animations/`, `components/greetings/animations/`, `public/festivals/`
- [X] T002 [P] Create festival-specific directories: `components/greetings/animations/diwali/`, `components/greetings/animations/newyear/`, `components/greetings/animations/pongal/`, `components/greetings/animations/shared/`
- [X] T003 [P] Create types files: `types/animation.types.ts`, `types/particle.types.ts` with AnimationTemplateProps, ParticleSystemConfig interfaces from contracts
- [X] T004 [P] Create public asset directories: `public/festivals/diwali/`, `public/festivals/newyear/`, `public/festivals/pongal/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core animation infrastructure that ALL user stories depend on. MUST complete before starting any festival templates.

**Duration**: Week 1 (Days 3-5)

**⚠️ CRITICAL**: No user story work (Phase 3+) can begin until this phase is 100% complete

### Particle System Foundation

- [X] T005 Create `lib/animations/particle-physics.ts` with Particle class (x, y, vx, vy, life, age, color, size properties)
- [X] T006 Implement ParticleSystem class in `lib/animations/particle-physics.ts` with constructor(canvas, config), start(), stop(), reset(), update(deltaTime), render() methods
- [X] T007 Add emitBurst() method to ParticleSystem with radial distribution (360-degree angle support), velocity randomization, color cycling
- [X] T008 Add emitStream() method to ParticleSystem for continuous particle emission with rate control
- [X] T009 Implement particle physics update logic: position += velocity * dt, velocity += gravity * dt, velocity *= friction, alpha fade based on age/lifespan
- [X] T010 Add object pooling to ParticleSystem to reuse particle objects (max pool size from config.maxParticles)
- [X] T011 Implement Canvas rendering with batch optimization: single context.fillRect or context.drawImage per frame where possible

### GSAP Configuration & Timeline Utilities

- [X] T012 Create `lib/animations/gsap-config.ts` with GSAP plugin registration (core, MotionPathPlugin) and global configuration
- [X] T013 [P] Add registerGSAPPlugins() function with conditional DrawSVG registration: `try { GSAP.registerPlugin(DrawSVG); return { useDrawSVG: true }; } catch (error) { console.warn('DrawSVG unavailable, using strokeDasharray fallback'); return { useDrawSVG: false }; }`. TEST REQUIREMENT: Create test SVG path and verify both DrawSVG and strokeDasharray fallback render kolam animation correctly before proceeding to Phase 3.
- [X] T014 [P] Create `lib/animations/timeline-factory.ts` with createAnimationTimeline(festivalType, relationshipContext) factory function
- [X] T015 Implement relationship-aware duration scaling in timeline-factory: professional (0.8x), family (1.0x), friends (1.1x), romantic (1.2x)

### Festival Theme Configuration

- [X] T016 Create `lib/animations/festival-themes.ts` with color palette exports for each festival: DIWALI_COLORS, NEWYEAR_COLORS, PONGAL_COLORS, FIREWORKS_COLORS
- [X] T017 Document cultural color symbolism in `lib/animations/festival-themes.ts` as JSDoc comments above each palette export. REQUIRED: (1) Diwali: Orange #FF6B35 = saffron/spirituality, Gold #FFA500 = prosperity/wealth, Red #DC143C = auspiciousness/celebration, White #FFFFFF = purity/peace. (2) New Year: Blue #1E90FF = new beginnings, Red #FF1493 = passion/excitement, Gold #FFD700 = prosperity, Green #32CD32 = growth, Purple #9370DB = luxury, Silver #C0C0C0 = modernity. (3) Pongal: Orange #FF8C00 = harvest warmth, Yellow #FFEB3B = turmeric/prosperity, Terracotta #D2691E = earthen pot tradition, Red #DC143C = auspiciousness, Cream #F5F5DC = rice/abundance. Honors Constitution Principle III (cultural authenticity).
- [X] T018 Add getRelationshipColorVariant() function to festival-themes for professional (muted), family (traditional), friends (vibrant), romantic (pastel) color adaptations
- [X] T019 Integrate with existing `lib/context-engine.ts`: import getRelationshipContext() and map to animation parameters (intensity, animationSpeed, colorPalette)

### Performance Monitoring

- [X] T020 Create `lib/animations/performance-monitor.ts` with FPSMonitor class (trackFrame(), getCurrentFPS(), getAverageFPS())
- [X] T021 Implement adaptive quality system in performance-monitor: if FPS < 45 for 2s, reduce particle count by 30%, if FPS < 30 for 2s, reduce by 50%
- [X] T021 Add getDeviceCapability() function returning 'high' | 'medium' | 'low' based on initial FPS baseline (60fps+ = high, 45-60 = medium, <45 = low)

### Shared Animation Components

- [X] T022 [P] Create `components/greetings/animations/shared/ParticleCanvas.tsx` with canvas element, useEffect for ParticleSystem lifecycle, forwardRef for parent control
- [X] T023 [P] Create `components/greetings/animations/shared/TextReveal.tsx` with GSAP SplitText for character-by-character animation, configurable easing and stagger
- [X] T024 [P] Create `components/greetings/animations/shared/ContextAdapter.tsx` hook to consume relationshipContext and return adapted animation config (colors, intensity, speed)

**Checkpoint ✅**: Foundation ready - festival template implementation (US1, US2, US3) can now begin in parallel

---

## Phase 3: User Story 1 - Diwali Festival Lighting Animation (Priority: P1) 🎯 MVP

**Goal**: Implement spectacular Diwali animation with fireworks, diyas, and sparkles capturing the essence of the festival of lights

**Independent Test**:
1. Load a Diwali greeting via `/g/[id]` with festivalType='diwali'
2. Observe 8-10 second animation sequence: dark background fade (0-2s) → diyas light up (0-2s) → fireworks launch (2-6s) → text reveal (6-8s) → finale sparkle loop (8-10s)
3. Verify 60fps performance on mid-range Android device
4. Confirm replay button appears and functions after animation completes
5. Test prefers-reduced-motion: simple fade-in instead of complex animation

**Duration**: Week 2 (Days 6-10)

### Diwali Animation Components

- [X] T025 [P] [US1] Create `components/greetings/animations/diwali/DiyaLighting.tsx` with SVG diya shapes, GSAP scale/opacity animation staggered by 0.2s, glow effect via filter: drop-shadow
- [X] T026 [P] [US1] Create `components/greetings/animations/diwali/FireworkSystem.tsx` using ParticleCanvas, emitBurst() calls with Diwali colors (#FF6B35, #FFA500, #DC143C, #FFFFFF), 200-300 particles total
- [X] T027 [P] [US1] Implement firework launch animation in FireworkSystem: use GSAP MotionPath for particles along bezier curves, burst at apex with radial distribution
- [X] T028 [P] [US1] Create `components/greetings/animations/diwali/SparkleParticles.tsx` with golden floating particles (#FFA500), vertical motion path with slight horizontal drift, continuous emission during 2-6s phase
- [X] T029 [P] [US1] Create `components/greetings/animations/diwali/RangoliDraw.tsx` with SVG path animation (strokeDasharray technique or DrawSVG plugin if available), traditional geometric pattern in white/orange

### Diwali SVG Assets

- [X] T030 [P] [US1] Create SVG asset `public/festivals/diwali/diya.svg`: traditional oil lamp shape with flame, optimized with SVGO (<2KB)
- [X] T031 [P] [US1] Create SVG asset `public/festivals/diwali/rangoli-pattern.svg`: circular geometric pattern, prepare for path animation
- [X] T032 [P] [US1] Create SVG asset `public/festivals/diwali/sparkle.svg`: 4-point star shape for particle rendering

### Diwali Template Integration

- [X] T033 [US1] Refactor existing `components/greetings/DiwaliTemplate.tsx` to use new animation components
- [X] T034 [US1] Create master GSAP timeline in DiwaliTemplate with phases: (0-2s) background fade + diya lighting, (2-6s) fireworks + sparkles, (6-8s) text reveal, (8-10s) finale with sparkle loop
- [X] T035 [US1] Integrate ContextAdapter in DiwaliTemplate to apply relationship-aware intensity and color adjustments
- [X] T036 [US1] Add prefers-reduced-motion detection: if enabled, render ReducedMotionVariant with simple fade-in (0-2s) and instant text display
- [X] T037 [US1] Wire onAnimationComplete callback to display ReplayButton (from `components/shared/ReplayButton.tsx`) after 8-10s
- [X] T038 [US1] Add GPU acceleration hints: transform: translate3d, will-change: transform, force3D: true in GSAP config
- [X] T039 [US1] Implement text reveal sequence: recipientName appears character-by-character (6-7s), senderName + message fade in (7-8s)

**Checkpoint ✅**: Diwali animation is fully functional, independently testable, and delivers MVP value

---

## Phase 4: User Story 2 - New Year Countdown Celebration (Priority: P1) 🎯 MVP

**Goal**: Implement exciting New Year animation with countdown timer, fireworks, and confetti celebrating the new year

**Independent Test**:
1. Load a New Year greeting via `/g/[id]` with festivalType='newyear'
2. Observe 10-12 second animation: countdown 3→2→1 (0-4s) → synchronized fireworks explosion (4-7s) → confetti burst (5-10s) → text reveal "Happy New Year 2026" (7-10s) → sparkle loop (10-12s)
3. Verify countdown numbers display correctly with scale/burst effects
4. Confirm confetti has 3D rotation (rotateX, rotateY, rotateZ) and realistic physics
5. Check 60fps performance throughout all phases

**Duration**: Week 3 (Days 11-15)

### New Year Animation Components

- [X] T040 [P] [US2] Create `components/greetings/animations/newyear/CountdownTimer.tsx` with SVG text elements for numbers "3", "2", "1", GSAP scale animation (scale: 0 → 1.5 → 1), burst disappear effect (scale: 1 → 2, opacity: 1 → 0)
- [X] T041 [P] [US2] Implement rolling digit effect in CountdownTimer using GSAP y-translate with modulo rotation for smooth transition between numbers
- [X] T042 [P] [US2] Create `components/greetings/animations/newyear/FireworkBurst.tsx` with ParticleCanvas, 5-7 fireworks with staggered timing (delay 0.1-0.3s between launches)
- [X] T043 [P] [US2] Configure FireworkBurst with 360-degree radial particle distribution, 400-500 particles total, color cycling through New Year palette (#1E90FF, #FF1493, #FFD700, #32CD32, #9370DB, #C0C0C0)
- [X] T044 [P] [US2] Implement gravity simulation in FireworkBurst: particles fall with vy += gravity * dt, fade as they descend (alpha = 1 - vy / maxFallSpeed)
- [X] T045 [P] [US2] Create `components/greetings/animations/newyear/ConfettiSystem.tsx` with 100-150 confetti pieces, random colors from New Year palette
- [X] T046 [P] [US2] Add 3D rotation to ConfettiSystem: GSAP animates rotateX (0-360deg), rotateY (0-360deg), rotateZ (0-360deg) with random duration (1-3s per rotation)
- [X] T047 [P] [US2] Implement confetti fall physics: vy += gravity * dt, slight horizontal drift (vx = sin(time) * windSpeed), realistic tumble via rotation
- [X] T048 [P] [US2] Create `components/greetings/animations/newyear/TextExplosion.tsx` with "Happy New Year 2026" text, each letter bounces elastically from center using GSAP elastic ease

### New Year SVG Assets

- [X] T049 [P] [US2] Create SVG asset `public/festivals/newyear/confetti-shapes.svg`: collection of shapes (rectangle, circle, triangle, star) for confetti rendering
- [X] T050 [P] [US2] Create SVG asset `public/festivals/newyear/firework-base.svg`: star burst shape for firework particle rendering
- [X] T051 [P] [US2] Create SVG background `public/festivals/newyear/night-sky.svg`: dark gradient with twinkling stars (CSS animation or GSAP)

### New Year Template Integration

- [X] T052 [US2] Refactor existing `components/greetings/NewYearTemplate.tsx` to use new animation components
- [X] T053 [US2] Create master GSAP timeline in NewYearTemplate with phases: (0-4s) countdown with background intensity increase, (4-7s) synchronized fireworks at countdown zero, (5-10s) confetti burst from top edges, (7-10s) text explosion, (10-12s) background fireworks loop
- [X] T054 [US2] Implement countdown synchronization: ensure fireworks trigger exactly at "1" → "0" transition using timeline labels or absolute positioning
- [X] T055 [US2] Integrate ContextAdapter in NewYearTemplate for relationship-aware color and intensity adjustments
- [X] T056 [US2] Add prefers-reduced-motion support: countdown numbers appear instantly (no animation), text fades in immediately
- [X] T057 [US2] Wire onAnimationComplete callback to display ReplayButton after 10-12s
- [X] T058 [US2] Implement text reveal: "Happy New Year 2026" explodes from center (7-8s), recipientName + senderName appear below (8-10s)

**Checkpoint ✅**: New Year animation is fully functional and independently testable

---

## Phase 5: User Story 3 - Pongal Harvest Festival Authenticity (Priority: P1) 🎯 MVP

**Goal**: Implement authentic Pongal animation with kolam drawing, pongal pot overflow, sun rise, and swaying sugarcane representing Tamil harvest culture

**Independent Test**:
1. Load a Pongal greeting via `/g/[id]` with festivalType='pongal'
2. Observe 8-10 second animation: warm dawn gradient (0-2s) → sun rising with rays (0-2s) → kolam drawing itself (2-4s) → pot appears with steam rising (3-6s) → dramatic overflow (5-6s) → sugarcane sway + rice grains (4-10s) → text reveal (6-8s)
3. Verify kolam pattern is culturally authentic (sunburst/flower mandala with concentric circles)
4. Confirm pongal pot overflow effect is visible and dramatic (prosperity symbolism)
5. Check steam particles rise vertically with horizontal wobble

**Duration**: Week 4 (Days 16-20)

### Pongal Animation Components

- [ ] T059 [P] [US3] Create `components/greetings/animations/pongal/SunRise.tsx` with SVG circle (sun), GSAP y-translate animation (bottom → center), expanding rays via scale animation
- [ ] T060 [P] [US3] Add continuous slow rotation to sun rays in SunRise component (rotateZ: 0 → 360deg over 8s, loop infinitely)
- [ ] T061 [P] [US3] Create `components/greetings/animations/pongal/KolamDrawing.tsx` with SVG path for sunburst/flower mandala pattern with concentric circles, implement path animation using DrawSVG plugin (primary) or strokeDasharray fallback (hybrid strategy per clarifications)
- [ ] T062 [P] [US3] Ensure KolamDrawing pattern is culturally authentic: sunburst mandala with radial design, concentric circles drawn outward, white/cream color (#F5F5DC)
- [ ] T063 [P] [US3] Create `components/greetings/animations/pongal/PongalPot.tsx` with SVG pot shape (terracotta #D2691E), decorative red/yellow patterns, mask/clipping path for overflow effect
- [ ] T064 [P] [US3] Implement boiling animation in PongalPot: contents rise vertically using GSAP y-translate, bubble effect via scale/opacity animation of small circles
- [ ] T065 [P] [US3] Add dramatic overflow effect in PongalPot: rice/milk overflows pot sides at 5-6s mark using clipping path reveal animation, symbolizes prosperity
- [ ] T066 [P] [US3] Create `components/greetings/animations/pongal/SteamParticles.tsx` with ParticleCanvas, 50-80 steam particles rising from pot opening
- [ ] T067 [P] [US3] Configure SteamParticles with vertical motion path (vy = -100 to -200 px/s), slight horizontal wobble (vx = sin(time) * 20), white color with low opacity (0.3-0.6)
- [ ] T068 [P] [US3] Create `components/greetings/animations/pongal/SugarcaneSway.tsx` with SVG sugarcane stalks on left/right sides, gentle sway animation using GSAP rotation (rotateZ: -5deg ↔ 5deg) with sine.inOut easing
- [ ] T069 [P] [US3] Create `components/greetings/animations/pongal/RiceGrains.tsx` with small particle emitters for rice grains falling like rain throughout background, 30-50 particles, slow vertical fall (vy = 50-100 px/s)

### Pongal SVG Assets

- [ ] T070 [P] [US3] Create SVG asset `public/festivals/pongal/pot.svg`: traditional pongal pot shape with terracotta texture, decorative patterns
- [ ] T071 [P] [US3] Create SVG asset `public/festivals/pongal/kolam.svg`: sunburst/flower mandala kolam pattern with concentric circles, path data for drawing animation (validated for cultural authenticity)
- [ ] T072 [P] [US3] Create SVG asset `public/festivals/pongal/sugarcane.svg`: sugarcane stalk with leaves, suitable for sway animation
- [ ] T073 [P] [US3] Create SVG asset `public/festivals/pongal/sun.svg`: sun with expanding rays, suitable for rotation animation

### Pongal Template Integration

- [ ] T074 [US3] Refactor existing `components/greetings/PongalTemplate.tsx` to use new animation components
- [ ] T075 [US3] Create master GSAP timeline in PongalTemplate with phases: (0-2s) warm gradient background + sun rise, (2-4s) kolam drawing, (3-6s) pot appearance + boiling + steam, (5-6s) dramatic overflow moment, (4-10s) sugarcane sway + rice grains, (6-8s) text reveal "Happy Pongal", (8-10s) celebration loop
- [ ] T076 [US3] Implement warm gradient background: linear-gradient from orange (#FF8C00) to yellow (#FFEB3B) representing dawn, animate opacity from 0 to 1 over 0-2s
- [ ] T077 [US3] Integrate ContextAdapter in PongalTemplate for relationship-aware adjustments
- [ ] T078 [US3] Add prefers-reduced-motion support: all elements fade in instantly, no complex animations, kolam appears immediately
- [ ] T079 [US3] Wire onAnimationComplete callback to display ReplayButton after 8-10s
- [ ] T080 [US3] Implement text reveal: "Happy Pongal" appears with traditional font (6-7s), recipientName + senderName fade in (7-8s)
- [ ] T081 [US3] Add optional cattle silhouette walking animation across bottom (if specified in requirements)

**Checkpoint ✅**: Pongal animation is fully functional with cultural authenticity validated

---

## Phase 6: User Story 4 - Relationship Context Adaptation (Priority: P2)

**Goal**: Ensure animations adapt intensity, color, and tone based on recipient relationship (professional, family, friends, romantic)

**Independent Test**:
1. Create Diwali greetings for each relationship type: professional, family, friends, romantic
2. Verify professional relationship shows 30% intensity reduction (fewer particles, muted colors, faster speed 0.8x)
3. Confirm family relationship shows full intensity with traditional color palettes (1.0x speed)
4. Check friends relationship has maximum vibrancy and energy (1.1x speed, high particle intensity)
5. Verify romantic relationship has softer animations with pastel-tinted colors (1.2x speed, medium intensity)

**Duration**: Week 5 (Days 21-23)

### Context Adaptation Implementation

- [ ] T082 [P] [US4] Update `lib/animations/festival-themes.ts` with getRelationshipColorPalette() function returning color arrays per relationship: professional (muted), family (traditional), friends (vibrant saturation +20%), romantic (pastel tint)
- [ ] T083 [P] [US4] Implement particle intensity scaling in `lib/animations/particle-physics.ts`: professional (max 150 particles), family (max 300), friends (max 500), romantic (max 250)
- [ ] T084 [P] [US4] Update `lib/animations/timeline-factory.ts` to apply duration scaling: professional (0.8x speed), family (1.0x), friends (1.1x), romantic (1.2x slower for elegance)
- [ ] T085 [US4] Create `components/greetings/animations/shared/ContextAdapter.tsx` hook: useAnimationContext(relationshipContext) returns { colors, intensity, duration, tone }
- [ ] T086 [US4] Integrate ContextAdapter into DiwaliTemplate: consume context and pass to all animation subcomponents (FireworkSystem, SparkleParticles, etc.)
- [ ] T087 [US4] Integrate ContextAdapter into NewYearTemplate: apply to CountdownTimer, FireworkBurst, ConfettiSystem
- [ ] T088 [US4] Integrate ContextAdapter into PongalTemplate: apply to SunRise, KolamDrawing, PongalPot, SteamParticles
- [ ] T089 [US4] Test professional relationship: verify muted Diwali colors (#CC5628 instead of #FF6B35), reduced particle count (150 vs 300), faster timeline (0.8x)
- [ ] T090 [US4] Test romantic relationship: verify pastel New Year colors (light pink #FFB6E1 instead of #FF1493), softer confetti animation, slower timeline (1.2x)

**Checkpoint ✅**: All animations now respect relationship context for appropriate tone

---

## Phase 7: User Story 5 - Animation Preview in Creation Flow (Priority: P2)

**Goal**: Enable creators to preview full animation with play/pause/replay controls before finalizing greeting

**Independent Test**:
1. Navigate to template selection step in creation flow (`/create/template`)
2. Click on a festival template card
3. Observe animation auto-plays in preview mode
4. Click pause button → verify animation pauses at current frame
5. Click play button → verify animation resumes from pause point
6. Wait for animation to complete → verify replay button appears
7. Click replay → verify animation restarts from beginning

**Duration**: Week 5 (Days 24-25)

### Preview UI Components

- [ ] T091 [P] [US5] Create `components/ui/AnimationControls.tsx` with play button, pause button, replay button, progress bar (0-100%), current time display
- [ ] T092 [P] [US5] Implement play/pause toggle in AnimationControls using AnimationTemplateRef.play() and .pause() methods
- [ ] T093 [P] [US5] Add replay functionality in AnimationControls calling AnimationTemplateRef.replay() method
- [ ] T094 [P] [US5] Implement progress bar in AnimationControls: displays 0-100% based on currentTime / totalTime from AnimationTemplateState
- [ ] T095 [P] [US5] Add keyboard navigation support in AnimationControls: Space = play/pause, R = replay, Left/Right arrow = seek -1s/+1s

### Template Selection Integration

- [ ] T096 [US5] Update `app/create/template/page.tsx` to render TemplateSelector with animation preview capability
- [ ] T097 [US5] Update `components/forms/TemplateSelector.tsx` to display AnimationControls below each template preview
- [ ] T098 [US5] Wire AnimationTemplateRef from DiwaliTemplate/NewYearTemplate/PongalTemplate to AnimationControls in TemplateSelector
- [ ] T099 [US5] Implement keyboard shortcuts (Space = play/pause, R = replay) leveraging existing AnimationControls keyboard support from T095
- [ ] T100 [US5] Show replay button on animation complete: onAnimationComplete callback makes replay button visible
- [ ] T101 [US5] Test preview workflow: verify user can watch animation multiple times before finalizing greeting selection
- [ ] T102 [US5] Implement context-aware autoplay for greeting view page (`app/g/[id]/page.tsx`): (1) Desktop browsers: autoplay animation on page load using `useEffect` with viewport width check (>768px = desktop), (2) Mobile browsers: display "Tap to Play" overlay requiring user click to start animation. Device detection using `window.matchMedia('(min-width: 768px)')` or user-agent parsing. Honors FR-005a clarification.

**Checkpoint ✅**: Preview functionality complete in creation flow, autoplay respects device context

---

## Phase 8: User Story 6 - Reusable Fireworks Template (Priority: P2)

**Goal**: Create configurable, reusable Fireworks template that adapts to multiple celebration contexts (Diwali, New Year, or any festive occasion) through runtime color/timing configuration

**Independent Test**:
1. Create greeting with festivalType='fireworks'
2. Configure with Diwali colors (#FF6B35, #FFA500, #DC143C, #FFFFFF)
3. Verify fireworks launch and explode with configured colors
4. Reconfigure with New Year colors (#1E90FF, #FF1493, #FFD700, #32CD32, #9370DB, #C0C0C0)
5. Verify fireworks adapt to new color palette without code changes
6. Test with custom burst count (3 vs 7 fireworks) and duration (8s vs 12s)

**Duration**: Week 6 (Days 26-28)

### Fireworks Template Implementation

- [ ] T102 [P] [US6] Create `components/greetings/templates/FireworksTemplate.tsx` with configurable props: burstCount (5-7 default), particleCount (200-500), duration (8-12s), colorPalette
- [ ] T103 [P] [US6] Implement firework launch animation in FireworksTemplate: particles launch from bottom using GSAP MotionPath with bezier curves (control points at 30%, 70% height)
- [ ] T104 [P] [US6] Add 360-degree radial particle distribution on burst: particles spread in full circle using angle = (index / count) * 2π
- [ ] T105 [P] [US6] Implement configurable easing in FireworksTemplate: launch uses power2.out, burst uses power3.out, fall uses sine.in
- [ ] T106 [P] [US6] Add staggered burst timing: delay between fireworks = 0.15s * index for cascading effect
- [ ] T107 [P] [US6] Implement gravity simulation: particles fall with vy += gravity * dt, fade as they descend (alpha reduces linearly with vy)
- [ ] T108 [P] [US6] Add optional looped background fireworks: after main animation, small fireworks continue launching every 2s from random x positions
- [ ] T109 [US6] Create festival context presets in `lib/animations/festival-themes.ts`: FIREWORKS_DIWALI_CONFIG, FIREWORKS_NEWYEAR_CONFIG with pre-configured colors, burst counts, durations
- [ ] T110 [US6] Integrate FireworksTemplate with GreetingRenderer: route festivalType='fireworks' to FireworksTemplate component
- [ ] T111 [US6] Support text overlay in FireworksTemplate: recipientName, senderName, message appear at configurable timing (default 6-8s)
- [ ] T112 [US6] Add relationship context support in FireworksTemplate: apply ContextAdapter for intensity and color adjustments
- [ ] T113 [US6] Test Fireworks with Diwali context: verify orange/gold/red/white colors, 6 bursts, 8s duration
- [ ] T114 [US6] Test Fireworks with New Year context: verify blue/red/gold/green/purple/silver colors, 7 bursts, 10s duration

**Checkpoint ✅**: Fireworks template is reusable across multiple contexts

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, accessibility, browser compatibility, and documentation

**Duration**: Week 6 (Days 29-30)

### Performance Optimization

- [ ] T115 [P] Physical device testing on mid-range Android (Snapdragon 600+ chipset, e.g., Samsung Galaxy A52, Motorola Moto G series): Install production build on device, measure FPS during all festival animations using Chrome DevTools Performance tab via USB debugging. REQUIRED: Test Diwali (200-300 particles), New Year (500-650 particles), Pongal (50-80 particles) on real device (NOT emulator). Document FPS results in `specs/002-enhance-festival-animations/PERFORMANCE-TEST-RESULTS.md`. Honors Constitution Principle II (mobile-first performance) and Quality Gate 2 (mobile device validation).
- [ ] T116 [P] Implement quality degradation in `lib/animations/performance-monitor.ts`: if FPS drops below 45 for 2+ seconds, reduce particle count by 30%
- [ ] T117 [P] Add aggressive quality degradation: if FPS drops below 30 for 2+ seconds, reduce particle count by 50%, disable some visual effects (e.g., shadows, glows)
- [ ] T118 [P] Optimize Canvas rendering: use requestAnimationFrame for render loop, batch draw calls, minimize context state changes
- [ ] T119 [P] Optimize SVG assets: run SVGO on all SVG files in `public/festivals/` to minimize file sizes, inline small SVGs (<2KB) into components
- [ ] T120 [P] Implement lazy loading for animation assets: use next/dynamic for heavy components, load particle systems on demand

### Accessibility Implementation

- [ ] T121 [P] Validate prefers-reduced-motion support across all templates: Diwali, New Year, Pongal, Fireworks all render simple fade-in alternative when media query is true
- [ ] T122 [P] Ensure WCAG AA color contrast for all text: verify recipientName, senderName, message text against animated backgrounds using contrast checker (minimum 4.5:1 ratio)
- [ ] T123 [P] Add ARIA labels to AnimationControls: aria-label="Play animation", "Pause animation", "Replay animation" for screen reader support
- [ ] T124 [P] Implement keyboard navigation in AnimationControls: verify Tab navigation, Space for play/pause, Enter for replay, Escape to close
- [ ] T125 [P] Add focus indicators to all interactive elements: visible outline on AnimationControls buttons when focused

### Browser Compatibility & Testing

- [ ] T126 [P] Cross-browser testing on Chrome, Firefox, Safari (desktop and mobile): verify animations render correctly, no visual artifacts
- [ ] T127 [P] Test on iOS Safari: verify GSAP animations work correctly, Canvas rendering performs well, no memory leaks
- [ ] T128 [P] Test on Android Chrome: verify 60fps performance on mid-range devices (2021+ Snapdragon 600), particle systems render smoothly
- [ ] T129 [P] Test network throttling (3G): verify greeting page loads in <2 seconds, animations don't block page render, lazy loading works correctly

### Integration & Workflow Testing

- [ ] T130 End-to-end test: create Diwali greeting → select template → preview animation → finalize → share → view shared greeting (/g/[id]) → verify animation plays correctly
- [ ] T131 End-to-end test: create New Year greeting with professional relationship → verify muted colors and reduced intensity → share → confirm recipient sees adapted animation
- [ ] T132 End-to-end test: create Pongal greeting → verify kolam drawing is culturally authentic → share via WhatsApp → confirm preview link shows animation
- [ ] T133 Regression test: verify existing Christmas, Holi, Generic templates still work correctly after animation system changes
- [ ] T134 Test animation replay workflow: load greeting → watch animation → click replay → verify animation restarts smoothly without jank

### Documentation & Code Quality

- [ ] T135 [P] Add JSDoc comments to all animation classes and functions in `lib/animations/`: ParticleSystem, createAnimationTimeline, festival-themes functions
- [ ] T136 [P] Add inline comments explaining complex GSAP timeline sequencing in DiwaliTemplate, NewYearTemplate, PongalTemplate
- [ ] T137 [P] Create developer guide in `specs/002-enhance-festival-animations/DEVELOPER-GUIDE.md`: how to create new festival animation, ParticleSystem usage, timeline patterns
- [ ] T138 [P] Update `specs/002-enhance-festival-animations/quickstart.md` with final setup instructions, testing commands, performance validation steps
- [ ] T139 [P] Add performance budgets to documentation: max 500KB per template code+assets, max 500 particles, min 45fps on mid-range devices
- [ ] T140 [P] Run biome linter and fix all errors: `bun run lint` in repo root, fix any animation-related linting issues

### Cultural Review & Constitution Compliance

- [ ] T141 **Cultural Review Gate** (Constitution Principle III): Review all festival animations with cultural experts. REQUIRED: (1) Tamil speaker to validate Pongal kolam pattern (sunburst/flower mandala) for cultural authenticity, (2) Cultural expert to validate Diwali color symbolism (#FF6B35 orange = saffron/spirituality, #FFA500 gold = prosperity, #DC143C red = auspiciousness, #FFFFFF white = purity), (3) Cultural expert to validate Pongal color meanings (#FF8C00 orange = harvest warmth, #FFEB3B yellow = turmeric/prosperity, #D2691E terracotta = earthen pot tradition). Document review feedback in `specs/002-enhance-festival-animations/CULTURAL-REVIEW.md`. BLOCKER: Feature cannot be marked production-ready until this gate passes.

**Checkpoint ✅**: All polish tasks complete, cultural review gate passed, feature ready for production

---

## Dependencies & Parallel Execution

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3, 4, 5 (US1, US2, US3 - P1 stories)
                                       ↓
                                   Phase 6 (US4 - depends on US1, US2, US3)
                                       ↓
                                   Phase 7, 8 (US5, US6 - P2 stories)
                                       ↓
                                   Phase 9 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → Any P1 story (US1, US2, or US3) → Polish

**MVP Definition**: Complete Phase 1, 2, and at least ONE P1 story (typically US1: Diwali) for viable product

### Parallel Execution Opportunities

**Week 1-2 (After Foundation Complete)**:
- US1 (Diwali) components can be developed in parallel: T025-T032 all marked [P]
- SVG asset creation (T030-T032) can happen simultaneously with component development

**Week 3 (After US1 Complete)**:
- US2 (New Year) components can be developed in parallel: T040-T051 all marked [P]
- Independent of US1 development once foundation is ready

**Week 4 (After US2 Complete)**:
- US3 (Pongal) components can be developed in parallel: T059-T073 all marked [P]
- Independent of US1 and US2 development once foundation is ready

**Week 5**:
- US4 context adaptation tasks T082-T084 marked [P] (different files)
- US5 preview UI components T091-T095 marked [P]

**Week 6**:
- US6 Fireworks template tasks T102-T108 marked [P]
- Polish tasks T115-T129 marked [P] (testing, optimization, accessibility)

**Total Parallelizable Tasks**: 78 out of 140 tasks (55.7%) can run in parallel after dependencies are met

---

## Implementation Strategy

### MVP-First Approach

**Minimum Viable Product** = Phase 1 + Phase 2 + Phase 3 (US1: Diwali only)

This delivers:
- ✅ Complete animation infrastructure (particle system, GSAP config, performance monitoring)
- ✅ One fully functional festival animation (Diwali)
- ✅ Relationship context adaptation
- ✅ Prefers-reduced-motion support
- ✅ Replay functionality

**Estimated MVP Time**: 2 weeks (10 working days)

### Incremental Delivery Phases

1. **Week 1-2**: Foundation + Diwali (MVP) → Ship to production
2. **Week 3**: Add New Year → Ship to production (2 festivals live)
3. **Week 4**: Add Pongal → Ship to production (3 festivals live)
4. **Week 5-6**: Add US4, US5, US6 + Polish → Final release

### Testing Strategy

**Per User Story** (independent testing):
- Load greeting with specific festivalType
- Verify animation completes full sequence
- Check 60fps performance on real device
- Test prefers-reduced-motion fallback
- Verify replay functionality

**Integration Testing** (after all stories complete):
- Test creation flow end-to-end
- Test WhatsApp sharing with animation preview
- Cross-browser and cross-device validation
- Performance regression testing

---

## Summary

**Total Tasks**: 143 (3 new tasks added during analysis: T017 cultural color docs, T102 autoplay, T141 cultural review gate)
**Parallelizable Tasks**: 80 (55.9%)
**Estimated Duration**: 6 weeks (30 working days)

**Task Breakdown by User Story**:
- Setup (Phase 1): 4 tasks
- Foundation (Phase 2): 22 tasks (CRITICAL - blocks all user stories) - includes T017 cultural color symbolism documentation
- US1 (Diwali): 15 tasks
- US2 (New Year): 19 tasks
- US3 (Pongal): 23 tasks
- US4 (Context Adaptation): 9 tasks
- US5 (Preview): 12 tasks - includes T102 context-aware autoplay
- US6 (Fireworks): 13 tasks
- Polish (Phase 9): 27 tasks - includes T141 cultural review gate

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1) = 41 tasks (~29% of total) for viable Diwali animation

**Independent Testing**: Each user story (US1-US6) has clear test criteria and can be validated independently

**Parallel Opportunities**: After foundation (Phase 2), all three P1 festival animations (US1, US2, US3) can be developed simultaneously by different developers

**Performance Target**: 60fps on Snapdragon 600+ devices, <2MB page weight, <2s load on 4G

**Accessibility**: Full prefers-reduced-motion support, WCAG AA contrast, keyboard navigation

**Constitution Compliance**: All MUST principles honored (Solo Dev Simplicity, Mobile-First Performance, Cultural Authenticity, MVP-First Delivery, Privacy by Design)

---

**Document Status**: ✅ Complete | Ready for Phase 2 Implementation
**Next Steps**: Begin Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3 (US1: Diwali MVP)
