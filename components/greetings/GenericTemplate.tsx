"use client";

/**
 * Generic Template Component
 * Animated greeting template for general celebrations
 * Features: Star sparkle and confetti animation
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FESTIVALS } from "@/lib/constants";
import type { RelationshipContext } from "@/types";
import { generateUniqueKey } from "@/lib/utils";

interface GenericTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function GenericTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: GenericTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const festivalData = FESTIVALS.generic;
  const colors = festivalData.colorPalette;

  // T135, T148: Apply context-aware animation duration
  const animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 8
      : relationshipContext.animationSpeed === "fast"
        ? 5
        : 6.5;

  // T135, T148: Apply context-aware color intensity
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? "#8A7BC8" // Muted purple
      : colorIntensity === "vibrant"
        ? colors[0] // Vibrant purple
        : "#667EEA"; // Moderate purple

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      // Background fade in
      tl.from(".generic-bg", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Stars twinkling - duration based on context
      tl.from(".star", {
        scale: 0,
        opacity: 0,
        duration: animationDuration * 0.12,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
      });

      tl.to(
        ".star",
        {
          scale: 1.2,
          opacity: 0.7,
          duration: 0.5,
          stagger: 0.1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        },
        "-=0.5",
      );

      // Confetti burst
      tl.from(
        ".confetti",
        {
          y: 50,
          opacity: 0,
          rotation: 0,
          duration: animationDuration * 0.15,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.8",
      );

      // Text animations
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
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, animationDuration]);

  return (
    <div
      ref={ containerRef }
      className="generic-bg relative flex min-h-screen items-center justify-center p-4"
      style={ {
        background: `linear-gradient(135deg, ${primaryColor}, ${colors[1]})`,
      } }
    >
      {/* Decorative elements */ }
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */ }
        { [...Array(12)].map((_, i) => (
          <div
            key={ `star-${generateUniqueKey()}` }
            className="star absolute text-4xl"
            style={ {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: colors[i % colors.length],
            } }
          >
            ⭐
          </div>
        )) }

        {/* Confetti */ }
        { [...Array(25)].map((_, i) => (
          <div
            key={ `confetti-${generateUniqueKey()}` }
            className="confetti absolute h-3 w-3 rounded-sm"
            style={ {
              backgroundColor: colors[i % colors.length],
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 60}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            } }
          />
        )) }
      </div>

      {/* Content */ }
      <div className="relative z-10 max-w-2xl text-center space-y-6">
        <h1 className="greeting-text text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
          Celebrating You!
        </h1>

        <div className="space-y-4">
          <p className="recipient-name text-3xl sm:text-4xl font-semibold text-white drop-shadow-md">
            Dear { recipientName },
          </p>

          <p className="greeting-text text-lg sm:text-xl leading-relaxed px-4 text-white drop-shadow-md">
            { message || `Sending you warm wishes and lots of happiness!` }
          </p>

          <p className="sender-name text-xl sm:text-2xl font-medium mt-8 text-white drop-shadow-md">
            With love,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
}
