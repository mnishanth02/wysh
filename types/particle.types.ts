/**
 * Particle System Type Definitions
 * Enhanced Festival Greeting Animations
 */

export interface ParticleSystemConfig {
  // Visual
  colors: string[]; // Hex color values for particles
  particleSize: number; // Pixels, typical range 2-10
  opacity?: number; // Initial opacity (0-1, default 1)

  // Physics
  gravity: number; // Pixels/sec², typical range 100-500
  friction: number; // Damping coefficient (0.9-0.99, default 0.95)
  velocityVariation?: number; // Velocity randomization (0-1, default 0.2)

  // Performance
  maxParticles: number; // Pooling limit, typical 200-500
  lifespan: number; // Milliseconds, typical 1000-3000
  maxLifespan?: number; // Override lifespan per-burst (ms)

  // Rendering
  blendMode?: "source-over" | "screen" | "multiply" | "overlay";
}

export interface ParticleEmitter {
  x: number; // Emitter X position (pixels)
  y: number; // Emitter Y position (pixels)
  burstCount: number; // Particles per emission
  angleMin: number; // Angle range (degrees, 0-360)
  angleMax: number;
  speedMin: number; // Speed range (pixels/sec)
  speedMax: number;
  emit(): void; // Trigger emission
}

export interface BurstConfig {
  count: number; // Number of particles to emit
  angle?: number | { min: number; max: number }; // Direction (degrees)
  speed?: number | { min: number; max: number }; // Initial speed (pixels/sec)
  life?: number; // Particle lifespan (ms, overrides config.lifespan)
  size?: number | { min: number; max: number }; // Override particleSize
  colors?: string[]; // Override default colors for this burst
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  life: number; // Current lifespan (ms)
  maxLife: number; // Total lifespan (ms)
  size: number;
  color: string;
  opacity: number;
  age: number; // Time elapsed (ms)
  active: boolean; // Is particle alive?
}

export interface ParticlePhysicsOptions {
  gravity?: number;
  friction?: number;
  velocityVariation?: number;
  windSpeed?: number; // Horizontal wind force (pixels/sec)
}
