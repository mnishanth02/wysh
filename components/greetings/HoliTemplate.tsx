"use client";

/**
 * Holi Template Component
 * Animated greeting template for Holi festival
 * Features: Vibrant color burst animations
 */

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
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
  variant?: string; // "1" = Color Splash, "2" = Water Balloons, "3" = Rainbow Wave
  isPreview?: boolean; // T151: Modal preview mode - use responsive sizing
}

export function HoliTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1",
  isPreview = false,
}: HoliTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgVisible, setBgVisible] = useState(false);

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
        setBgVisible(true);
        tl.set(
          [
            ".color-splash",
            ".greeting-text",
            ".recipient-name",
            ".sender-name",
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

      // Color splashes burst from center
      tl.from(".color-splash", {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "back.out(2)",
      }).to(
        ".color-splash",
        {
          opacity: 0.3,
          duration: 0,
        },
        "<",
      );

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
      ref={containerRef}
      className="holi-bg relative flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[4]})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 0.8s ease-out" : "none",
        width: "100%",
        height: "100%",
        minHeight: isPreview ? "auto" : "100vh",
      }}
    >
      {/* Color splash effects */}
      <div className="absolute inset-0 overflow-hidden">
        {colors.map((color, i) => (
          <div
            key={`splash-${generateUniqueKey()}`}
            className="color-splash absolute rounded-full blur-3xl"
            style={{
              backgroundColor: color,
              opacity: 0,
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
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
          className={`greeting-text font-bold opacity-0 ${
            isPreview
              ? "text-3xl sm:text-4xl md:text-5xl"
              : "text-5xl sm:text-6xl md:text-7xl"
          }`}
          style={{
            color: "#FFFFFF",
            textShadow:
              "0 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 0, 0, 0.8), 0 6px 15px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 1)",
          }}
        >
          Happy Holi!
        </h1>

        <div className={isPreview ? "space-y-3 sm:space-y-4" : "space-y-4"}>
          <p
            className={`recipient-name font-semibold opacity-0 ${
              isPreview
                ? "text-xl sm:text-2xl md:text-3xl"
                : "text-3xl sm:text-4xl"
            }`}
            style={{
              color: "#FFFFFF",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 1)",
            }}
          >
            Dear {recipientName},
          </p>

          <p
            className={`greeting-text leading-relaxed px-4 opacity-0 ${
              isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-lg sm:text-xl"
            }`}
            style={{
              color: "#FFFFFF",
              textShadow:
                "0 2px 6px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              backdropFilter: "blur(6px)",
            }}
          >
            {message ||
              `May your life be filled with colors of joy, love, and happiness!`}
          </p>

          <p
            className={`sender-name font-medium opacity-0 ${
              isPreview
                ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                : "text-xl sm:text-2xl mt-8"
            }`}
            style={{
              color: "#FFD700",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
            }}
          >
            With colorful wishes,
            <br />
            {senderName}
          </p>
        </div>
      </div>
    </div>
  );
}
