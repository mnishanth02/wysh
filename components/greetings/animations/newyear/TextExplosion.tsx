"use client";

/**
 * TextExplosion Component - New Year Animation
 * Text that explodes from center with elastic bounce
 * T048: "Happy New Year 2026" with elastic bounce effect
 */

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { NEWYEAR_COLORS } from "@/lib/animations/festival-themes";

interface TextExplosionProps {
    /** Text to display (default: "Happy New Year 2026") */
    text?: string;
    /** Animation duration in seconds (default: 1.5s) */
    duration?: number;
    /** Delay before starting (default: 0s) */
    delay?: number;
    /** Custom color for text */
    color?: string;
    /** Font size in rem (default: 4rem mobile, 6rem desktop) */
    fontSize?: { mobile: number; desktop: number };
}

export function TextExplosion({
    text = "Happy New Year 2026!",
    duration = 1.5,
    delay = 0,
    color = NEWYEAR_COLORS[2], // Gold (#FFD700)
    fontSize = { mobile: 3, desktop: 5 },
}: TextExplosionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const letters = containerRef.current?.querySelectorAll(".letter");
            if (!letters) return;

            gsap.set(letters, {
                scale: 0,
                opacity: 0,
                x: 0,
                y: 0,
            });

            const tl = gsap.timeline({ delay });

            // T048: Elastic bounce from center
            letters.forEach((letter, i) => {
                // Calculate explosion direction based on position
                const totalLetters = letters.length;
                const angle = (i / totalLetters) * Math.PI * 2;
                const distance = 100; // pixels

                const targetX = Math.cos(angle) * distance;
                const targetY = Math.sin(angle) * distance;

                // Stagger explosion based on distance from center
                const stagger = i * 0.02;

                tl.fromTo(
                    letter,
                    {
                        scale: 0,
                        opacity: 0,
                        x: 0,
                        y: 0,
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        x: targetX,
                        y: targetY,
                        duration: duration * 0.5,
                        ease: "back.out(3)", // Elastic bounce
                    },
                    stagger,
                );

                // Return to final position
                tl.to(
                    letter,
                    {
                        x: 0,
                        y: 0,
                        duration: duration * 0.5,
                        ease: "elastic.out(1, 0.5)",
                    },
                    stagger + duration * 0.5,
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [duration, delay]);

    return (
        <div
            ref={ containerRef }
            className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none"
        >
            <h1
                className="font-bold text-center"
                style={ {
                    color,
                    fontSize: `${fontSize.mobile}rem`,
                    textShadow: `0 0 20px ${color}, 0 0 30px ${color}`,
                } }
            >
                { text.split("").map((char, i) => (
                    <span
                        key={ `char-${i}-${char}` }
                        className="letter inline-block"
                        style={ { whiteSpace: char === " " ? "pre" : "normal" } }
                    >
                        { char === " " ? "\u00A0" : char }
                    </span>
                )) }
            </h1>

            {/* Desktop size using CSS media query */ }
            <style jsx>{ `
        @media (min-width: 768px) {
          h1 {
            font-size: ${fontSize.desktop}rem;
          }
        }
      `}</style>
        </div>
    );
}
