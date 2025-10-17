"use client";

/**
 * Pongal Template Component
 * Animated greeting template for Pongal
 * Features: Rising sun with harvest symbols
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FESTIVALS } from "@/lib/constants";
import type { RelationshipContext } from "@/types";
import { generateUniqueKey } from "@/lib/utils";

interface PongalTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function PongalTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: PongalTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const festivalData = FESTIVALS.pongal;
  const colors = festivalData.colorPalette;

  // T134, T147: Apply context-aware animation duration
  const animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 8
      : relationshipContext.animationSpeed === "fast"
        ? 5
        : 6.5;

  // T135, T147: Apply context-aware color intensity
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? "#B87A3A" // Muted orange
      : colorIntensity === "vibrant"
        ? colors[0] // Vibrant orange
        : "#FF8C42"; // Moderate orange

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      // Background fade in
      tl.from(".pongal-bg", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Sun rising - duration based on context
      tl.from(".sun", {
        y: 100,
        scale: 0.5,
        opacity: 0,
        duration: animationDuration * 0.3,
        ease: "power2.out",
      });

      // Sun rays rotating
      tl.to(
        ".sun-ray",
        {
          rotation: 360,
          duration: 3,
          repeat: -1,
          ease: "linear",
        },
        "-=1.5",
      );

      // Kolam patterns appearing
      tl.from(
        ".kolam",
        {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=1",
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
      className="pongal-bg relative flex min-h-screen items-center justify-center p-4"
      style={ {
        background: `linear-gradient(135deg, ${colors[1]}, ${primaryColor})`,
      } }
    >
      {/* Decorative elements */ }
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun */ }
        <div className="sun absolute left-1/2 top-32 -translate-x-1/2">
          <div
            className="relative h-32 w-32 rounded-full"
            style={ {
              backgroundColor: colors[2],
              boxShadow: `0 0 60px ${colors[2]}`,
            } }
          >
            {/* Sun rays */ }
            { [...Array(8)].map((_, i) => (
              <div
                key={ `ray-${generateUniqueKey()}` }
                className="sun-ray absolute left-1/2 top-1/2"
                style={ {
                  width: "4px",
                  height: "60px",
                  backgroundColor: colors[0],
                  transform: `rotate(${i * 45}deg) translate(-2px, -60px)`,
                  transformOrigin: "center bottom",
                } }
              />
            )) }
          </div>
        </div>

        {/* Kolam patterns */ }
        { [...Array(8)].map((_, i) => (
          <div
            key={ `kolam-${generateUniqueKey()}` }
            className="kolam absolute h-8 w-8 rounded-full border-4"
            style={ {
              borderColor: colors[3],
              left: `${20 + (i % 4) * 20}%`,
              top: `${60 + Math.floor(i / 4) * 20}%`,
            } }
          />
        )) }
      </div>

      {/* Content */ }
      <div className="relative z-10 max-w-2xl text-center space-y-6">
        <h1
          className="greeting-text text-5xl sm:text-6xl md:text-7xl font-bold drop-shadow-lg"
          style={ { color: colors[2] } }
        >
          Pongal Vazhthukkal!
        </h1>

        <div className="space-y-4">
          <p
            className="recipient-name text-3xl sm:text-4xl font-semibold drop-shadow-md"
            style={ { color: colors[3] } }
          >
            Dear { recipientName },
          </p>

          <p
            className="greeting-text text-lg sm:text-xl leading-relaxed px-4 drop-shadow-md"
            style={ { color: colors[2] } }
          >
            { message ||
              `May this harvest festival bring abundant prosperity and happiness to you and your family!` }
          </p>

          <p
            className="sender-name text-xl sm:text-2xl font-medium mt-8 drop-shadow-md"
            style={ { color: colors[0] } }
          >
            With best wishes,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
}
