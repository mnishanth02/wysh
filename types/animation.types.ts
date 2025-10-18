/**
 * Animation Type Definitions
 * Enhanced Festival Greeting Animations
 */

import type { RelationshipContext } from "./index";

export interface AnimationTemplateProps {
  // Identification
  festivalType: "diwali" | "newyear" | "pongal" | "fireworks";

  // Personalization
  recipientName: string; // User-provided, max 50 chars, visible in animation
  senderName: string; // User-provided, max 50 chars, visible in animation
  message?: string; // Optional, user-provided, max 150 chars

  // Context & Configuration
  relationshipContext: RelationshipContext;
  colorPalette?: string[]; // Override default festival colors (hex values)
  particleIntensity?: "low" | "medium" | "high"; // Device-aware scaling

  // Lifecycle Callbacks
  onAnimationComplete?: () => void; // Called when animation finishes (8-12s)
  onAnimationStart?: () => void; // Called when animation begins
  onError?: (error: Error) => void; // Error handling for animation failures

  // Configuration
  duration?: number; // Override duration (ms, default 8000-12000)
  autoPlay?: boolean; // Start animation immediately (default true)
  playbackRate?: number; // GSAP timeline playback rate (0.5-2.0, default 1.0)
}

export interface AnimationTemplateState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number; // 0-1 normalized progress
  currentTime: number; // Current animation time (ms)
  totalTime: number; // Total animation duration (ms)
}

export interface AnimationTemplateRef {
  play(): void;
  pause(): void;
  resume(): void;
  replay(): void;
  stop(): void;
  seek(time: number): void;
  getState(): AnimationTemplateState;
}

export interface AnimationTimelineConfig {
  duration: number; // Total animation duration (ms)
  relationshipSpeed: number; // Speed multiplier (0.8-1.2)
  colors: string[]; // Color palette for animation
  festival: "diwali" | "newyear" | "pongal" | "fireworks";
}

export interface TimelinePhase {
  name: string; // e.g., 'intro', 'main', 'outro'
  duration: number; // Phase duration (ms)
  startTime: number; // When phase starts in master timeline (ms)
  endTime: number; // When phase ends in master timeline (ms)
}

export interface AnimationContext {
  colors: string[]; // Relationship-adapted color palette
  intensity: "low" | "medium" | "high"; // Particle intensity
  duration: number; // Scaled duration (ms)
  tone: "professional" | "traditional" | "vibrant" | "romantic";
}
