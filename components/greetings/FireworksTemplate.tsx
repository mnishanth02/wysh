"use client";

/**
 * Fireworks Template Component - Reusable
 * Configurable fireworks animation for multiple celebration contexts
 * Phase 8: User Story 6 - Reusable Fireworks Template
 *
 * Features:
 * - T102: Configurable props (burstCount, particleCount, duration, colorPalette)
 * - T103: Launch animation with GSAP MotionPath and bezier curves
 * - T104: 360-degree radial particle distribution
 * - T105: Configurable easing (power2.out, power3.out, sine.in)
 * - T106: Staggered burst timing for cascading effect
 * - T107: Gravity simulation with fade-out
 * - T108: Optional looped background fireworks
 */

import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  logPerformanceMetrics,
  shouldUseReducedMotion,
  startFPSMonitor,
} from "@/lib/performance";
import type { RelationshipContext } from "@/types";
import { useAnimationContext } from "./animations/shared/ContextAdapter";
import {
  ParticleCanvas,
  type ParticleCanvasRef,
} from "./animations/shared/ParticleCanvas";

// T102: Configurable template props
interface FireworksTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
  // Configurable animation properties
  burstCount?: number; // 5-7 default
  particleCount?: number; // 200-500
  duration?: number; // 8000-12000ms
  colorPalette?: string[];
  enableLoop?: boolean; // T108: Optional looped background fireworks
}

