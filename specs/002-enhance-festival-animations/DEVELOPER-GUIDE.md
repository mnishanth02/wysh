# Festival Animation Developer Guide

**Purpose**: Comprehensive guide for developers creating new festival animations in the Wysh greeting system.

**Audience**: Frontend developers, animation designers, contributors

**Prerequisites**:
- React 18+
- TypeScript 5+
- GSAP 3.12+
- Next.js 15+ App Router
- Understanding of Canvas API

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Creating a New Festival Animation](#creating-a-new-festival-animation)
3. [ParticleSystem API](#particlesystem-api)
4. [GSAP Timeline Patterns](#gsap-timeline-patterns)
5. [Context Adaptation](#context-adaptation)
6. [Reduced Motion Support](#reduced-motion-support)
7. [Performance Optimization](#performance-optimization)
8. [Testing & Validation](#testing--validation)
9. [Cultural Authenticity Guidelines](#cultural-authenticity-guidelines)

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────┐
│                 Festival Template                    │
│              (e.g., DiwaliTemplate.tsx)             │
│  ┌──────────────────────────────────────────────┐  │
│  │ GSAP Master Timeline (phases coordination)   │  │
│  │  ├─ Phase 1: Intro (0-2s)                   │  │
│  │  ├─ Phase 2: Main Animation (2-6s)          │  │
│  │  ├─ Phase 3: Text Reveal (6-8s)             │  │
│  │  └─ Phase 4: Finale (8-10s)                 │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Animation Components                          │  │
│  │  ├─ DiyaLighting.tsx (custom animations)    │  │
│  │  ├─ FireworkSystem.tsx (ParticleCanvas)     │  │
│  │  ├─ SparkleParticles.tsx (ParticleCanvas)   │  │
│  │  └─ TextReveal.tsx (GSAP text animation)    │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Context Adaptation                            │  │
│  │  ├─ useAnimationContext() hook               │  │
│  │  └─ getRelationshipContext()                 │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌────────────────────────────────┐
        │     Shared Animation System     │
        ├────────────────────────────────┤
        │ ParticleSystem (lib/animations/│
        │   particle-physics.ts)          │
        │ ├─ Particle pool management     │
        │ ├─ Physics simulation           │
        │ ├─ Canvas rendering              │
        │ └─ Performance monitoring        │
        ├────────────────────────────────┤
        │ ContextAdapter                  │
        │ ├─ Relationship-aware colors    │
        │ ├─ Intensity scaling             │
        │ └─ Duration adjustments          │
        ├────────────────────────────────┤
        │ Performance System               │
        │ ├─ FPS monitoring                │
        │ ├─ Quality degradation           │
        │ └─ Device capability detection   │
        └────────────────────────────────┘
```

### Directory Structure

```
components/greetings/
├── DiwaliTemplate.tsx          # Main festival template
├── NewYearTemplate.tsx
├── PongalTemplate.tsx
├── FireworksTemplate.tsx
├── ChristmasTemplate.tsx
├── HoliTemplate.tsx
├── GenericTemplate.tsx
├── GreetingRenderer.tsx        # Template router
└── animations/
    ├── diwali/
    │   ├── DiyaLighting.tsx    # Custom animations
    │   ├── FireworkSystem.tsx
    │   ├── RangoliDraw.tsx
    │   └── SparkleParticles.tsx
    ├── newyear/
    │   ├── CountdownTimer.tsx
    │   ├── FireworkBurst.tsx
    │   └── ConfettiSystem.tsx
    ├── pongal/
    │   ├── KolamDrawing.tsx
    │   ├── PongalPot.tsx
    │   ├── SunRise.tsx
    │   └── SteamParticles.tsx
    └── shared/
        ├── ParticleCanvas.tsx  # Reusable particle wrapper
        ├── ContextAdapter.tsx  # Context integration
        └── TextReveal.tsx      # Text animation component

lib/animations/
├── particle-physics.ts         # ParticleSystem class
├── timeline-factory.ts         # GSAP timeline creation
├── festival-themes.ts          # Color palettes & themes
├── animation-context.ts        # Context adapter
├── performance-monitor.ts      # FPS & quality monitoring
├── gsap-config.ts             # GSAP plugin registration
└── lazy-loader.tsx            # Code splitting utilities
```

---

## Creating a New Festival Animation

### Step 1: Define Festival Configuration

Add your festival to `lib/constants.ts`:

```typescript
// lib/constants.ts
export const FESTIVALS = {
  // ... existing festivals
  hanukkah: {
    festivalId: "hanukkah" as FestivalType,
    displayName: "Hanukkah",
    category: "religious" as const,
    colorPalette: ["#0047AB", "#FFFFFF", "#FFD700", "#4169E1"], // Blue, White, Gold
    symbols: ["menorah", "dreidel", "star"],
    animationStyle: "sequential" as const,
    description: "Festival of Lights",
  },
};

// types/index.ts
export type FestivalType =
  | "diwali"
  | "newyear"
  | "pongal"
  | "fireworks"
  | "hanukkah"  // Add new festival
  | "christmas"
  | "holi"
  | "generic";
```

### Step 2: Add Festival Theme Colors

Add culturally authentic colors to `lib/animations/festival-themes.ts`:

```typescript
/**
 * Hanukkah Color Palette
 * Cultural symbolism:
 * - Blue #0047AB: Traditional Hanukkah blue - represents divinity
 * - White #FFFFFF: Purity and light
 * - Gold #FFD700: Menorah - nine-branched candelabrum
 * - Royal Blue #4169E1: Celebration and joy
 */
export const HANUKKAH_COLORS = [
  "#0047AB",
  "#FFFFFF",
  "#FFD700",
  "#4169E1",
] as const;

// Add to getFestivalColors function
export function getFestivalColors(festival: FestivalType): readonly string[] {
  switch (festival) {
    // ... existing cases
    case "hanukkah":
      return HANUKKAH_COLORS;
    default:
      return FIREWORKS_COLORS;
  }
}
```

### Step 3: Create Template Component

Create `components/greetings/HanukkahTemplate.tsx`:

```typescript
"use client";

/**
 * Hanukkah Template Component
 * Animated greeting template for Hanukkah festival
 * Features: Menorah lighting, dreidel spin, Star of David pattern
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
import { useAnimationContext } from "./animations/shared/ContextAdapter";
import { MenorahLighting } from "./animations/hanukkah/MenorahLighting";
import { DreidelSpin } from "./animations/hanukkah/DreidelSpin";
import { TextReveal } from "./animations/shared/TextReveal";

interface HanukkahTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
}

export function HanukkahTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
}: HanukkahTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    "intro" | "main" | "text" | "finale" | "complete"
  >("intro");

  const festivalData = FESTIVALS.hanukkah;
  const colors = festivalData.colorPalette;

  // Get relationship-aware animation configuration
  const animationConfig = useAnimationContext(
    "hanukkah",
    relationshipContext.relationshipType,
  );

  // Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    // Start FPS monitoring for performance profiling
    const fpsMonitor =
      process.env.NODE_ENV === "development" ? startFPSMonitor() : null;

    const ctx = gsap.context(() => {
      // Create master GSAP timeline with phases
      const tl = gsap.timeline({
        onComplete: () => {
          // Log performance metrics after animation completes
          if (fpsMonitor) {
            const metrics = fpsMonitor.stop();
            logPerformanceMetrics("HanukkahTemplate", metrics);
          }
          setAnimationPhase("complete");
          onAnimationComplete?.();
        },
      });

      // Prefers-reduced-motion: simple fade-in
      if (useReducedMotion) {
        tl.set([".hanukkah-bg", ".hanukkah-content"], {
          opacity: 1,
        });
        setAnimationPhase("complete");
        tl.play();
        return;
      }

      // GPU acceleration hints
      gsap.set(".hanukkah-content", {
        force3D: true,
        transformOrigin: "center center",
      });

      // Phase 1 (0-2s): Background fade + menorah lighting
      tl.to(".hanukkah-bg", {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        onStart: () => setAnimationPhase("intro"),
      });

      // Phase 2 (2-6s): Dreidel spin + sparkles
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
    "Wishing you a joyous Hanukkah filled with light, love, and miracles!";

  return (
    <div
      ref={containerRef}
      className="hanukkah-bg relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${animationConfig.colors[0] || colors[0]}, ${animationConfig.colors[3] || colors[3]})`,
        opacity: useReducedMotion ? 1 : 0,
      }}
    >
      {/* Reduced motion variant - simple fade */}
      {useReducedMotion ? (
        <div className="hanukkah-content absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center space-y-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{ color: animationConfig.colors[2] || colors[2] }}
            >
              Happy Hanukkah!
            </h1>
            <p
              className="text-3xl md:text-4xl font-semibold"
              style={{ color: animationConfig.colors[1] || colors[1] }}
            >
              Dear {recipientName},
            </p>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: animationConfig.colors[1] || colors[1] }}
            >
              {message || defaultMessage}
            </p>
            <p
              className="text-xl md:text-2xl font-medium mt-8"
              style={{ color: animationConfig.colors[1] || colors[1] }}
            >
              With warm wishes,
              <br />
              {senderName}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Menorah Lighting Animation */}
          {(animationPhase === "intro" || animationPhase === "main") && (
            <MenorahLighting
              colors={animationConfig.colors}
              phase={animationPhase}
            />
          )}

          {/* Dreidel Spin Animation */}
          {animationPhase === "main" && (
            <DreidelSpin colors={animationConfig.colors} />
          )}

          {/* Text Reveal */}
          {(animationPhase === "text" ||
            animationPhase === "finale" ||
            animationPhase === "complete") && (
            <TextReveal
              recipientName={recipientName}
              senderName={senderName}
              message={message || defaultMessage}
              colors={animationConfig.colors}
              greeting="Happy Hanukkah!"
            />
          )}
        </>
      )}
    </div>
  );
}
```

### Step 4: Create Animation Components

Create specific animation components for your festival. Example: `components/greetings/animations/hanukkah/MenorahLighting.tsx`:

```typescript
"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

interface MenorahLightingProps {
  colors: readonly string[];
  phase: "intro" | "main";
}

export function MenorahLighting({ colors, phase }: MenorahLightingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || phase !== "intro") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Menorah candles (9 candles)
    const candles = Array.from({ length: 9 }, (_, i) => ({
      x: canvas.width / 2 + (i - 4) * 60,
      y: canvas.height / 2,
      lit: false,
      brightness: 0,
    }));

    // Animate candles lighting sequentially
    const tl = gsap.timeline();

    candles.forEach((candle, i) => {
      tl.to(
        candle,
        {
          brightness: 1,
          duration: 0.3,
          ease: "power2.out",
          onStart: () => {
            candle.lit = true;
          },
        },
        i * 0.2, // Stagger lighting
      );
    });

    // Render loop
    function render() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      candles.forEach((candle) => {
        if (candle.lit) {
          // Draw candle flame
          const gradient = ctx.createRadialGradient(
            candle.x,
            candle.y,
            0,
            candle.x,
            candle.y,
            30,
          );
          gradient.addColorStop(0, `rgba(255, 215, 0, ${candle.brightness})`);
          gradient.addColorStop(
            1,
            `rgba(255, 165, 0, ${candle.brightness * 0.3})`,
          );

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(candle.x, candle.y, 30, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(render);
    }

    render();
  }, [phase, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
```

### Step 5: Register Template in GreetingRenderer

Add routing to `components/greetings/GreetingRenderer.tsx`:

```typescript
import { HanukkahTemplate } from "./HanukkahTemplate";

// ... in switch statement
case "hanukkah":
  return <HanukkahTemplate {...templateProps} />;
```

### Step 6: Add Context Engine Messages

Update `lib/context-engine.ts` with festival-specific messages:

```typescript
const messageTemplates = {
  formal: {
    // ... existing festivals
    hanukkah: "May this Festival of Lights bring you eight nights of joy, peace, and blessings. Wishing you a meaningful Hanukkah.",
  },
  professional: {
    hanukkah: "Wishing you a bright and joyous Hanukkah celebration.",
  },
  casual: {
    hanukkah: "Happy Hanukkah! Hope your eight nights are filled with latkes, dreidels, and tons of fun! 🕎✨",
  },
  intimate: {
    hanukkah: "You light up my life like the menorah lights up the night. Happy Hanukkah, my love! 💙✨",
  },
};

const closingMap = {
  formal: {
    hanukkah: "May your celebration be bright",
  },
  professional: {
    hanukkah: "Wishing you a joyous holiday",
  },
  casual: {
    hanukkah: "Happy Hanukkah! 🕎",
  },
  intimate: {
    hanukkah: "You're my miracle",
  },
};
```

### Step 7: Add Template Selector Variants

Update `components/forms/TemplateSelector.tsx`:

```typescript
const TEMPLATE_CONFIGS: Record<FestivalType, TemplateConfig[]> = {
  // ... existing configs
  hanukkah: [
    {
      id: "hanukkah-template-1",
      name: "Menorah Glow",
      description: "Classic menorah lighting animation",
    },
    {
      id: "hanukkah-template-2",
      name: "Dreidel Dance",
      description: "Spinning dreidel celebration",
    },
    {
      id: "hanukkah-template-3",
      name: "Festival of Lights",
      description: "Sparkling candle lights",
    },
  ],
};
```

---

## ParticleSystem API

### Basic Usage

```typescript
import { ParticleCanvas } from "@/components/greetings/animations/shared/ParticleCanvas";
import type { ParticleCanvasRef } from "@/types/particle.types";

function MyAnimation() {
  const particleRef = useRef<ParticleCanvasRef>(null);

  const handleClick = () => {
    // Emit a burst of particles
    particleRef.current?.getSystem()?.emitBurst(
      window.innerWidth / 2,  // x position
      window.innerHeight / 2, // y position
      {
        count: 100,           // Number of particles
        angle: undefined,     // undefined = 360° radial
        speed: { min: 100, max: 200 },
        size: { min: 2, max: 5 },
        life: 2000,           // Lifespan in ms
        colors: ["#FF6B35", "#FFD700"],
      }
    );
  };

  return (
    <>
      <ParticleCanvas
        ref={particleRef}
        config={{
          maxParticles: 300,
          colors: ["#FF6B35", "#FFD700"],
          particleSize: 3,
          lifespan: 2000,
          gravity: 120,        // Downward acceleration
          friction: 0.97,      // Air resistance
          velocityVariation: 0.2,
          opacity: 1,
          blendMode: "screen", // Additive blending
        }}
      />
      <button onClick={handleClick}>Emit Particles</button>
    </>
  );
}
```

### Configuration Options

```typescript
interface ParticleSystemConfig {
  maxParticles: number;        // Max particles (pool size)
  colors: string[];            // Particle colors
  particleSize: number;        // Base particle size (px)
  lifespan: number;           // Default lifespan (ms)
  gravity?: number;           // Downward gravity (px/s²)
  friction?: number;          // Air resistance (0-1)
  velocityVariation?: number; // Random velocity variance (0-1)
  opacity?: number;           // Base opacity (0-1)
  blendMode?: GlobalCompositeOperation; // Canvas blend mode
}

interface BurstConfig {
  count: number;              // Number of particles
  angle?: number;             // Emission angle (undefined = 360°)
  speed: {                    // Speed range
    min: number;
    max: number;
  };
  size: {                     // Size range
    min: number;
    max: number;
  };
  life: number;               // Lifespan (ms)
  colors: string[];           // Particle colors
}
```

### Performance Optimization

```typescript
// Adaptive particle count based on FPS
const getParticleCount = (fps: number) => {
  if (fps >= 55) return 500;      // High performance
  if (fps >= 45) return 300;      // Medium performance
  return 150;                     // Low performance (degraded)
};

// Use quality degradation
<ParticleCanvas
  config={{
    maxParticles: getParticleCount(currentFPS),
    // ... other config
  }}
/>
```

---

## GSAP Timeline Patterns

### Pattern 1: Sequential Phases

Use timeline labels and call() for phase coordination:

```typescript
const tl = gsap.timeline();

// Phase 1: Intro
tl.to(".background", { opacity: 1, duration: 1 });
tl.addLabel("introComplete"); // Label for synchronization

// Phase 2: Main
tl.call(() => setPhase("main"), [], "introComplete");
tl.to(".element", { x: 100, duration: 2 }, "introComplete");

// Phase 3: Text
tl.addLabel("textStart", "+=1");
tl.from(".text", { y: 50, opacity: 0 }, "textStart");
```

### Pattern 2: Staggered Animations

Stagger creates cascading effects:

```typescript
// Stagger with delay
tl.from(".particle", {
  scale: 0,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1,  // 0.1s between each particle
  ease: "back.out(1.7)",
});

// Stagger from specific position
tl.from(".firework", {
  scale: 0,
  duration: 1,
  stagger: {
    each: 0.2,     // Delay between each
    from: "center", // Start from center outward
    grid: "auto",   // Auto-detect grid layout
  },
});
```

### Pattern 3: Parallel Animations

Use position parameter to overlap:

```typescript
// Start at same time as previous
tl.to(".element-1", { x: 100 }, 0);
tl.to(".element-2", { y: 100 }, 0);

// Start 0.5s before previous ends
tl.to(".element-3", { rotation: 360 }, "-=0.5");

// Start at specific label
tl.to(".element-4", { scale: 2 }, "labelName");
```

### Pattern 4: Looping Animations

Create infinite loops for ambient effects:

```typescript
// Infinite yoyo (back and forth)
tl.to(".sparkle", {
  opacity: 0.3,
  duration: 1,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
});

// Infinite rotation
tl.to(".element", {
  rotation: 360,
  duration: 5,
  repeat: -1,
  ease: "none",
});
```

### Pattern 5: Callbacks and Events

```typescript
tl.to(".element", {
  x: 100,
  duration: 1,
  onStart: () => console.log("Animation started"),
  onUpdate: () => console.log("Animating..."),
  onComplete: () => console.log("Animation complete"),
});

// Timeline-level callbacks
const tl = gsap.timeline({
  onComplete: () => {
    console.log("Full timeline complete");
    onAnimationComplete?.();
  },
});
```

---

## Context Adaptation

### Using ContextAdapter Hook

```typescript
import { useAnimationContext } from "./animations/shared/ContextAdapter";

function MyTemplate({ relationshipContext }: Props) {
  // Get relationship-aware animation configuration
  const animationConfig = useAnimationContext(
    "diwali",
    relationshipContext.relationshipType,
  );

  // Use adapted colors, intensity, duration
  return (
    <div style={{ background: animationConfig.colors[0] }}>
      <ParticleCanvas
        config={{
          maxParticles: animationConfig.intensity === "high" ? 500 : 300,
          colors: animationConfig.colors,
        }}
      />
    </div>
  );
}
```

### Relationship Context Mapping

| Relationship | Color Intensity | Particle Count | Animation Speed |
|--------------|----------------|----------------|-----------------|
| Professional | Muted (-30% saturation) | 70% of base | 0.8x (faster) |
| Family | Traditional (unchanged) | 100% of base | 1.0x (normal) |
| Friends | Vibrant (+20% saturation) | 130% of base | 1.1x (upbeat) |
| Romantic | Pastel (+40% white tint) | 85% of base | 1.2x (slower, elegant) |

### Manual Context Application

```typescript
import { getRelationshipContext } from "@/lib/context-engine";

const relationshipContext = getRelationshipContext("boss");
// Returns: { category: "professional", colorIntensity: "muted", ... }

// Apply to colors
const adjustedColor = relationshipContext.colorIntensity === "muted"
  ? "#CC5628"  // Muted version of #FF6B35
  : "#FF6B35"; // Original vibrant color

// Apply to particle count
const particleCount = relationshipContext.category === "professional"
  ? 210  // 70% of 300
  : 300; // Full count
```

---

## Reduced Motion Support

### Implementation Pattern

**REQUIRED**: All templates MUST support `prefers-reduced-motion` media query.

```typescript
import { shouldUseReducedMotion } from "@/lib/performance";

function MyTemplate(props: Props) {
  const useReducedMotion = shouldUseReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ /* ... */ });

      // Check for reduced motion
      if (useReducedMotion) {
        // Simple fade-in, no complex animations
        tl.set([".bg", ".content", ".text"], {
          opacity: 1,
        });
        tl.call(() => {
          onAnimationComplete?.();
        }, [], 1); // Complete after 1s
        return;
      }

      // Normal animation timeline
      // ... rest of animation
    }, containerRef);

    return () => ctx.revert();
  }, [useReducedMotion]);

  return (
    <div style={{ opacity: useReducedMotion ? 1 : 0 }}>
      {/* Content */}
    </div>
  );
}
```

### Testing Reduced Motion

**macOS**: System Preferences → Accessibility → Display → Reduce motion
**Windows**: Settings → Ease of Access → Display → Show animations
**Chrome DevTools**: Command Palette (Cmd+Shift+P) → "Emulate CSS prefers-reduced-motion"

---

## Performance Optimization

### Performance Budgets

**MUST meet these targets on mid-range Android devices (Snapdragon 600+ from 2021):**

| Metric | Target | Maximum |
|--------|--------|---------|
| FPS | 60fps | 45fps (degraded quality) |
| Particle Count | 300 particles | 500 particles (max) |
| Template Size | 200KB | 500KB (code + assets) |
| Animation Duration | 8-10s | 12s (max) |
| Load Time (3G) | <2s | <3s |

### Optimization Techniques

#### 1. GPU Acceleration

Enable hardware acceleration for transforms:

```typescript
gsap.set(".element", {
  force3D: true,           // Enable GPU acceleration
  transformOrigin: "center center",
  will-change: "transform", // Browser hint
});

