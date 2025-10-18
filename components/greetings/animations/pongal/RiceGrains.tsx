"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

interface RiceGrainsProps {
  /** Number of rice grain particles */
  grainCount?: number;
  /** Duration of animation in seconds */
  duration?: number;
  /** Color of rice grains */
  grainColor?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * RiceGrains Animation Component for Pongal
 *
 * Small rice grain particles falling like gentle rain in the background.
 * Continuous slow vertical fall with slight randomization.
 *
 * Task: T069
 */
export function RiceGrains({
  grainCount = 40,
  duration = 8,
  grainColor = "#FFF8DC",
  onComplete,
}: RiceGrainsProps) {
  const containerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const grains = containerRef.current.querySelectorAll(".rice-grain");
    const tl = gsap.timeline({
      repeat: -1, // Loop infinitely
      onComplete,
    });

    grains.forEach((grain, index) => {
      const element = grain as SVGElement;

      // Random starting y position above viewport
      const startY = gsap.utils.random(-50, -20);
      // Random ending y position below viewport
      const endY = gsap.utils.random(200, 220);
      // Random horizontal position
      const x = gsap.utils.random(10, 190);
      // Random fall duration (slow vertical fall: vy = 50-100 px/s)
      const fallDuration = gsap.utils.random(duration * 0.8, duration * 1.2);
      // Random delay for staggered start
      const delay = (index / grainCount) * duration * 0.5;

      // Set initial position
      gsap.set(element, {
        x,
        y: startY,
        opacity: 0,
      });

      // Animate falling
      tl.to(
        element,
        {
          y: endY,
          opacity: 0.7,
          duration: fallDuration,
          ease: "none",
          // Slight horizontal drift
          x: `+=${gsap.utils.random(-10, 10)}`,
          // Gentle rotation while falling
          rotation: gsap.utils.random(-180, 180),
        },
        delay,
      );

      // Fade out near bottom
      tl.to(
        element,
        {
          opacity: 0,
          duration: fallDuration * 0.2,
        },
        delay + fallDuration * 0.8,
      );
    });

    return () => {
      tl.kill();
    };
  }, [grainCount, duration, onComplete]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        role="img"
        aria-hidden="true"
      >
        <title>Falling rice grains</title>
        <defs>
          {/* Define rice grain shape */}
          <ellipse id="rice-grain-shape" rx="1.5" ry="3" />
        </defs>

        <g ref={containerRef}>
          {Array.from({ length: grainCount }, (_, i) => {
            // Generate stable unique key based on grain position
            const grainKey = `rice-grain-${i}-${Math.random().toString(36).slice(2, 9)}`;
            return (
              <use
                key={grainKey}
                href="#rice-grain-shape"
                className="rice-grain"
                fill={grainColor}
                opacity="0"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
