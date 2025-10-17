"use client";

/**
 * Christmas Template Component
 * Animated greeting template for Christmas
 * Features: Snow globe effect with twinkling lights
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FESTIVALS } from "@/lib/constants";
import type { RelationshipContext } from "@/types";
import { generateUniqueKey } from "@/lib/utils";

interface ChristmasTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function ChristmasTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: ChristmasTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const festivalData = FESTIVALS.christmas;
  const colors = festivalData.colorPalette;

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      // Background fade in
      tl.from(".christmas-bg", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Snowflakes falling
      tl.from(".snowflake", {
        y: -100,
        opacity: 0,
        duration: 2,
        stagger: 0.1,
        ease: "power1.in",
      });

      // Lights twinkling
      tl.to(
        ".light",
        {
          opacity: 0.4,
          duration: 0.5,
          stagger: 0.1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        },
        "-=1.5",
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
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className="christmas-bg relative flex min-h-screen items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${colors[1]}, ${colors[0]})`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Snowflakes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`snow-${generateUniqueKey()}`}
            className="snowflake absolute text-white text-2xl opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ❄
          </div>
        ))}

        {/* Twinkling lights */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`light-${generateUniqueKey()}`}
            className="light absolute h-3 w-3 rounded-full"
            style={{
              backgroundColor: colors[2],
              left: `${Math.random() * 100}%`,
              top: `${10 + i * 5}%`,
              boxShadow: `0 0 15px ${colors[2]}`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center space-y-6">
        <h1 className="greeting-text text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
          Merry Christmas!
        </h1>

        <div className="space-y-4">
          <p className="recipient-name text-3xl sm:text-4xl font-semibold text-white drop-shadow-md">
            Dear {recipientName},
          </p>

          <p className="greeting-text text-lg sm:text-xl leading-relaxed px-4 text-white drop-shadow-md">
            {message ||
              `Wishing you a magical Christmas filled with joy, peace, and love!`}
          </p>

          <p className="sender-name text-xl sm:text-2xl font-medium mt-8 text-white drop-shadow-md">
            With warm wishes,
            <br />
            {senderName}
          </p>
        </div>
      </div>
    </div>
  );
}