// Prefer transform over top/left
gsap.to(".element", {
  x: 100,            // transform: translateX() - GPU accelerated
  y: 100,            // transform: translateY() - GPU accelerated
  // NOT: left, top    // Layout properties - CPU only
});
```

#### 2. Particle Pool Management

Reuse particles instead of creating new objects:

```typescript
class ParticleSystem {
  private particlePool: Particle[] = [];

  constructor() {
    // Pre-allocate particle pool
    for (let i = 0; i < maxParticles; i++) {
      this.particlePool.push(new Particle());
    }
  }

  emitBurst() {
    // Reuse inactive particles from pool
    const particle = this.particlePool.find(p => !p.active);
    if (particle) {
      particle.init(/* ... */);
    }
  }
}
```

#### 3. Canvas Optimization

Minimize context state changes:

```typescript
function render() {
  ctx.save(); // Save state once

  // Batch similar operations
  ctx.globalAlpha = 0.8;
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  ctx.restore(); // Restore state once
}
```

#### 4. Quality Degradation

Automatically reduce quality on low FPS:

```typescript
import { PerformanceMonitor } from "@/lib/animations/performance-monitor";

const monitor = new PerformanceMonitor((quality) => {
  // quality: 1.0 = full, 0.7 = reduced 30%, 0.5 = reduced 50%
  setParticleCount(Math.floor(baseCount * quality));
});

