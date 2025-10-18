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
  const [bgVisible, setBgVisible] = useState(false);
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
        setBgVisible(true);
        tl.set([".diwali-content", ".greeting-title", ".recipient-name", ".message-body", ".sender-name"], {
          opacity: 1,
        });
        setAnimationPhase("complete");
        tl.play();
        return;
      }

      // Set initial opacity for animated elements
      gsap.set([".diwali-content", ".greeting-title", ".recipient-name", ".message-body", ".sender-name"], {
        opacity: 0,
      });

      // Set initial transform states
      gsap.set(".greeting-title", {
        scale: 0.8,
      });

      gsap.set([".recipient-name", ".message-body", ".sender-name"], {
        y: 20,
      });

      // Phase 1 (0-2s): Background fade via React state + diya lighting
      setBgVisible(true);
      tl.call(() => setAnimationPhase("intro"), [], 0);

      // Phase 2 (2-6s): Fireworks + sparkles
      tl.call(() => setAnimationPhase("main"), [], 2);

      // Phase 3 (6-8s): Text reveal with character animations
      tl.call(() => setAnimationPhase("text"), [], 6);

      // Fade in content container first
      tl.to(".diwali-content", {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, 6);

      // Text reveal animations (6-10s)
      tl.to(".greeting-title", {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.5)",
      }, 6.5);

      tl.to(".recipient-name", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }, 7);

      tl.to(".message-body", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }, 7.5);

      tl.to(".sender-name", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }, 8.5);

      // Phase 4 (9-10s): Finale with sparkle loop
      tl.call(() => setAnimationPhase("finale"), [], 9);

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
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 2s ease-out" : "none",
      } }
    >
      {/* T036: Always render content container so GSAP can target it */ }
      <div className="diwali-content absolute inset-0 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-6">
          <h1
            className="greeting-title text-4xl md:text-5xl lg:text-6xl font-bold"
            style={ { color: animationConfig.colors[0] || colors[0] } }
          >
            Happy Diwali!
          </h1>
          <p
            className="recipient-name text-3xl md:text-4xl font-semibold"
            style={ { color: animationConfig.colors[3] || colors[3] } }
          >
            Dear { recipientName },
          </p>
          <p
            className="message-body text-lg md:text-xl leading-relaxed"
            style={ { color: animationConfig.colors[3] || colors[3] } }
          >
            { message || defaultMessage }
          </p>
          <p
            className="sender-name text-xl md:text-2xl font-medium mt-8"
            style={ { color: animationConfig.colors[1] || colors[1] } }
          >
            With love,
            <br />
            { senderName }
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
