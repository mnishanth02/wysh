"use client";

/**
 * ChampagneSparkles Component - New Year Champagne Pop Animation
 * Sparkle particles shooting upward from champagne bottle
 * Features: Upward cone spray, golden sparkles, reaches top of viewport
 */

import { gsap } from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { CHAMPAGNE_SPARKLE_COLORS } from "@/lib/animations/festival-themes";
import {
  ParticleCanvas,
  type ParticleCanvasRef,
} from "../shared/ParticleCanvas";

interface ChampagneSparklesProps {
  /** Number of sparkle particles (default: 70) */
  particleCount?: number;
  /** Animation duration in seconds (default: 1.5s) */
  duration?: number;
  /** Delay before starting (default: 0s) */
  delay?: number;
  /** Custom color palette */
  colors?: readonly string[];
  /** Callback when sparkles reach top of viewport */
  onReachTop?: () => void;
}

export function ChampagneSparkles({
  particleCount = 70,
  duration = 1.5,
  delay = 0,
  colors = CHAMPAGNE_SPARKLE_COLORS,
  onReachTop,
}: ChampagneSparklesProps) {
  const canvasRef = useRef<ParticleCanvasRef>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /**
   * Launch sparkle spray from bottle mouth
   */
  const launchSparkles = useCallback(
    (canvasWidth: number, canvasHeight: number) => {
      const particleSystem = canvasRef.current?.getSystem();
      if (!particleSystem) return;

      // Position at bottom center (bottle mouth)
      const launchX = canvasWidth * 0.5;
      const launchY = canvasHeight * 0.92; // Near bottom (bottle top)

      // Upward cone spray: -90° ± 30° (straight up with spread)
      const angleMin = -Math.PI / 2 - Math.PI / 6; // -120° (left spray)
      const angleMax = -Math.PI / 2 + Math.PI / 6; // -60° (right spray)

      // Use golden/champagne/white colors
      const sparkleColors = [
        colors[0] || "#FFD700", // Gold
        colors[1] || "#FFF8DC", // Cornsilk
        colors[2] || "#FFB700", // Amber
        colors[3] || "#FFFFFF", // White
        colors[4] || "#EEE8AA", // Pale Goldenrod
      ];

      // Emit sparkle burst
      particleSystem.emitBurst(launchX, launchY, {
        count: particleCount,
        angle: { min: angleMin, max: angleMax },
        speed: { min: 350, max: 550 }, // High upward velocity
        size: { min: 3, max: 7 },
        life: duration * 1000, // Convert to milliseconds
        colors: sparkleColors,
      });
    },
    [particleCount, duration, colors],
  );

  const EARLY_TRIGGER_FACTOR = 0.8;

  useEffect(() => {
    const particleSystem = canvasRef.current?.getSystem();
    if (!particleSystem) return;

    // Get canvas dimensions
    const { width, height } = particleSystem.getCanvasDimensions();
    const canvasWidth = width || window.innerWidth;
    const canvasHeight = height || window.innerHeight;

    const tl = gsap.timeline({ delay });

    // Launch sparkles immediately
    tl.call(
      () => {
        launchSparkles(canvasWidth, canvasHeight);
      },
      [],
      0,
    );

    // Callback when sparkles should reach top (duration * EARLY_TRIGGER_FACTOR for early trigger)
    tl.call(
      () => {
        onReachTop?.();
      },
      [],
      duration * EARLY_TRIGGER_FACTOR,
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [delay, duration, launchSparkles, onReachTop]);

  return (
    <ParticleCanvas
      ref={canvasRef}
      config={{
        maxParticles: particleCount,
        colors: [...colors],
        particleSize: 5,
        lifespan: duration * 1000,
        // Low gravity to keep particles moving upward
        gravity: -50, // Negative gravity = upward pull
        friction: 0.97,
        velocityVariation: 0.3,
        opacity: 1,
        blendMode: "screen", // Additive blending for sparkle effect
      }}
      className="absolute inset-0 pointer-events-none"
      autoStart={true}
    />
  );
}
