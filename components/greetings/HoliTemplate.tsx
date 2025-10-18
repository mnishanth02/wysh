"use client";

/**
 * Holi Template Component
 * Animated greeting template for Holi festival
 * Features: Vibrant color burst animations
 */

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { FESTIVALS } from "@/lib/constants";
import { shouldUseReducedMotion } from "@/lib/performance";
import { generateUniqueKey } from "@/lib/utils";
import type { RelationshipContext } from "@/types";

interface HoliTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function HoliTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: HoliTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const festivalData = FESTIVALS.holi;
  const colors = festivalData.colorPalette;

  const _animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 7
      : relationshipContext.animationSpeed === "fast"
        ? 4
        : 5.5;

  // T121: Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      // T121: Prefers-reduced-motion: simple fade-in
      if (useReducedMotion) {
        tl.set([".holi-bg", ".color-splash", ".greeting-text", ".recipient-name", ".sender-name"], {
          opacity: 1,
        });
        tl.call(() => {
          onAnimationComplete?.();
        }, [], 1);
        return;
      }

      // Background fade in
      tl.from(".holi-bg", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // Color splashes burst from center
      tl.from(".color-splash", {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "back.out(2)",
      });

      // Text animations
      tl.from(
        ".greeting-text",
        {
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.5",
      );

      tl.from(
        ".recipient-name",
        {
          x: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      );

      tl.from(
        ".sender-name",
        {
          x: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, useReducedMotion]);

  return (
    <div
      ref={ containerRef }
      className="holi-bg relative flex min-h-screen items-center justify-center p-4"
      style={ {
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[4]})`,
      } }
    >
      {/* Color splash effects */ }
      <div className="absolute inset-0 overflow-hidden">
        { colors.map((color, i) => (
          <div
            key={ `splash-${generateUniqueKey()}` }
            className="color-splash absolute rounded-full blur-3xl"
            style={ {
              backgroundColor: color,
              opacity: 0.3,
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
            } }
          />
        )) }
      </div>

      {/* Content */ }
      <div className="relative z-10 max-w-2xl text-center space-y-6">
        <h1 className="greeting-text text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
          Happy Holi!
        </h1>

        <div className="space-y-4">
          <p className="recipient-name text-3xl sm:text-4xl font-semibold text-white drop-shadow-md">
            Dear { recipientName },
          </p>

          <p className="greeting-text text-lg sm:text-xl leading-relaxed px-4 text-white drop-shadow-md">
            { message ||
              `May your life be filled with colors of joy, love, and happiness!` }
          </p>

          <p className="sender-name text-xl sm:text-2xl font-medium mt-8 text-white drop-shadow-md">
            With colorful wishes,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
}
