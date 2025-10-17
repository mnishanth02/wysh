"use client";

/**
 * ParticleCanvas Component
 * Shared canvas element for particle system rendering
 */

import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { ParticleSystem } from "@/lib/animations/particle-physics";
import type { ParticleSystemConfig } from "@/types/particle.types";

export interface ParticleCanvasProps {
  config: ParticleSystemConfig;
  className?: string;
  width?: number;
  height?: number;
  autoStart?: boolean;
  onSystemReady?: (system: ParticleSystem) => void;
}

export interface ParticleCanvasRef {
  getSystem(): ParticleSystem | null;
  start(): void;
  stop(): void;
  reset(): void;
}

/**
 * ParticleCanvas component with forwardRef for parent control
 */
export const ParticleCanvas = forwardRef<
  ParticleCanvasRef,
  ParticleCanvasProps
>(
  (
    {
      config,
      className,
      width = 800,
      height = 600,
      autoStart = true,
      onSystemReady,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const systemRef = useRef<ParticleSystem | null>(null);

    // Initialize particle system
    useEffect(() => {
      if (!canvasRef.current) return;

      // Set canvas dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Create particle system
      systemRef.current = new ParticleSystem(canvasRef.current, config);

      // Auto start if enabled
      if (autoStart) {
        systemRef.current.start();
      }

      // Notify parent
      onSystemReady?.(systemRef.current);

      // Cleanup
      return () => {
        systemRef.current?.dispose();
        systemRef.current = null;
      };
    }, [config, width, height, autoStart, onSystemReady]);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getSystem: () => systemRef.current,
      start: () => systemRef.current?.start(),
      stop: () => systemRef.current?.stop(),
      reset: () => systemRef.current?.reset(),
    }));

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    );
  },
);

ParticleCanvas.displayName = "ParticleCanvas";