// Track FPS in render loop
function render() {
  monitor.trackFrame();
  // ... rendering
  requestAnimationFrame(render);
}
```

#### 5. Lazy Loading

Load heavy animations on demand:

```typescript
import dynamic from "next/dynamic";

const FireworkSystem = dynamic(
  () => import("./animations/diwali/FireworkSystem"),
  { ssr: false } // Don't render on server
);

// Only load when needed
{animationPhase === "main" && <FireworkSystem />}
```

---

## Testing & Validation

### Testing Checklist

Before submitting a new festival animation:

- [ ] **Functionality**
  - [ ] Animation plays smoothly (60fps on development machine)
  - [ ] onAnimationComplete callback fires correctly
  - [ ] All animation phases execute in order
  - [ ] Text appears legibly at correct timing

- [ ] **Accessibility**
  - [ ] Reduced motion fallback implemented
  - [ ] Text contrast meets WCAG AA (4.5:1 minimum)
  - [ ] All interactive elements have ARIA labels
  - [ ] Keyboard navigation works (if applicable)

- [ ] **Performance**
  - [ ] FPS stays above 45 on mid-range device
  - [ ] Particle count within budget (≤500)
  - [ ] Template size ≤500KB
  - [ ] No memory leaks (check DevTools Memory profiler)

- [ ] **Context Adaptation**
  - [ ] Professional relationship uses muted colors
  - [ ] Romantic relationship uses pastel colors
  - [ ] Friends relationship uses vibrant colors
  - [ ] Particle intensity scales correctly

- [ ] **Browser Compatibility**
  - [ ] Works on Chrome 90+
  - [ ] Works on Firefox 88+
  - [ ] Works on Safari 15+
  - [ ] Works on Edge 90+

- [ ] **Cultural Authenticity**
  - [ ] Colors are culturally appropriate
  - [ ] Symbols are accurate and respectful
  - [ ] Cultural expert has reviewed (if applicable)

### Performance Testing

```bash
# Build production bundle
bun run build

