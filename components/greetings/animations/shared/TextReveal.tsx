"use client";

/**
 * TextReveal Component
 * Character-by-character text reveal animation using GSAP
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export interface TextRevealProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  onComplete?: () => void;
}

/**
 * TextReveal component with GSAP character animation
 */
export function TextReveal({
  text,
  className,
  duration = 1,
  delay = 0,
  stagger = 0.05,
  ease = "power2.out",
  onComplete,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <false positive>
  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".char");

    // Create timeline
    const tl = gsap.timeline({
      delay,
      onComplete,
    });

    // Animate characters
    tl.fromTo(
      chars,
      {
        opacity: 0,
        y: 20,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        stagger,
        ease,
      },
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [text, duration, delay, stagger, ease, onComplete]);

  return (
    <div ref={containerRef} className={className}>
      {text.split("").map((char, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: Character position is stable and unique
          key={index}
          className="char inline-block"
          style={{ opacity: 0 }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
