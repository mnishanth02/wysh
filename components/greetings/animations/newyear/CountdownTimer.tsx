"use client";

/**
 * CountdownTimer Component - New Year Animation
 * Displays animated countdown from 3→2→1 with scale and burst effects
 * T040: SVG text elements with GSAP scale animation
 * T041: Rolling digit effect with y-translate
 */

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { NEWYEAR_COLORS } from "@/lib/animations/festival-themes";

interface CountdownTimerProps {
    /** Starting number (default: 3) */
    startFrom?: number;
    /** Duration per number in seconds (default: 1.3s) */
    durationPerNumber?: number;
    /** Delay before starting countdown (default: 0s) */
    delay?: number;
    /** Callback when countdown completes (reaches 0) */
    onComplete?: () => void;
    /** Custom colors for countdown numbers */
    colors?: readonly string[];
}

export function CountdownTimer({
    startFrom = 3,
    durationPerNumber = 1.3,
    delay = 0,
    onComplete,
    colors = NEWYEAR_COLORS as readonly string[],
}: CountdownTimerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentNumber, setCurrentNumber] = useState(startFrom);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                delay,
                onComplete: () => {
                    onComplete?.();
                },
            });

            // T040: Animate each number with scale burst effect
            for (let i = startFrom; i >= 1; i--) {
                const numberClass = `.countdown-${i}`;

                // Entry animation: scale from 0 to 1.5 to 1 (elastic bounce)
                tl.fromTo(
                    numberClass,
                    {
                        scale: 0,
                        opacity: 0,
                        rotateZ: -15,
                    },
                    {
                        scale: 1.5,
                        opacity: 1,
                        rotateZ: 0,
                        duration: durationPerNumber * 0.4,
                        ease: "back.out(2)",
                        onStart: () => setCurrentNumber(i),
                    },
                );

                // Settle to normal size
                tl.to(numberClass, {
                    scale: 1,
                    duration: durationPerNumber * 0.2,
                    ease: "power2.out",
                });

                // T040: Burst disappear effect
                tl.to(
                    numberClass,
                    {
                        scale: 2,
                        opacity: 0,
                        rotateZ: 15,
                        duration: durationPerNumber * 0.4,
                        ease: "power2.in",
                    },
                    `+=${durationPerNumber * 0.4}`, // Hold for 40% of duration
                );
            }

            timelineRef.current = tl;
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [startFrom, durationPerNumber, delay, onComplete]);

    return (
        <div
            ref={ containerRef }
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-live="polite"
        >
            {/* Render all countdown numbers (only visible number will have opacity) */ }
            { Array.from({ length: startFrom }, (_, i) => {
                const number = startFrom - i;
                // Cycle through colors for each number
                const color = colors[number % colors.length];

                return (
                    <svg
                        key={ number }
                        className={ `countdown-${number} absolute` }
                        style={ {
                            opacity: 0,
                            width: "60vw",
                            maxWidth: "400px",
                            height: "60vw",
                            maxHeight: "400px",
                        } }
                        viewBox="0 0 200 200"
                        aria-hidden={ currentNumber !== number }
                        role="img"
                        aria-label={ `Countdown number ${number}` }
                    >
                        {/* Glow effect behind number */ }
                        <defs>
                            <filter id={ `glow-${number}` }>
                                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Main number */ }
                        <text
                            x="100"
                            y="130"
                            fontSize="120"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill={ color }
                            filter={ `url(#glow-${number})` }
                            style={ {
                                fontFamily:
                                    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                            } }
                        >
                            { number }
                        </text>
                    </svg>
                );
            }) }
        </div>
    );
}
