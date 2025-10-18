"use client";

/**
 * Diwali Template Component - Enhanced
 * Animated greeting template for Diwali festival
 * Features: Diya lighting, fireworks, sparkles, rangoli drawing with GSAP timeline
 * Phase 3: User Story 1 - Diwali Festival Lighting Animation
 */

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import {
  logPerformanceMetrics,
  shouldUseReducedMotion,
  startFPSMonitor,
} from "@/lib/performance";
import type { RelationshipContext } from "@/types";
import { DiyaLighting } from "./animations/diwali/DiyaLighting";
import { FireworkSystem } from "./animations/diwali/FireworkSystem";
import { RangoliDraw } from "./animations/diwali/RangoliDraw";
import { SparkleParticles } from "./animations/diwali/SparkleParticles";
import { useAnimationContext } from "./animations/shared/ContextAdapter";
import { TextReveal } from "./animations/shared/TextReveal";

interface DiwaliTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function DiwaliTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: DiwaliTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    "intro" | "main" | "text" | "finale" | "complete"
  >("intro");

  const festivalData = FESTIVALS.diwali;
  const colors = festivalData.colorPalette;

  // T035: Integrate ContextAdapter for relationship-aware adjustments
  const animationConfig = useAnimationContext(
    "diwali",
    relationshipContext.relationshipType,
  );

  // T036: Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    // Start FPS monitoring for performance profiling
    const fpsMonitor =
      process.env.NODE_ENV === "development" ? startFPSMonitor() : null;

    const ctx = gsap.context(() => {
      // T034: Create master GSAP timeline with phases
      const tl = gsap.timeline({
        onComplete: () => {
          // Log performance metrics after animation completes
          if (fpsMonitor) {
            const metrics = fpsMonitor.stop();
            logPerformanceMetrics("DiwaliTemplate", metrics);
          }
          setAnimationPhase("complete");
          // T037: Wire onAnimationComplete callback
          onAnimationComplete?.();
        },
      });

      // T036: Prefers-reduced-motion: simple fade-in
      if (useReducedMotion) {
        tl.set([".diwali-bg", ".diwali-content"], {
          opacity: 1,
        });
        setAnimationPhase("complete");
        tl.play();
        return;
      }

      // T038: GPU acceleration hints
      gsap.set(".diwali-content", {
        force3D: true,
        transformOrigin: "center center",
      });

      // Phase 1 (0-2s): Background fade + diya lighting
      tl.to(".diwali-bg", {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        onStart: () => setAnimationPhase("intro"),
      });

      // Phase 2 (2-6s): Fireworks + sparkles
      tl.call(() => setAnimationPhase("main"), [], 2);

      // Phase 3 (6-8s): Text reveal
      tl.call(() => setAnimationPhase("text"), [], 6);

      // Phase 4 (8-10s): Finale with sparkle loop
      tl.call(() => setAnimationPhase("finale"), [], 8);

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, useReducedMotion]);

  const defaultMessage =
    "May this Diwali bring light, prosperity, and joy to your life! Wishing you a festival filled with happiness and blessings.";

  return (
    <div
      ref={ containerRef }
      className="diwali-bg relative min-h-screen overflow-hidden"
      style={ {
        background: `linear-gradient(135deg, ${animationConfig.colors[2] || colors[2]}, ${animationConfig.colors[3] || colors[3]})`,
        opacity: useReducedMotion ? 1 : 0,
      } }
    >
      {/* T036: Always render content container so GSAP can target it */ }
      <div
        className={ `diwali-content absolute inset-0 flex items-center justify-center p-8 ${useReducedMotion || animationPhase === "text" ? "opacity-100" : "opacity-0"
          }` }
      >
        <div className="max-w-2xl text-center space-y-6">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            style={ { color: animationConfig.colors[0] || colors[0] } }
          >
            { useReducedMotion || animationPhase === "text" ? (
              animationPhase === "text" ? (
                <TextReveal
                  text="Happy Diwali!"
                  duration={ 1 }
                  delay={ 0 }
                  stagger={ 0.08 }
                />
              ) : (
                "Happy Diwali!"
              )
            ) : null }
          </h1>
          <p
            className="text-3xl md:text-4xl font-semibold"
            style={ { color: animationConfig.colors[3] || colors[3] } }
          >
            { useReducedMotion || animationPhase === "text" ? (
              animationPhase === "text" ? (
                <TextReveal
                  text={ `Dear ${recipientName},` }
                  duration={ 0.8 }
                  delay={ 1 }
                  stagger={ 0.05 }
                />
              ) : (
                `Dear ${recipientName},`
              )
            ) : null }
          </p>
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={ {
              color: animationConfig.colors[3] || colors[3],
              animation:
                !useReducedMotion && animationPhase === "text"
                  ? "fadeIn 0.8s ease-out 2s forwards"
                  : "none",
            } }
          >
            { useReducedMotion || animationPhase === "text"
              ? message || defaultMessage
              : null }
          </p>
          <p
            className="text-xl md:text-2xl font-medium mt-8"
            style={ {
              color: animationConfig.colors[1] || colors[1],
              animation:
                !useReducedMotion && animationPhase === "text"
                  ? "fadeIn 0.8s ease-out 2.5s forwards"
                  : "none",
            } }
          >
            { useReducedMotion || animationPhase === "text" ? (
              <>
                With love,
                <br />
                { senderName }
              </>
            ) : null }
          </p>
        </div>
      </div>

      {/* Phase 1 (0-2s): Diya lighting */ }
      { !useReducedMotion && animationPhase !== "intro" && (
        <DiyaLighting count={ 5 } duration={ 1 } delay={ 0.5 } stagger={ 0.2 } />
      ) }

      {/* Phase 2 (2-6s): Fireworks */ }
      { !useReducedMotion && animationPhase === "main" && (
        <FireworkSystem
          burstCount={ animationConfig.intensity === "low" ? 3 : 5 }
          particlesPerBurst={
            animationConfig.intensity === "low"
              ? 40
              : animationConfig.intensity === "high"
                ? 60
                : 50
          }
          duration={ 4 }
          delay={ 0 }
          colors={ animationConfig.colors }
        />
      ) }

      {/* Phase 2 (2-6s): Sparkles */ }
      { !useReducedMotion && animationPhase === "main" && (
        <SparkleParticles count={ 30 } duration={ 4 } delay={ 0 } />
      ) }

      {/* Rangoli (appears subtly in background) */ }
      { !useReducedMotion && animationPhase === "text" && (
        <div className="absolute inset-0 flex items-end justify-center pb-20 opacity-20">
          <RangoliDraw duration={ 3 } delay={ 0 } />
        </div>
      ) }

      {/* Phase 4 (8-10s): Finale sparkles */ }
      { !useReducedMotion && animationPhase === "finale" && (
        <SparkleParticles count={ 20 } duration={ 2 } delay={ 0 } />
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
