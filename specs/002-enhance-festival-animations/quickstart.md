# Phase 1 Quickstart: Enhanced Festival Greeting Animations

**Date**: 2025-10-17 | **Branch**: `002-enhance-festival-animations` | **Status**: Phase 1 Complete

---

## Overview

This guide helps developers implement and integrate the enhanced festival greeting animations into Wysh. All required dependencies are already installed. This guide covers:

1. Environment setup and verification
2. GSAP configuration with plugins
3. Creating animation components
4. Testing performance on mobile devices
5. Accessibility compliance checks

---

## 1. Environment Setup

### Prerequisites

Verify your environment has all required tools:

```bash
# Check Node.js version (need 18+)
node --version

# Check bun is installed
bun --version

# Verify working directory
pwd  # Should be /Users/nishanth/youtube-pre/wisher
ls package.json  # Should exist
```

### Install Dependencies

All animation dependencies are already installed:

```bash
# Verify GSAP
bun list gsap         # Should show gsap@^3.13.0
bun list @gsap/react  # Should show @gsap/react@2.1.2

# Verify other tools
bun list react        # Should show react@18+
bun list next         # Should show next@15+
```

### Project Structure

New animation code follows this structure:

```text
components/greetings/
├── animations/               # NEW: Animation subcomponents
│   ├── diwali/
│   │   ├── FireworkSystem.tsx
│   │   ├── DiyaLighting.tsx
│   │   ├── SparkleParticles.tsx
│   │   └── RangoliDraw.tsx
│   ├── newyear/
│   ├── pongal/
│   └── shared/
│       ├── ParticleCanvas.tsx
│       ├── TextReveal.tsx
│       └── ContextAdapter.tsx

lib/animations/              # NEW: Animation utilities
├── gsap-config.ts          # GSAP initialization & plugins
├── particle-physics.ts     # ParticleSystem class
├── timeline-factory.ts     # Animation timeline creation
└── performance-monitor.ts  # FPS tracking

types/
├── animation.types.ts      # NEW: Animation types
└── particle.types.ts       # NEW: Particle types
```

---

## 2. GSAP Configuration

### Setup GSAP & Plugins

Create `lib/animations/gsap-config.ts`:

```typescript
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register plugins
try {
  // DrawSVG for Pongal kolam animation
  const DrawSVG = require('@gsap/bonus').DrawSVG;
  gsap.registerPlugin(DrawSVG);
} catch (e) {
  // Fallback if DrawSVG not available
  console.warn('DrawSVG plugin not available, using strokeDasharray fallback');
}

// Default configuration
export const gsapConfig = {
  force3D: true,              // GPU acceleration
  paused: false,              // Auto-play by default
  overwrite: 'auto',
};

// Initialize
export function initializeGSAP() {
  gsap.config({
    nullTargetAction: 'ignore',
    traceVars: false,
  });
}

// Export useGSAP for React integration
export { useGSAP };
```

### Verify Configuration

```bash
# Build and check for errors
bun run build

# Check types compile
bun run tsc --noEmit
```

---

## 3. Creating Animation Components

### Example: DiwaliTemplate Component

