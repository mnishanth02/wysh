"use client";

/**
 * RangoliDraw Component
 * Enhanced SVG path animation for traditional rangoli pattern
 * Matches the detailed design from rangoli-pattern.svg with gradients and layers
 */

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export interface RangoliDrawProps {
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

/**
 * RangoliDraw with enhanced multi-layer SVG path animation
 */
export function RangoliDraw({
  duration = 6.5,
  delay = 0,
  onComplete,
}: RangoliDrawProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const timeline = gsap.timeline({
      delay,
      onComplete,
    });

    // Layer 1: Outer decorative circles (0-0.8s)
    const outerCircles = svgRef.current.querySelectorAll(".outer-circle");
    outerCircles.forEach((circle) => {
      timeline.fromTo(
        circle,
        {
          strokeDashoffset:
            (circle as SVGCircleElement).getTotalLength?.() || 0,
        },
        {
          strokeDashoffset: 0,
          duration: duration * 0.2,
          ease: "power2.inOut",
        },
        0,
      );
    });

    // Layer 2: Middle decorative circles (0.6-1.4s)
    const middleCircles = svgRef.current.querySelectorAll(".middle-circle");
    timeline.fromTo(
      middleCircles,
      { scale: 0, opacity: 0, transformOrigin: "center" },
      {
        scale: 1,
        opacity: 1,
        duration: duration * 0.2,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      duration * 0.15,
    );

    // Layer 3: Outer petal layer (16 petals) (1.2-2.4s)
    const outerPetals = svgRef.current.querySelectorAll(".outer-petal");
    outerPetals.forEach((path, index) => {
      if (path instanceof SVGPathElement) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        timeline.to(
          path,
          {
            strokeDashoffset: 0,
            duration: duration * 0.08,
            ease: "none",
          },
          duration * 0.3 + index * ((duration * 0.075) / outerPetals.length),
        );
      }
    });

    // Layer 4: Inner petal layer (8 petals) (2.2-3.0s)
    const innerPetals = svgRef.current.querySelectorAll(".inner-petal");
    innerPetals.forEach((path, index) => {
      if (path instanceof SVGPathElement) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        timeline.to(
          path,
          {
            strokeDashoffset: 0,
            duration: duration * 0.1,
            ease: "none",
          },
          duration * 0.55 + index * ((duration * 0.1) / innerPetals.length),
        );
      }
    });

    // Layer 5: Decorative dots on outer circle (2.8-3.2s)
    const outerDots = svgRef.current.querySelectorAll(".outer-dot");
    timeline.fromTo(
      outerDots,
      { scale: 0, opacity: 0, transformOrigin: "center" },
      {
        scale: 1,
        opacity: 1,
        duration: duration * 0.1,
        stagger: 0.02,
        ease: "back.out(2)",
      },
      duration * 0.7,
    );

    // Layer 6: Inner decorative dots (3.0-3.4s)
    const innerDots = svgRef.current.querySelectorAll(".inner-dot");
    timeline.fromTo(
      innerDots,
      { scale: 0, opacity: 0, transformOrigin: "center" },
      {
        scale: 1,
        opacity: 0.9,
        duration: duration * 0.1,
        stagger: 0.02,
        ease: "back.out(2)",
      },
      duration * 0.75,
    );

    // Layer 7: Center circles with glow (3.2-4.0s)
    const centerElements = svgRef.current.querySelectorAll(".center-element");
    timeline.fromTo(
      centerElements,
      { scale: 0, opacity: 0, transformOrigin: "center" },
      {
        scale: 1,
        opacity: 1,
        duration: duration * 0.2,
        stagger: 0.05,
        ease: "elastic.out(1, 0.5)",
      },
      duration * 0.8,
    );

    // Layer 8: Accent rings around center (3.6-4.0s)
    const accentRings = svgRef.current.querySelectorAll(".accent-ring");
    accentRings.forEach((ring, index) => {
      timeline.fromTo(
        ring,
        { scale: 0, opacity: 0, transformOrigin: "center" },
        {
          scale: 1,
          opacity: index === 0 ? 0.5 : 0.4,
          duration: duration * 0.1,
          ease: "power2.out",
        },
        duration * 0.9 + index * 0.05,
      );
    });

    return () => {
      timeline.kill();
    };
  }, [duration, delay, onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        ref={ svgRef }
        viewBox="0 0 200 200"
        className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
        style={ {
          filter: "drop-shadow(0 0 15px rgba(255, 165, 0, 0.6))",
          opacity: 1,
        } }
        aria-labelledby="rangoliTitle rangoliDesc"
        role="img"
      >
        <title id="rangoliTitle">Rangoli Pattern</title>
        <desc id="rangoliDesc">
          Traditional Indian decorative art pattern with geometric symmetry and
          vibrant colors
        </desc>

        <defs>
          {/* Enhanced gradients for depth */ }
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              style={ { stopColor: "#ff1744", stopOpacity: 1 } }
            />
            <stop
              offset="50%"
              style={ { stopColor: "#dc143c", stopOpacity: 1 } }
            />
            <stop
              offset="100%"
              style={ { stopColor: "#b71c1c", stopOpacity: 1 } }
            />
          </radialGradient>

          <radialGradient id="petalGradient" cx="30%" cy="30%" r="70%">
            <stop
              offset="0%"
              style={ { stopColor: "#ffb74d", stopOpacity: 1 } }
            />
            <stop
              offset="50%"
              style={ { stopColor: "#ff9800", stopOpacity: 1 } }
            />
            <stop
              offset="100%"
              style={ { stopColor: "#f57c00", stopOpacity: 1 } }
            />
          </radialGradient>

          <linearGradient
            id="outerRingGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={ { stopColor: "#ffd54f", stopOpacity: 1 } }
            />
            <stop
              offset="50%"
              style={ { stopColor: "#ffb300", stopOpacity: 1 } }
            />
            <stop
              offset="100%"
              style={ { stopColor: "#ff6f00", stopOpacity: 1 } }
            />
          </linearGradient>

          {/* Shadow filter */ }
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
            <feComponentTransfer in="offsetBlur" result="shadow">
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow effect for center */ }
          <filter
            id="centerGlowFilter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer decorative circle with gradient */ }
        <circle
          className="outer-circle"
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#outerRingGradient)"
          strokeWidth="3"
          opacity="0.6"
          filter="url(#softShadow)"
        />

        {/* Second outer circle */ }
        <circle
          className="outer-circle"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#ff9800"
          strokeWidth="2.5"
          opacity="0.8"
        />

        {/* Middle decorative circles */ }
        <circle
          className="middle-circle"
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          opacity="0.9"
          filter="url(#softShadow)"
        />
        <circle
          className="middle-circle"
          cx="100"
          cy="100"
          r="52"
          fill="none"
          stroke="#ffd54f"
          strokeWidth="1.5"
          opacity="0.7"
        />

        {/* Outer petal layer (16 petals) */ }
        <g transform="translate(100, 100)" opacity="0.95">
          { [
            0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5,
            270, 292.5, 315, 337.5,
          ].map((angle) => (
            <path
              key={ `outer-${angle}` }
              className="outer-petal"
              fill="none"
              stroke="url(#petalGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              d="M0-60q-15 22.5-12 37.5L0 0l12-22.5q3-15-12-37.5Z"
              transform={ `rotate(${angle})` }
            />
          )) }
        </g>

        {/* Inner petal layer (8 petals) with enhanced stroke */ }
        <g transform="translate(100, 100)" opacity="1">
          { [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={ `inner-${angle}` }
              className="inner-petal"
              fill="none"
              stroke="#ff6f00"
              strokeWidth="3"
              strokeLinecap="round"
              d="M0-40q-10 15-8 25L0 0l8-15q2-10-8-25Z"
              transform={ `rotate(${angle})` }
            />
          )) }
        </g>

        {/* Decorative dots on outer circle with enhanced styling */ }
        <g fill="url(#centerGlow)" filter="url(#softShadow)">
          { [
            [100, 15],
            [147, 29],
            [171, 53],
            [185, 100],
            [171, 147],
            [147, 171],
            [100, 185],
            [53, 171],
            [29, 147],
            [15, 100],
            [29, 53],
            [53, 29],
          ].map(([cx, cy]) => (
            <circle
              key={ `outer-dot-${cx}-${cy}` }
              className="outer-dot"
              cx={ cx }
              cy={ cy }
              r="4"
            />
          )) }
        </g>

        {/* Inner decorative dots (between petals) */ }
        <g fill="#ffd54f" opacity="0.9">
          { [
            [100, 45],
            [125, 55],
            [145, 75],
            [155, 100],
            [145, 125],
            [125, 145],
            [100, 155],
            [75, 145],
            [55, 125],
            [45, 100],
            [55, 75],
            [75, 55],
          ].map(([cx, cy]) => (
            <circle
              key={ `inner-dot-${cx}-${cy}` }
              className="inner-dot"
              cx={ cx }
              cy={ cy }
              r="2.5"
            />
          )) }
        </g>

        {/* Center circle with enhanced glow */ }
        <circle
          className="center-element"
          cx="100"
          cy="100"
          r="10"
          fill="url(#centerGlow)"
          stroke="#ff9800"
          strokeWidth="2.5"
          filter="url(#centerGlowFilter)"
        />
        <circle
          className="center-element"
          cx="100"
          cy="100"
          r="6"
          fill="#fff"
          opacity="0.6"
        />

        {/* Accent rings around center */ }
        <circle
          className="accent-ring"
          cx="100"
          cy="100"
          r="20"
          fill="none"
          stroke="#ffd54f"
          strokeWidth="1"
          opacity="0.5"
        />
        <circle
          className="accent-ring"
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke="#ff9800"
          strokeWidth="0.5"
          opacity="0.4"
          strokeDasharray="2,3"
        />
      </svg>
    </div>
  );
}
