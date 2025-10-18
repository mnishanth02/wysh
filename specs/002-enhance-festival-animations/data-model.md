# Phase 1 Data Model: Enhanced Festival Greeting Animations

**Date**: 2025-10-17 | **Branch**: `002-enhance-festival-animations` | **Prerequisite**: `research.md` | **Status**: Phase 1 Design

---

## Core Entities

### 1. AnimationTemplate

**Purpose**: Festival-specific animation component that orchestrates visual effects, particle systems, text rendering, and timeline coordination.

**Relationships**:

- Uses: ParticleSystem (may have 0-N particle emitters)
- Uses: AnimationTimeline (1 primary timeline with multiple phases)
- Uses: RelationshipContextAdapter (adapts based on recipient relationship)
- Uses: ReducedMotionVariant (prefers-reduced-motion fallback)

**Attributes**:

- `festivalType`: 'diwali' | 'newyear' | 'pongal' | 'fireworks' (enumerated, maps to FESTIVALS in lib/constants.ts)
- `recipientName`: string (user-provided, max 50 chars)
- `senderName`: string (user-provided, max 50 chars)
- `message`: string (optional, user-provided, max 150 chars)
- `relationshipContext`: RelationshipContext (professional/family/friends/romantic tone)
- `animationDuration`: number (milliseconds, 8000-12000 range)
- `particleIntensity`: 'low' | 'medium' | 'high' (device-aware scaling)
- `colorPalette`: string[] (hex colors, ordered by prominence, e.g., ['#FF9933', '#FFFFFF', '#138808'])

**Lifecycle**:

1. Mount: Initialize canvas/SVG elements, register event listeners
2. Play: Start GSAP timeline, emit particles if applicable
3. Pause: Pause timeline (if user clicks pause button)
4. Resume: Resume timeline from paused state
5. Replay: Reset timeline state, restart from beginning
6. Unmount: Clean up canvas, clear animations, remove listeners

**Examples**:

- DiwaliTemplate: Renders diyas (SVG), sparkles (canvas particles), rangoli (SVG path animation)
- NewYearTemplate: Renders countdown timer (SVG text), fireworks (canvas particles), confetti (canvas)
- PongalTemplate: Renders kolam (SVG path drawing), pot overflow (SVG + canvas particles), sun (SVG animation)

---

### 2. ParticleSystem

**Purpose**: Canvas-based particle renderer for effects like fireworks, confetti, sparkles. Handles physics simulation, collision detection (optional), and rendering.

**Composition**:

- Canvas element (2D context)
- ParticleEmitter instances (each emitter configured for specific burst pattern)
- Particle[] array (current active particles)

**Class Interface**:

```typescript
class ParticleSystem {
  // Lifecycle
  constructor(canvas: HTMLCanvasElement, config: ParticleSystemConfig);
  start(): void;                          // Enable rendering loop
  stop(): void;                           // Disable rendering loop
  reset(): void;                          // Clear all particles

  // Emitter control
  addEmitter(emitter: ParticleEmitter): void;
  emitBurst(x: number, y: number, count: number, config: BurstConfig): void;
  emitStream(x: number, y: number, rate: number, duration: number): void;

  // Rendering
  update(deltaTime: number): void;        // Update particle state (position, velocity, lifetime)
  render(): void;                         // Draw particles to canvas

  // Query
  getParticleCount(): number;
  isFinished(): boolean;                  // All particles expired
}
```

**Attributes**:

- `config.colors`: string[] (hex colors for particles)
- `config.particleSize`: number (pixels, typically 2-10)
- `config.gravity`: number (pixels/sec², typically 100-500)
- `config.friction`: number (damping, 0.9-0.99)
- `config.maxParticles`: number (pooling limit, typically 200-500)
- `config.lifespan`: number (milliseconds, typically 1000-3000)

**Physics Model**:

