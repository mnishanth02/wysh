"use client";

import { useEffect } from "react";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { prefersReducedMotion } from "@/lib/animations";

interface AnimatedCounterProps {
    end: number;
    label: string;
    suffix?: string;
    className?: string;
}

/**
 * Animated counter component with GSAP animation
 * Triggers animation when scrolled into viewport (once)
 */
export function AnimatedCounter({
    end,
    label,
    suffix = "",
    className = "",
}: AnimatedCounterProps) {
    const { ref, isIntersecting } = useIntersectionObserver({
        threshold: 0.5,
        triggerOnce: true,
    });

    const { value, play } = useCounterAnimation({
        end,
        autoPlay: false,
    });

    // Trigger animation when element enters viewport
    useEffect(() => {
        if (isIntersecting) {
            play();
        }
    }, [isIntersecting, play]);

    const reducedMotion = prefersReducedMotion();

    return (
        <div ref={ ref } className={ `text-center ${className}` }>
            <div
                className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl"
                aria-live="polite"
            >
                { reducedMotion ? end.toLocaleString() : value.toLocaleString() }
                { suffix }
            </div>
            <div className="mt-2 text-sm text-muted-foreground sm:text-base">
                { label }
            </div>
        </div>
    );
}
