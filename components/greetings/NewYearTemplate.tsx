"use client";

/**
 * New Year Template Component - Enhanced
 * Animated greeting template for New Year celebration
 * Features: Countdown, fireworks, confetti, text explosion with GSAP timeline
 * Phase 4: User Story 2 - New Year Countdown Celebration
 */

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import {
  logPerformanceMetrics,
  shouldUseReducedMotion,
  startFPSMonitor,
} from "@/lib/performance";
import type { RelationshipContext } from "@/types";
import { ConfettiSystem } from "./animations/newyear/ConfettiSystem";
import { CountdownTimer } from "./animations/newyear/CountdownTimer";
import { FireworkBurst } from "./animations/newyear/FireworkBurst";
import { TextExplosion } from "./animations/newyear/TextExplosion";
import { useAnimationContext } from "./animations/shared/ContextAdapter";

interface NewYearTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
  variant?: string; // "1" = Countdown, "2" = Champagne Pop, "3" = Fireworks Sky
}

export function NewYearTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1",
}: NewYearTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    "countdown" | "fireworks" | "confetti" | "text" | "complete"
  >("countdown");

  const festivalData = FESTIVALS.newyear;
  const colors = festivalData.colorPalette;

  // T055: Integrate ContextAdapter for relationship-aware adjustments
  const animationConfig = useAnimationContext(
    "newyear",
    relationshipContext.relationshipType,
  );

  // T056: Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  // Track if animation has started (for background opacity)
  const [bgVisible, setBgVisible] = useState(useReducedMotion);

  useEffect(() => {
    if (!containerRef.current) return;

    // Start FPS monitoring for performance profiling
    const fpsMonitor =
      process.env.NODE_ENV === "development" ? startFPSMonitor() : null;

    const ctx = gsap.context(() => {
      // T053: Create master GSAP timeline with phases
      const tl = gsap.timeline({
        onComplete: () => {
          // Log performance metrics after animation completes
          if (fpsMonitor) {
            const metrics = fpsMonitor.stop();
            logPerformanceMetrics("NewYearTemplate", metrics);
          }
          setAnimationPhase("complete");
          // T057: Wire onAnimationComplete callback
          onAnimationComplete?.();
        },
      });

      // T056: Prefers-reduced-motion: simple fade-in
      if (useReducedMotion) {
        setAnimationPhase("complete");
        tl.play();
        return;
      }

      // T053: Phase 1 (0-4s): Countdown with background intensity increase
      tl.call(
        () => {
          setBgVisible(true);
          setAnimationPhase("countdown");
        },
        [],
        0,
      );

      // T054: Phase 2 (4-7s): Fireworks - synchronized with countdown completion
      tl.addLabel("countdownComplete", 4); // Timeline label for synchronization
      tl.call(() => setAnimationPhase("fireworks"), [], "countdownComplete");

      // T053: Phase 3 (5-10s): Confetti burst from top
      tl.call(() => setAnimationPhase("confetti"), [], 5);

      // T053: Phase 4 (7-10s): Text explosion and text reveal
      tl.call(() => setAnimationPhase("text"), [], 7);

      // Animate text elements (8-10s)
      tl.to(
        ".newyear-recipient",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        8,
      );

      tl.to(
        ".newyear-message",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        8.5,
      );

      tl.to(
        ".newyear-sender",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        9,
      );

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, useReducedMotion]);

  const defaultMessage =
    "May this new year bring you endless opportunities, joy, and wonderful moments! Wishing you success and happiness in all your endeavors.";

  return (
    <div
      ref={containerRef}
      className="newyear-bg relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${animationConfig.colors[2] || colors[2]}, ${animationConfig.colors[3] || colors[3]})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 1s ease-out" : "none",
      }}
    >
      {/* Night sky background */}
      <div className="absolute inset-0">
        <Image
          src="/festivals/newyear/night-sky.svg"
          alt=""
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      {/* T056: Reduced motion variant - simple fade */}
      {useReducedMotion ? (
        <div className="newyear-content absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center space-y-6">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold"
              style={{ color: animationConfig.colors[0] || colors[0] }}
            >
              Happy New Year 2026!
            </h1>
            <p
              className="text-3xl md:text-4xl font-semibold"
              style={{ color: animationConfig.colors[4] || colors[4] }}
            >
              Dear {recipientName},
            </p>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: animationConfig.colors[4] || colors[4] }}
            >
              {message || defaultMessage}
            </p>
            <p
              className="text-xl md:text-2xl font-medium mt-8"
              style={{ color: animationConfig.colors[1] || colors[1] }}
            >
              Cheers to new beginnings,
              <br />
              {senderName}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* All animation components always mounted for GSAP targeting, visibility controlled by opacity/pointer-events */}

          {/* T053: Phase 1 (0-4s): Countdown */}
          <div
            className={`absolute inset-0 ${animationPhase === "countdown" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <CountdownTimer
              startFrom={3}
              durationPerNumber={1.3}
              delay={0.5}
              onComplete={() => {
                // Countdown complete triggers fireworks phase
              }}
              colors={animationConfig.colors}
            />
          </div>

          {/* T053, T054: Phase 2 (4-7s): Fireworks */}
          <div
            className={`absolute inset-0 ${animationPhase === "fireworks" || animationPhase === "confetti" || animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <FireworkBurst
              burstCount={
                animationConfig.intensity === "low"
                  ? 4
                  : animationConfig.intensity === "high"
                    ? 7
                    : 6
              }
              particlesPerBurst={
                animationConfig.intensity === "low"
                  ? 60
                  : animationConfig.intensity === "high"
                    ? 90
                    : 80
              }
              duration={3}
              delay={0}
              colors={animationConfig.colors}
            />
          </div>

          {/* T053: Phase 3 (5-10s): Confetti */}
          <div
            className={`absolute inset-0 ${animationPhase === "confetti" || animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <ConfettiSystem
              count={
                animationConfig.intensity === "low"
                  ? 80
                  : animationConfig.intensity === "high"
                    ? 150
                    : 120
              }
              duration={5}
              delay={0}
              colors={animationConfig.colors}
            />
          </div>

          {/* T053, T058: Phase 4 (7-10s): Text explosion */}
          <div
            className={`absolute inset-0 ${animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <TextExplosion
              text="Happy New Year 2026!"
              duration={1.5}
              delay={0}
              color={animationConfig.colors[2] || colors[2]}
              fontSize={{ mobile: 3, desktop: 5 }}
            />
          </div>

          {/* T058: Text reveal sequence - recipient name + message + sender - Always rendered */}
          <div
            className={`newyear-content absolute inset-0 flex items-center justify-center p-8 pointer-events-none ${animationPhase !== "text" && animationPhase !== "complete" ? "opacity-0" : ""}`}
          >
            <div className="max-w-2xl text-center space-y-6">
              {/* Spacer for main text */}
              <div className="h-32" />

              {/* Recipient name appears (8-9s) */}
              <div
                className="newyear-recipient opacity-0"
                style={{
                  color: animationConfig.colors[4] || colors[4],
                }}
              >
                <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                  Dear {recipientName},
                </p>
              </div>

              {/* Message body (8.5-9.5s) */}
              <p
                className="newyear-message text-lg md:text-xl leading-relaxed opacity-0"
                style={{
                  color: animationConfig.colors[4] || colors[4],
                }}
              >
                {message || defaultMessage}
              </p>

              {/* Sender name (9-10s) */}
              <p
                className="newyear-sender text-xl md:text-2xl font-medium mt-8 opacity-0"
                style={{
                  color: animationConfig.colors[1] || colors[1],
                }}
              >
                Cheers to new beginnings,
                <br />
                {senderName}
              </p>
            </div>
          </div>
        </>
      )}

      {/* CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
