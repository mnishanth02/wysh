"use client";

/**
 * FireworkBurst Component - New Year Animation
 * Multiple fireworks with staggered timing and gravity simulation
 * T042: ParticleCanvas with 5-7 fireworks, staggered timing
 * T043: 360-degree radial distribution, 400-500 particles, color cycling
 * T044: Gravity simulation with fade-out
 */

import { gsap } from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { NEWYEAR_COLORS } from "@/lib/animations/festival-themes";
import {
    ParticleCanvas,
    type ParticleCanvasRef,
} from "../shared/ParticleCanvas";

interface FireworkBurstProps {
    /** Number of firework bursts (default: 6) */
    burstCount?: number;
    /** Particles per burst (default: 80) */
    particlesPerBurst?: number;
    /** Total animation duration in seconds (default: 3s) */
    duration?: number;
    /** Delay before starting (default: 0s) */
    delay?: number;
    /** Custom color palette */
    colors?: readonly string[];
}

export function FireworkBurst({
    burstCount = 6,
    particlesPerBurst = 80,
    duration = 3,
    delay = 0,
    colors = NEWYEAR_COLORS,
}: FireworkBurstProps) {
    const canvasRef = useRef<ParticleCanvasRef>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    /**
     * T042-T044: Launch a single firework with physics
     */
    const launchFirework = useCallback(
        (index: number, canvasWidth: number, canvasHeight: number) => {
            const particleSystem = canvasRef.current?.getSystem();
            if (!particleSystem) return;

            // Random launch position (horizontal spread)
            const launchX = canvasWidth * (0.2 + Math.random() * 0.6);
            const apexY = canvasHeight * (0.2 + Math.random() * 0.3); // Upper portion

            // T043: Cycle through colors for each firework
            const colorIndex = index % colors.length;
            const burstColor = colors[colorIndex] || NEWYEAR_COLORS[0];

            // T043: 360-degree radial burst with all particles at once
            particleSystem.emitBurst(launchX, apexY, {
                count: particlesPerBurst,
                angle: undefined, // Defaults to 360-degree radial
                speed: { min: 150, max: 250 },
                size: { min: 3, max: 6 },
                life: 2000 + Math.random() * 1000, // 2-3 seconds
                colors: [burstColor],
            });
        },
        [particlesPerBurst, colors],
    );

    useEffect(() => {
        const particleSystem = canvasRef.current?.getSystem();
        if (!particleSystem) return;

        // Get canvas dimensions for firework positioning
        const canvas = canvasRef.current?.getSystem()?.["canvas"];
        if (!canvas) return;
        const canvasWidth = canvas.width || window.innerWidth;
        const canvasHeight = canvas.height || window.innerHeight;

        const tl = gsap.timeline({ delay });

        // T042: Staggered firework launches
        const staggerDelay = duration / burstCount;

        for (let i = 0; i < burstCount; i++) {
            const launchTime = i * staggerDelay;

            tl.call(
                () => {
                    launchFirework(i, canvasWidth, canvasHeight);
                },
                [],
                launchTime,
            );
        }

        timelineRef.current = tl;

        return () => {
            tl.kill();
        };
    }, [burstCount, duration, delay, launchFirework]);

    return (
        <ParticleCanvas
            ref={ canvasRef }
            config={ {
                maxParticles: burstCount * particlesPerBurst,
                colors: [...colors],
                particleSize: 4,
                lifespan: 2500,
                // T044: Gravity simulation
                gravity: 150,
                friction: 0.98,
                velocityVariation: 0.2,
                opacity: 1,
                blendMode: "screen",
            } }
            className="absolute inset-0 pointer-events-none"
            autoStart={ true }
        />
    );
}
