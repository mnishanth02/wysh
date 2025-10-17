"use client";

/**
 * RangoliDraw Component
 * SVG path animation for traditional rangoli pattern
 */

import { useEffect, useRef } from "react";
import { animateSVGPath } from "@/lib/animations/gsap-config";

export interface RangoliDrawProps {
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

/**
 * RangoliDraw with SVG path animation
 */
export function RangoliDraw({
  duration = 3,
  delay = 0,
  onComplete,
}: RangoliDrawProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path, circle[stroke]");
    const timelines: gsap.core.Tween[] = [];

    // Animate each path in sequence
    paths.forEach((path, index) => {
      if (path instanceof SVGPathElement) {
        const tween = animateSVGPath(
          path,
          duration / paths.length,
          delay + (index * duration) / paths.length,
          "none",
        );
        timelines.push(tween);
      }
    });

    // Call onComplete after all animations
    if (onComplete && timelines.length > 0) {
      timelines[timelines.length - 1].eventCallback("onComplete", onComplete);
    }

    return () => {
      for (const tl of timelines) {
        tl.kill();
      }
    };
  }, [duration, delay, onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-fade-in">
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-48 h-48"
        style={{ filter: "drop-shadow(0 0 10px rgba(255, 165, 0, 0.5))" }}
        aria-hidden="true"
      >
        {/* Center circle */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="#DC143C"
          stroke="#FFA500"
          strokeWidth="2"
        />

        {/* Inner petals */}
        <g transform="translate(100, 100)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={angle}
              d="M 0 -40 Q -10 -25 -8 -15 L 0 0 L 8 -15 Q 10 -25 0 -40 Z"
              fill="none"
              stroke="#FFA500"
              strokeWidth="2"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>

        {/* Middle ring */}
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
        />

        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#FFA500"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
