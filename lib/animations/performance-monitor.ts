/**
 * Performance Monitoring and Adaptive Quality System
 * Tracks FPS and adjusts animation quality for optimal performance
 */

export type DeviceCapability = "high" | "medium" | "low";

/**
 * FPS Monitor class
 */
export class FPSMonitor {
  private frames: number[] = [];
  private lastFrameTime: number = 0;
  private maxSamples: number = 60; // Track last 60 frames

  /**
   * Track a single frame
   */
  trackFrame(): void {
    const now = performance.now();
    if (this.lastFrameTime > 0) {
      const delta = now - this.lastFrameTime;
      const fps = 1000 / delta;
      this.frames.push(fps);

      // Keep only recent samples
      if (this.frames.length > this.maxSamples) {
        this.frames.shift();
      }
    }
    this.lastFrameTime = now;
  }

  /**
   * Get current FPS (last frame)
   */
  getCurrentFPS(): number {
    if (this.frames.length === 0) return 60;
    return Math.round(this.frames[this.frames.length - 1]);
  }

  /**
   * Get average FPS over all samples
   */
  getAverageFPS(): number {
    if (this.frames.length === 0) return 60;
    const sum = this.frames.reduce((acc, fps) => acc + fps, 0);
    return Math.round(sum / this.frames.length);
  }

  /**
   * Reset monitor
   */
  reset(): void {
    this.frames = [];
    this.lastFrameTime = 0;
  }
}

/**
 * Performance monitor with adaptive quality system
 */
export class PerformanceMonitor {
  private fpsMonitor: FPSMonitor;
  private lowFPSCount: number = 0;
  private veryLowFPSCount: number = 0;
  private qualityLevel: number = 1.0; // 1.0 = full quality, 0.5 = reduced 50%
  private onQualityChange?: (quality: number) => void;

  constructor(onQualityChange?: (quality: number) => void) {
    this.fpsMonitor = new FPSMonitor();
    this.onQualityChange = onQualityChange;
  }

  /**
   * Track frame and check for quality degradation
   */
  trackFrame(): void {
    this.fpsMonitor.trackFrame();
    this.checkQualityAdaptation();
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fpsMonitor.getCurrentFPS();
  }

  /**
   * Get average FPS
   */
  getAverageFPS(): number {
    return this.fpsMonitor.getAverageFPS();
  }

  /**
   * Get current quality level
   */
  getQualityLevel(): number {
    return this.qualityLevel;
  }

  /**
   * Reset monitor
   */
  reset(): void {
    this.fpsMonitor.reset();
    this.lowFPSCount = 0;
    this.veryLowFPSCount = 0;
    this.qualityLevel = 1.0;
  }

  /**
   * Check for adaptive quality adjustments
   */
  private checkQualityAdaptation(): void {
    const avgFPS = this.fpsMonitor.getAverageFPS();

    // Very low FPS (< 30) - aggressive quality reduction
    if (avgFPS < 30) {
      this.veryLowFPSCount++;

      // If low for 2 seconds (assuming 60fps target = 120 frames)
      if (this.veryLowFPSCount > 60 && this.qualityLevel > 0.5) {
        this.qualityLevel = 0.5; // Reduce to 50%
        this.onQualityChange?.(this.qualityLevel);
        console.warn(
          "Performance: Reducing quality to 50% due to very low FPS",
        );
      }
    } else {
      this.veryLowFPSCount = 0;
    }

    // Low FPS (< 45) - moderate quality reduction
    if (avgFPS < 45) {
      this.lowFPSCount++;

      // If low for 2 seconds
      if (this.lowFPSCount > 60 && this.qualityLevel > 0.7) {
        this.qualityLevel = 0.7; // Reduce to 70%
        this.onQualityChange?.(this.qualityLevel);
        console.warn("Performance: Reducing quality to 70% due to low FPS");
      }
    } else {
      this.lowFPSCount = 0;
    }
  }
}

/**
 * Detect device capability based on initial FPS baseline
 */
export function getDeviceCapability(): DeviceCapability {
  // Simple capability detection based on navigator properties
  if (typeof window === "undefined") return "medium";

  const memory =
    "memory" in performance
      ? (
          performance as typeof performance & {
            memory?: { jsHeapSizeLimit: number };
          }
        ).memory?.jsHeapSizeLimit
      : undefined;
  const cores = navigator.hardwareConcurrency || 2;

  // High-end: 8GB+ RAM equivalent, 6+ cores
  if (memory && memory > 8 * 1024 * 1024 * 1024 && cores >= 6) {
    return "high";
  }

  // Low-end: < 2GB RAM equivalent, 2 cores
  if (memory && memory < 2 * 1024 * 1024 * 1024 && cores <= 2) {
    return "low";
  }

  return "medium";
}

/**
 * Get particle count based on device capability and quality level
 */
export function getAdaptiveParticleCount(
  baseCount: number,
  capability: DeviceCapability,
  qualityLevel: number,
): number {
  let multiplier = 1.0;

  switch (capability) {
    case "high":
      multiplier = 1.0;
      break;
    case "medium":
      multiplier = 0.7;
      break;
    case "low":
      multiplier = 0.5;
      break;
  }

  return Math.floor(baseCount * multiplier * qualityLevel);
}
