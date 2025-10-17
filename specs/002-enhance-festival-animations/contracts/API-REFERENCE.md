# Animation Contracts & API Reference

**Date**: 2025-10-17 | **Branch**: `002-enhance-festival-animations` | **Purpose**: Developer API documentation for Phase 2 implementation

---

## Component Props: AnimationTemplate

Festival-specific template components receive these props to configure animation behavior:

```typescript
interface AnimationTemplateProps {
  // Identification
  festivalType: 'diwali' | 'newyear' | 'pongal' | 'fireworks';

  // Personalization
  recipientName: string;        // User-provided, max 50 chars
  senderName: string;           // User-provided, max 50 chars
  message?: string;             // Optional, max 150 chars

  // Context & Configuration
  relationshipContext: RelationshipContext;
  colorPalette?: string[];      // Override default colors
  particleIntensity?: 'low' | 'medium' | 'high';

  // Lifecycle Callbacks
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  onError?: (error: Error) => void;

  // Tuning
  duration?: number;            // ms, range 8000-12000
  autoPlay?: boolean;           // Start immediately (default true)
  playbackRate?: number;        // Speed multiplier (0.5-2.0)
}

interface AnimationTemplateState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;             // 0-1
  currentTime: number;          // ms
  totalTime: number;            // ms
}

interface AnimationTemplateRef {
  play(): void;
  pause(): void;
  resume(): void;
  replay(): void;
  stop(): void;
  seek(time: number): void;
  getState(): AnimationTemplateState;
}
```

**Example Usage** (DiwaliTemplate.tsx):

```typescript
<DiwaliTemplate
  recipientName="Priya"
  senderName="Rahul"
  message="Happy Diwali!"
  relationshipContext={{
    type: 'romantic',
    colorIntensity: 'vibrant',
    pacing: 'slow',
    messageTone: 'intimate'
  }}
  onAnimationComplete={() => showShareButton()}
  autoPlay={true}
/>
```

---

## ParticleSystem Class Contract

Canvas-based particle renderer for effects (fireworks, confetti, sparkles):

```typescript
interface ParticleSystemConfig {
  // Visual
  colors: string[];             // Hex values
  particleSize: number;         // Pixels (2-10)
  opacity?: number;             // 0-1 (default 1)

  // Physics
  gravity: number;              // Pixels/sec² (100-500)
  friction: number;             // Damping (0.9-0.99)
  velocityVariation?: number;   // 0-1 (default 0.2)

  // Performance
  maxParticles: number;         // Pool size (200-500)
  lifespan: number;             // Milliseconds (1000-3000)

  // Rendering
  blendMode?: 'source-over' | 'screen' | 'multiply' | 'overlay';
}

interface BurstConfig {
  count: number;
  angle?: number | { min: number; max: number };
  speed?: number | { min: number; max: number };
  life?: number;
  size?: number | { min: number; max: number };
}

class ParticleSystem {
  constructor(canvas: HTMLCanvasElement, config: ParticleSystemConfig);

  // Lifecycle
  start(): void;                // Enable rendering
  stop(): void;                 // Disable rendering
  reset(): void;                // Clear particles

  // Emissions
  emitBurst(x: number, y: number, count: number, config?: BurstConfig): void;
  emitStream(x: number, y: number, rate: number, duration: number): void;

  // Updates
  update(deltaTime: number): void;
  render(): void;

  // Query
  getParticleCount(): number;
  isFinished(): boolean;
  dispose(): void;
}
```

**Example Usage** (FireworkSystem.tsx):

```typescript
const particleSystem = new ParticleSystem(canvasRef.current, {
  colors: ['#FF9933', '#FFFFFF', '#138808'],
  particleSize: 4,
  gravity: 200,
  friction: 0.95,
  maxParticles: 500,
  lifespan: 2000,
  blendMode: 'screen'
});

particleSystem.start();

// Emit firework burst
particleSystem.emitBurst(canvasWidth / 2, canvasHeight / 2, 200, {
  angle: { min: 0, max: 360 },
  speed: { min: 100, max: 400 },
  life: 2000
});

// After animation:
particleSystem.stop();
particleSystem.dispose();
```

