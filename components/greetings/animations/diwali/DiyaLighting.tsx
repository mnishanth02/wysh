"use client";

/**
 * DiyaLighting Component
 * Animated diya (oil lamps) with staggered lighting effect
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export interface DiyaLightingProps {
  count?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
}

/**
 * DiyaLighting component with GSAP scale/opacity animation
 */
export function DiyaLighting({
  count = 5,
  duration = 1,
  delay = 0,
  stagger = 0.2,
  onComplete,
}: DiyaLightingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <false positive>
  useEffect(() => {
    if (!containerRef.current) return;

    const diyas = containerRef.current.querySelectorAll(".diya");

    // Create timeline
    const tl = gsap.timeline({
      delay,
      onComplete,
    });

    // Animate diyas lighting up
    tl.fromTo(
      diyas,
      {
        opacity: 0,
        scale: 0.5,
        filter: "drop-shadow(0 0 0px rgba(255, 165, 0, 0))",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "drop-shadow(0 0 20px rgba(255, 165, 0, 0.8))",
        duration,
        stagger,
        ease: "power2.out",
      },
    );

    // Add flickering flame animation
    tl.to(
      diyas,
      {
        filter: "drop-shadow(0 0 25px rgba(255, 165, 0, 1))",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
      "-=0.5",
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [count, duration, delay, stagger, onComplete]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-end justify-around px-8 pb-12"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Stable array of fixed count
          key={index}
          className="diya relative"
          style={{
            width: "60px",
            height: "72px",
            opacity: 0,
          }}
        >
          <Image
            src="/festivals/diwali/diya.svg"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      ))}
    </div>
  );
}