- Position update: `x += vx * dt, y += vy * dt`
- Velocity update: `vx += ax * dt, vy += (ay + gravity) * dt`
- Lifetime decay: `alpha = 1 - (age / lifespan)`
- Friction: `vx *= friction, vy *= friction`

**Performance Considerations**:

- Use object pooling (reuse particle objects instead of allocating)
- Limit particle count based on device (detected via performance monitor)
- Batch render calls (single `drawImage` per frame ideally, or use multiple contexts if needed)
- Offscreen canvas for pre-rendering complex shapes

---

### 3. AnimationTimeline

**Purpose**: Orchestrate multi-phase animation sequences using GSAP timelines. Manages timing relationships between SVG animations, text reveals, particle emissions, and relationship-aware pacing.

**Composition**:

- Master GSAP timeline (root timeline that orchestrates all phases)
- Phase timelines (Diwali: lighting → sparkles → rangoli; New Year: countdown → burst → confetti)
- Relationship-aware duration modifiers (professional: ×0.8 speed, romantic: ×1.2 duration)

**Timeline Creation Pattern**:

```typescript
function createAnimationTimeline(
  festival: FestivalType,
  relationshipContext: RelationshipContext
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: false });
  const durationScale = relationshipContext.animationSpeed;

  // Phase 1: Intro (text reveal, element appearance)
  tl.to(textElement, { duration: 1 * durationScale, opacity: 1 }, 0);
  tl.to(backgroundShape, { duration: 0.5 * durationScale, scale: 1 }, 0);

  // Phase 2: Main animation (festival-specific effects)
  // ...depends on festival type...

  // Phase 3: Outro (fade out, particle dissipation)
  tl.to(allElements, { duration: 0.5 * durationScale, opacity: 0 });

  return tl;
}
```

**Relationship-Aware Scaling**:

- `professional`: animationSpeed = 0.8 (faster, business-like), particleIntensity = 'low'
- `family`: animationSpeed = 1.0 (normal), particleIntensity = 'medium'
- `friends`: animationSpeed = 1.1 (upbeat), particleIntensity = 'high'
- `romantic`: animationSpeed = 1.2 (slower, sensual), particleIntensity = 'medium'

**Color Adaptation**:

- `professional`: Muted versions of festival colors (reduce saturation by 20%)
- `family`: Full saturation festival colors (traditional)
- `friends`: Bright boosted colors (increase brightness by 15%)
- `romantic`: Warm color shift (increase red/orange, decrease blue)

---

### 4. RelationshipContextAdapter

**Purpose**: Adapt animation parameters (speed, intensity, colors, tone) based on recipient relationship type. Bridge between existing `lib/context-engine.ts` and new animation requirements.

**Function Interface**:

```typescript
interface AnimationContext {
  particleIntensity: 'low' | 'medium' | 'high';
  animationSpeed: number;  // 0.8-1.2 multiplier
  colorPalette: string[];  // Adjusted hex colors
  messageTone: 'formal' | 'casual' | 'playful' | 'intimate';
}

function getAnimationContext(relationshipType: string): AnimationContext {
  const baseContext = getRelationshipContext(relationshipType); // Reuse existing function
  return {
    particleIntensity: mapToIntensity(baseContext.colorIntensity),
    animationSpeed: mapToSpeed(baseContext.pacing),
    colorPalette: adjustColorPalette(FESTIVALS[festival].colors, relationshipType),
    messageTone: baseContext.messageTone
  };
}
```

**Mapping Logic**:

- `colorIntensity` → `particleIntensity`: 'muted' → 'low', 'normal' → 'medium', 'vibrant' → 'high'
- `pacing` → `animationSpeed`: 'quick' → 0.8, 'moderate' → 1.0, 'slow' → 1.2
- `messageTone` → `tone`: Reuse directly (formal/casual/playful/intimate)

**Integration Points**:

