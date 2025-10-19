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
import {
  getDeviceAnimationConfig,
  getMobileParticleCount,
} from "@/lib/animations";
import { FESTIVALS } from "@/lib/constants";
import {
  logPerformanceMetrics,
  shouldUseReducedMotion,
  startFPSMonitor,
} from "@/lib/performance";
import type { RelationshipContext } from "@/types";
import { ChampagneBottle } from "./animations/newyear/ChampagneBottle";
import { ChampagneBurst } from "./animations/newyear/ChampagneBurst";
import { ChampagneSparkles } from "./animations/newyear/ChampagneSparkles";
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
  isPreview?: boolean; // T151: Modal preview mode - use responsive sizing
}

export function NewYearTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1",
  isPreview = false,
}: NewYearTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    | "countdown"
    | "fireworks"
    | "confetti"
    | "text"
    | "complete"
    | "champagne"
    | "champagne-pop"
    | "champagne-sparkles"
    | "champagne-burst"
  >(
    variant === "1" ? "countdown" : variant === "2" ? "champagne" : "fireworks",
  );

  const festivalData = FESTIVALS.newyear;
  const colors = festivalData.colorPalette;

  // T110: Mobile optimization - detect device and reduce particles
  const deviceConfig = getDeviceAnimationConfig();
  const mobileParticleCount = (count: number) =>
    getMobileParticleCount(count);

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

      // Variant-specific animation timelines
      if (variant === "1") {
        // VARIANT 1: Countdown to Fireworks
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
      } else if (variant === "2") {
        // VARIANT 2: Champagne Pop Celebration
        // New champagne-specific animation sequence
        tl.call(
          () => {
            setBgVisible(true);
            setAnimationPhase("champagne"); // Show bottle
          },
          [],
          0,
        );

        // Phase 1 (0-1s): Bottle shake and cork pop
        // ChampagneBottle will call onPopComplete at 1s

        // Phase 2 (1-2.5s): Sparkles shoot upward
        tl.call(() => setAnimationPhase("champagne-sparkles"), [], 1);

        // Phase 3 (2.5-3.5s): Burst explosion at top
        tl.call(() => setAnimationPhase("champagne-burst"), [], 2.5);

        // Phase 4 (3.5s+): Text explosion reveals "Happy New Year 2026!"
        tl.call(() => setAnimationPhase("text"), [], 3.5);

        // Phase 5: Animate text elements (4.5-7s)
        tl.to(
          ".newyear-recipient",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          4.5,
        );

        tl.to(
          ".newyear-message",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          5,
        );

        tl.to(
          ".newyear-sender",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          5.5,
        );
      } else if (variant === "3") {
        // VARIANT 3: Fireworks Sky Spectacular
        // Emphasis on fireworks with minimal countdown
        tl.call(
          () => {
            setBgVisible(true);
            setAnimationPhase("fireworks");
          },
          [],
          0,
        );

        // Extended fireworks display (0-5s)
        tl.call(() => setAnimationPhase("fireworks"), [], 0);

        // Confetti complement (3-8s)
        tl.call(() => setAnimationPhase("confetti"), [], 3);

        // Text reveal (5-10s)
        tl.call(() => setAnimationPhase("text"), [], 5);

        // Animate text elements (6-10s)
        tl.to(
          ".newyear-recipient",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          6,
        );

        tl.to(
          ".newyear-message",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          6.5,
        );

        tl.to(
          ".newyear-sender",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          7,
        );
      }

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, useReducedMotion, variant]);

  const defaultMessage =
    "May this new year bring you endless opportunities, joy, and wonderful moments! Wishing you success and happiness in all your endeavors.";

  return (
    <div
      ref={ containerRef }
      className="newyear-bg relative w-full h-full overflow-hidden"
      style={ {
        background: `linear-gradient(135deg, ${animationConfig.colors[2] || colors[2]}, ${animationConfig.colors[3] || colors[3]})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 1s ease-out" : "none",
        minHeight: isPreview ? "auto" : "100vh",
      } }
    >
      {/* Night sky background */ }
      <div className="absolute inset-0">
        <Image
          src="/festivals/newyear/night-sky.svg"
          alt=""
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      {/* T151: Reduced motion variant - responsive sizing for preview and full-screen modes */ }
      { useReducedMotion ? (
        <div
          className={ `newyear-content absolute inset-0 flex items-center justify-center ${isPreview ? "p-4 sm:p-6" : "p-8"
            }` }
        >
          <div
            className={ `max-w-2xl text-center w-full ${isPreview ? "space-y-4 sm:space-y-6" : "space-y-6"
              }` }
          >
            <h1
              className={ `font-bold ${isPreview
                  ? "text-2xl sm:text-3xl md:text-4xl"
                  : "text-5xl md:text-6xl lg:text-7xl"
                }` }
              style={ { color: animationConfig.colors[0] || colors[0] } }
            >
              Happy New Year 2026!
            </h1>
            <p
              className={ `font-semibold ${isPreview
                  ? "text-lg sm:text-2xl md:text-3xl"
                  : "text-3xl md:text-4xl"
                }` }
              style={ { color: animationConfig.colors[4] || colors[4] } }
            >
              Dear { recipientName },
            </p>
            <p
              className={ `leading-relaxed ${isPreview
                  ? "text-sm sm:text-base md:text-lg"
                  : "text-lg md:text-xl"
                }` }
              style={ { color: animationConfig.colors[4] || colors[4] } }
            >
              { message || defaultMessage }
            </p>
            <p
              className={ `font-medium mt-6 sm:mt-8 ${isPreview
                  ? "text-base sm:text-lg md:text-xl"
                  : "text-xl md:text-2xl"
                }` }
              style={ { color: animationConfig.colors[1] || colors[1] } }
            >
              Cheers to new beginnings,
              <br />
              { senderName }
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* All animation components always mounted for GSAP targeting, visibility controlled by opacity/pointer-events */ }

          {/* VARIANT 2: Champagne Pop Animation Sequence */ }
          { variant === "2" && (
            <>
              {/* Champagne Bottle (visible during champagne phase) */ }
              <div
                className={ `absolute inset-0 ${animationPhase === "champagne" || animationPhase === "champagne-sparkles" ? "opacity-100" : "opacity-0 pointer-events-none"}` }
              >
                <ChampagneBottle
                  delay={ 0 }
                  onPopComplete={ () => {
                    // Bottle pop complete - sparkles phase already triggered by timeline
                  } }
                  colors={ animationConfig.colors }
                />
              </div>

              {/* Champagne Sparkles shooting upward (1-2.5s) */ }
              <div
                className={ `absolute inset-0 ${animationPhase === "champagne-sparkles" || animationPhase === "champagne-burst" || animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}` }
              >
                <ChampagneSparkles
                  particleCount={ 70 }
                  duration={ 1.5 }
                  delay={ 0 }
                  colors={ animationConfig.colors }
                  onReachTop={ () => {
                    // Sparkles reached top - burst phase already triggered by timeline
                  } }
                />
              </div>

              {/* Champagne Burst at top (2.5-3.5s) */ }
              <div
                className={ `absolute inset-0 ${animationPhase === "champagne-burst" || animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}` }
              >
                <ChampagneBurst
                  particleCount={ 180 }
                  duration={ 1.2 }
                  delay={ 0 }
                  colors={ animationConfig.colors }
                  onBurstComplete={ () => {
                    // Burst complete - text phase already triggered by timeline
                  } }
                />
              </div>
            </>
          ) }

          {/* T053: Phase 1 (0-4s): Countdown (VARIANT 1 only) */ }
          <div
            className={ `absolute inset-0 ${animationPhase === "countdown" ? "opacity-100" : "opacity-0 pointer-events-none"}` }
          >
            <CountdownTimer
              startFrom={ 3 }
              durationPerNumber={ 1.3 }
              delay={ 0.5 }
              onComplete={ () => {
                // Countdown complete triggers fireworks phase
              } }
              colors={ animationConfig.colors }
            />
          </div>

          {/* T053, T054: Phase 2 (4-7s): Fireworks */ }
          <div
            className={ `absolute inset-0 ${animationPhase === "fireworks" || animationPhase === "confetti" || animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}` }
          >
            <FireworkBurst
              burstCount={
                deviceConfig.isMobile
                  ? 3
                  : animationConfig.intensity === "low"
                    ? 4
                    : animationConfig.intensity === "high"
                      ? 7
                      : 6
              }
              particlesPerBurst={ mobileParticleCount(
                animationConfig.intensity === "low"
                  ? 60
                  : animationConfig.intensity === "high"
                    ? 90
                    : 80,
              ) }
              duration={ 3 }
              delay={ 0 }
              colors={ animationConfig.colors }
            />
          </div>

          {/* T053: Phase 3 (5-10s): Confetti */ }
          <div
            className={ `absolute inset-0 ${animationPhase === "confetti" || animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}` }
          >
            <ConfettiSystem
              count={ mobileParticleCount(
                animationConfig.intensity === "low"
                  ? 80
                  : animationConfig.intensity === "high"
                    ? 150
                    : 120,
              ) }
              duration={ 5 }
              delay={ 0 }
              colors={ animationConfig.colors }
            />
          </div>

          {/* T053, T058: Phase 4 (7-10s): Text explosion */ }
          <div
            className={ `absolute inset-0 ${animationPhase === "text" || animationPhase === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}` }
          >
            <TextExplosion
              text="Happy New Year 2026!"
              duration={ 1.5 }
              delay={ 0 }
              color={ animationConfig.colors[2] || colors[2] }
              fontSize={ { mobile: 3, desktop: 5 } }
            />
          </div>

          {/* T058: Text reveal sequence - recipient name + message + sender - Always rendered, T151: responsive */ }
          <div
            className={ `newyear-content absolute inset-0 flex items-center justify-center pointer-events-none ${isPreview ? "p-4 sm:p-6" : "p-8"
              } ${animationPhase !== "text" && animationPhase !== "complete" ? "opacity-0" : ""}` }
          >
            {/* Semi-transparent backdrop for better text readability */ }
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

            <div
              className={ `max-w-2xl text-center w-full relative z-10 ${isPreview ? "space-y-3 sm:space-y-6" : "space-y-6"
                }` }
            >
              {/* Spacer for main text */ }
              <div className={ isPreview ? "h-16 sm:h-24" : "h-32" } />

              {/* Recipient name appears (8-9s) */ }
              <div
                className={ `newyear-recipient opacity-0 ${isPreview
                    ? "text-lg sm:text-2xl md:text-3xl"
                    : "text-2xl md:text-3xl lg:text-4xl"
                  } font-semibold` }
                style={ {
                  color: "#FFFFFF",
                  textShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 1)",
                } }
              >
                <p>Dear { recipientName },</p>
              </div>

              {/* Message body (8.5-9.5s) */ }
              <p
                className={ `newyear-message opacity-0 leading-relaxed ${isPreview
                    ? "text-sm sm:text-base md:text-lg"
                    : "text-lg md:text-xl"
                  }` }
                style={ {
                  color: "#FFFFFF",
                  textShadow:
                    "0 2px 6px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.8)",
                  backgroundColor: "rgba(0, 0, 0, 0.25)",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  backdropFilter: "blur(6px)",
                } }
              >
                { message || defaultMessage }
              </p>

              {/* Sender name (9-10s) */ }
              <p
                className={ `newyear-sender opacity-0 font-medium mt-4 sm:mt-6 ${isPreview
                    ? "text-base sm:text-lg md:text-xl"
                    : "text-xl md:text-2xl"
                  }` }
                style={ {
                  color: "#FFD700",
                  textShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
                } }
              >
                Cheers to new beginnings,
                <br />
                { senderName }
              </p>
            </div>
          </div>
        </>
      ) }

      {/* CSS for fade-in animation */ }
      <style jsx>{ `
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
