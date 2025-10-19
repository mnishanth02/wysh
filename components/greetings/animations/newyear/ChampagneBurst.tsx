"use client";

/**
 * ChampagneBurst Component - New Year Champagne Pop Animation
 * Large explosion burst at top of viewport when sparkles converge
 * Features: 360° radial burst, golden sparkles, explosive spread
 */

import { gsap } from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { CHAMPAGNE_SPARKLE_COLORS } from "@/lib/animations/festival-themes";
import {
  ParticleCanvas,
  type ParticleCanvasRef,
} from "../shared/ParticleCanvas";

interface ChampagneBurstProps {
  /** Number of burst particles (default: 180) */
  particleCount?: number;
  /** Animation duration in seconds (default: 1.2s) */
  duration?: number;
  /** Delay before starting (default: 0s) */
  delay?: number;
  /** Custom color palette */
  colors?: readonly string[];
  /** Callback when burst completes */
  onBurstComplete?: () => void;
}

export function ChampagneBurst({
  particleCount = 180,
  duration = 1.2,
  delay = 0,
  colors = CHAMPAGNE_SPARKLE_COLORS,
  onBurstComplete,
}: ChampagneBurstProps) {
  const canvasRef = useRef<ParticleCanvasRef>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /**
   * Trigger explosion burst at top center
   */
  const triggerBurst = useCallback(
    (canvasWidth: number, canvasHeight: number) => {
      const particleSystem = canvasRef.current?.getSystem();
      if (!particleSystem) return;

      // Position at top center of viewport
      const burstX = canvasWidth * 0.5;
      const burstY = canvasHeight * 0.15; // 15% from top

      // Golden sparkle colors
      const burstColors = [
        colors[0] || "#FFD700", // Gold
        colors[1] || "#FFF8DC", // Cornsilk
        colors[2] || "#FFB700", // Amber
        colors[3] || "#FFFFFF", // White
        colors[4] || "#EEE8AA", // Pale Goldenrod
      ];

      // Emit 360° radial burst with high velocity
      particleSystem.emitBurst(burstX, burstY, {
        count: particleCount,
        angle: undefined, // 360° radial (default)
        speed: { min: 200, max: 400 }, // Explosive velocity
        size: { min: 4, max: 8 },
        life: duration * 1000, // Convert to milliseconds
        colors: burstColors,
      });
    },
    [particleCount, duration, colors],
  );

  useEffect(() => {
    const particleSystem = canvasRef.current?.getSystem();
    if (!particleSystem) return;

    // Get canvas dimensions
    const { width, height } = particleSystem.getCanvasDimensions();
    const canvasWidth = width || window.innerWidth;
    const canvasHeight = height || window.innerHeight;

    const tl = gsap.timeline({ delay });

    // Trigger burst immediately
    tl.call(
      () => {
        triggerBurst(canvasWidth, canvasHeight);
      },
      [],
      0,
    );

    // Callback when burst completes
    tl.call(
      () => {
        onBurstComplete?.();
      },
      [],
      duration,
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [delay, duration, triggerBurst, onBurstComplete]);

  return (
    <ParticleCanvas
      ref={canvasRef}
      config={{
        maxParticles: particleCount,
        colors: [...colors],
        particleSize: 6,
        lifespan: duration * 1000,
        // Standard gravity for natural fall
        gravity: 120,
        friction: 0.96,
        velocityVariation: 0.25,
        opacity: 1,
        blendMode: "screen", // Additive blending for sparkle effect
      }}
      className="absolute inset-0 pointer-events-none"
      autoStart={true}
    />
  );
}
