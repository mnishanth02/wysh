"use client";

/**
 * SparkleParticles Component
 * Floating golden sparkle particles for Diwali ambiance
 */

import { useCallback, useEffect, useRef } from "react";
import type { ParticleSystem } from "@/lib/animations/particle-physics";
import {
  ParticleCanvas,
  type ParticleCanvasRef,
} from "../shared/ParticleCanvas";

export interface SparkleParticlesProps {
  count?: number;
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

/**
 * SparkleParticles with vertical motion and horizontal drift
 */
export function SparkleParticles({
  count = 30,
  duration = 4,
  delay = 0,
  onComplete,
}: SparkleParticlesProps) {
  const canvasRef = useRef<ParticleCanvasRef>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSystemReady = useCallback(
    (system: ParticleSystem) => {
      const canvas = canvasRef.current?.getSystem()?.canvas;
      if (!canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      // Start after delay
      setTimeout(() => {
        // Emit sparkles continuously
        let emitted = 0;
        const emitRate = count / duration; // particles per second
        const emitInterval = 1000 / emitRate;

        intervalRef.current = setInterval(() => {
          if (emitted >= count) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            if (onComplete) {
              setTimeout(onComplete, 2000); // Wait for particles to fade
            }
            return;
          }

          const x = Math.random() * width;
          const y = height + 20;

          system.emitBurst(x, y, {
            count: 1,
            angle: { min: -Math.PI / 2 - 0.3, max: -Math.PI / 2 + 0.3 },
            speed: { min: 40, max: 80 },
            life: 3000,
            size: { min: 3, max: 5 },
            colors: ["#FFA500", "#FFD700", "#FFFFFF"],
          });

          emitted++;
        }, emitInterval);
      }, delay * 1000);
    },
    [count, duration, delay, onComplete],
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <ParticleCanvas
      ref={canvasRef}
      config={{
        colors: ["#FFA500", "#FFD700", "#FFFFFF"],
        particleSize: 4,
        gravity: -50, // Upward motion
        friction: 0.99,
        maxParticles: count + 10,
        lifespan: 3000,
        blendMode: "screen",
        opacity: 0.8,
      }}
      className="absolute inset-0 pointer-events-none"
      width={800}
      height={600}
      autoStart={true}
      onSystemReady={handleSystemReady}
    />
  );
}
