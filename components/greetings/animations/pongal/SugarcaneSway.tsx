"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SugarcaneSwaySugarcaneSwayCaneSwayProps {
    /** Duration of sway animation in seconds */
    duration?: number;
    /** Angle range for sway (in degrees) */
    swayAngle?: number;
    /** Color of sugarcane stalks */
    caneColor?: string;
    /** Color of sugarcane leaves */
    leafColor?: string;
    /** Callback when animation completes */
    onComplete?: () => void;
}

/**
 * SugarcaneSway Animation Component for Pongal
 *
 * Sugarcane stalks on left and right sides with gentle sway animation.
 * Uses sine easing for natural, wind-like movement.
 *
 * Task: T068
 */
export function SugarcaneSway({
    duration = 8,
    swayAngle = 5,
    caneColor = "#8B7355",
    leafColor = "#228B22",
    onComplete,
}: SugarcaneSwaySugarcaneSwayCaneSwayProps) {
    const leftCaneRef = useRef<SVGGElement>(null);
    const rightCaneRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!leftCaneRef.current || !rightCaneRef.current) return;

        const tl = gsap.timeline({
            repeat: -1, // Loop infinitely
            onComplete,
        });

        // Left cane sways from left to right
        tl.to(leftCaneRef.current, {
            rotation: swayAngle,
            duration: duration / 2,
            ease: "sine.inOut",
            transformOrigin: "bottom center",
        });

        tl.to(leftCaneRef.current, {
            rotation: -swayAngle,
            duration: duration / 2,
            ease: "sine.inOut",
            transformOrigin: "bottom center",
        });

        // Right cane sways opposite to left (out of phase)
        tl.to(
            rightCaneRef.current,
            {
                rotation: -swayAngle,
                duration: duration / 2,
                ease: "sine.inOut",
                transformOrigin: "bottom center",
            },
            0, // Start at same time as left cane
        );

        tl.to(
            rightCaneRef.current,
            {
                rotation: swayAngle,
                duration: duration / 2,
                ease: "sine.inOut",
                transformOrigin: "bottom center",
            },
            duration / 2,
        );

        return () => {
            tl.kill();
        };
    }, [duration, swayAngle, onComplete]);

    // Generate sugarcane stalk with leaves
    const renderSugarcane = (side: "left" | "right") => {
        const xBase = side === "left" ? 30 : 170;
        const segments = 5;

        return (
            <>
                {/* Sugarcane stalk segments */ }
                { Array.from({ length: segments }, (_, i) => {
                    const y = 180 - i * 30;
                    const segmentId = `${side}-segment-${y}`;
                    return (
                        <g key={ segmentId }>
                            {/* Stalk segment */ }
                            <rect
                                x={ xBase - 4 }
                                y={ y }
                                width="8"
                                height="28"
                                fill={ caneColor }
                                rx="2"
                            />
                            {/* Joint/node */ }
                            <ellipse
                                cx={ xBase }
                                cy={ y }
                                rx="5"
                                ry="3"
                                fill="#6B5340"
                                opacity="0.8"
                            />
                        </g>
                    );
                }) }

                {/* Leaves sprouting from top segments */ }
                { Array.from({ length: 3 }, (_, i) => {
                    const y = 90 - i * 30;
                    const leafAngle = side === "left" ? -30 - i * 10 : 30 + i * 10;
                    const leafId = `${side}-leaf-${y}-${leafAngle}`;

                    return (
                        <g key={ leafId }>
                            {/* Left leaf */ }
                            <path
                                d={ `M ${xBase} ${y} Q ${xBase - 25} ${y - 15}, ${xBase - 35} ${y - 25}` }
                                fill="none"
                                stroke={ leafColor }
                                strokeWidth="2"
                                strokeLinecap="round"
                                opacity="0.9"
                            />
                            {/* Right leaf */ }
                            <path
                                d={ `M ${xBase} ${y} Q ${xBase + 25} ${y - 15}, ${xBase + 35} ${y - 25}` }
                                fill="none"
                                stroke={ leafColor }
                                strokeWidth="2"
                                strokeLinecap="round"
                                opacity="0.9"
                            />
                        </g>
                    );
                }) }
            </>
        );
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
                viewBox="0 0 200 200"
                className="h-full w-full"
                role="img"
                aria-hidden="true"
            >
                <title>Swaying sugarcane decoration</title>

                {/* Left sugarcane */ }
                <g ref={ leftCaneRef } style={ { transformOrigin: "30px 180px" } }>
                    { renderSugarcane("left") }
                </g>

                {/* Right sugarcane */ }
                <g ref={ rightCaneRef } style={ { transformOrigin: "170px 180px" } }>
                    { renderSugarcane("right") }
                </g>
            </svg>
        </div>
    );
}