# Check bundle size
du -sh .next/static/chunks/*

# Run Lighthouse audit
lighthouse http://localhost:3000/g/[test-id] --view

# Check specific metrics
# - First Contentful Paint: <1.8s
# - Time to Interactive: <3.5s
# - Total Blocking Time: <300ms
```

### Device Testing

**Required**: Test on real mid-range Android device:
- Samsung Galaxy A52 (Snapdragon 720G)
- Motorola Moto G Power (Snapdragon 662)
- Google Pixel 4a (Snapdragon 730G)

```bash
# Enable USB debugging on device
# Connect device via USB

# Open Chrome DevTools
chrome://inspect

# Record performance trace
# DevTools → Performance tab → Record → Load greeting → Stop
# Check FPS stays above 45fps during animation
```

---

## Cultural Authenticity Guidelines

### Research Requirements

Before implementing a festival animation:

1. **Cultural Background**
   - Research festival history and significance
   - Understand regional variations
   - Document cultural sources in code comments

2. **Color Symbolism**
   - Verify color meanings with cultural experts
   - Document color significance in JSDoc
   - Get approval from community representatives

3. **Symbols and Icons**
   - Use authentic cultural symbols (not stereotypes)
   - Verify symbol meanings and contexts
   - Avoid cultural appropriation or misrepresentation

### Cultural Review Process (T141)

**REQUIRED** for all festival animations targeting specific cultural/religious groups:

1. **Step 1**: Submit animation for cultural review
   - Document color choices and symbolism
   - Explain animation concepts and meanings
   - List cultural sources and references

2. **Step 2**: Cultural expert review
   - Tamil speaker for Pongal animations
   - Hindu cultural expert for Diwali
   - Relevant expert for each festival

3. **Step 3**: Address feedback
   - Implement requested changes
   - Re-submit for approval
   - Document final approval in CULTURAL-REVIEW.md

4. **Step 4**: Production approval
   - Only deploy after review gate passes
   - Mark review status in tasks.md
   - Include expert feedback in documentation

### Example: Diwali Color Research

```typescript
/**
 * Diwali Color Palette
 *
 * Cultural Research Sources:
 * - "The Symbolism of Colors in Hinduism" by Dr. Ananda Coomaraswamy
 * - Hindu American Foundation cultural guidelines
 * - Feedback from Indian American community (2025)
 *
 * Color Meanings:
 * - Orange #FF6B35: Saffron - Represents fire, purity, spirituality
 *   Used in Hindu religious ceremonies and sacred rituals
 *
 * - Gold #FFA500: Prosperity - Symbol of wealth, success, good fortune
 *   Associated with Goddess Lakshmi (prosperity deity)
 *
 * - Red #DC143C: Auspiciousness - Most sacred color in Hinduism
 *   Used in all celebrations, represents divine feminine energy
 *
 * - White #FFFFFF: Purity - Represents divine light and cleanliness
 *   Associated with spiritual enlightenment
 *
 * Cultural Approval:
 * - Reviewed by Hindu American Foundation (October 2025)
 * - Approved by Tamil cultural expert (October 2025)
 */
