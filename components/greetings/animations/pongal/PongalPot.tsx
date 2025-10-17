"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PongalPotProps {
    /** Duration of the complete pot animation in seconds */
    duration?: number;
    /** Color of the pot (terracotta) */
    potColor?: string;
    /** When the overflow should occur (in seconds) */
    overflowAt?: number;
    /** Callback when animation completes */
    onComplete?: () => void;
}

/**
 * PongalPot Animation Component for Pongal
 *
 * Traditional pongal pot with boiling rice/milk animation.
 * Contents rise vertically with bubbles, then overflow dramatically.
 * Symbolizes prosperity and abundance.
 *
 * Tasks: T063, T064, T065
 */
export function PongalPot({
    duration = 6,
    potColor = "#D2691E", // Terracotta brown
    overflowAt = 4,
    onComplete,
}: PongalPotProps) {
    const contentsRef = useRef<SVGGElement>(null);
    const bubblesRef = useRef<SVGGElement>(null);
    const overflowRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!contentsRef.current || !bubblesRef.current || !overflowRef.current)
            return;

        const tl = gsap.timeline({
            onComplete,
        });

        // Initial state: contents at bottom of pot
        gsap.set(contentsRef.current, {
            y: 40,
        });

        gsap.set(overflowRef.current, {
            opacity: 0,
            scale: 0,
        });

        // Boiling animation: contents rise (T064)
        tl.to(contentsRef.current, {
            y: 0, // Rise to top
            duration: overflowAt * 0.8,
            ease: "power1.inOut",
        });

        // Bubble animations (T064)
        const bubbles = bubblesRef.current.querySelectorAll("circle");
        bubbles.forEach((bubble, index) => {
            const delay = (index / bubbles.length) * 0.5;

            // Animate bubble appearance and growth
            tl.to(
                bubble,
                {
                    scale: gsap.utils.random(0.8, 1.5),
                    opacity: gsap.utils.random(0.3, 0.8),
                    duration: 0.4,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                },
                delay,
            );

            // Animate bubble vertical movement
            tl.to(
                bubble,
                {
                    y: gsap.utils.random(-5, -15),
                    duration: gsap.utils.random(0.6, 1.2),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                },
                delay,
            );
        });

        // Dramatic overflow effect (T065)
        tl.to(
            overflowRef.current,
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(2)",
            },
            overflowAt,
        );

        // Continue overflow flowing down
        tl.to(
            overflowRef.current,
            {
                y: 30,
                duration: duration - overflowAt,
                ease: "power1.out",
            },
            overflowAt + 0.5,
        );

        return () => {
            tl.kill();
        };
    }, [duration, overflowAt, onComplete]);

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <svg
                viewBox="0 0 200 200"
                className="h-72 w-72 md:h-96 md:w-96"
                role="img"
                aria-hidden="true"
            >
                <title>Pongal pot with boiling overflow</title>
                <defs>
                    {/* Pattern for decorative pot design */ }
                    <pattern
                        id="pot-pattern"
                        x="0"
                        y="0"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="4" cy="4" r="1.5" fill="#FF6B35" opacity="0.4" />
                    </pattern>

                    {/* Clipping path for overflow effect */ }
                    <clipPath id="pot-clip">
                        <rect x="60" y="80" width="80" height="70" />
                    </clipPath>
                </defs>

                {/* Pot body (terracotta color with decorative patterns) */ }
                <g>
                    {/* Main pot shape */ }
                    <path
                        d="M 70 80 L 65 140 Q 65 150, 75 150 L 125 150 Q 135 150, 135 140 L 130 80 Z"
                        fill={ potColor }
                        stroke="#8B4513"
                        strokeWidth="2"
                    />

                    {/* Decorative red/yellow bands */ }
                    <rect
                        x="68"
                        y="85"
                        width="64"
                        height="4"
                        fill="#FF6B35"
                        opacity="0.8"
                    />
                    <rect
                        x="68"
                        y="93"
                        width="64"
                        height="3"
                        fill="#FDEE00"
                        opacity="0.7"
                    />

                    {/* Decorative dots pattern */ }
                    <rect
                        x="68"
                        y="100"
                        width="64"
                        height="40"
                        fill="url(#pot-pattern)"
                    />

                    {/* Pot rim */ }
                    <ellipse cx="100" cy="80" rx="32" ry="6" fill={ potColor } />
                    <ellipse
                        cx="100"
                        cy="80"
                        rx="32"
                        ry="6"
                        fill="none"
                        stroke="#8B4513"
                        strokeWidth="2"
                    />
                </g>

                {/* Rice/milk contents (inside pot, clipped) */ }
                <g ref={ contentsRef } clipPath="url(#pot-clip)">
                    {/* Main contents */ }
                    <ellipse cx="100" cy="135" rx="30" ry="15" fill="#FFFACD" />
                    <rect x="70" y="135" width="60" height="20" fill="#FFFACD" />

                    {/* Rice grains texture */ }
                    { Array.from({ length: 15 }, (_, i) => {
                        const x = 75 + (i % 5) * 10;
                        const y = 120 + Math.floor(i / 5) * 8;
                        const grainId = `grain-${x}-${y}`;
                        return (
                            <ellipse
                                key={ grainId }
                                cx={ x }
                                cy={ y }
                                rx="2"
                                ry="3"
                                fill="#FFF8DC"
                                opacity="0.6"
                            />
                        );
                    }) }
                </g>

                {/* Bubbles (T064) */ }
                <g ref={ bubblesRef }>
                    { Array.from({ length: 8 }, (_, i) => {
                        const angle = (i * Math.PI * 2) / 8;
                        const radius = 18 + Math.random() * 8;
                        const x = 100 + Math.cos(angle) * radius;
                        const y = 125 + Math.sin(angle) * radius * 0.3;
                        const bubbleSize = 2 + Math.random() * 2;
                        const bubbleId = `bubble-${Math.round(x)}-${Math.round(y)}`;

                        return (
                            <circle
                                key={ bubbleId }
                                cx={ x }
                                cy={ y }
                                r={ bubbleSize }
                                fill="#FFF"
                                opacity="0"
                                style={ { transformOrigin: `${x}px ${y}px` } }
                            />
                        );
                    }) }
                </g>

                {/* Overflow effect (T065) - appears at overflowAt timing */ }
                <g ref={ overflowRef }>
                    {/* Overflow on left side */ }
                    <path
                        d="M 68 82 Q 60 85, 58 95 Q 56 105, 60 115"
                        fill="none"
                        stroke="#FFFACD"
                        strokeWidth="8"
                        strokeLinecap="round"
                        opacity="0.9"
                    />
                    {/* Overflow on right side */ }
                    <path
                        d="M 132 82 Q 140 85, 142 95 Q 144 105, 140 115"
                        fill="none"
                        stroke="#FFFACD"
                        strokeWidth="8"
                        strokeLinecap="round"
                        opacity="0.9"
                    />
                    {/* Center overflow (most dramatic) */ }
                    <path
                        d="M 95 78 Q 100 75, 105 78 L 108 95 Q 108 100, 103 102 L 97 102 Q 92 100, 92 95 Z"
                        fill="#FFFACD"
                        stroke="#FFF8DC"
                        strokeWidth="1.5"
                        opacity="0.95"
                    />

                    {/* Dripping drops */ }
                    { [65, 100, 135].map((x, idx) => (
                        <ellipse
                            key={ `drop-${x}` }
                            cx={ x }
                            cy={ 115 + idx * 3 }
                            rx="3"
                            ry="5"
                            fill="#FFFACD"
                            opacity="0.8"
                        />
                    )) }
                </g>
            </svg>
        </div>
    );
}
