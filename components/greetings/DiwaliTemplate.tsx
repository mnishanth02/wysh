"use client";

/**
 * Diwali Template Component
 * Animated greeting template for Diwali festival
 * Features: Diya lighting sequence with GSAP timeline
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FESTIVALS } from "@/lib/constants";
import type { RelationshipContext } from "@/types";
import { generateUniqueKey } from "@/lib/utils";
import {
  detectDevicePerformance,
  optimizeGSAPTimeline,
  shouldUseReducedMotion,
  startFPSMonitor,
  logPerformanceMetrics,
} from "@/lib/performance";

interface DiwaliTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function DiwaliTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: DiwaliTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const festivalData = FESTIVALS.diwali;
  const colors = festivalData.colorPalette;

  // Adjust animation duration based on relationship context
  const animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 8
      : relationshipContext.animationSpeed === "fast"
        ? 5
        : 6.5;

  // Adjust color intensity based on relationship context
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? "#D4A574"
      : colorIntensity === "vibrant"
        ? colors[0]
        : colors[1];

  // biome-ignore lint/correctness/useExhaustiveDependencies: <false positive>
  useEffect(() => {
    if (!containerRef.current) return;

    // T125: Start FPS monitoring for performance profiling
    const fpsMonitor =
      process.env.NODE_ENV === "development" ? startFPSMonitor() : null;

    // T127: Check for reduced motion preference
    const useReducedMotion = shouldUseReducedMotion();

    // T124: Detect device performance for optimization
    const devicePerf = detectDevicePerformance();

    const ctx = gsap.context(() => {
      // Create GSAP timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // T125: Log performance metrics after animation completes
          if (fpsMonitor) {
            const metrics = fpsMonitor.stop();
            logPerformanceMetrics("DiwaliTemplate", metrics);
          }
          onAnimationComplete?.();
        },
      });

      // T127: Skip animations for reduced motion preference
      if (useReducedMotion) {
        tl.set(
          [
            ".diwali-bg",
            ".diya",
            ".flame",
            ".greeting-text",
            ".recipient-name",
            ".sender-name",
            ".sparkle",
          ],
          {
            opacity: 1,
            scale: 1,
          },
        );
        tl.play();
        return;
      }

      // T126: Optimize timeline based on device performance
      optimizeGSAPTimeline(tl, devicePerf);

      timelineRef.current = tl;

      // Fade in background
      tl.from(".diwali-bg", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Animate diyas lighting up sequentially
      tl.from(
        ".diya",
        {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.3,
          ease: "back.out(1.7)",
        },
        "+=0.5",
      );

      // Animate flames flickering
      tl.to(
        ".flame",
        {
          scale: 1.1,
          opacity: 0.9,
          duration: 0.3,
          stagger: 0.1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        },
        "-=1",
      );

      // Fade in greeting text
      tl.from(
        ".greeting-text",
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5",
      );

      // Fade in names
      tl.from(
        ".recipient-name",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      );

      tl.from(
        ".sender-name",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5",
      );

      // Sparkle effects
      tl.from(
        ".sparkle",
        {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=1",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, animationDuration]);

  return (
    <div
      ref={containerRef}
      className="diwali-bg relative flex min-h-screen items-center justify-center p-4 mobile-p-4"
      style={{
        background: `linear-gradient(135deg, ${colors[2]}, ${colors[3]})`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Diyas */}
        {[...Array(5)].map((_, i) => (
          <div
            key={generateUniqueKey()}
            className="diya absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
              transform: "scale(0.7) sm:scale(1)",
            }}
          >
            {/* Diya base */}
            <div
              className="relative h-6 w-10 sm:h-8 sm:w-12 rounded-full"
              style={{ backgroundColor: colors[1] }}
            >
              {/* Flame */}
              <div
                className="flame absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 h-5 w-3 sm:h-6 sm:w-4 rounded-full"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 15px ${primaryColor}, 0 0 20px ${primaryColor}`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Sparkles */}
        {[...Array(12)].map(() => (
          <div
            key={generateUniqueKey()}
            className="sparkle absolute h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full"
            style={{
              backgroundColor: colors[0],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 8px ${colors[0]}, 0 0 10px ${colors[0]}`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center space-y-4 sm:space-y-6 px-4">
        <h1
          className="greeting-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
          style={{ color: colors[0] }}
        >
          Happy Diwali!
        </h1>

        <div className="space-y-3 sm:space-y-4">
          <p
            className="recipient-name text-2xl sm:text-3xl md:text-4xl font-semibold"
            style={{ color: colors[3] }}
          >
            Dear {recipientName},
          </p>

          <p
            className="greeting-text text-base sm:text-lg md:text-xl leading-relaxed px-2 sm:px-4"
            style={{ color: colors[3] }}
          >
            {message ||
              `May this Diwali bring light, prosperity, and joy to your life!`}
          </p>

          <p
            className="sender-name text-lg sm:text-xl md:text-2xl font-medium mt-6 sm:mt-8"
            style={{ color: colors[1] }}
          >
            With love,
            <br />
            {senderName}
          </p>
        </div>
      </div>
    </div>
  );
}