export const DIWALI_COLORS = [
  "#FF6B35", // Saffron orange
  "#FFA500", // Gold
  "#DC143C", // Red
  "#FFFFFF", // White
] as const;
```

---

## Common Pitfalls & Troubleshooting

### Issue: Animation stutters on mobile

**Solution**: Reduce particle count and enable quality degradation

```typescript
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 150 : 300;

<ParticleCanvas
  config={{
    maxParticles: particleCount,
    // Enable automatic quality reduction
  }}
/>
```

### Issue: Timeline doesn't complete

**Solution**: Ensure all callbacks and timelines finish

```typescript
const tl = gsap.timeline({
  onComplete: () => {
    console.log("Timeline complete"); // Debug log
    onAnimationComplete?.(); // Ensure callback fires
  },
});

// Check timeline duration
console.log("Timeline duration:", tl.duration());
```

### Issue: Reduced motion not working

**Solution**: Add dependency to useEffect

```typescript
useEffect(() => {
  // ... animation code
}, [useReducedMotion]); // ← Must include this dependency
```

### Issue: Memory leak in particle system

**Solution**: Clean up animation frame and particle system

```typescript
useEffect(() => {
  const particleSystem = new ParticleSystem(/* ... */);

  return () => {
    particleSystem.stop();     // Stop render loop
    particleSystem.destroy();  // Clean up resources
  };
}, []);
```

---

## Resources & References

### Documentation
- **GSAP Docs**: https://greensock.com/docs/
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **React Hooks**: https://react.dev/reference/react
- **Next.js App Router**: https://nextjs.org/docs/app

### Project Docs
- `specs/002-enhance-festival-animations/spec.md` - Feature specification
- `specs/002-enhance-festival-animations/plan.md` - Implementation plan
- `specs/002-enhance-festival-animations/tasks.md` - Task tracking
- `specs/002-enhance-festival-animations/ACCESSIBILITY-SUMMARY.md` - Accessibility guide
- `specs/002-enhance-festival-animations/PERFORMANCE-TEST-RESULTS.md` - Performance data

### Example Templates
- `components/greetings/DiwaliTemplate.tsx` - Complex multi-phase animation
- `components/greetings/FireworksTemplate.tsx` - Reusable configurable template
- `components/greetings/PongalTemplate.tsx` - Cultural authenticity example

---

## Contributing

When contributing a new festival animation:

1. Follow this guide's patterns and conventions
2. Include comprehensive JSDoc comments
3. Test on real devices (not just emulators)
4. Get cultural review approval (if applicable)
5. Submit PR with performance metrics
6. Update this guide with new patterns (if applicable)

---

**Last Updated**: October 18, 2025
**Version**: 1.0.0
**Maintainers**: Wysh Development Team
