"use client";

/**
 * FireworkSystem Component
 * Firework particle effects for Diwali animation
 */

import { gsap } from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { DIWALI_COLORS } from "@/lib/animations/festival-themes";
import type { ParticleSystem } from "@/lib/animations/particle-physics";
import {
    ParticleCanvas,
    type ParticleCanvasRef,
} from "../shared/ParticleCanvas";

export interface FireworkSystemProps {
    burstCount?: number;
    particlesPerBurst?: number;
    duration?: number;
    delay?: number;
    colors?: string[];
    onComplete?: () => void;
}

/**
 * FireworkSystem with particle bursts and motion paths
 */
export function FireworkSystem({
    burstCount = 5,
    particlesPerBurst = 50,
    duration: _duration = 4,
    delay = 0,
    colors = [...DIWALI_COLORS],
    onComplete,
}: FireworkSystemProps) {
    const canvasRef = useRef<ParticleCanvasRef>(null);
    const systemRef = useRef<ParticleSystem | null>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const launchFirework = useCallback(
        (x: number, y: number, targetY: number) => {
            if (!systemRef.current) return;

            // Create launch animation
            const launchDuration = 0.8;
            const tl = gsap.timeline();

            // Animate launch position
            const pos = { x, y };
            tl.to(pos, {
                y: targetY,
                duration: launchDuration,
                ease: "power2.out",
                onUpdate: () => {
                    // Emit trail particles during launch
                    if (systemRef.current) {
                        systemRef.current.emitBurst(pos.x, pos.y, {
                            count: 2,
                            angle: { min: Math.PI / 2 - 0.2, max: Math.PI / 2 + 0.2 },
                            speed: { min: 20, max: 40 },
                            life: 500,
                            size: { min: 2, max: 4 },
                        });
                    }
                },
                onComplete: () => {
                    // Burst at apex
                    if (systemRef.current) {
                        systemRef.current.emitBurst(pos.x, pos.y, {
                            count: particlesPerBurst,
                            angle: { min: 0, max: Math.PI * 2 }, // 360 degrees
                            speed: { min: 100, max: 200 },
                            life: 2000,
                            size: { min: 3, max: 6 },
                            colors,
                        });
                    }
                },
            });

            return tl;
        },
        [particlesPerBurst, colors],
    );

    const handleSystemReady = useCallback(
        (system: ParticleSystem) => {
            systemRef.current = system;

            // Create master timeline for fireworks
            const tl = gsap.timeline({
                delay,
                onComplete,
            });

            // Calculate canvas dimensions
            const canvas = canvasRef.current?.getSystem()?.["canvas"];
            if (!canvas) return;

            const width = canvas.width;
            const height = canvas.height;

            // Launch fireworks with staggered timing
            for (let i = 0; i < burstCount; i++) {
                const launchX = (width / (burstCount + 1)) * (i + 1);
                const launchY = height;
                const targetY = height * 0.3 + Math.random() * height * 0.2;
                const delayOffset = i * 0.3;

                const fireworkTl = launchFirework(launchX, launchY, targetY);
                if (fireworkTl) {
                    tl.add(fireworkTl, delayOffset);
                }
            }

            timelineRef.current = tl;
        },
        [delay, burstCount, launchFirework, onComplete],
    );

    useEffect(() => {
        return () => {
            timelineRef.current?.kill();
        };
    }, []);

    return (
        <ParticleCanvas
            ref={ canvasRef }
            config={ {
                colors,
                particleSize: 4,
                gravity: 150,
                friction: 0.98,
                maxParticles: burstCount * particlesPerBurst + 50,
                lifespan: 2000,
                blendMode: "screen",
            } }
            className="absolute inset-0"
            width={ 800 }
            height={ 600 }
            autoStart={ true }
            onSystemReady={ handleSystemReady }
        />
    );
}