```typescript
// components/greetings/animations/diwali/DiwaliTemplate.tsx
import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { AnimationTemplateProps, AnimationTemplateRef } from '@/types/animation.types';
import { ParticleSystem } from '@/lib/animations/particle-physics';
import { createAnimationTimeline } from '@/lib/animations/timeline-factory';
import { getAnimationContext } from '@/lib/animations/context-adapter';
import { useDeviceCapabilities, useFPSMonitor } from '@/lib/performance';

export const DiwaliTemplate = React.forwardRef<AnimationTemplateRef, AnimationTemplateProps>(
  ({
    recipientName,
    senderName,
    message,
    relationshipContext,
    onAnimationComplete,
    autoPlay = true
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const particleSystemRef = useRef<ParticleSystem | null>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Get device capabilities and animation context
    const deviceCaps = useDeviceCapabilities();
    const animationContext = getAnimationContext(relationshipContext.type, 'diwali');

    // Monitor FPS
    useFPSMonitor((fps) => {
      if (fps < 30) {
        console.warn('Low FPS detected, degrading particle quality');
        particleSystemRef.current?.dispose();
        // Recreate with lower maxParticles
      }
    });

    // Initialize animation
    useGSAP(() => {
      if (!containerRef.current) return;

      // Create particle system
      particleSystemRef.current = new ParticleSystem(canvasRef.current!, {
        colors: animationContext.colorPalette,
        particleSize: 4,
        gravity: 200,
        friction: 0.95,
        maxParticles: animationContext.particleIntensity === 'high' ? 500 : 300,
        lifespan: 2000,
        blendMode: 'screen'
      });
      particleSystemRef.current.start();

      // Create timeline
      const elements = {
        text: textRef.current!,
        container: containerRef.current!,
        // Add SVG element refs as needed
      };

      timelineRef.current = createAnimationTimeline('diwali', relationshipContext, elements);
      timelineRef.current.play();

      // Emit particles at specific moments
      const particleEmitTime = 3;  // Start at 3 seconds
      timelineRef.current.add(() => {
        particleSystemRef.current?.emitBurst(
          containerRef.current!.offsetWidth / 2,
          containerRef.current!.offsetHeight / 2,
          animationContext.particleIntensity === 'high' ? 300 : 150,
          { angle: { min: 0, max: 360 }, speed: { min: 100, max: 400 } }
        );
      }, particleEmitTime);

      // On complete
      timelineRef.current.eventCallback('onComplete', () => {
        particleSystemRef.current?.stop();
        onAnimationComplete?.();
      });
    }, { scope: containerRef });

    // Expose ref methods
    React.useImperativeHandle(ref, () => ({
      play: () => timelineRef.current?.play(),
      pause: () => timelineRef.current?.pause(),
      resume: () => timelineRef.current?.resume(),
      replay: () => {
        timelineRef.current?.restart();
        particleSystemRef.current?.reset();
      },
      stop: () => {
        timelineRef.current?.kill();
        particleSystemRef.current?.stop();
      },
      seek: (time) => timelineRef.current?.seek(time),
      getState: () => ({
        isPlaying: !timelineRef.current?.paused(),
        isPaused: timelineRef.current?.paused() ?? false,
        progress: timelineRef.current?.progress() ?? 0,
        currentTime: (timelineRef.current?.time() ?? 0) * 1000,
        totalTime: (timelineRef.current?.duration() ?? 0) * 1000
      })
    }), []);

    return (
      <div ref={containerRef} className="relative w-full h-screen bg-gradient-to-b from-orange-900 to-yellow-100">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          width={containerRef.current?.offsetWidth}
          height={containerRef.current?.offsetHeight}
        />
        <div ref={textRef} className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{message}</h1>
            <p className="text-xl">Dear {recipientName}, from {senderName}</p>
          </div>
        </div>
      </div>
    );
  }
);

DiwaliTemplate.displayName = 'DiwaliTemplate';
```

### Integration with GreetingRenderer

```typescript
// components/greetings/GreetingRenderer.tsx
import { DiwaliTemplate } from '@/components/greetings/animations/diwali/DiwaliTemplate';
import { NewYearTemplate } from '@/components/greetings/animations/newyear/NewYearTemplate';
import { PongalTemplate } from '@/components/greetings/animations/pongal/PongalTemplate';

export function GreetingRenderer({ festival, ...props }: GreetingRendererProps) {
  const templateRef = useRef(null);

  const handleComplete = () => {
    // Show replay/share buttons
    console.log('Animation complete');
  };

  switch (festival) {
    case 'diwali':
      return (
        <DiwaliTemplate
          ref={templateRef}
          {...props}
          onAnimationComplete={handleComplete}
        />
      );
    case 'newyear':
      return <NewYearTemplate ref={templateRef} {...props} onAnimationComplete={handleComplete} />;
    case 'pongal':
      return <PongalTemplate ref={templateRef} {...props} onAnimationComplete={handleComplete} />;
    default:
      return <GenericTemplate ref={templateRef} {...props} />;
  }
}
```

---

## 4. Performance Testing on Mobile

### Setup Chrome DevTools Remote Debugging

On your Mac terminal:

```bash
# Connect Android device via USB
# Enable USB debugging on device: Settings > Developer options > USB debugging

# Forward port for debugging
adb forward tcp:9222 localabstract:chrome_devtools_remote

# Open Chrome DevTools
open "chrome://inspect"

# You should see your device connected
```

### Performance Testing Workflow

1. **Record Performance Timeline**:
   - Open DevTools Performance tab
   - Click "Record" (or Ctrl+Shift+E)
   - Interact with animation for 10-15 seconds
   - Click "Stop"

2. **Analyze Results**:
   - Look for "FPS" counter in the timeline
   - Check for dropped frames (red bars = dropped)
   - Target: 60fps consistently, ≥80% frames ≤16.67ms
   - Acceptable: Some frames 20-33ms (visible but not stuttering)

3. **Network Testing**:
   - Set network throttling to "Slow 4G"
   - Measure page load time (<2s target)
   - Check bundle size (<2MB target)

### FPS Monitoring Function

