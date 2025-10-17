"use client";

/**
 * ConfettiSystem Component - New Year Animation
 * Falling confetti with 3D rotation and realistic physics
 * T045: 100-150 confetti pieces with random New Year colors
 * T046: 3D rotation (rotateX, rotateY, rotateZ)
 * T047: Fall physics with horizontal drift
 */

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { NEWYEAR_COLORS } from "@/lib/animations/festival-themes";

interface ConfettiSystemProps {
    /** Number of confetti pieces (default: 120) */
    count?: number;
    /** Animation duration in seconds (default: 5s) */
    duration?: number;
    /** Delay before starting (default: 0s) */
    delay?: number;
    /** Custom color palette */
    colors?: readonly string[];
}

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    color: string;
    shape: "rect" | "circle" | "triangle" | "star";
    size: number;
    windOffset: number;
    fallSpeed: number;
}

const SHAPES = ["rect", "circle", "triangle", "star"] as const;

export function ConfettiSystem({
    count = 120,
    duration = 5,
    delay = 0,
    colors = NEWYEAR_COLORS,
}: ConfettiSystemProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const confettiRef = useRef<ConfettiPiece[]>([]);

    // Initialize confetti pieces
    useEffect(() => {
        confettiRef.current = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100, // % of container width
            y: -10 - Math.random() * 20, // Start above viewport
            rotation: Math.random() * 360,
            rotationX: 0,
            rotationY: 0,
            rotationZ: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            size: 8 + Math.random() * 8, // 8-16px
            windOffset: Math.random() * 30 - 15, // -15 to 15 horizontal drift
            fallSpeed: 0.8 + Math.random() * 0.4, // 0.8-1.2x speed variation
        }));
    }, [count, colors]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // T045-T047: Animate each confetti piece
            confettiRef.current.forEach((piece, index) => {
                const tl = gsap.timeline({
                    delay: delay + index * 0.01, // Slight stagger for natural feel
                });

                const confettiElement = `.confetti-${piece.id}`;

                // T047: Fall physics with horizontal drift
                tl.to(confettiElement, {
                    y: "110vh", // Fall below viewport
                    x: `+=${piece.windOffset}vw`, // Horizontal drift
                    duration: duration * piece.fallSpeed,
                    ease: "none",
                });

                // T046: 3D rotation animations
                tl.to(
                    confettiElement,
                    {
                        rotationX: 360 * (1 + Math.random()),
                        rotationY: 360 * (1 + Math.random()),
                        rotationZ: 360 * (2 + Math.random()),
                        duration: duration * piece.fallSpeed,
                        ease: "none",
                    },
                    0, // Start simultaneously with fall
                );

                // T047: Opacity fade at bottom
                tl.to(
                    confettiElement,
                    {
                        opacity: 0,
                        duration: duration * 0.2,
                    },
                    duration * piece.fallSpeed * 0.8, // Fade in last 20% of fall
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [duration, delay]);

    /**
     * Render confetti shape based on type
     */
    const renderShape = (piece: ConfettiPiece) => {
        const { shape, size, color } = piece;

        switch (shape) {
            case "rect":
                return (
                    <div
                        style={ {
                            width: size,
                            height: size * 0.6,
                            backgroundColor: color,
                        } }
                    />
                );
            case "circle":
                return (
                    <div
                        style={ {
                            width: size,
                            height: size,
                            backgroundColor: color,
                            borderRadius: "50%",
                        } }
                    />
                );
            case "triangle":
                return (
                    <div
                        style={ {
                            width: 0,
                            height: 0,
                            borderLeft: `${size / 2}px solid transparent`,
                            borderRight: `${size / 2}px solid transparent`,
                            borderBottom: `${size}px solid ${color}`,
                        } }
                    />
                );
            case "star":
                return (
                    <svg
                        width={ size }
                        height={ size }
                        viewBox="0 0 24 24"
                        role="img"
                        aria-label="star confetti"
                    >
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill={ color }
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={ containerRef }
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            { confettiRef.current.map((piece) => (
                <div
                    key={ piece.id }
                    className={ `confetti-${piece.id} absolute` }
                    style={ {
                        left: `${piece.x}%`,
                        top: `${piece.y}vh`,
                        transform: `rotate(${piece.rotation}deg)`,
                        transformStyle: "preserve-3d",
                    } }
                >
                    { renderShape(piece) }
                </div>
            )) }
        </div>
    );
}
