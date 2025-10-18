"use client";

/**
 * Sample Greeting Component
 * Simplified version of greeting templates for landing page showcase
 * Features: Reduced complexity animations, auto-play, subtle looping
 */

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import { getRelationshipContext } from "@/lib/context-engine";
import type { FestivalType, RelationshipType } from "@/types";

interface SampleGreetingProps {
  festivalType: FestivalType;
  relationshipType: RelationshipType;
  recipientName: string;
  senderName: string;
  label: string;
  description: string;
  isVisible: boolean; // For lazy loading
}

export function SampleGreeting({
  festivalType,
  relationshipType,
  recipientName,
  senderName,
  label,
  description,
  isVisible,
}: SampleGreetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  // Generate deterministic decorator colors based on festival type to avoid hydration mismatch
  const [decoratorColors] = useState(() => {
    const festivalData = FESTIVALS[festivalType];
    const colors = festivalData.colorPalette;
    // Use a deterministic approach: cycle through colors instead of random
    return [...Array(6)].map((_, index) => colors[index % colors.length]);
  });

  const festivalData = FESTIVALS[festivalType];
  const relationshipContext = getRelationshipContext(relationshipType);
  const colors = festivalData.colorPalette;

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    const ctx = gsap.context(() => {
      // Create looping timeline
      const tl = gsap.timeline({
        repeat: -1, // Infinite loop
        repeatDelay: 2, // 2 second pause between loops
        onStart: () => setIsPlaying(true),
      });

      timelineRef.current = tl;

      // Universal simplified animation pattern
      // Works for all festival types with minimal overhead

      // 1. Fade in background
      tl.from(".sample-bg", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // 2. Scale in decorative elements
      tl.from(
        ".sample-decor",
        {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );

      // 3. Fade in text content
      tl.from(
        ".sample-text",
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.4",
      );

      // 4. Gentle pulse at the end
      tl.to(
        ".sample-decor",
        {
          scale: 1.1,
          opacity: 0.8,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        "+=0.5",
      );

      // 5. Fade out for loop
      tl.to(
        [".sample-bg", ".sample-decor", ".sample-text"],
        {
          opacity: 0.3,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "+=0.5",
      );
    }, containerRef);

    return () => {
      ctx.revert();
      setIsPlaying(false);
    };
  }, [isVisible]);

  // Get primary color based on relationship context
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? adjustColorIntensity(colors[0], 0.7)
      : colorIntensity === "vibrant"
        ? colors[0]
        : colors[1];

  const secondaryColor = colors[colors.length > 2 ? 2 : 1];

  return (
    <div className="relative">
      {/* Sample Container */}
      <div
        ref={containerRef}
        className="sample-bg relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] sm:aspect-[16/9]"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 sm:gap-6 opacity-20">
            {decoratorColors.map((color, index) => (
              <div
                key={`${festivalType}-decor-${index}-${color}`}
                className="sample-decor h-8 w-8 sm:h-12 sm:w-12 rounded-full"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 sm:p-6 text-center">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="sample-text text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {festivalData.displayName}
            </h3>
            <p className="sample-text text-sm sm:text-base text-white/90 drop-shadow-md">
              For {recipientName}
            </p>
            <p className="sample-text text-xs sm:text-sm text-white/80 drop-shadow-md">
              From {senderName}
            </p>
          </div>
        </div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" />
            <span className="text-xs text-white/80 hidden sm:inline">
              Preview
            </span>
          </div>
        )}
      </div>

      {/* Label and description */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/**
 * Helper function to adjust color intensity
 * Simplified version from context-engine.ts for sample use
 */
function adjustColorIntensity(hexColor: string, multiplier: number): string {
  const hex = hexColor.replace("#", "");
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  const adjustChannel = (channel: number): number => {
    if (multiplier < 1.0) {
      const gray = 128;
      return Math.round(channel + (gray - channel) * (1 - multiplier));
    }
    const adjusted = Math.round(channel * multiplier);
    return Math.min(255, adjusted);
  };

  const newR = adjustChannel(r);
  const newG = adjustChannel(g);
  const newB = adjustChannel(b);

  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}
