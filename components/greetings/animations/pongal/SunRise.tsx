"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SunRiseProps {
    /** Duration of the sunrise animation in seconds */
    duration?: number;
    /** Color of the sun */
    sunColor?: string;
    /** Color of the sun rays */
    rayColor?: string;
    /** Whether rays should rotate continuously */
    rotateRays?: boolean;
    /** Callback when animation completes */
    onComplete?: () => void;
}

/**
 * SunRise Animation Component for Pongal
 *
 * Animates a sun rising from bottom to center with expanding rays.
 * Rays rotate continuously to create a dynamic effect.
 *
 * Tasks: T059, T060
 */
export function SunRise({
    duration = 2,
    sunColor = "#FF8C42",
    rayColor = "#FDEE00",
    rotateRays = true,
    onComplete,
}: SunRiseProps) {
    const sunRef = useRef<SVGGElement>(null);
    const raysRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!sunRef.current || !raysRef.current) return;

        const tl = gsap.timeline({
            onComplete,
        });

        // Start sun below the viewport
        gsap.set(sunRef.current, {
            y: 200, // Start below visible area
            scale: 0.5,
        });

        // Start rays at minimal scale
        gsap.set(raysRef.current, {
            scale: 0.3,
            opacity: 0,
        });

        // Animate sun rising from bottom to center
        tl.to(sunRef.current, {
            y: 0, // Rise to center position
            duration: duration,
            ease: "power2.out",
        });

        // Animate sun growing to full size
        tl.to(
            sunRef.current,
            {
                scale: 1,
                duration: duration * 0.8,
                ease: "back.out(1.2)",
            },
            0, // Start at same time as rise
        );

        // Animate rays expanding
        tl.to(
            raysRef.current,
            {
                scale: 1,
                opacity: 1,
                duration: duration * 0.6,
                ease: "power2.out",
            },
            duration * 0.4, // Start after sun is halfway up
        );

        // Continuous rotation of rays (T060)
        if (rotateRays) {
            gsap.to(raysRef.current, {
                rotation: 360,
                duration: 8,
                ease: "none",
                repeat: -1,
            });
        }

        return () => {
            tl.kill();
            if (rotateRays) {
                gsap.killTweensOf(raysRef.current);
            }
        };
    }, [duration, rotateRays, onComplete]);

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <svg
                viewBox="0 0 200 200"
                className="h-48 w-48 md:h-64 md:w-64"
                role="img"
                aria-hidden="true"
            >
                <title>Rising sun animation</title>
                <defs>
                    {/* Glow filter for sun */ }
                    <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Radial gradient for sun */ }
                    <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={ sunColor } stopOpacity="1" />
                        <stop offset="70%" stopColor={ sunColor } stopOpacity="0.95" />
                        <stop offset="100%" stopColor={ rayColor } stopOpacity="0.8" />
                    </radialGradient>
                </defs>

                {/* Sun rays (behind sun) */ }
                <g ref={ raysRef } className="origin-center">
                    { Array.from({ length: 12 }, (_, i) => {
                        const angle = (i * 360) / 12;
                        const longRay = i % 2 === 0; // Alternate long and short rays
                        const rayLength = longRay ? 45 : 35;
                        const rayWidth = longRay ? 8 : 6;
                        const rayId = `sun-ray-${angle}-${rayLength}`;

                        return (
                            <rect
                                key={ rayId }
                                x="96" // Center at 100 - half width
                                y="40" // Start from center minus ray length
                                width={ rayWidth }
                                height={ rayLength }
                                fill={ rayColor }
                                opacity="0.7"
                                rx="2"
                                transform={ `rotate(${angle}, 100, 100)` }
                                style={ {
                                    transformOrigin: "100px 100px",
                                } }
                            />
                        );
                    }) }
                </g>

                {/* Sun circle (in front of rays) */ }
                <g ref={ sunRef }>
                    <circle
                        cx="100"
                        cy="100"
                        r="40"
                        fill="url(#sun-gradient)"
                        filter="url(#sun-glow)"
                    />
                    {/* Inner glow circle for depth */ }
                    <circle cx="100" cy="100" r="35" fill={ sunColor } opacity="0.6" />
                </g>
            </svg>
        </div>
    );
}