---

## AnimationTimeline Factory Contract

Orchestrate multi-phase animation sequences using GSAP:

```typescript
interface AnimationTimelineConfig {
  duration: number;             // Total ms
  relationshipSpeed: number;    // Multiplier 0.8-1.2
  colors: string[];
  festival: 'diwali' | 'newyear' | 'pongal' | 'fireworks';
}

interface TimelinePhase {
  name: string;                 // 'intro', 'main', 'outro'
  duration: number;             // ms
  startTime: number;            // ms from start
  elements: HTMLElement[];
  animations: gsap.core.Tween[];
}

interface AnimationTimelineAPI {
  timeline: gsap.core.Timeline;
  phases: TimelinePhase[];
  getPhase(name: string): TimelinePhase | undefined;
  addPhase(phase: TimelinePhase): void;

  // Playback
  play(): void;
  pause(): void;
  resume(): void;
  seek(time: number): void;
  reverse(): void;

  // Query
  duration(): number;
  progress(): number;
}

function createAnimationTimeline(
  festival: 'diwali' | 'newyear' | 'pongal' | 'fireworks',
  relationshipContext: RelationshipContext,
  elements: Record<string, HTMLElement>
): AnimationTimelineAPI;
```

**Example Usage** (DiwaliTemplate.tsx):

```typescript
const elements = {
  diyas: diasRef.current,
  rangoli: rangoliRef.current,
  sparkles: particleCanvas.current,
  text: textRef.current
};

const timeline = createAnimationTimeline('diwali', relationshipContext, elements);

// Timeline automatically:
// 1. Fades in text (0-1s)
// 2. Lights diyas (1-5s)
// 3. Draws rangoli (2-6s)
// 4. Emits sparkles (3-8s)
// 5. Fades out (8-10s)

timeline.play();

setTimeout(() => {
  onAnimationComplete();  // After 10s
  timeline.dispose();
}, 10000);
```

---

## Relationship Context Adapter Contract

Map relationship types to animation parameters:

```typescript
interface RelationshipContext {
  type: 'professional' | 'family' | 'friends' | 'romantic';
  colorIntensity: 'muted' | 'normal' | 'vibrant';
  pacing: 'quick' | 'moderate' | 'slow';
  messageTone: 'formal' | 'casual' | 'playful' | 'intimate';
}

interface AnimationContext {
  particleIntensity: 'low' | 'medium' | 'high';
  animationSpeed: number;       // 0.8-1.2
  colorPalette: string[];
  messageTone: 'formal' | 'casual' | 'playful' | 'intimate';
}

function getAnimationContext(
  relationshipType: 'professional' | 'family' | 'friends' | 'romantic',
  festivalType: 'diwali' | 'newyear' | 'pongal'
): AnimationContext;
```

**Mapping Reference**:

| Relationship | particleIntensity | animationSpeed | Tone | Colors |
|--------------|-------------------|----------------|------|--------|
| professional | low | 0.8x | formal | Muted |
| family | medium | 1.0x | casual | Full saturation |
| friends | high | 1.1x | playful | Bright boosted |
| romantic | medium | 1.2x | intimate | Warm shift |

**Example Usage** (DiwaliTemplate.tsx):

```typescript
const animationContext = getAnimationContext('romantic', 'diwali');

// Returns:
// {
//   particleIntensity: 'medium',
//   animationSpeed: 1.2,
//   colorPalette: ['#FF6B35', '#FFD700', '#90EE90'],  // Warm colors
//   messageTone: 'intimate'
// }

const particleSystem = new ParticleSystem(canvas, {
  colors: animationContext.colorPalette,
  maxParticles: particleIntensity === 'medium' ? 300 : 200,
  // ...
});

const timeline = createAnimationTimeline('diwali', {
  ...relationshipContext,
  animationSpeed: animationContext.animationSpeed
}, elements);
```

