"use client";

import { useEffect, useRef } from "react";
import type { ParticleSystemConfig } from "@/types/particle.types";
import {
  ParticleCanvas,
  type ParticleCanvasRef,
} from "../shared/ParticleCanvas";

interface SteamParticlesProps {
  /** Number of steam particles */
  particleCount?: number;
  /** Duration of steam animation in seconds */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * SteamParticles Animation Component for Pongal
 *
 * Steam particles rising from the pongal pot with vertical motion
 * and slight horizontal wobble for realistic effect.
 *
 * Tasks: T066, T067
 */
export function SteamParticles({
  particleCount = 65,
  duration = 5,
  onComplete,
}: SteamParticlesProps) {
  const canvasRef = useRef<ParticleCanvasRef>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const system = canvasRef.current?.getSystem();
    if (!system) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
      timeRef.current = elapsed;

      if (elapsed >= duration) {
        onComplete?.();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    canvasRef.current?.start();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvasRef.current?.stop();
    };
  }, [duration, onComplete]);

  // Particle configuration for steam (T066, T067)
  // Steam rises vertically with slight horizontal wobble
  const config: ParticleSystemConfig = {
    colors: ["#FFFFFF", "#F5F5F5", "#E8E8E8"], // White steam colors
    particleSize: 12, // Medium-sized particles
    opacity: 0.5, // Semi-transparent (0.3-0.6 range)
    gravity: -100, // Negative gravity for upward movement (vy = -100 to -200 px/s)
    friction: 0.98, // Slight friction for realistic steam dissipation
    velocityVariation: 0.3, // Some variation in particle movement
    maxParticles: particleCount,
    lifespan: 2500, // 2.5 seconds lifespan
    blendMode: "screen", // Additive blending for soft steam effect
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <ParticleCanvas
        ref={canvasRef}
        config={config}
        className="h-full w-full"
        autoStart={false}
      />
    </div>
  );
}
