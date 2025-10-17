"use client";

/**
 * New Year Template Component
 * Animated greeting template for New Year
 * Features: Countdown and fireworks celebration
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FESTIVALS } from "@/lib/constants";
import type { RelationshipContext } from "@/types";
import { generateUniqueKey } from "@/lib/utils";

interface NewYearTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function NewYearTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: NewYearTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const festivalData = FESTIVALS.newyear;
  const colors = festivalData.colorPalette;

  // T134, T146: Apply context-aware animation duration
  const animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 8
      : relationshipContext.animationSpeed === "fast"
        ? 5
        : 6.5;

  // T135, T146: Apply context-aware color intensity
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? "#B8A860" // Muted gold
      : colorIntensity === "vibrant"
        ? colors[0] // Vibrant gold
        : "#FFD700"; // Moderate gold

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      // Background fade in
      tl.from(".newyear-bg", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Fireworks burst - duration based on context
      tl.from(".firework", {
        scale: 0,
        opacity: 0,
        duration: animationDuration * 0.15,
        stagger: 0.2,
        ease: "back.out(2)",
      });

      // Confetti falling
      tl.from(
        ".confetti",
        {
          y: -100,
          rotation: 0,
          opacity: 0,
          duration: animationDuration * 0.23,
          stagger: 0.05,
          ease: "power2.in",
        },
        "-=0.8",
      );

      // Text animations
      tl.from(
        ".greeting-text",
        {
          scale: 0.5,
          opacity: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.5",
      );

      tl.from(
        ".recipient-name",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      );

      tl.from(
        ".sender-name",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, animationDuration]);

  return (
    <div
      ref={ containerRef }
      className="newyear-bg relative flex min-h-screen items-center justify-center p-4"
      style={ {
        background: `radial-gradient(circle, ${primaryColor}22, ${colors[1]})`,
      } }
    >
      {/* Decorative elements */ }
      <div className="absolute inset-0 overflow-hidden">
        {/* Fireworks */ }
        { [...Array(6)].map((_, i) => (
          <div
            key={ `firework-${generateUniqueKey()}` }
            className="firework absolute rounded-full"
            style={ {
              backgroundColor: colors[i % colors.length],
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 30}%`,
              opacity: 0.3,
              boxShadow: `0 0 40px ${colors[i % colors.length]}`,
            } }
          />
        )) }

        {/* Confetti */ }
        { [...Array(30)].map((_, i) => (
          <div
            key={ `confetti-${generateUniqueKey()}` }
            className="confetti absolute h-3 w-3 rounded-sm"
            style={ {
              backgroundColor: colors[i % colors.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            } }
          />
        )) }
      </div>

      {/* Content */ }
      <div className="relative z-10 max-w-2xl text-center space-y-6">
        <h1 className="greeting-text text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
          Happy New Year!
        </h1>

        <div className="space-y-4">
          <p className="recipient-name text-3xl sm:text-4xl font-semibold text-white drop-shadow-md">
            Dear { recipientName },
          </p>

          <p className="greeting-text text-lg sm:text-xl leading-relaxed px-4 text-white drop-shadow-md">
            { message ||
              `May this new year bring you endless opportunities and wonderful moments!` }
          </p>

          <p className="sender-name text-xl sm:text-2xl font-medium mt-8 text-white drop-shadow-md">
            Cheers to new beginnings,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
}
