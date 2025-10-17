"use client";

/**
 * Pongal Template Component
 * Enhanced animated greeting template for Pongal harvest festival
 *
 * Features complete animation sequence:
 * - Sunrise with rotating rays (0-2s)
 * - Kolam drawing animation (2-4s)
 * - Pongal pot boiling and overflow (3-6s)
 * - Steam particles rising (4-10s)
 * - Sugarcane sway and rice grains (4-10s)
 * - Text reveal sequence (6-10s)
 *
 * Tasks: T074-T081
 */

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import { shouldUseReducedMotion } from "@/lib/performance";
import { SunRise } from "./animations/pongal/SunRise";
import { KolamDrawing } from "./animations/pongal/KolamDrawing";
import { PongalPot } from "./animations/pongal/PongalPot";
import { SteamParticles } from "./animations/pongal/SteamParticles";
import { SugarcaneSway } from "./animations/pongal/SugarcaneSway";
import { RiceGrains } from "./animations/pongal/RiceGrains";
import type { RelationshipContext } from "@/types";

interface PongalTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  /** T077: Relationship context for future context-aware adjustments */
  relationshipContext?: RelationshipContext;
  onAnimationComplete?: () => void;
}

type AnimationPhase =
  | "sunrise"
  | "kolam"
  | "pot"
  | "celebration"
  | "text"
  | "complete";

export function PongalTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext: _relationshipContext, // T077: Reserved for Phase 6 context adaptation
  onAnimationComplete,
}: PongalTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] =
    useState<AnimationPhase>("sunrise");
  const reducedMotion = shouldUseReducedMotion();

  const festivalData = FESTIVALS.pongal;
  const colors = festivalData.colorPalette;

  // Master timeline orchestration (T074, T075)
  useEffect(() => {
    if (!containerRef.current) return;

    // Reduced motion fallback (T078)
    if (reducedMotion) {
      setAnimationPhase("complete");
      onAnimationComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setAnimationPhase("complete");
          onAnimationComplete?.();
        },
      });

      // T076: Warm gradient background fade (0-2s)
      tl.from(".pongal-bg", {
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      });

      // Phase callbacks for conditional rendering
      tl.call(() => setAnimationPhase("sunrise"), [], 0);
      tl.addLabel("sunriseComplete", 2);

      tl.call(() => setAnimationPhase("kolam"), [], "sunriseComplete");
      tl.addLabel("kolamComplete", 4);

      tl.call(() => setAnimationPhase("pot"), [], 3);
      tl.addLabel("potBoiling", 6);

      tl.call(() => setAnimationPhase("celebration"), [], 4);

      // T080: Text reveal sequence (6-10s)
      tl.call(() => setAnimationPhase("text"), [], 6);

      // Greeting text "Happy Pongal" (6-7s)
      tl.from(
        ".greeting-text",
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: "back.out(1.5)",
        },
        6,
      );

      // Recipient name (7-8s)
      tl.from(
        ".recipient-name",
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        7,
      );

      // Message body (8-9s)
      tl.from(
        ".message-body",
        {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        8,
      );

      // Sender name (9-10s)
      tl.from(
        ".sender-name",
        {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        9,
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, reducedMotion]);

  // Reduced motion fallback (T078)
  if (reducedMotion) {
    return (
      <div
        ref={ containerRef }
        className="pongal-bg relative flex min-h-screen items-center justify-center p-4"
        style={ {
          background: `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`,
        } }
      >
        <div className="relative z-10 max-w-2xl text-center space-y-6">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold drop-shadow-lg"
            style={ { color: colors[2] } }
          >
            Pongal Vazhthukkal!
          </h1>

          <div className="space-y-4">
            <p
              className="text-3xl sm:text-4xl font-semibold drop-shadow-md"
              style={ { color: colors[3] } }
            >
              Dear { recipientName },
            </p>

            <p
              className="text-lg sm:text-xl leading-relaxed px-4 drop-shadow-md text-white"
            >
              { message ||
                `May this harvest festival bring abundant prosperity and happiness to you and your family!` }
            </p>

            <p
              className="text-xl sm:text-2xl font-medium mt-8 drop-shadow-md"
              style={ { color: colors[0] } }
            >
              With best wishes,
              <br />
              { senderName }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ containerRef }
      className="pongal-bg relative flex min-h-screen items-center justify-center p-4 overflow-hidden"
      style={ {
        background: `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`,
      } }
    >
      {/* Animation Layers */ }

      {/* Background decorations - always visible */ }
      { (animationPhase === "celebration" || animationPhase === "text" || animationPhase === "complete") && (
        <>
          <SugarcaneSway duration={ 8 } />
          <RiceGrains grainCount={ 40 } duration={ 10 } />
        </>
      ) }

      {/* Sunrise animation (0-2s) */ }
      { animationPhase === "sunrise" && (
        <SunRise
          duration={ 2 }
          sunColor={ colors[0] }
          rayColor={ colors[1] }
          onComplete={ () => {
            // Sunrise complete handled by timeline
          } }
        />
      ) }

      {/* Kolam drawing (2-4s) */ }
      { animationPhase === "kolam" && (
        <KolamDrawing
          duration={ 2 }
          color="#F5F5DC"
          circleCount={ 6 }
          onComplete={ () => {
            // Kolam complete handled by timeline
          } }
        />
      ) }

      {/* Pongal pot with boiling and overflow (3-6s) */ }
      { (animationPhase === "pot" || animationPhase === "celebration") && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <PongalPot
              duration={ 6 }
              potColor="#D2691E"
              overflowAt={ 4 }
              onComplete={ () => {
                // Pot animation complete
              } }
            />
          </div>

          {/* Steam particles (4-10s) */ }
          <SteamParticles
            particleCount={ 65 }
            duration={ 6 }
            onComplete={ () => {
              // Steam complete
            } }
          />
        </>
      ) }

      {/* Text content (6-10s) */ }
      { (animationPhase === "text" || animationPhase === "complete") && (
        <div className="relative z-20 max-w-2xl text-center space-y-6">
          <h1
            className="greeting-text text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg"
            style={ { color: colors[2] } }
          >
            Pongal Vazhthukkal!
          </h1>

          <div className="space-y-4">
            <p
              className="recipient-name text-2xl sm:text-3xl md:text-4xl font-semibold drop-shadow-md text-white"
            >
              Dear { recipientName },
            </p>

            <p className="message-body text-base sm:text-lg md:text-xl leading-relaxed px-4 drop-shadow-md text-white">
              { message ||
                `May this harvest festival bring abundant prosperity and happiness to you and your family!` }
            </p>

            <p
              className="sender-name text-lg sm:text-xl md:text-2xl font-medium mt-8 drop-shadow-md"
              style={ { color: colors[1] } }
            >
              With best wishes,
              <br />
              { senderName }
            </p>
          </div>
        </div>
      ) }
    </div>
  );
}
