/**
 * Animation Utilities: Wysh Festival Greeting Platform
 *
 * Configuration and helpers for GSAP and Framer Motion animations
 */

import gsap from "gsap";
import type { RelationshipType } from "../types";
import { adjustAnimationDuration, getAnimationDelays } from "./context-engine";

// ============================================================================
// GSAP Configuration
// ============================================================================

/**
 * Configure GSAP defaults for optimal performance
 */
export function configureGSAP(): void {
  // Set default ease for smooth animations
  gsap.defaults({
    ease: "power2.out",
    duration: 0.8,
  });

  // Enable force3D for hardware acceleration
  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });
}

/**
 * Create GSAP timeline with relationship context
 *
 * @param relationshipType - Relationship type for timing adjustments
 * @returns Configured GSAP timeline
 */
export function createContextualTimeline(
  relationshipType: RelationshipType,
): gsap.core.Timeline {
  const delays = getAnimationDelays(relationshipType);

  return gsap.timeline({
    defaults: {
      ease: "power2.out",
    },
    delay: delays.initial / 1000, // Convert ms to seconds
  });
}

// ============================================================================
// Animation Presets
// ============================================================================

/**
 * Fade in animation preset
 */
export const fadeIn: gsap.TweenVars = {
  opacity: 1,
  duration: 0.8,
  ease: "power2.out",
};

/**
 * Fade out animation preset
 */
export const fadeOut: gsap.TweenVars = {
  opacity: 0,
  duration: 0.6,
  ease: "power2.in",
};

/**
 * Scale up animation preset
 */
export const scaleUp: gsap.TweenVars = {
  scale: 1,
  opacity: 1,
  duration: 0.8,
  ease: "back.out(1.7)",
};

/**
 * Slide in from bottom animation preset
 */
export const slideInBottom: gsap.TweenVars = {
  y: 0,
  opacity: 1,
  duration: 0.8,
  ease: "power3.out",
};

/**
 * Slide in from top animation preset
 */
export const slideInTop: gsap.TweenVars = {
  y: 0,
  opacity: 1,
  duration: 0.8,
  ease: "power3.out",
};

/**
 * Rotate animation preset
 */
export const rotate: gsap.TweenVars = {
  rotation: 360,
  duration: 1.5,
  ease: "power2.inOut",
};

/**
 * Bounce animation preset
 */
export const bounce: gsap.TweenVars = {
  y: -20,
  duration: 0.4,
  ease: "bounce.out",
  repeat: 2,
  yoyo: true,
};

// ============================================================================
// Festival-Specific Animation Configs
// ============================================================================

/**
 * Diwali animation configuration (sequential lighting)
 */
export const diwaliAnimationConfig = {
  type: "sequential" as const,
  staggerDelay: 0.2,
  duration: 8,
  elements: {
    diya: {
      appear: { scale: 0, opacity: 0 },
      light: { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      glow: { filter: "blur(8px)", duration: 0.3 },
    },
    rangoli: {
      draw: { strokeDashoffset: 0, duration: 2, ease: "power1.inOut" },
    },
    fireworks: {
      burst: { scale: 1.5, opacity: 0, duration: 0.8, ease: "power2.out" },
    },
  },
};

/**
 * Holi animation configuration (burst of colors)
 */
export const holiAnimationConfig = {
  type: "burst" as const,
  duration: 6,
  elements: {
    colorSplash: {
      initial: { scale: 0, opacity: 0 },
      burst: {
        scale: [1, 1.5, 1.2],
        opacity: [0, 1, 0.8],
        duration: 1,
        ease: "power2.out",
      },
    },
    colorPowder: {
      float: {
        y: [0, -100, -50],
        x: [0, 30, -20],
        rotation: [0, 180, 360],
        duration: 3,
        ease: "sine.inOut",
      },
    },
  },
};

/**
 * Christmas animation configuration (cascade effect)
 */
export const christmasAnimationConfig = {
  type: "cascade" as const,
  staggerDelay: 0.15,
  duration: 7,
  elements: {
    ornament: {
      hang: {
        y: [-50, 0],
        rotation: [-10, 0, 10, 0],
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      },
    },
    snowflake: {
      fall: {
        y: [0, 500],
        rotation: [0, 360],
        duration: 4,
        ease: "linear",
      },
    },
  },
};

/**
 * New Year animation configuration (celebration burst)
 */
export const newYearAnimationConfig = {
  type: "burst" as const,
  duration: 6,
  elements: {
    confetti: {
      burst: {
        y: [-100, 500],
        x: "random(-200, 200)",
        rotation: "random(0, 720)",
        scale: [1, 0.5],
        opacity: [1, 0],
        duration: 3,
        ease: "power2.out",
      },
    },
    fireworks: {
      explode: {
        scale: [0, 1.5],
        opacity: [1, 0],
        duration: 1.2,
        ease: "power2.out",
      },
    },
  },
};

/**
 * Pongal animation configuration (harvest theme)
 */
export const pongalAnimationConfig = {
  type: "sequential" as const,
  staggerDelay: 0.3,
  duration: 7,
  elements: {
    pot: {
      boil: {
        scale: [1, 1.05, 1],
        duration: 2,
        repeat: -1,
        ease: "sine.inOut",
      },
    },
    kolam: {
      draw: {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power1.inOut",
      },
    },
  },
};

// ============================================================================
// Framer Motion Variants
// ============================================================================

/**
 * Fade in variant for Framer Motion
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/**
 * Scale up variant for Framer Motion
 */
export const scaleUpVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
  },
};

