// Animation Entity Contracts
// TypeScript interface definitions for Phase 1 Design

/* ============================================================================
 * AnimationTemplate Component Props
 * ============================================================================
 */
```ts
export interface AnimationTemplateProps {
  // Identification
  festivalType: 'diwali' | 'newyear' | 'pongal' | 'fireworks';

  // Personalization
  recipientName: string;        // User-provided, max 50 chars, visible in animation
  senderName: string;           // User-provided, max 50 chars, visible in animation
  message?: string;             // Optional, user-provided, max 150 chars

  // Context & Configuration
  relationshipContext: RelationshipContext;
  colorPalette?: string[];      // Override default festival colors (hex values)
  particleIntensity?: 'low' | 'medium' | 'high';  // Device-aware scaling

  // Lifecycle Callbacks
  onAnimationComplete?: () => void;   // Called when animation finishes (8-12s)
  onAnimationStart?: () => void;      // Called when animation begins
  onError?: (error: Error) => void;   // Error handling for animation failures

  // Configuration
  duration?: number;            // Override duration (ms, default 8000-12000)
  autoPlay?: boolean;           // Start animation immediately (default true)
  playbackRate?: number;        // GSAP timeline playback rate (0.5-2.0, default 1.0)
}

export interface AnimationTemplateState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;             // 0-1 normalized progress
  currentTime: number;          // Current animation time (ms)
  totalTime: number;            // Total animation duration (ms)
}

export interface AnimationTemplateRef {
  play(): void;
  pause(): void;
  resume(): void;
  replay(): void;
  stop(): void;
  seek(time: number): void;
  getState(): AnimationTemplateState;
}

/* ============================================================================
 * ParticleSystem Class Contract
 * ============================================================================
 */

export interface ParticleSystemConfig {
  // Visual
  colors: string[];             // Hex color values for particles
  particleSize: number;         // Pixels, typical range 2-10
  opacity?: number;             // Initial opacity (0-1, default 1)

  // Physics
  gravity: number;              // Pixels/sec², typical range 100-500
  friction: number;             // Damping coefficient (0.9-0.99, default 0.95)
  velocityVariation?: number;   // Velocity randomization (0-1, default 0.2)

  // Performance
  maxParticles: number;         // Pooling limit, typical 200-500
  lifespan: number;             // Milliseconds, typical 1000-3000
  maxLifespan?: number;         // Override lifespan per-burst (ms)

  // Rendering
  blendMode?: 'source-over' | 'screen' | 'multiply' | 'overlay';
}

export interface ParticleEmitter {
  x: number;                    // Emitter X position (pixels)
  y: number;                    // Emitter Y position (pixels)
  burstCount: number;           // Particles per emission
  angleMin: number;             // Angle range (degrees, 0-360)
  angleMax: number;
  speedMin: number;             // Speed range (pixels/sec)
  speedMax: number;
  emit(): void;                 // Trigger emission
}

export interface BurstConfig {
  count: number;                // Number of particles to emit
  angle?: number | { min: number; max: number };  // Direction (degrees)
  speed?: number | { min: number; max: number };  // Initial speed (pixels/sec)
  life?: number;                // Particle lifespan (ms, overrides config.lifespan)
  size?: number | { min: number; max: number };   // Override particleSize
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  life: number;                 // Current lifespan (ms)
  maxLife: number;              // Total lifespan (ms)
  size: number;
  color: string;
  opacity: number;
  age: number;                  // Time elapsed (ms)
}

export class ParticleSystem {
  constructor(canvas: HTMLCanvasElement, config: ParticleSystemConfig);

  // Lifecycle
  start(): void;                // Enable rendering loop
  stop(): void;                 // Disable rendering loop
  reset(): void;                // Clear all particles

  // Emitter Control
  addEmitter(emitter: ParticleEmitter): void;
  removeEmitter(emitter: ParticleEmitter): void;
  emitBurst(x: number, y: number, count: number, config?: BurstConfig): void;
  emitStream(x: number, y: number, rate: number, duration: number): void;

  // Rendering & Updates
  update(deltaTime: number): void;        // Update particle state
  render(): void;                         // Draw particles to canvas

  // Query
  getParticleCount(): number;
  isFinished(): boolean;                  // All particles expired
  dispose(): void;                        // Cleanup resources
}

/* ============================================================================
 * AnimationTimeline Factory Contract
 * ============================================================================
 */

export interface AnimationTimelineConfig {
  duration: number;             // Total animation duration (ms)
  relationshipSpeed: number;    // Speed multiplier (0.8-1.2)
  colors: string[];             // Color palette for animation
  festival: 'diwali' | 'newyear' | 'pongal' | 'fireworks';
}

export interface TimelinePhase {
  name: string;                 // e.g., 'intro', 'main', 'outro'
  duration: number;             // Phase duration (ms)
  startTime: number;            // When phase starts in master timeline (ms)
  elements: HTMLElement[];      // DOM elements in this phase
  animations: gsap.core.Tween[];  // GSAP tweens for this phase
}

export interface AnimationTimelineAPI {
  timeline: gsap.core.Timeline;
  phases: TimelinePhase[];
  getPhase(name: string): TimelinePhase | undefined;
  addPhase(phase: TimelinePhase): void;
  play(): void;
  pause(): void;
  resume(): void;
  seek(time: number): void;
  reverse(): void;
  duration(): number;
  progress(): number;
}

export function createAnimationTimeline(
  festival: 'diwali' | 'newyear' | 'pongal' | 'fireworks',
  relationshipContext: RelationshipContext,
  elements: Record<string, HTMLElement>
): AnimationTimelineAPI;

/* ============================================================================
 * Relationship Context Adapter Contract
 * ============================================================================
 */

export interface RelationshipContext {
  type: 'professional' | 'family' | 'friends' | 'romantic';
  colorIntensity: 'muted' | 'normal' | 'vibrant';
  pacing: 'quick' | 'moderate' | 'slow';
  messageTone: 'formal' | 'casual' | 'playful' | 'intimate';
}

export interface AnimationContext {
  particleIntensity: 'low' | 'medium' | 'high';
  animationSpeed: number;       // Multiplier 0.8-1.2
  colorPalette: string[];       // Adjusted hex colors
  messageTone: 'formal' | 'casual' | 'playful' | 'intimate';
}

export function getAnimationContext(
  relationshipType: 'professional' | 'family' | 'friends' | 'romantic',
  festivalType: 'diwali' | 'newyear' | 'pongal'
): AnimationContext;

export function mapParticleIntensity(
  colorIntensity: 'muted' | 'normal' | 'vibrant'
): 'low' | 'medium' | 'high';

export function mapAnimationSpeed(
  pacing: 'quick' | 'moderate' | 'slow'
): number;

export function adjustColorPalette(
  basePalette: string[],
  relationshipType: 'professional' | 'family' | 'friends' | 'romantic'
): string[];

/* ============================================================================
 * ReducedMotionVariant Contract
 * ============================================================================
 */

export interface ReducedMotionConfig {
  prefersReducedMotion: boolean;  // Detected via media query
  staticFallback: boolean;        // Use static SVG instead of particles
  extendedDuration: boolean;      // Increase animation duration for readability
  minDuration: number;            // Minimum duration (ms, e.g., 5000)
}

export function detectPrefersReducedMotion(): boolean;

export function createReducedMotionTimeline(
  originalTimeline: gsap.core.Timeline,
  config: ReducedMotionConfig
): gsap.core.Timeline;

/* ============================================================================
 * WCAG AA Accessibility Contract
 * ============================================================================
 */

export interface AccessibilityConfig {
  minFontSize: number;          // Minimum 18px
  minContrastRatio: number;     // Minimum 4.5:1 (WCAG AA)
  noFlashingContent: boolean;   // <3 flashes/second
  keyboardNavigable: boolean;   // Tab, Enter, Space support
  screenReaderSupport: boolean; // ARIA labels
}

export function validateColorContrast(
  foreground: string,
  background: string
): { ratio: number; meetsWCAG_AA: boolean };

export function validateNoFlashing(timeline: gsap.core.Timeline): boolean;

export interface PlaybackControls {
  playButton: HTMLElement;
  pauseButton: HTMLElement;
  replayButton: HTMLElement;
  progressBar?: HTMLElement;
  timeDisplay?: HTMLElement;
}

/* ============================================================================
 * Integration Contracts
 * ============================================================================
 */

// GreetingRenderer receives these props
export interface GreetingRendererProps {
  festival: 'diwali' | 'newyear' | 'pongal' | 'fireworks';
  personalization: {
    recipientName: string;
    senderName: string;
    message?: string;
  };
  relationshipContext: RelationshipContext;
  onComplete?: () => void;
}

// Context Engine provides this
export function getRelationshipContext(
  relationshipType: string
): RelationshipContext;

// Constants provides this
export interface FestivalConfig {
  name: string;
  colors: string[];
  symbols: string[];
  animationStyle: 'sequential' | 'burst' | 'cascade' | 'generic';
  duration: number;  // ms
}

export const FESTIVALS: Record<string, FestivalConfig>;

// Performance Monitor provides this
export interface DeviceCapabilities {
  isMobile: boolean;
  hasGPU: boolean;
  cpuClass: 'low' | 'medium' | 'high';
  estimatedFPS: number;
}

export function getDeviceCapabilities(): DeviceCapabilities;
export function monitorFPS(callback: (fps: number) => void): () => void;
```