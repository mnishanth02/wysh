"use client";

/**
 * ContextAdapter Hook
 * Provides relationship-aware animation configuration
 */

import { useMemo } from "react";
import {
  getAnimationContext,
  getParticleCountForIntensity,
} from "@/lib/animations/animation-context";
import type { FestivalType } from "@/lib/animations/festival-themes";
import type { RelationshipType } from "@/types";
import type { AnimationContext } from "@/types/animation.types";

export interface AnimationConfig extends AnimationContext {
  particleCount: number;
  baseParticleCount: number;
}

/**
 * Hook to get relationship-aware animation configuration
 */
export function useAnimationContext(
  festivalType: FestivalType,
  relationshipType: RelationshipType,
  baseParticleCount: number = 300,
): AnimationConfig {
  return useMemo(() => {
    const context = getAnimationContext(festivalType, relationshipType);
    const particleCount = getParticleCountForIntensity(
      context.intensity,
      baseParticleCount,
    );

    return {
      ...context,
      particleCount,
      baseParticleCount,
    };
  }, [festivalType, relationshipType, baseParticleCount]);
}
