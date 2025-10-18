/**
 * GSAP Configuration and Plugin Registration
 * Enhanced Festival Greeting Animations
 */

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register core plugins
gsap.registerPlugin(MotionPathPlugin);

/**
 * DrawSVG plugin detection and fallback configuration
 * DrawSVG is a premium GSAP plugin - we'll use strokeDasharray fallback if unavailable
 */
export interface GSAPPluginConfig {
  useDrawSVG: boolean;
}

let drawSVGAvailable = false;

/**
 * Register GSAP plugins and detect DrawSVG availability
 */
export async function registerGSAPPlugins(): Promise<GSAPPluginConfig> {
  try {
    // Try to import DrawSVG if available (premium plugin)
    const { DrawSVGPlugin } = await import("gsap/DrawSVGPlugin");
    if (DrawSVGPlugin) {
      gsap.registerPlugin(DrawSVGPlugin);
      drawSVGAvailable = true;
      console.log("✓ GSAP DrawSVG plugin registered");
      return { useDrawSVG: true };
    }
  } catch {
    console.warn("DrawSVG plugin unavailable, using strokeDasharray fallback");
  }

  return { useDrawSVG: false };
}

/**
 * Check if DrawSVG plugin is available
 */
export function isDrawSVGAvailable(): boolean {
  return drawSVGAvailable;
}

/**
 * Global GSAP defaults for all animations
 */
gsap.defaults({
  ease: "power2.out",
});

export function animateSVGPath(
  element: SVGPathElement,
  duration: number,
  delay: number = 0,
  ease: string = "none",
): gsap.core.Tween {
  if (drawSVGAvailable) {
    // Use DrawSVG plugin if available
    return gsap.fromTo(
      element,
      {
        drawSVG: "0%",
      },
      {
        drawSVG: "100%",
        duration,
        delay,
        ease,
      },
    );
  }

  // Fallback: strokeDasharray technique
  const length = element.getTotalLength();
  element.style.strokeDasharray = `${length}`;
  element.style.strokeDashoffset = `${length}`;

  return gsap.to(element, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease,
  });
}

/**
 * GPU-accelerated transform properties
 * GSAP 3.x handles GPU acceleration automatically via will-change CSS
 */
export const GPU_PROPS = {
  transformOrigin: "50% 50%",
  transformPerspective: 1000,
};

/**
 * Common easing presets
 */
export const EASING = {
  elastic: "elastic.out(1, 0.3)",
  bounce: "bounce.out",
  smooth: "power2.inOut",
  quick: "power1.out",
  slow: "power3.inOut",
} as const;

export { gsap };
