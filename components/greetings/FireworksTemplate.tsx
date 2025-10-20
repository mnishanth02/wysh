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
import { memo, useCallback, useEffect, useRef, useState } from "react";
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

function FireworksTemplateComponent({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  burstCount = 50, // 200% INCREASE: 25 → 50
  particleCount = 2400, // 200% INCREASE: 1200 → 2400
  duration: _duration = 13000, // Kept for backward compatibility, using fixed timing internally
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

      // Full experience on all devices - wider spread and dramatic effect
      const launchX = canvasWidth * (0.25 + Math.random() * 0.5);
      const launchY = canvasHeight; // Bottom of screen

      // T103: Apex point - burst high for dramatic effect on all devices
      const apexY = canvasHeight * (0.1 + Math.random() * 0.2);

      // T104: 360-degree radial burst
      // Calculate particles per burst - 200% INCREASE!
      const particlesPerBurst = Math.floor(particleCount / burstCount);
      const enhancedParticleCount = Math.max(particlesPerBurst, 300); // 200% INCREASE: 150 → 300 minimum!

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
            // 200% DENSITY INCREASE - TRIPLE BURST SYSTEM!
            // MOBILE FIX: Reduced speeds (40-90 vs 60-140) and larger sizes (8-16px vs 6-14px)
            particleSystem.emitBurst(launchX, apexY, {
              count: enhancedParticleCount,
              angle: undefined, // 360-degree radial
              speed: { min: 60, max: 140 }, // 33% slower on mobile!
              size: { min: 6, max: 14 }, // Larger for high-DPI mobile!
              life: 3000 + Math.random() * 2000, // 3-5s MUCH longer life!
              colors: [burstColor],
            });

            // SECOND BURST: 0.1s later for density!
            setTimeout(() => {
              particleSystem.emitBurst(launchX, apexY, {
                count: Math.floor(enhancedParticleCount * 0.9), // 90% of main burst
                angle: undefined,
                speed: { min: 50, max: 120 }, // Slower on mobile
                size: { min: 5, max: 12 }, // Larger on mobile
                life: 2500 + Math.random() * 1500,
                colors: [burstColor],
              });
            }, 100);

            // THIRD BURST: 0.2s later for MAXIMUM density!
            setTimeout(() => {
              particleSystem.emitBurst(launchX, apexY, {
                count: Math.floor(enhancedParticleCount * 0.7), // 70% of main burst
                angle: undefined,
                speed: { min: 40, max: 100 }, // Slower on mobile
                size: { min: 4, max: 10 }, // Larger on mobile
                life: 2000 + Math.random() * 1200,
                colors: [burstColor],
              });
            }, 200);
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
        // MOBILE OPTIMIZED: More centered position
        const x = canvasWidth * (0.25 + Math.random() * 0.5);
        const y = canvasHeight * 0.85; // Higher for mobile visibility

        // 200% INCREASE: 30 → 60 bursts!
        for (let i = 0; i < 60; i++) {
          const colorIndex = Math.floor(i / 5) % colors.length; // Change color every 5 bursts
          crackerTl.call(
            () => {
              particleSystem.emitBurst(x, y, {
                count: 120, // 200% INCREASE: 60 → 120 particles!
                angle: { min: -Math.PI * 0.7, max: -Math.PI * 0.3 }, // Wide upward cone
                speed: { min: 120, max: 240 }, // Faster for more height
                size: { min: 6, max: 12 }, // 200% LARGER: was 4-9, now 6-12!
                life: 2000 + Math.random() * 1000, // Longer life
                colors: [colors[colorIndex] || colors[0]],
              });
            },
            [],
            i * 0.05,
          ); // Faster spray for MORE density!
        }
      } else if (type === "fountain") {
        // Fountain cracker - SUPER dense upward spray
        // MOBILE OPTIMIZED: More centered position
        const x = canvasWidth * (0.25 + Math.random() * 0.5);
        const y = canvasHeight * 0.85;

        for (let i = 0; i < 50; i++) {
          // 200% INCREASE: 25 → 50!
          crackerTl.call(
            () => {
              particleSystem.emitBurst(x, y, {
                count: 140, // 200% INCREASE: 70 → 140 particles!
                angle: { min: -Math.PI * 0.65, max: -Math.PI * 0.35 }, // Tight cone
                speed: { min: 130, max: 220 },
                size: { min: 6, max: 11 }, // 200% LARGER!
                life: 1800 + Math.random() * 800,
                colors: [
                  colors[Math.floor(Math.random() * colors.length)] ||
                    colors[0],
                ],
              });
            },
            [],
            i * 0.05,
          );
        }
      } else {
        // Chakri (spinning wheel) - SUPER bright and visible
        // MOBILE OPTIMIZED: More centered position
        const x = canvasWidth * (0.3 + Math.random() * 0.4);
        const y = canvasHeight * 0.85;

        // Spinning effect with MANY more particles - 200% INCREASE!
        for (let i = 0; i < 72; i++) {
          // 200% INCREASE: 36 → 72!
          // More rotations for longer effect
          const baseAngle = (i / 72) * Math.PI * 10; // 5 full rotations!
          crackerTl.call(
            () => {
              particleSystem.emitBurst(x, y, {
                count: 80, // 200% INCREASE: 40 → 80 particles!
                angle: { min: baseAngle - 0.4, max: baseAngle + 0.4 },
                speed: { min: 100, max: 180 },
                size: { min: 5, max: 10 }, // 200% LARGER!
                life: 1500 + Math.random() * 700,
                colors: [
                  colors[Math.floor(Math.random() * colors.length)] ||
                    colors[0],
                ],
              });
            },
            [],
            i * 0.04,
          ); // Even faster rotation!
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

      // MOBILE FIX: Position sparkles in MIDDLE-TOP area (25-40%) not extreme top (8-20%)
      // This keeps sparkles visible in small mobile viewport
      const x = canvasWidth * (0.35 + Math.random() * 0.3);
      const y = canvasHeight * (0.08 + Math.random() * 0.12);

      if (pattern === "willow") {
        // Willow - drooping effect with trails - 200% INCREASE!
        // MOBILE FIX: Slower speeds and larger sizes for mobile visibility
        sparkleTl.call(() => {
          particleSystem.emitBurst(x, y, {
            count: 240, // 200% INCREASE: 120 → 240!
            angle: undefined, // Full radial
            speed: { min: 35, max: 90 }, // Even slower on mobile!
            size: { min: 5, max: 10 }, // Larger on mobile!
            life: 3500 + Math.random() * 1200, // MUCH longer life!
            colors: [
              colors[Math.floor(Math.random() * colors.length)] || colors[0],
            ],
          });

          // Secondary sparkles after 0.2s - 200% MORE!
          setTimeout(() => {
            particleSystem.emitBurst(x, y + 30, {
              count: 160, // 200% INCREASE: 80 → 160!
              angle: { min: Math.PI * 0.3, max: Math.PI * 0.7 }, // Downward
              speed: { min: 20, max: 55 }, // Slower on mobile
              size: { min: 5, max: 9 }, // Larger on mobile
              life: 3000,
              colors: ["#FFD700", "#FFA500"], // Golden sparkles
            });
          }, 200);

          // TRIPLE burst for density - 200% INCREASE!
          setTimeout(() => {
            particleSystem.emitBurst(x, y + 50, {
              count: 120, // 200% INCREASE: 60 → 120!
              angle: undefined,
              speed: { min: 18, max: 45 }, // Slower on mobile
              size: { min: 4, max: 8 }, // Larger on mobile
              life: 2800,
              colors: [
                colors[Math.floor(Math.random() * colors.length)] || colors[0],
              ],
            });
          }, 400);
        });
      } else if (pattern === "palm") {
        // Palm - burst then fall pattern - 200% INCREASE!
        // MOBILE FIX: Slower speeds and larger sizes for mobile visibility
        sparkleTl.call(() => {
          particleSystem.emitBurst(x, y, {
            count: 200, // 200% INCREASE: 100 → 200!
            angle: { min: -Math.PI * 0.3, max: -Math.PI * 0.7 }, // Upward
            speed: { min: 60, max: 110 }, // Slower on mobile
            size: { min: 6, max: 12 }, // Larger on mobile
            life: 2500,
            colors: [
              colors[Math.floor(Math.random() * colors.length)] || colors[0],
            ],
          });

          // Secondary burst at peak - 200% MORE!
          setTimeout(() => {
            particleSystem.emitBurst(x, y - 50, {
              count: 280, // 200% INCREASE: 140 → 280!
              angle: undefined,
              speed: { min: 30, max: 75 }, // Slower on mobile
              size: { min: 5, max: 11 }, // Larger on mobile
              life: 3200,
              colors: [
                colors[Math.floor(Math.random() * colors.length)] || colors[0],
              ],
            });
          }, 400);

          // TRIPLE burst for palm - 200% INCREASE!
          setTimeout(() => {
            particleSystem.emitBurst(x, y - 30, {
              count: 160, // 200% INCREASE: 80 → 160!
              angle: undefined,
              speed: { min: 22, max: 58 }, // Slower on mobile
              size: { min: 4, max: 10 }, // Larger on mobile
              life: 2900,
              colors: [
                colors[Math.floor(Math.random() * colors.length)] || colors[0],
              ],
            });
          }, 600);
        });
      } else {
        // Crossette - multiple LARGE bursts in pattern - 200% INCREASE!
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
                count: 140, // 200% INCREASE: 70 → 140!
                angle: undefined,
                speed: { min: 45, max: 100 }, // Slower on mobile
                size: { min: 5, max: 12 }, // Larger on mobile
                life: 2500 + Math.random() * 1000,
                colors: [
                  colors[Math.floor(Math.random() * colors.length)] ||
                    colors[0],
                ],
              });

              // Double burst for each crossette position - 200% INCREASE!
              setTimeout(() => {
                particleSystem.emitBurst(x + pos.dx, y + pos.dy, {
                  count: 100, // 200% INCREASE: 50 → 100!
                  angle: undefined,
                  speed: { min: 30, max: 70 }, // Slower on mobile
                  size: { min: 4, max: 10 }, // Larger on mobile
                  life: 2000 + Math.random() * 800,
                  colors: [
                    colors[Math.floor(Math.random() * colors.length)] ||
                      colors[0],
                  ],
                });
              }, 150);
            },
            [],
            idx * 0.08,
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

      // Animate ground glow to pulse with crackers - MORE VISIBLE!
      tl.to(
        ".fireworks-ground-glow",
        {
          opacity: 0.8, // Increased for better visibility
          duration: 0.8,
          ease: "power2.in",
        },
        1.2, // Start with crackers
      );

      tl.to(
        ".fireworks-ground-glow",
        {
          opacity: 0.5, // Higher base for visibility
          duration: 0.4,
          ease: "sine.inOut",
          repeat: 15, // More pulses for extended phase
          yoyo: true,
        },
        2,
      );

      // Phase 2: Launch fireworks with staggered timing (1-7s = 6 seconds of pure fireworks!)
      setAnimationPhase("fireworks");

      // NEW STRUCTURE: Dedicated 6-second fireworks phase before text
      const fireworksOnlyDuration = 6; // 6 seconds of pure fireworks
      const staggerDelay = fireworksOnlyDuration / burstCount;

      // Launch main fireworks with OVERLAPPING distribution for maximum density!
      // 200% INCREASE: TRIPLE burst system = 3 × 50 = 150 total bursts!
      for (let i = 0; i < burstCount; i++) {
        const delay = 1 + i * staggerDelay * 0.6; // 40% faster = MORE OVERLAP!
        const fireworkTl = launchFirework(i, canvasWidth, canvasHeight, 0);
        if (fireworkTl) {
          tl.add(fireworkTl, delay);
        }
      }

      // Second wave offset by 0.3s
      for (let i = 0; i < burstCount; i++) {
        const delay = 1.3 + i * staggerDelay * 0.6; // Offset by 0.3s
        const fireworkTl = launchFirework(
          i + burstCount,
          canvasWidth,
          canvasHeight,
          0,
        );
        if (fireworkTl) {
          tl.add(fireworkTl, delay);
        }
      }

      // 200% INCREASE: THIRD wave offset by 0.6s for MAXIMUM density!
      for (let i = 0; i < burstCount; i++) {
        const delay = 1.6 + i * staggerDelay * 0.6; // Offset by 0.6s
        const fireworkTl = launchFirework(
          i + burstCount * 2,
          canvasWidth,
          canvasHeight,
          0,
        );
        if (fireworkTl) {
          tl.add(fireworkTl, delay);
        }
      }

      // NEW: Add ground crackers - 200% INCREASE!
      const crackerStartTime = 1.2; // Start early for continuous ground effect

      // Launch 16 Anar (Flower Pot) crackers - 200% INCREASE: 8 → 16!
      const anarTimings = [
        0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8, 5.2, 5.6,
        6.0,
      ];
      anarTimings.forEach((timing) => {
        const anar = launchGroundCracker(canvasWidth, canvasHeight, 0, "anar");
        if (anar) {
          tl.add(anar, crackerStartTime + timing);
        }
      });

      // Launch 12 fountain crackers - 200% INCREASE: 6 → 12!
      const fountainTimings = [
        0.3, 0.8, 1.3, 1.8, 2.3, 2.8, 3.3, 3.8, 4.3, 4.8, 5.3, 5.8,
      ];
      fountainTimings.forEach((timing) => {
        const fountain = launchGroundCracker(
          canvasWidth,
          canvasHeight,
          0,
          "fountain",
        );
        if (fountain) {
          tl.add(fountain, crackerStartTime + timing);
        }
      });

      // Launch 16 chakri (spinning wheel) crackers - 200% INCREASE: 8 → 16!
      const chakriTimings = [
        0.2, 0.6, 1.0, 1.4, 1.8, 2.2, 2.6, 3.0, 3.4, 3.8, 4.2, 4.6, 5.0, 5.4,
        5.8, 6.2,
      ];
      chakriTimings.forEach((timing) => {
        const chakri = launchGroundCracker(
          canvasWidth,
          canvasHeight,
          0,
          "chakri",
        );
        if (chakri) {
          tl.add(chakri, crackerStartTime + timing);
        }
      });

      // NEW: Add top sparkles - 200% INCREASE: 12 → 24 sparkles!
      const sparkleStartTime = 1.5; // Start with the fireworks

      // Add 24 sparkle patterns for MAXIMUM coverage - 200% INCREASE!
      const sparkleSequence = [
        { delay: 0, type: "willow" as const },
        { delay: 0.35, type: "palm" as const },
        { delay: 0.7, type: "crossette" as const },
        { delay: 1.05, type: "willow" as const },
        { delay: 1.4, type: "palm" as const },
        { delay: 1.75, type: "crossette" as const },
        { delay: 2.1, type: "willow" as const },
        { delay: 2.45, type: "palm" as const },
        { delay: 2.8, type: "crossette" as const },
        { delay: 3.15, type: "willow" as const },
        { delay: 3.5, type: "palm" as const },
        { delay: 3.85, type: "crossette" as const },
        { delay: 4.2, type: "willow" as const },
        { delay: 4.55, type: "palm" as const },
        { delay: 4.9, type: "crossette" as const },
        { delay: 5.25, type: "willow" as const },
        { delay: 5.6, type: "palm" as const },
        { delay: 5.95, type: "crossette" as const },
        { delay: 6.3, type: "willow" as const },
        { delay: 6.65, type: "palm" as const },
        { delay: 7.0, type: "crossette" as const },
        { delay: 7.35, type: "willow" as const },
        { delay: 7.7, type: "palm" as const },
        { delay: 8.05, type: "crossette" as const },
      ];

      sparkleSequence.forEach((sparkle) => {
        const sparkleEffect = launchTopSparkle(
          canvasWidth,
          canvasHeight,
          0,
          sparkle.type,
        );
        if (sparkleEffect) {
          tl.add(sparkleEffect, sparkleStartTime + sparkle.delay);
        }
      });

      // Phase 3: Text reveal AFTER fireworks complete (starts at 7.5s)
      const textRevealStart = 7.5; // Fixed timing: text appears after 6s of fireworks
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
    enableLoop,
    onAnimationComplete,
    useReducedMotion,
    launchFirework,
    launchBackgroundFirework,
    launchGroundCracker,
    launchTopSparkle,
  ]);

  // Performance tuning: Particle multiplier for maxParticles
  const PARTICLE_MULTIPLIER = 6.0; // 200% INCREASE: 4.0 → 6.0 for MAXIMUM density!

  // Full quality settings for all devices
  const desktopGravity = 60; // Standard gravity for all devices
  const desktopParticleSize = 6; // Standard size for all devices

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Background */}
      <div
        className="fireworks-bg absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        }}
      />

      {/* Ground Glow Effect - Makes bottom crackers more visible */}
      <div
        className="fireworks-ground-glow absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none opacity-0"
        style={{
          background: `linear-gradient(to top,
            ${colors[0]}15 0%,
            ${colors[1] || colors[0]}10 20%,
            transparent 100%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* T107: Particle Canvas with Gravity Simulation */}
      <ParticleCanvas
        ref={canvasRef}
        config={{
          maxParticles: particleCount * PARTICLE_MULTIPLIER, // 200% INCREASE: 2400 * 6.0 = 14,400 particles!
          colors: colors,
          particleSize: desktopParticleSize, // MOBILE: 8px, DESKTOP: 6px
          lifespan: 4000, // 200% INCREASE: 3000 → 4000ms for longer visibility!
          gravity: desktopGravity, // MOBILE: 40 (lighter), DESKTOP: 60
          friction: 0.99, // LESS friction = particles float more
          velocityVariation: 0.25, // Slightly reduced variation for containment
          opacity: 1,
          blendMode: "screen",
        }}
        className="absolute inset-0 pointer-events-none"
        autoStart
      />

      {/* T111: Text Overlay */}
      <div className="fireworks-content absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-4 sm:space-y-6 px-4">
          {/* Recipient Name */}
          <div className="fireworks-recipient opacity-0">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
              style={{
                color: "#FFFFFF",
                textShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.9), 0 8px 20px rgba(0, 0, 0, 0.85), 0 2px 4px rgba(0, 0, 0, 1)",
              }}
            >
              {recipientName}
            </h1>
          </div>

          {/* Message */}
          {message && (
            <div className="fireworks-message opacity-0">
              <p
                className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto px-4"
                style={{
                  color: "#FFFFFF",
                  textShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.8)",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  padding: "1rem 1.5rem",
                  borderRadius: "0.75rem",
                  backdropFilter: "blur(8px)",
                }}
              >
                {message}
              </p>
            </div>
          )}

          {/* Sender Name */}
          <div className="fireworks-sender opacity-0">
            <p
              className="text-base sm:text-lg md:text-xl"
              style={{
                color: "#FFD700",
                textShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.85), 0 4px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
              }}
            >
              From {senderName}
            </p>
          </div>
        </div>
      </div>

      {/* Animation Phase Indicator (dev only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded">
          Phase: {animationPhase}
        </div>
      )}
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
export const FireworksTemplate = memo(
  FireworksTemplateComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.recipientName === nextProps.recipientName &&
      prevProps.senderName === nextProps.senderName &&
      prevProps.message === nextProps.message &&
      prevProps.burstCount === nextProps.burstCount &&
      prevProps.particleCount === nextProps.particleCount &&
      prevProps.duration === nextProps.duration &&
      prevProps.enableLoop === nextProps.enableLoop &&
      prevProps.relationshipContext.colorIntensity ===
        nextProps.relationshipContext.colorIntensity &&
      prevProps.relationshipContext.animationSpeed ===
        nextProps.relationshipContext.animationSpeed &&
      JSON.stringify(prevProps.colorPalette) ===
        JSON.stringify(nextProps.colorPalette)
    );
  },
);

FireworksTemplate.displayName = "FireworksTemplate";
