/**
 * Animation Timeline Factory
 * Creates GSAP timelines with relationship-aware duration scaling
 */

import { gsap } from "gsap";
import type { RelationshipContext } from "@/types";

/**
 * Get relationship-aware duration scaling factor
 */
export function getRelationshipDurationScale(
  category: RelationshipContext["category"],
): number {
  switch (category) {
    case "professional":
      return 0.8; // Faster, business-like
    case "family":
      return 1.0; // Normal pace
    case "friends":
      return 1.1; // Upbeat
    case "romantic":
      return 1.2; // Slower, elegant
    default:
      return 1.0;
  }
}

/**
 * Create animation timeline with relationship-aware configuration
 */
export function createAnimationTimeline(
  festivalType: "diwali" | "newyear" | "pongal" | "fireworks",
  relationshipContext: RelationshipContext,
): gsap.core.Timeline {
  const durationScale = getRelationshipDurationScale(
    relationshipContext.category,
  );

  const timeline = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power2.out",
    },
  });

  // Festival-specific duration base (will be scaled)
  const baseDuration = getFestivalBaseDuration(festivalType);

  // Store metadata using GSAP's data API
  timeline.data = {
    totalDuration: baseDuration * durationScale,
    relationshipScale: durationScale,
  };

  return timeline;
}

/**
 * Get base duration for each festival type (ms)
 */
function getFestivalBaseDuration(
  festivalType: "diwali" | "newyear" | "pongal" | "fireworks",
): number {
  switch (festivalType) {
    case "diwali":
      return 8000; // 8 seconds
    case "newyear":
      return 10000; // 10 seconds
    case "pongal":
      return 8000; // 8 seconds
    case "fireworks":
      return 8000; // 8 seconds
    default:
      return 8000;
  }
}

/**
 * Create contextual timeline with relationship scaling
 */
export function createContextualTimeline(
  relationshipCategory: RelationshipContext["category"],
): gsap.core.Timeline {
  const durationScale = getRelationshipDurationScale(relationshipCategory);

  return gsap.timeline({
    paused: true,
    defaults: {
      ease: "power2.out",
    },
    timeScale: 1 / durationScale, // Inverse for GSAP timeScale
  });
}

/**
 * Adjust animation duration based on relationship context
 */
export function adjustAnimationDuration(
  baseDuration: number,
  relationshipCategory: RelationshipContext["category"],
): number {
  const scale = getRelationshipDurationScale(relationshipCategory);
  return baseDuration * scale;
}