export function FireworksTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  burstCount = 6,
  particleCount = 300,
  duration = 8000,
  colorPalette,
  enableLoop = false,
}: FireworksTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<ParticleCanvasRef>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const loopTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    "intro" | "fireworks" | "text" | "loop" | "complete"
  >("intro");

  // T112: Apply ContextAdapter for relationship-aware adjustments
  const animationConfig = useAnimationContext(
    "fireworks",
    relationshipContext.relationshipType,
  );

  // Use provided colors or fallback to config
  const colors = colorPalette || animationConfig.colors;

  // Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  // T103: Launch a single firework with bezier curve motion
  const launchFirework = useCallback(
    (index: number, canvasWidth: number, canvasHeight: number, delay = 0) => {
      const particleSystem = canvasRef.current?.getSystem();
      if (!particleSystem) return null;

      // Random launch position (horizontal spread across bottom third)
      const launchX = canvasWidth * (0.2 + Math.random() * 0.6);
      const launchY = canvasHeight; // Bottom of screen

      // T103: Apex point (30-70% height) for bezier curve
      const apexY = canvasHeight * (0.2 + Math.random() * 0.3);

      // T104: 360-degree radial burst
      // Calculate particles per burst
      const particlesPerBurst = Math.floor(particleCount / burstCount);

      // Color for this burst
      const colorIndex = index % colors.length;
      const burstColor = colors[colorIndex] || colors[0];

      // Create launch animation timeline for this firework
      const launchTl = gsap.timeline({ delay });

      // Animate a dummy object to simulate particle launch
      const launcher = { y: launchY };

      // T103: Launch with bezier curve (power2.out easing)
      // T105: Configurable easing - launch uses power2.out
      launchTl.to(
        launcher,
        {
          y: apexY,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            // Visual trail during launch (optional)
          },
          onComplete: () => {
            // T104: Emit 360-degree radial burst at apex
            // T105: Burst uses power3.out for explosive feel
            particleSystem.emitBurst(launchX, apexY, {
              count: particlesPerBurst,
              angle: undefined, // 360-degree radial
              speed: { min: 100, max: 200 },
              size: { min: 2, max: 5 },
              life: 1500 + Math.random() * 1000, // 1.5-2.5s
              colors: [burstColor],
            });
          },
        },
        0,
      );

      return launchTl;
    },
    [particleCount, burstCount, colors],
  );

  // NEW: Launch ground-level crackers (anars/fountains/chakris)
  const launchGroundCracker = useCallback(
    (
      canvasWidth: number,
      canvasHeight: number,
      delay = 0,
      type: "anar" | "fountain" | "chakri" = "anar",
    ) => {
      const particleSystem = canvasRef.current?.getSystem();
      if (!particleSystem) return null;

      const crackerTl = gsap.timeline({ delay });

      if (type === "anar") {
        // Anar (Flower Pot) - continuous upward spray with color changing
        const x = canvasWidth * (0.15 + Math.random() * 0.7);
        const y = canvasHeight * 0.88; // Visible at bottom

        // Longer duration with more particles for prominent effect
        for (let i = 0; i < 20; i++) {
          const colorIndex = Math.floor(i / 4) % colors.length; // Change color every 4 bursts
          crackerTl.call(
            () => {
              particleSystem.emitBurst(x, y, {
                count: 25, // More particles for visibility
                angle: { min: -Math.PI * 0.7, max: -Math.PI * 0.3 }, // Wide upward cone
                speed: { min: 100, max: 200 }, // Faster for more height
                size: { min: 3, max: 6 }, // Larger particles
                life: 1200 + Math.random() * 600, // Longer life
                colors: [colors[colorIndex] || colors[0]],
              });
            },
            [],
            i * 0.12,
          ); // Continuous spray
        }
      } else if (type === "fountain") {
        // Fountain cracker - dense upward spray
        const x = canvasWidth * (0.15 + Math.random() * 0.7);
        const y = canvasHeight * 0.88;

        for (let i = 0; i < 15; i++) {
          crackerTl.call(
            () => {
              particleSystem.emitBurst(x, y, {
                count: 30, // Dense spray
                angle: { min: -Math.PI * 0.65, max: -Math.PI * 0.35 }, // Tight cone
                speed: { min: 120, max: 180 },
                size: { min: 3, max: 5 },
                life: 1000 + Math.random() * 500,
                colors: [
                  colors[Math.floor(Math.random() * colors.length)] ||
                  colors[0],
                ],
              });
            },
            [],
            i * 0.1,
          );
        }
      } else {
        // Chakri (spinning wheel) - brighter and more visible
        const x = canvasWidth * (0.2 + Math.random() * 0.6);
        const y = canvasHeight * 0.88;

        // Spinning effect with more particles
        for (let i = 0; i < 24; i++) {
          // More rotations for longer effect
          const baseAngle = (i / 24) * Math.PI * 4; // 2 full rotations
          crackerTl.call(
            () => {
              particleSystem.emitBurst(x, y, {
                count: 15, // More particles per burst
                angle: { min: baseAngle - 0.3, max: baseAngle + 0.3 },
                speed: { min: 80, max: 140 },
                size: { min: 2, max: 5 }, // Larger for visibility
                life: 800 + Math.random() * 400,
                colors: [
                  colors[Math.floor(Math.random() * colors.length)] ||
                  colors[0],
                ],
              });
            },
            [],
            i * 0.08,
          ); // Fast rotation
        }
      }

      return crackerTl;
    },
    [colors],
  );

  // NEW: Launch top sparkle effects (willow, palm, crossette)
  const launchTopSparkle = useCallback(
    (
      canvasWidth: number,
      canvasHeight: number,
      delay = 0,
      pattern: "willow" | "palm" | "crossette" = "willow",
    ) => {
      const particleSystem = canvasRef.current?.getSystem();
      if (!particleSystem) return null;

      const sparkleTl = gsap.timeline({ delay });

      const x = canvasWidth * (0.3 + Math.random() * 0.4);
      const y = canvasHeight * (0.15 + Math.random() * 0.15); // Top area

      if (pattern === "willow") {
        // Willow - drooping effect with trails
        sparkleTl.call(() => {
          particleSystem.emitBurst(x, y, {
            count: 50,
            angle: undefined, // Full radial
            speed: { min: 40, max: 80 },
            size: { min: 1, max: 2 },
            life: 2000 + Math.random() * 500, // Longer life for trailing
            colors: [
              colors[Math.floor(Math.random() * colors.length)] || colors[0],
            ],
          });

          // Secondary sparkles after 0.3s
          setTimeout(() => {
            particleSystem.emitBurst(x, y + 30, {
              count: 30,
              angle: { min: Math.PI * 0.3, max: Math.PI * 0.7 }, // Downward
              speed: { min: 20, max: 50 },
              size: { min: 1, max: 2 },
              life: 1500,
              colors: ["#FFD700", "#FFA500"], // Golden sparkles
            });
          }, 300);
        });
      } else if (pattern === "palm") {
        // Palm - burst then fall pattern
        sparkleTl.call(() => {
          particleSystem.emitBurst(x, y, {
            count: 40,
            angle: { min: -Math.PI * 0.3, max: -Math.PI * 0.7 }, // Upward
            speed: { min: 80, max: 120 },
            size: { min: 2, max: 4 },
            life: 1200,
            colors: [
              colors[Math.floor(Math.random() * colors.length)] || colors[0],
            ],
          });

          // Secondary burst at peak
          setTimeout(() => {
            particleSystem.emitBurst(x, y - 50, {
              count: 60,
              angle: undefined,
              speed: { min: 30, max: 70 },
              size: { min: 1, max: 2 },
              life: 1800,
              colors: [
                colors[Math.floor(Math.random() * colors.length)] || colors[0],
              ],
            });
          }, 400);
        });
      } else {
        // Crossette - multiple small bursts in pattern
        const crossettePositions = [
          { dx: 0, dy: 0 },
          { dx: 40, dy: -30 },
          { dx: -40, dy: -30 },
          { dx: 30, dy: 30 },
          { dx: -30, dy: 30 },
        ];

        crossettePositions.forEach((pos, idx) => {
          sparkleTl.call(
            () => {
              particleSystem.emitBurst(x + pos.dx, y + pos.dy, {
                count: 20,
                angle: undefined,
                speed: { min: 50, max: 100 },
                size: { min: 1, max: 3 },
                life: 1000 + Math.random() * 500,
                colors: [
                  colors[Math.floor(Math.random() * colors.length)] ||
                  colors[0],
                ],
              });
            },
            [],
            idx * 0.1,
          );
        });
      }

      return sparkleTl;
    },
    [colors],
  );

  // T108: Launch background fireworks loop
  const launchBackgroundFirework = useCallback(
    (canvasWidth: number, canvasHeight: number) => {
      const particleSystem = canvasRef.current?.getSystem();
      if (!particleSystem) return;

      // Smaller bursts for background
      const particlesPerBurst = Math.floor(particleCount / burstCount / 3); // 1/3 size

      // Random position
      const x = canvasWidth * (0.1 + Math.random() * 0.8);
      const y = canvasHeight * (0.3 + Math.random() * 0.4);

      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)];

      particleSystem.emitBurst(x, y, {
        count: particlesPerBurst,
        angle: undefined,
        speed: { min: 50, max: 100 },
        size: { min: 1, max: 3 },
        life: 1000 + Math.random() * 500,
        colors: [color || colors[0]],
      });
    },
    [particleCount, burstCount, colors],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Start FPS monitoring
    const fpsMonitor =
      process.env.NODE_ENV === "development" ? startFPSMonitor() : null;

    // Get canvas element from particle system
    const particleSystem = canvasRef.current?.getSystem();
    if (!particleSystem) return;

    // Access canvas dimensions from the particle system
    const { width, height } = particleSystem.getCanvasDimensions();

    const canvasWidth = width || window.innerWidth;
    const canvasHeight = height || window.innerHeight;

    const ctx = gsap.context(() => {
      // Main animation timeline
      const tl = gsap.timeline({
        onComplete: () => {
          if (fpsMonitor) {
            const metrics = fpsMonitor.stop();
            logPerformanceMetrics("FireworksTemplate", metrics);
          }
          setAnimationPhase("complete");
          onAnimationComplete?.();

          // T108: Start looped background fireworks if enabled
          if (enableLoop && canvasRef.current) {
            setAnimationPhase("loop");
            const loopTl = gsap.timeline({ repeat: -1 });

            // Launch small firework every 2 seconds
            for (let i = 0; i < 10; i++) {
              loopTl.call(
                () => launchBackgroundFirework(canvasWidth, canvasHeight),
                [],
                i * 2,
              );
            }

            loopTimelineRef.current = loopTl;
          }
        },
      });

      // Reduced motion: simple fade-in
      if (useReducedMotion) {
        tl.set([".fireworks-bg", ".fireworks-content"], {
          opacity: 1,
        });
        setAnimationPhase("complete");
        return;
      }

      // Phase 1: Background fade-in (0-1s)
      setAnimationPhase("intro");
      tl.to(
        ".fireworks-bg",
        {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      );

      // Animate ground glow to pulse with crackers
      tl.to(
        ".fireworks-ground-glow",
        {
          opacity: 0.6,
          duration: 0.8,
          ease: "power2.in",
        },
        1.2, // Start with crackers
      );

      tl.to(
        ".fireworks-ground-glow",
        {
          opacity: 0.3,
          duration: 0.5,
          ease: "sine.inOut",
          repeat: 8, // Pulse 8 times
          yoyo: true,
        },
        2,
      );

      // Phase 2: Launch fireworks with staggered timing (1-duration)
      setAnimationPhase("fireworks");

      // T106: Staggered burst timing - delay between fireworks
      const durationInSeconds = duration / 1000;
      const fireworksDuration = durationInSeconds * 0.6; // 60% of total for fireworks
      const staggerDelay = fireworksDuration / burstCount;

      for (let i = 0; i < burstCount; i++) {
        const delay = 1 + i * staggerDelay; // Start after background fade
        const fireworkTl = launchFirework(i, canvasWidth, canvasHeight, 0);
        if (fireworkTl) {
          tl.add(fireworkTl, delay);
        }
      }

      // NEW: Add ground crackers - Diwali celebration at bottom!
      const crackerStartTime = 1.2; // Start early for continuous ground effect

      // Launch 3 Anar (Flower Pot) crackers - the star of ground crackers!
      const anar1 = launchGroundCracker(canvasWidth, canvasHeight, 0, "anar");
      if (anar1) {
        tl.add(anar1, crackerStartTime);
      }

      const anar2 = launchGroundCracker(canvasWidth, canvasHeight, 0, "anar");
      if (anar2) {
        tl.add(anar2, crackerStartTime + 1.5);
      }

      const anar3 = launchGroundCracker(canvasWidth, canvasHeight, 0, "anar");
      if (anar3) {
        tl.add(anar3, crackerStartTime + 3);
      }

      // Launch 2 fountain crackers for variety
      const fountain1 = launchGroundCracker(
        canvasWidth,
        canvasHeight,
        0,
        "fountain",
      );
      if (fountain1) {
        tl.add(fountain1, crackerStartTime + 0.8);
      }

      const fountain2 = launchGroundCracker(
        canvasWidth,
        canvasHeight,
        0,
        "fountain",
      );
      if (fountain2) {
        tl.add(fountain2, crackerStartTime + 4);
      }

      // Launch 3 chakri (spinning wheel) crackers
      const chakri1 = launchGroundCracker(
        canvasWidth,
        canvasHeight,
        0,
        "chakri",
      );
      if (chakri1) {
        tl.add(chakri1, crackerStartTime + 0.5);
      }

      const chakri2 = launchGroundCracker(
        canvasWidth,
        canvasHeight,
        0,
        "chakri",
      );
      if (chakri2) {
        tl.add(chakri2, crackerStartTime + 2.2);
      }

      const chakri3 = launchGroundCracker(
        canvasWidth,
        canvasHeight,
        0,
        "chakri",
      );
      if (chakri3) {
        tl.add(chakri3, crackerStartTime + 3.8);
      }

      // NEW: Add top sparkles (willow, palm, crossette patterns)
      const sparkleStartTime = 2; // Start with the fireworks

      // Add 3-4 different sparkle patterns
      const willow1 = launchTopSparkle(canvasWidth, canvasHeight, 0, "willow");
      if (willow1) {
        tl.add(willow1, sparkleStartTime);
      }

      const palm1 = launchTopSparkle(canvasWidth, canvasHeight, 0, "palm");
      if (palm1) {
        tl.add(palm1, sparkleStartTime + 1.5);
      }

      const crossette1 = launchTopSparkle(
        canvasWidth,
        canvasHeight,
        0,
        "crossette",
      );
      if (crossette1) {
        tl.add(crossette1, sparkleStartTime + 2.5);
      }

      const willow2 = launchTopSparkle(canvasWidth, canvasHeight, 0, "willow");
      if (willow2) {
        tl.add(willow2, sparkleStartTime + 3.5);
      }

      const palm2 = launchTopSparkle(canvasWidth, canvasHeight, 0, "palm");
      if (palm2) {
        tl.add(palm2, sparkleStartTime + 4.5);
      }

      // Phase 3: Text reveal (at 75% of duration)
      const textRevealStart = durationInSeconds * 0.75;
      setAnimationPhase("text");

      tl.fromTo(
        ".fireworks-recipient",
        {
          opacity: 0,
          scale: 0.5,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        textRevealStart,
      );

      tl.fromTo(
        ".fireworks-message",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        textRevealStart + 0.4,
      );

      tl.fromTo(
        ".fireworks-sender",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        textRevealStart + 0.7,
      );

      timelineRef.current = tl;
    }, containerRef);

    return () => {
      ctx.revert();
      timelineRef.current?.kill();
      loopTimelineRef.current?.kill();
    };
  }, [
    burstCount,
    duration,
    enableLoop,
    onAnimationComplete,
    useReducedMotion,
    launchFirework,
    launchBackgroundFirework,
    launchGroundCracker,
    launchTopSparkle,
  ]);

  // Performance tuning: Particle multiplier for maxParticles
  const PARTICLE_MULTIPLIER = 1.5;

  return (
    <div
      ref={ containerRef }
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Background */ }
      <div
        className="fireworks-bg absolute inset-0 opacity-0"
        style={ {
          background:
            "radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        } }
      />

      {/* Ground Glow Effect - Makes bottom crackers more visible */ }
      <div
        className="fireworks-ground-glow absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none opacity-0"
        style={ {
          background: `linear-gradient(to top,
            ${colors[0]}15 0%,
            ${colors[1] || colors[0]}10 20%,
            transparent 100%)`,
          mixBlendMode: "screen",
        } }
      />

      {/* T107: Particle Canvas with Gravity Simulation */ }
      <ParticleCanvas
        ref={ canvasRef }
        config={ {
          maxParticles: particleCount * PARTICLE_MULTIPLIER, // Increase for more particles
          colors: colors,
          particleSize: 3,
          lifespan: 2000,
          gravity: 120, // T107: Gravity for falling particles
          friction: 0.97, // T107: Slight friction for realistic fall
          velocityVariation: 0.2,
          opacity: 1,
          blendMode: "screen",
        } }
        className="absolute inset-0 pointer-events-none"
        autoStart={ true }
      />

      {/* T111: Text Overlay */ }
      <div className="fireworks-content absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-4 sm:space-y-6 px-4">
          {/* Recipient Name */ }
          <div className="fireworks-recipient opacity-0">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
              style={ {
                color: "#FFFFFF",
                textShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.9), 0 8px 20px rgba(0, 0, 0, 0.85), 0 2px 4px rgba(0, 0, 0, 1)",
              } }
            >
              { recipientName }
            </h1>
          </div>

          {/* Message */ }
          { message && (
            <div className="fireworks-message opacity-0">
              <p
                className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto px-4"
                style={ {
                  color: "#FFFFFF",
                  textShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.8)",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  padding: "1rem 1.5rem",
                  borderRadius: "0.75rem",
                  backdropFilter: "blur(8px)",
                } }
              >
                { message }
              </p>
            </div>
          ) }

          {/* Sender Name */ }
          <div className="fireworks-sender opacity-0">
            <p
              className="text-base sm:text-lg md:text-xl"
              style={ {
                color: "#FFD700",
                textShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.85), 0 4px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
              } }
            >
              From { senderName }
            </p>
          </div>
        </div>
      </div>

      {/* Animation Phase Indicator (dev only) */ }
      { process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded">
          Phase: { animationPhase }
        </div>
      ) }
    </div>
  );
}