/**
 * Slide up variant for Framer Motion
 */
export const slideUpVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Stagger children variant for Framer Motion
 */
export const staggerChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// ============================================================================
// Performance Optimizations
// ============================================================================

/**
 * Set will-change property for animation performance
 *
 * @param element - DOM element or selector
 * @param properties - CSS properties that will change
 */
export function optimizeForAnimation(
  element: HTMLElement | string,
  properties: string[] = ["transform", "opacity"],
): void {
  const el =
    typeof element === "string" ? document.querySelector(element) : element;

  if (el instanceof HTMLElement) {
    el.style.willChange = properties.join(", ");
  }
}

/**
 * Clear will-change property after animation
 *
 * @param element - DOM element or selector
 */
export function clearAnimationOptimization(
  element: HTMLElement | string,
): void {
  const el =
    typeof element === "string" ? document.querySelector(element) : element;

  if (el instanceof HTMLElement) {
    el.style.willChange = "auto";
  }
}

/**
 * Check if device supports hardware acceleration
 *
 * @returns True if hardware acceleration is supported
 */
export function supportsHardwareAcceleration(): boolean {
  if (typeof window === "undefined") return false;

  const test = document.createElement("div");
  test.style.transform = "translate3d(0, 0, 0)";
  const supported = test.style.transform !== "";
  // Clean up the test element
  if (test.parentNode) {
    test.parentNode.removeChild(test);
  }
  return supported;
}

// ============================================================================
// Animation State Management
// ============================================================================

/**
 * Animation state tracker
 */
export class AnimationState {
  private isPlaying = false;
  private timeline: gsap.core.Timeline | null = null;

  constructor(
    private readonly relationshipType: RelationshipType,
    private readonly baseDuration: number,
  ) {}

  /**
   * Start animation
   */
  play(timeline: gsap.core.Timeline): void {
    this.timeline = timeline;
    this.isPlaying = true;

    const duration = adjustAnimationDuration(
      this.baseDuration,
      this.relationshipType,
    );

    timeline.timeScale(this.baseDuration / duration);
    timeline.play();
  }

  /**
   * Pause animation
   */
  pause(): void {
    if (this.timeline) {
      this.timeline.pause();
      this.isPlaying = false;
    }
  }

  /**
   * Restart animation
   */
  restart(): void {
    if (this.timeline) {
      this.timeline.restart();
      this.isPlaying = true;
    }
  }

  /**
   * Check if animation is playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get current progress (0-1)
   */
  getProgress(): number {
    return this.timeline?.progress() || 0;
  }

  /**
   * Clean up animation
   */
  destroy(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    this.isPlaying = false;
  }
}

// ============================================================================
// Exports
// ============================================================================

export const animations = {
  configureGSAP,
  createTimeline: createContextualTimeline,
  presets: {
    fadeIn,
    fadeOut,
    scaleUp,
    slideInBottom,
    slideInTop,
    rotate,
    bounce,
  },
  festivals: {
    diwali: diwaliAnimationConfig,
    holi: holiAnimationConfig,
    christmas: christmasAnimationConfig,
    newyear: newYearAnimationConfig,
    pongal: pongalAnimationConfig,
  },
  framerMotion: {
    fadeIn: fadeInVariants,
    scaleUp: scaleUpVariants,
    slideUp: slideUpVariants,
    staggerChildren: staggerChildrenVariants,
  },
  optimize: optimizeForAnimation,
  clearOptimization: clearAnimationOptimization,
  supportsHardwareAcceleration,
};
