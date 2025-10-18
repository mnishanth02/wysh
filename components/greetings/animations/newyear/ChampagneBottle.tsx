"use client";

/**
 * ChampagneBottle Component - New Year Champagne Pop Animation
 * SVG champagne bottle with cork pop animation
 * Features: Bottle shake, cork explosion with rotation and trajectory
 */

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { CHAMPAGNE_SPARKLE_COLORS } from "@/lib/animations/festival-themes";

interface ChampagneBottleProps {
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Callback when cork pop animation completes */
  onPopComplete?: () => void;
  /** Custom color palette */
  colors?: readonly string[];
}

export function ChampagneBottle({
  delay = 0,
  onPopComplete,
  colors = CHAMPAGNE_SPARKLE_COLORS,
}: ChampagneBottleProps) {
  const bottleRef = useRef<SVGGElement>(null);
  const corkRef = useRef<SVGGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!bottleRef.current || !corkRef.current) return;

    const tl = gsap.timeline({ delay });

    // Phase 1 (0-0.9s): Intense bottle shake anticipation - building pressure
    tl.to(bottleRef.current, {
      rotation: -2,
      duration: 0.08,
      repeat: 3,
      yoyo: true,
      ease: "power1.inOut",
      transformOrigin: "50% 90%", // Pivot at bottom
    });

    // Increase shake intensity
    tl.to(bottleRef.current, {
      rotation: -4,
      duration: 0.06,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
      transformOrigin: "50% 90%",
    });

    // Final intense vibration before pop
    tl.to(bottleRef.current, {
      rotation: -6,
      scale: 1.02,
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      ease: "power2.inOut",
      transformOrigin: "50% 90%",
    });

    // Phase 2 (0.9-1.6s): DRAMATIC cork pop with explosive physics
    tl.to(
      corkRef.current,
      {
        y: -700, // Shoot high off-screen
        x: 30, // Slight horizontal drift for realism
        rotation: 1080, // Three full rotations (more dramatic)
        scale: 0.8, // Shrink as it flies away
        opacity: 0,
        duration: 0.7,
        ease: "power3.out", // More explosive easing
      },
      0.9,
    );

    // Phase 3: Strong bottle recoil from cork pop
    tl.to(
      bottleRef.current,
      {
        y: 8,
        rotation: 2,
        scale: 0.98,
        duration: 0.15,
        ease: "power3.out",
      },
      0.9,
    );

    // Settle back with slight bounce
    tl.to(bottleRef.current, {
      y: -2,
      rotation: 0,
      scale: 1,
      duration: 0.2,
      ease: "power1.out",
    });

    // Final rest position
    tl.to(bottleRef.current, {
      y: 0,
      duration: 0.25,
      ease: "elastic.out(1, 0.5)", // Slight elastic bounce
    });

    // Call completion callback when cork pop finishes
    tl.call(
      () => {
        onPopComplete?.();
      },
      [],
      1.6,
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [delay, onPopComplete]);

  // Realistic champagne bottle colors
  const bottleGlassColor = "#1B4D1B"; // Dark green glass
  const bottleDarkShade = "#0D2610"; // Darker green for depth
  const foilColor = colors[0] || "#FFD700"; // Gold foil
  const foilHighlight = "#FFF4A3"; // Lighter gold
  const corkColor = "#8B6F47"; // Natural cork
  const labelCream = "#FFF8E7"; // Cream label

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-80 md:w-56 md:h-96 pointer-events-none">
      <svg
        viewBox="0 0 120 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Glass gradient for realistic bottle */}
          <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={bottleDarkShade} />
            <stop offset="25%" stopColor={bottleGlassColor} />
            <stop offset="50%" stopColor={bottleGlassColor} />
            <stop offset="75%" stopColor={bottleDarkShade} />
          </linearGradient>

          {/* Gold foil gradient */}
          <linearGradient id="foilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={foilHighlight} />
            <stop offset="50%" stopColor={foilColor} />
            <stop offset="100%" stopColor="#DAA520" />
          </linearGradient>

          {/* Glass shine effect */}
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Champagne Bottle Group */}
        <g ref={bottleRef}>
          {/* Bottle Body - Main Shape */}
          <path
            d="M 40 110
               L 38 170
               Q 38 240 45 250
               Q 45 260 60 260
               Q 75 260 75 250
               Q 82 240 82 170
               L 80 110
               Z"
            fill="url(#bottleGradient)"
            stroke={bottleDarkShade}
            strokeWidth="1.5"
          />

          {/* Bottle Shoulder (curve to neck) */}
          <path
            d="M 40 110 Q 40 90 45 80 L 45 50 Q 45 45 50 45 L 70 45 Q 75 45 75 50 L 75 80 Q 80 90 80 110"
            fill="url(#bottleGradient)"
            stroke={bottleDarkShade}
            strokeWidth="1.5"
          />

          {/* Punt (bottom indentation) */}
          <ellipse
            cx="60"
            cy="255"
            rx="12"
            ry="4"
            fill={bottleDarkShade}
            opacity="0.4"
          />

          {/* Bottle Neck */}
          <rect
            x="50"
            y="45"
            width="20"
            height="50"
            fill="url(#bottleGradient)"
            stroke={bottleDarkShade}
            strokeWidth="1"
            rx="1"
          />

          {/* Neck Ring (detail) */}
          <ellipse
            cx="60"
            cy="50"
            rx="11"
            ry="2"
            fill={bottleDarkShade}
            opacity="0.5"
          />

          {/* Gold Foil Wrapper - More elaborate */}
          <path
            d="M 46 38
               L 46 48
               Q 46 52 48 54
               L 52 56
               L 68 56
               Q 72 54 74 52
               L 74 48
               L 74 38
               Q 74 35 72 33
               L 68 31
               L 52 31
               Q 48 33 46 35
               Z"
            fill="url(#foilGradient)"
            stroke="#B8860B"
            strokeWidth="1"
          />

          {/* Foil texture lines */}
          <path
            d="M 50 35 L 50 50 M 54 34 L 54 52 M 58 34 L 58 52 M 62 34 L 62 52 M 66 34 L 66 52 M 70 35 L 70 50"
            stroke="#DAA520"
            strokeWidth="0.5"
            opacity="0.4"
          />

          {/* Main Shine/Highlight - Left side */}
          <ellipse
            cx="48"
            cy="150"
            rx="8"
            ry="60"
            fill="url(#shineGradient)"
            opacity="0.6"
          />

          {/* Secondary Shine - Body */}
          <ellipse cx="70" cy="180" rx="5" ry="30" fill="white" opacity="0.2" />

          {/* Elegant Label */}
          <g>
            {/* Label background with border */}
            <rect
              x="44"
              y="140"
              width="32"
              height="50"
              fill={labelCream}
              stroke={foilColor}
              strokeWidth="1.5"
              rx="3"
            />

            {/* Decorative top border */}
            <rect
              x="44"
              y="140"
              width="32"
              height="8"
              fill={foilColor}
              opacity="0.3"
              rx="3"
            />

            {/* "2026" text - larger and bolder */}
            <text
              x="60"
              y="165"
              fontSize="16"
              fontWeight="bold"
              fill={foilColor}
              textAnchor="middle"
              fontFamily="serif"
            >
              2026
            </text>

            {/* Decorative elements */}
            <path
              d="M 48 175 L 72 175 M 50 178 L 70 178"
              stroke={foilColor}
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Small stars decoration */}
            <text
              x="60"
              y="185"
              fontSize="12"
              fill={foilColor}
              textAnchor="middle"
            >
              ★
            </text>
          </g>

          {/* Bubbles rising in bottle (champagne effect) */}
          <circle cx="52" cy="200" r="1.5" fill="white" opacity="0.4" />
          <circle cx="55" cy="220" r="1" fill="white" opacity="0.3" />
          <circle cx="65" cy="210" r="1.2" fill="white" opacity="0.4" />
          <circle cx="68" cy="230" r="1" fill="white" opacity="0.3" />
          <circle cx="58" cy="240" r="1.3" fill="white" opacity="0.35" />
        </g>

        {/* Cork Group (separate for independent animation) */}
        <g ref={corkRef}>
          {/* Cork Mushroom Top - properly positioned at bottle top */}
          <ellipse
            cx="60"
            cy="32"
            rx="14"
            ry="5"
            fill={corkColor}
            stroke="#654321"
            strokeWidth="1"
          />

          {/* Cork Top Surface */}
          <ellipse cx="60" cy="31" rx="14" ry="4" fill="#A0826D" />

          {/* Cork Body/Neck - sits flush on top of foil */}
          <rect x="52" y="32" width="16" height="8" fill={corkColor} rx="1" />

          {/* Cork texture lines */}
          <path
            d="M 54 33 L 54 39 M 58 33 L 58 39 M 62 33 L 62 39 M 66 33 L 66 39"
            stroke="#654321"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Wire Cage (muselet) - positioned at top of cork */}
          <g stroke={foilColor} strokeWidth="1.5" fill="none" opacity="0.9">
            {/* Cage top ring */}
            <ellipse cx="60" cy="34" rx="12" ry="3" />

            {/* Vertical wires running down from cork */}
            <path d="M 48 34 L 46 45 M 52 34 L 50 45 M 68 34 L 70 45 M 72 34 L 74 45" />

            {/* Twisted wire detail at very top */}
            <path d="M 60 31 L 60 28 Q 58 26 60 24" strokeWidth="1" />
          </g>

          {/* Cork highlight */}
          <ellipse cx="57" cy="34" rx="2" ry="3" fill="white" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}