---

## ReducedMotionVariant Contract

Accessible animation alternatives for `prefers-reduced-motion`:

```typescript
interface ReducedMotionConfig {
  prefersReducedMotion: boolean;
  staticFallback: boolean;
  extendedDuration: boolean;
  minDuration: number;          // ms
}

function detectPrefersReducedMotion(): boolean;

function createReducedMotionTimeline(
  originalTimeline: gsap.core.Timeline,
  config: ReducedMotionConfig
): gsap.core.Timeline;
```

**Implementation Strategy**:

If `prefersReducedMotion`:

1. Hide particle systems (replace with static gradients)
2. Remove scale/translate animations (keep opacity/fade)
3. Increase duration (minimum 5000ms for readability)
4. Keep text reveal and overlay static elements
5. Preserve all functionality (play/pause/replay)

**Example Usage** (AnimationTemplate.tsx):

```typescript
const prefersReducedMotion = detectPrefersReducedMotion();

let timeline = createAnimationTimeline('diwali', relationshipContext, elements);

if (prefersReducedMotion) {
  timeline = createReducedMotionTimeline(timeline, {
    prefersReducedMotion: true,
    staticFallback: true,
    extendedDuration: true,
    minDuration: 5000
  });
}

timeline.play();
```

---

## WCAG AA Accessibility Requirements

All components must meet these standards:

1. **Color Contrast**: Minimum 4.5:1 (text vs background)
2. **Font Size**: Minimum 18px for all text
3. **No Flashing**: <3 flashes/second (prevents seizures)
4. **Keyboard Navigation**: Tab, Enter, Space support for all controls
5. **Screen Reader Support**: ARIA labels on interactive elements

**Validation Functions**:

```typescript
function validateColorContrast(
  foreground: string,
  background: string
): { ratio: number; meetsWCAG_AA: boolean };

function validateNoFlashing(timeline: gsap.core.Timeline): boolean;

interface PlaybackControls {
  playButton: HTMLElement;      // aria-label="Play animation"
  pauseButton: HTMLElement;     // aria-label="Pause animation"
  replayButton: HTMLElement;    // aria-label="Replay animation"
  progressBar?: HTMLElement;    // aria-label="Animation progress"
  timeDisplay?: HTMLElement;    // aria-live="polite"
}
```

---

## Integration Points

### 1. GreetingRenderer.tsx (Master Router)

**Provides to AnimationTemplate**:

- festival type
- personalization data (names, message)
- relationshipContext

**Receives from AnimationTemplate**:

- onAnimationComplete callback
- Error notifications

### 2. lib/context-engine.ts (Context Mapping)

**Current Function** (reuse):

```typescript
getRelationshipContext(relationshipType: string): RelationshipContext
```

**Used by**: `getAnimationContext()` wrapper

### 3. lib/constants.ts (Festival Data)

**Current**: `FESTIVALS` object with names, dates, symbols

**Extend with**:

- Animation durations
- Color palettes per festival
- Symbol definitions for animation

### 4. lib/performance.ts (Device Detection)

**Provides**:

```typescript
getDeviceCapabilities(): {
  isMobile: boolean;
  hasGPU: boolean;
  cpuClass: 'low' | 'medium' | 'high';
  estimatedFPS: number;
}

monitorFPS(callback: (fps: number) => void): () => void;
```

**Used by**: ParticleSystem (scale maxParticles), AnimationTemplate (quality degradation)

---

## Status: Contracts Complete ✅

All 5 core entities have API contracts documented.

**Next Steps**:

1. Implement `contracts/animation.contracts.ts` (actual TypeScript definitions in `types/`)
2. Create `quickstart.md` with usage examples
3. Generate `tasks.md` for Phase 2 implementation
