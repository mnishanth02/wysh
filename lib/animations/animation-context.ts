/**
 * Animation Context Adapter
 * Integrates lib/context-engine.ts with animation system
 * Maps relationship context to animation parameters
 */

import { getRelationshipContext } from "@/lib/context-engine";
import type { RelationshipContext, RelationshipType } from "@/types";
import type { AnimationContext } from "@/types/animation.types";
import {
  type FestivalType,
  getRelationshipColorPalette,
} from "./festival-themes";

/**
 * Get animation-specific context from relationship type
 */
export function getAnimationContext(
  festivalType: FestivalType,
  relationshipType: RelationshipType,
): AnimationContext {
  // Get base relationship context from existing engine
  const relationshipContext = getRelationshipContext(relationshipType);

  // Map to animation parameters
  const colors = getRelationshipColorPalette(festivalType, relationshipType);
  const intensity = mapColorIntensityToParticleIntensity(
    relationshipContext.colorIntensity,
  );
  const duration = mapAnimationSpeedToDuration(
    relationshipContext.animationSpeed,
    festivalType,
  );
  const tone = mapVisualToneToAnimationTone(relationshipContext.visualTone);

  return {
    colors,
    intensity,
    duration,
    tone,
  };
}

/**
 * Map color intensity to particle intensity
 */
function mapColorIntensityToParticleIntensity(
  colorIntensity: "muted" | "moderate" | "vibrant",
): "low" | "medium" | "high" {
  switch (colorIntensity) {
    case "muted":
      return "low";
    case "moderate":
      return "medium";
    case "vibrant":
      return "high";
    default:
      return "medium";
  }
}

/**
 * Map animation speed to duration in milliseconds
 */
function mapAnimationSpeedToDuration(
  animationSpeed: "slow" | "medium" | "fast",
  festivalType: FestivalType,
): number {
  const baseDuration = getBaseDuration(festivalType);

  switch (animationSpeed) {
    case "fast":
      return baseDuration * 0.8; // Professional - faster
    case "medium":
      return baseDuration; // Family/Friends - normal
    case "slow":
      return baseDuration * 1.2; // Romantic - slower
    default:
      return baseDuration;
  }
}

/**
 * Get base duration for festival type
 */
function getBaseDuration(festivalType: FestivalType): number {
  switch (festivalType) {
    case "diwali":
      return 8000;
    case "newyear":
      return 10000;
    case "pongal":
      return 8000;
    case "fireworks":
      return 8000;
    default:
      return 8000;
  }
}

/**
 * Map visual tone to animation tone
 */
function mapVisualToneToAnimationTone(
  visualTone: RelationshipContext["visualTone"],
): "professional" | "traditional" | "vibrant" | "romantic" {
  switch (visualTone) {
    case "formal":
      return "professional";
    case "respectful":
    case "warm":
      return "traditional";
    case "playful":
      return "vibrant";
    case "intimate":
      return "romantic";
    default:
      return "traditional";
  }
}

/**
 * Get particle count based on intensity and device capability
 */
export function getParticleCountForIntensity(
  intensity: "low" | "medium" | "high",
  baseCount: number = 300,
): number {
  switch (intensity) {
    case "low":
      return Math.floor(baseCount * 0.5); // 150 particles
    case "medium":
      return baseCount; // 300 particles
    case "high":
      return Math.floor(baseCount * 1.5); // 450 particles
    default:
      return baseCount;
  }
}
