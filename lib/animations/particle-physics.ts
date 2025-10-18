/**
 * Particle Physics Engine
 * Handles particle simulation, physics calculations, and rendering
 */

import type {
  BurstConfig,
  Particle,
  ParticleSystemConfig,
} from "@/types/particle.types";

/**
 * Individual Particle class
 */
export class ParticleInstance implements Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  ax: number = 0;
  ay: number = 0;
  life: number = 0;
  maxLife: number = 1000;
  size: number = 4;
  color: string = "#FFFFFF";
  opacity: number = 1;
  age: number = 0;
  active: boolean = false;

  /**
   * Initialize particle with burst configuration
   */
  init(
    x: number,
    y: number,
    angle: number,
    speed: number,
    life: number,
    size: number,
    color: string,
  ): void {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.ax = 0;
    this.ay = 0;
    this.life = life;
    this.maxLife = life;
    this.age = 0;
    this.size = size;
    this.color = color;
    this.opacity = 1;
    this.active = true;
  }

  /**
   * Reset particle to pool
   */
  reset(): void {
    this.active = false;
    this.age = 0;
    this.opacity = 0;
  }
}

/**
 * ParticleSystem class
 * Manages particle pool, physics simulation, and canvas rendering
 */
export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: ParticleSystemConfig;
  private particles: ParticleInstance[] = [];
  private particlePool: ParticleInstance[] = [];
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement, config: ParticleSystemConfig) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.ctx = ctx;
    this.config = {
      ...config,
      opacity: config.opacity ?? 1,
      friction: config.friction ?? 0.95,
      velocityVariation: config.velocityVariation ?? 0.2,
      blendMode: config.blendMode ?? "source-over",
    };

    // Initialize particle pool
    for (let i = 0; i < this.config.maxParticles; i++) {
      this.particlePool.push(new ParticleInstance());
    }
  }

  /**
   * Start rendering loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.renderLoop();
  }

  /**
   * Stop rendering loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Clear all particles
   */
  reset(): void {
    for (const p of this.particles) {
      p.reset();
    }
    this.particles = [];
  }

  /**
   * Get canvas dimensions
   * @returns Object with width and height of the canvas
   */
  getCanvasDimensions(): { width: number; height: number } {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  /**
   * Emit burst of particles
   */
  emitBurst(x: number, y: number, burstConfig: BurstConfig): void {
    const count = Math.min(
      burstConfig.count,
      this.config.maxParticles - this.particles.length,
    );
    const colors = burstConfig.colors ?? this.config.colors;

    for (let i = 0; i < count; i++) {
      const particle = this.getParticleFromPool();
      if (!particle) break;

      // Calculate angle
      let angle: number;
      if (typeof burstConfig.angle === "number") {
        angle = burstConfig.angle;
      } else if (burstConfig.angle) {
        const { min, max } = burstConfig.angle;
        angle = min + Math.random() * (max - min);
      } else {
        // Default: 360-degree radial distribution
        angle = (i / count) * Math.PI * 2;
      }

      // Calculate speed
      let speed: number;
      if (typeof burstConfig.speed === "number") {
        speed = burstConfig.speed;
      } else if (burstConfig.speed) {
        const { min, max } = burstConfig.speed;
        speed = min + Math.random() * (max - min);
      } else {
        speed = 100 + Math.random() * 100; // Default 100-200 px/s
      }

      // Apply velocity variation
      if (this.config.velocityVariation) {
        const variation =
          1 + (Math.random() - 0.5) * this.config.velocityVariation;
        speed *= variation;
      }

      // Calculate size
      let size: number;
      if (typeof burstConfig.size === "number") {
        size = burstConfig.size;
      } else if (burstConfig.size) {
        const { min, max } = burstConfig.size;
        size = min + Math.random() * (max - min);
      } else {
        size = this.config.particleSize;
      }

      // Calculate life
      const life = burstConfig.life ?? this.config.lifespan;

      // Random color from palette
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.init(x, y, angle, speed, life, size, color);
      this.particles.push(particle);
    }
  }

  /**
   * Emit continuous stream of particles
   */
  emitStream(x: number, y: number, rate: number, duration: number): void {
    const interval = 1000 / rate; // ms between emissions
    const endTime = Date.now() + duration;
    let lastEmit = Date.now();

    const streamInterval = setInterval(() => {
      const now = Date.now();
      if (now >= endTime) {
        clearInterval(streamInterval);
        return;
      }

      if (now - lastEmit >= interval) {
        this.emitBurst(x, y, {
          count: 1,
          angle: { min: -Math.PI / 6, max: Math.PI / 6 },
          speed: { min: 50, max: 150 },
        });
        lastEmit = now;
      }
    }, interval);
  }

  /**
   * Update particle physics
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000; // Convert to seconds

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update age
      p.age += deltaTime;

      // Check if particle expired
      if (p.age >= p.maxLife) {
        this.returnParticleToPool(p);
        this.particles.splice(i, 1);
        continue;
      }

      // Apply gravity
      p.vy += this.config.gravity * dt;

      // Apply friction
      p.vx *= this.config.friction;
      p.vy *= this.config.friction;

      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Update opacity (fade out based on age)
      p.opacity = 1 - p.age / p.maxLife;
    }
  }

  /**
   * Render particles to canvas (T118: Optimized with batching)
   */
  render(): void {
    const { ctx } = this;
    const globalOpacity = this.config.opacity ?? 1;

    // Set blend mode once (minimize context state changes)
    ctx.globalCompositeOperation = this.config.blendMode ?? "source-over";

    // Batch particles by color to minimize fillStyle changes
    const particlesByColor = new Map<string, ParticleInstance[]>();

    for (const p of this.particles) {
      const color = p.color;
      if (!particlesByColor.has(color)) {
        particlesByColor.set(color, []);
      }
      const colorGroup = particlesByColor.get(color);
      if (colorGroup) {
        colorGroup.push(p);
      }
    }

    // Render particles grouped by color
    for (const [color, particles] of particlesByColor) {
      ctx.fillStyle = color;

      // Batch draw particles with same color
      for (const p of particles) {
        ctx.globalAlpha = p.opacity * globalOpacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Reset global alpha once at end
    ctx.globalAlpha = 1;
  }

  /**
   * Get current particle count
   */
  getParticleCount(): number {
    return this.particles.length;
  }

  /**
   * Check if all particles expired
   */
  isFinished(): boolean {
    return this.particles.length === 0;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();
    this.reset();
    this.particlePool = [];
  }

  /**
   * Rendering loop
   */
  private renderLoop = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and render
    this.update(deltaTime);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  };

  /**
   * Get particle from pool
   */
  private getParticleFromPool(): ParticleInstance | null {
    return this.particlePool.pop() ?? null;
  }

  /**
   * Return particle to pool
   */
  private returnParticleToPool(particle: ParticleInstance): void {
    particle.reset();
    this.particlePool.push(particle);
  }
}

/**
 * Get particle intensity scaling based on relationship context (T083)
 * Professional: max 150 particles (conservative)
 * Family: max 300 particles (traditional/moderate)
 * Friends: max 500 particles (high energy)
 * Romantic: max 250 particles (elegant/refined)
 */
export function getParticleIntensityScale(relationshipType: string): {
  maxParticles: number;
  scale: number;
} {
  switch (relationshipType) {
    case "boss":
    case "colleague":
    case "client":
    case "mentor":
      return { maxParticles: 150, scale: 0.5 }; // Professional - 50% intensity

    case "parents":
    case "children":
    case "relatives":
      return { maxParticles: 300, scale: 1.0 }; // Family - 100% traditional

    case "friend":
    case "best_friend":
    case "neighbor":
    case "siblings":
      return { maxParticles: 500, scale: 1.5 }; // Friends - 150% energy

    case "partner":
    case "spouse":
    case "fiance":
    case "crush":
      return { maxParticles: 250, scale: 0.8 }; // Romantic - 80% elegant

    default:
      return { maxParticles: 300, scale: 1.0 }; // Default to family
  }
}