- Called by each festival template during initialization: `const context = getAnimationContext(relationshipType)`
- Passed to AnimationTimeline creator: `createAnimationTimeline(festival, context)`
- Passed to ParticleSystem config: `particleIntensity` determines maxParticles scaling

---

### 5. ReducedMotionVariant

**Purpose**: Provide accessible animation alternative respecting `prefers-reduced-motion` media query. Replace particle systems with static animations, reduce motion intensity, extend durations for readability.

**Implementation**:

- Detect: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Fallback: Render static SVG shapes without particle effects
- Timeline changes: Remove particle emissions, reduce scale/translate animations, increase opacity/fade durations

**Example (Diwali without motion)**:

```typescript
if (prefersReducedMotion) {
  // Static diyas visible immediately (no animation)
  diyas.forEach(diya => diya.style.opacity = '1');

  // Fade in text only (no scaling/motion)
  gsap.to(textElement, { duration: 2, opacity: 1 });

  // No sparkles/particle system
  // Replace with static radial gradients or simple color fills

  tl.duration = 5;  // Extend for readability
}
```

**WCAG AA Requirements**:

- All text readable (18pt minimum, WCAG AA color contrast)
- Functionality preserved (play/pause/replay buttons accessible)
- No flashing (>3 flashes/second)
- Keyboard navigation supported

---

## Component Integration Points

### With existing Wysh components

1. **GreetingRenderer.tsx** (master routing):

1. **GreetingRenderer.tsx** (master routing):
   - Receives: festival type, personalization data (names, message), relationshipContext
   - Routes to appropriate template: `<DiwaliTemplate /> | <NewYearTemplate /> | <PongalTemplate />`
   - Listens: `onAnimationComplete` callback to show ReplayButton, ShareButton

1. **lib/context-engine.ts** (relationship mapping):
   - Provides: `getRelationshipContext(relationshipType)` → base context data
   - Used by: `RelationshipContextAdapter.getAnimationContext()` for animation-specific parameters

1. **lib/constants.ts** (festival data):
   - Current: Festival names, dates, culturally significant symbols
   - Extend with: Animation-specific fields (symbols used in animations, color palettes with relationship variants)

1. **lib/performance.ts** (performance monitoring):
   - Provides: Device detection (mobile/tablet/desktop, GPU capability)
   - Provides: FPS monitoring utility
   - Used by: ParticleSystem to scale maxParticles, AnimationTemplate to degrade quality

---

## Data Flow Diagram

```text
User Input (Festival, Names, Message, Relationship)
           ↓
    GreetingRenderer
           ↓
    Festival Template (e.g., DiwaliTemplate)
    ├─ getAnimationContext(relationshipType) ← RelationshipContextAdapter
    ├─ createAnimationTimeline(festival, context) ← AnimationTimeline
    ├─ new ParticleSystem(canvas, config) ← ParticleSystem
    └─ Render SVG/Canvas elements
           ↓
    [Animation plays 8-12 seconds]
           ↓
    onAnimationComplete() callback
           ↓
    Show ReplayButton, ShareButton
```

---

## Success Criteria for Data Model

- ✅ All 5 entities mapped to specification requirements
- ✅ Component interfaces match existing Wysh patterns (context-engine, constants, performance)
- ✅ RelationshipContextAdapter reduces code duplication (reuses existing context-engine)
- ✅ ParticleSystem class pools objects for 60fps performance
- ✅ ReducedMotionVariant respects accessibility standard (WCAG AA)
- ✅ Data model supports all 6 user stories and 74 functional requirements
- ✅ No breaking changes to existing Wysh codebase

---

## Next Steps (Phase 1 Continuation)

1. **contracts/**: Generate TypeScript interfaces for each entity
2. **quickstart.md**: Developer setup guide with entity usage examples
3. **Re-validate Constitution**: Ensure all 5 principles align with data model design

**Status**: Data Model Complete ✅ | Ready for contracts generation