```typescript
// lib/performance.ts
export function useFPSMonitor(callback: (fps: number) => void) {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    function measureFPS() {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const fps = frameCount;
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    }

    const id = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(id);
  }, [callback]);
}
```

---

## 5. Accessibility Testing

### Check prefers-reduced-motion

```typescript
// Detect user's motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Adapt animation
if (prefersReducedMotion) {
  // Disable particle systems, reduce motion, extend duration
  timeline.duration = 5000;  // Extend to 5s minimum
}
```

### Color Contrast Validation

Test using WCAG AA standards:

```typescript
// Validate color contrast
import { validateColorContrast } from '@/lib/animations/gsap-config';

const result = validateColorContrast('#FF9933', '#000000');
// Returns: { ratio: 8.6, meetsWCAG_AA: true }

if (!result.meetsWCAG_AA) {
  console.warn(`Color contrast ratio ${result.ratio}:1 does not meet WCAG AA (need 4.5:1)`);
}
```

### Manual Accessibility Audit

Checklist for each animation:

- [ ] Text is readable (minimum 18px, WCAG AA contrast)
- [ ] All controls keyboard-navigable (Tab, Enter, Space)
- [ ] No flashing content (>3 flashes/second)
- [ ] Screen reader can access all text
- [ ] prefers-reduced-motion is respected
- [ ] Play/pause/replay buttons are accessible

---

## 6. Common Tasks & Workflows

### Adding a New Festival Animation

1. Create component directory:

   ```bash
   mkdir -p components/greetings/animations/myfestival
   ```

2. Create template component (use DiwaliTemplate as template)

3. Create animation components (FireworkSystem.tsx, etc.)

4. Register in GreetingRenderer.tsx switch statement

5. Update lib/constants.ts with festival config

6. Test on mobile device

### Debugging Particle Performance

```typescript
// Add debug FPS display
const debugRef = useRef<HTMLDivElement>(null);

useFPSMonitor((fps) => {
  if (debugRef.current) {
    debugRef.current.textContent = `FPS: ${fps}`;
    debugRef.current.style.color = fps >= 50 ? 'green' : fps >= 30 ? 'yellow' : 'red';
  }
});

// Add to JSX:
<div ref={debugRef} className="absolute top-4 right-4 text-white font-bold" />
```

### Measuring Bundle Size

```bash
# Build and analyze
bun run build

# Check animation component size
ls -lh .next/static/chunks/

# Use next/bundle-analyzer plugin for detailed report
```

---

## 7. Testing Checklist

Before submitting a new animation template:

- [ ] Compiles without errors (`bun run build`)
- [ ] All imports resolve correctly (`bun run tsc --noEmit`)
- [ ] Renders on desktop (Chrome/Firefox/Safari)
- [ ] Renders on mobile (Chrome on Android real device)
- [ ] Animation plays at 60fps on Snapdragon 600+ (real device)
- [ ] Animation < 500KB (code + assets)
- [ ] Duration 8-12 seconds
- [ ] Colors use relationshipContext palette
- [ ] Respects prefers-reduced-motion
- [ ] WCAG AA text contrast verified
- [ ] Play/pause/replay buttons functional
- [ ] onAnimationComplete callback fires at correct time
- [ ] No memory leaks (DevTools heap snapshot comparison)
- [ ] Linting passes (`bun run lint`)

---

## 8. Resources & References

- **GSAP Docs**: [https://greensock.com/docs/](https://greensock.com/docs/)
- **DrawSVG Plugin**: [https://greensock.com/drawsvg/](https://greensock.com/drawsvg/)
- **Canvas API**: [https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- **Web Performance**: [https://web.dev/performance/](https://web.dev/performance/)
- **WCAG AA Accessibility**: [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)
- **Wysh Docs**: `/specs/001-festival-greeting-mvp/spec.md`

---

## Getting Help

If you encounter issues:

1. **Check console errors**: DevTools Console tab
2. **Profile performance**: DevTools Performance tab
3. **Review timeline**: Check GSAP timeline in console (`window._gsap`)
4. **Check mobile device**: Real device testing often reveals issues emulation misses
5. **Verify types**: Run `bun run tsc --noEmit` to catch TypeScript issues
6. **Consult data-model.md**: Reference entity contracts and integration points

---

## Next Steps

Once you've completed this quickstart:

1. Implement the animation components for Week 1 (Infrastructure)
2. Create animation-specific components (Week 2-4: Diwali, New Year, Pongal)
3. Test on real mobile devices throughout
4. Optimize particle rendering if needed
5. Complete accessibility audit before merging

**Status**: Quickstart Complete ✅

Ready to start implementing animations in Phase 2!
