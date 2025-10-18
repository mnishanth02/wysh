"use client";

/**
 * Christmas Template Component
 * Animated greeting template for Christmas
 * Features: Snow globe effect with twinkling lights
 */

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import { shouldUseReducedMotion } from "@/lib/performance";
import { generateUniqueKey } from "@/lib/utils";
import type { RelationshipContext } from "@/types";

interface ChristmasTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
  variant?: string; // "1" = Snow Globe, "2" = Tree Lights, "3" = Gift Unwrap
  isPreview?: boolean; // T151: Modal preview mode - use responsive sizing
}

export function ChristmasTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1",
  isPreview = false,
}: ChristmasTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const festivalData = FESTIVALS.christmas;
  const colors = festivalData.colorPalette;

  // T134, T145: Apply context-aware animation duration
  const animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 8
      : relationshipContext.animationSpeed === "fast"
        ? 5
        : 6.5;

  // T135, T145: Apply context-aware color intensity
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? "#8B2635" // Muted red
      : colorIntensity === "vibrant"
        ? colors[0] // Vibrant red
        : "#C41E3A"; // Moderate red

  const secondaryColor =
    colorIntensity === "muted"
      ? "#0A4D2E" // Muted green
      : colorIntensity === "vibrant"
        ? colors[1] // Vibrant green
        : "#0C6B2E"; // Moderate green

  // T121: Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  // Track if animation has started (for background opacity)
  const [bgVisible, setBgVisible] = useState(useReducedMotion);

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
        tl.set(
          [
            ".greeting-text",
            ".recipient-name",
            ".sender-name",
            ".snowflake",
            ".light",
          ],
          {
            opacity: 1,
          },
        );
        tl.call(
          () => {
            onAnimationComplete?.();
          },
          [],
          1,
        );
        return;
      }

      // Trigger background fade via React state
      setBgVisible(true);

      // Snowflakes falling - duration based on context
      tl.from(".snowflake", {
        y: -100,
        opacity: 0,
        duration: animationDuration * 0.3,
        stagger: 0.1,
        ease: "power1.in",
      });

      // Text animations
      tl.from(
        ".greeting-text",
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=1",
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

      // Lights twinkling - separate infinite animation (not blocking timeline completion)
      gsap.to(".light", {
        opacity: 0.4,
        duration: 0.5,
        stagger: 0.1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, animationDuration, useReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="christmas-bg relative flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 1s ease-out" : "none",
        width: "100%",
        height: "100%",
        minHeight: isPreview ? "auto" : "100vh",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Snowflakes */}
        {[...Array(20)].map(() => (
          <div
            key={`snow-${generateUniqueKey()}`}
            className={`snowflake absolute text-white opacity-70 ${
              isPreview ? "text-lg" : "text-2xl"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ❄
          </div>
        ))}

        {/* Twinkling lights */}
        {[...Array(15)].map(() => (
          <div
            key={`light-${generateUniqueKey()}`}
            className={`light absolute rounded-full ${
              isPreview ? "h-2 w-2" : "h-3 w-3"
            }`}
            style={{
              backgroundColor: colors[2],
              left: `${Math.random() * 100}%`,
              top: `${10 + Math.random() * 5}%`,
              boxShadow: `0 0 15px ${colors[2]}`,
            }}
          />
        ))}
      </div>

      {/* T151: Responsive content for preview and full-screen modes */}
      <div
        className={`relative z-10 max-w-2xl text-center w-full ${
          isPreview ? "space-y-4 sm:space-y-6" : "space-y-6"
        }`}
      >
        <h1
          className={`greeting-text font-bold text-white drop-shadow-lg ${
            isPreview
              ? "text-3xl sm:text-4xl md:text-5xl"
              : "text-5xl sm:text-6xl md:text-7xl"
          }`}
        >
          Merry Christmas!
        </h1>

        <div className={isPreview ? "space-y-3 sm:space-y-4" : "space-y-4"}>
          <p
            className={`recipient-name font-semibold text-white drop-shadow-md ${
              isPreview
                ? "text-xl sm:text-2xl md:text-3xl"
                : "text-3xl sm:text-4xl"
            }`}
          >
            Dear {recipientName},
          </p>

          <p
            className={`greeting-text leading-relaxed px-4 text-white drop-shadow-md ${
              isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-lg sm:text-xl"
            }`}
          >
            {message ||
              `Wishing you a magical Christmas filled with joy, peace, and love!`}
          </p>

          <p
            className={`sender-name font-medium text-white drop-shadow-md ${
              isPreview
                ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                : "text-xl sm:text-2xl mt-8"
            }`}
          >
            With warm wishes,
            <br />
            {senderName}
          </p>
        </div>
      </div>
    </div>
  );
}
