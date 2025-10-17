"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface KolamDrawingProps {
    /** Duration of the drawing animation in seconds */
    duration?: number;
    /** Color of the kolam pattern */
    color?: string;
    /** Number of concentric circles in the pattern */
    circleCount?: number;
    /** Callback when animation completes */
    onComplete?: () => void;
}

/**
 * KolamDrawing Animation Component for Pongal
 *
 * Draws a sunburst/flower mandala kolam pattern with concentric circles.
 * Uses strokeDasharray animation to simulate traditional kolam drawing.
 * Culturally authentic with radial design and outward progression.
 *
 * Tasks: T061, T062
 */
export function KolamDrawing({
    duration = 3,
    color = "#F5F5DC", // Beige/cream color for traditional look
    circleCount = 6,
    onComplete,
}: KolamDrawingProps) {
    const containerRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const paths = containerRef.current.querySelectorAll("path, circle");
        const tl = gsap.timeline({
            onComplete,
        });

        // Animate each path/circle sequentially from center outward
        paths.forEach((path, index) => {
            const element = path as SVGPathElement | SVGCircleElement;
            const length = element.getTotalLength?.() || 0;

            // Set up initial state for stroke drawing
            gsap.set(element, {
                strokeDasharray: length,
                strokeDashoffset: length,
                opacity: 0,
            });

            // Calculate stagger timing - center elements first, then outward
            const staggerDelay = (index / paths.length) * duration * 0.8;

            // Animate drawing effect
            tl.to(
                element,
                {
                    strokeDashoffset: 0,
                    opacity: 1,
                    duration: duration / circleCount,
                    ease: "power1.inOut",
                },
                staggerDelay,
            );
        });

        return () => {
            tl.kill();
        };
    }, [duration, circleCount, onComplete]);

    // Generate sunburst mandala pattern with concentric circles
    const generateKolamPaths = () => {
        const paths: React.ReactElement[] = [];
        const centerX = 100;
        const centerY = 100;
        const petalCount = 8; // 8-fold symmetry for sunburst

        // Central dot
        paths.push(
            <circle
                key="center-dot"
                cx={ centerX }
                cy={ centerY }
                r="2"
                fill={ color }
                stroke={ color }
                strokeWidth="1"
            />,
        );

        // Concentric circles with decreasing spacing
        for (let i = 1; i <= circleCount; i++) {
            const radius = (i * 60) / circleCount;
            paths.push(
                <circle
                    key={ `circle-${i}` }
                    cx={ centerX }
                    cy={ centerY }
                    r={ radius }
                    fill="none"
                    stroke={ color }
                    strokeWidth="1.5"
                    opacity="0.9"
                />,
            );
        }

        // Sunburst petals radiating outward
        for (let i = 0; i < petalCount; i++) {
            const angle = (i * Math.PI * 2) / petalCount;
            const innerRadius = 15;
            const outerRadius = 65;

            // Calculate petal control points for curved petals
            const innerX = centerX + Math.cos(angle) * innerRadius;
            const innerY = centerY + Math.sin(angle) * innerRadius;
            const outerX = centerX + Math.cos(angle) * outerRadius;
            const outerY = centerY + Math.sin(angle) * outerRadius;

            // Control points for smooth curves
            const ctrlDistance = (outerRadius - innerRadius) * 0.4;
            const perpAngle = angle + Math.PI / 2;
            const ctrl1X = innerX + Math.cos(perpAngle) * ctrlDistance;
            const ctrl1Y = innerY + Math.sin(perpAngle) * ctrlDistance;
            const ctrl2X = outerX + Math.cos(perpAngle) * ctrlDistance;
            const ctrl2Y = outerY + Math.sin(perpAngle) * ctrlDistance;

            // Create petal path (curved line from center outward)
            const pathData = `
        M ${innerX} ${innerY}
        C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${outerX} ${outerY}
      `;

            paths.push(
                <path
                    key={ `petal-right-${i}` }
                    d={ pathData }
                    fill="none"
                    stroke={ color }
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.85"
                />,
            );

            // Mirror petal on opposite side
            const ctrl3X = innerX - Math.cos(perpAngle) * ctrlDistance;
            const ctrl3Y = innerY - Math.sin(perpAngle) * ctrlDistance;
            const ctrl4X = outerX - Math.cos(perpAngle) * ctrlDistance;
            const ctrl4Y = outerY - Math.sin(perpAngle) * ctrlDistance;

            const mirrorPathData = `
        M ${innerX} ${innerY}
        C ${ctrl3X} ${ctrl3Y}, ${ctrl4X} ${ctrl4Y}, ${outerX} ${outerY}
      `;

            paths.push(
                <path
                    key={ `petal-left-${i}` }
                    d={ mirrorPathData }
                    fill="none"
                    stroke={ color }
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.85"
                />,
            );
        }

        // Decorative dots at petal tips
        for (let i = 0; i < petalCount; i++) {
            const angle = (i * Math.PI * 2) / petalCount;
            const radius = 68;
            const dotX = centerX + Math.cos(angle) * radius;
            const dotY = centerY + Math.sin(angle) * radius;

            paths.push(
                <circle
                    key={ `dot-${i}` }
                    cx={ dotX }
                    cy={ dotY }
                    r="2.5"
                    fill={ color }
                    stroke={ color }
                    strokeWidth="1"
                    opacity="0.9"
                />,
            );
        }

        return paths;
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <svg
                viewBox="0 0 200 200"
                className="h-64 w-64 md:h-80 md:w-80"
                role="img"
                aria-hidden="true"
            >
                <title>Kolam mandala pattern animation</title>
                <defs>
                    {/* Glow filter for kolam */ }
                    <filter id="kolam-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g ref={ containerRef } filter="url(#kolam-glow)">
                    { generateKolamPaths() }
                </g>
            </svg>
        </div>
    );
}
