# Performance Budgets

**Last Updated**: October 18, 2025
**Version**: 1.0.0
**Status**: Production

---

## Overview

This document defines performance budgets for the Wysh festival greeting animation system. All festival templates MUST meet these targets on mid-range Android devices to ensure a smooth user experience on 3G networks and budget smartphones.

**Target Devices**:
- Samsung Galaxy A52 (Snapdragon 720G, 6GB RAM, 2021)
- Motorola Moto G Power (Snapdragon 662, 4GB RAM, 2021)
- Google Pixel 4a (Snapdragon 730G, 6GB RAM, 2020)

**Test Network**: 3G throttle (DevTools: Fast 3G, 1.6 Mbps down, 750 Kbps up, 150ms RTT)

---

## Hard Performance Limits

### Runtime Performance

| Metric | Target | Acceptable | Maximum | Action |
|--------|--------|------------|---------|--------|
| **Frame Rate (FPS)** | 60fps | 55fps | 45fps | Degrade quality below 45fps |
| **Particle Count** | 300 particles | 400 particles | 500 particles | Hard limit enforced by ParticleSystem |
| **Animation Duration** | 8-10s | 10-12s | 12s | Maximum duration for user engagement |
| **Memory Usage** | <150MB | <200MB | <250MB | Memory leak detection required |

### Load Performance

| Metric | Target | Acceptable | Maximum | Action |
|--------|--------|------------|---------|--------|
| **First Contentful Paint** | <1.2s | <1.8s | <2.5s | Optimize critical path |
| **Time to Interactive** | <2.5s | <3.5s | <4.5s | Code splitting, lazy loading |
| **Largest Contentful Paint** | <2.0s | <2.5s | <3.5s | Image optimization |
| **Total Blocking Time** | <150ms | <300ms | <500ms | Reduce JS execution time |
| **Cumulative Layout Shift** | <0.05 | <0.10 | <0.25 | Reserve space for dynamic content |

### Asset Budgets

| Asset Type | Target | Maximum | Enforcement |
|------------|--------|---------|-------------|
| **Template Code** | <150KB | 500KB | Bundle analyzer |
| **Template Assets** | <200KB | 500KB | Image compression |
| **GSAP Core** | 75KB (gzipped) | 100KB | Already included |
| **GSAP Plugins** | 15KB (gzipped) | 30KB | Lazy load DrawSVG |
| **Total Page Weight** | <1.5MB | <2MB | Lighthouse audit |

### Particle System Budgets

| Parameter | Target | Maximum | Degraded (Mobile) |
|-----------|--------|---------|-------------------|
| **Active Particles** | 300 | 500 | 150 |
| **Burst Count** | 100 particles/burst | 200 particles/burst | 50 particles/burst |
| **Canvas Size** | 1920×1080 | 2560×1440 | 1280×720 |
| **Render Calls/Frame** | 1 call | 1 call | 1 call (batched) |
| **Context State Changes** | <10/frame | <20/frame | <5/frame |

---

## Performance Monitoring

### Automatic Quality Degradation

The `PerformanceMonitor` class automatically degrades animation quality when FPS drops below threshold:

```typescript
import { PerformanceMonitor } from "@/lib/animations/performance-monitor";

const monitor = new PerformanceMonitor((quality) => {
  // quality = 1.0 (full), 0.7 (reduced 30%), 0.5 (reduced 50%)

  if (quality < 0.7) {
    // Reduce particle count by 30%
    setParticleCount(Math.floor(baseCount * 0.7));
  }

  if (quality < 0.5) {
    // Reduce particle count by 50%, simplify effects
    setParticleCount(Math.floor(baseCount * 0.5));
    disableComplexEffects();
  }
});
```

### FPS Monitoring

```typescript
import { startFPSMonitor, logPerformanceMetrics } from "@/lib/performance";

// Start monitoring
const fpsMonitor = startFPSMonitor();

// In animation loop
function animate() {
  fpsMonitor.trackFrame();

  const currentFPS = fpsMonitor.getCurrentFPS();
  if (currentFPS < 45) {
    console.warn("FPS below threshold:", currentFPS);
  }

  requestAnimationFrame(animate);
}

// On animation complete
const metrics = fpsMonitor.stop();
logPerformanceMetrics("TemplateName", metrics);
// Logs: avgFPS, minFPS, maxFPS, duration
```

### Memory Leak Detection

```typescript
useEffect(() => {
  const particleSystem = new ParticleSystem(config);

  return () => {
    // REQUIRED: Clean up to prevent memory leaks
    particleSystem.stop();     // Stop render loop
    particleSystem.destroy();  // Release resources
  };
}, []);
```

---

## Budget Enforcement

### Pre-Commit Checks

```bash
# Build production bundle
bun run build

# Check bundle size (must be <500KB per template)
du -sh .next/static/chunks/*

# Run Lighthouse audit
lighthouse http://localhost:3001/g/[test-id] --view

# Verify metrics:
# - Performance Score: ≥90
# - FCP: <1.8s
# - TTI: <3.5s
# - TBT: <300ms
```

### CI/CD Pipeline

Automated checks on every PR:

```yaml
# .github/workflows/performance.yml
- name: Bundle Size Check
  run: |
    bun run build
    node scripts/check-bundle-size.js
    # Fails if any chunk exceeds 500KB

- name: Lighthouse Audit
  run: |
    bun run start &
    npx lighthouse http://localhost:3001/g/test --output json
    node scripts/check-lighthouse-scores.js
    # Fails if Performance Score < 90
```

### Manual Device Testing

**REQUIRED** before merging any animation changes:

```bash
# Connect mid-range Android device via USB

# Start dev server
bun run dev

# Get local IP
ipconfig getifaddr en0  # macOS

# On device:
# 1. Open Chrome
# 2. Navigate to http://<LOCAL_IP>:3001/g/[test-id]
# 3. Record Performance trace (chrome://inspect)
# 4. Verify FPS ≥45 during animation
# 5. Check particle count ≤500
# 6. Monitor memory usage (<250MB)
```

---

## Optimization Strategies

### 1. GPU Acceleration

**Always enable** for transform animations:

```typescript
gsap.set(".element", {
  force3D: true,              // Enable GPU acceleration
  transformOrigin: "center",
  will-change: "transform",   // Browser hint
});

// Use transform properties (GPU)
gsap.to(".element", {
  x: 100,        // translateX() - GPU ✅
  y: 100,        // translateY() - GPU ✅
  rotation: 45,  // rotate() - GPU ✅
  scale: 1.5,    // scale() - GPU ✅
});

// Avoid layout properties (CPU)
gsap.to(".element", {
  left: 100,     // CPU ❌
  top: 100,      // CPU ❌
  width: 200,    // CPU ❌
  height: 200,   // CPU ❌
});
```

### 2. Particle Pool Reuse

**Never** create particles dynamically:

```typescript
// ❌ BAD: Creates new objects (GC pressure)
function emitParticle() {
  const particle = new Particle();
  particles.push(particle);
}

// ✅ GOOD: Reuse from pool
class ParticleSystem {
  private particlePool: Particle[] = [];

  constructor(maxParticles: number) {
    // Pre-allocate pool
    for (let i = 0; i < maxParticles; i++) {
      this.particlePool.push(new Particle());
    }
  }

  emitParticle() {
    // Reuse inactive particle
    const particle = this.particlePool.find(p => !p.active);
    if (particle) {
      particle.init();
    }
  }
}
```

### 3. Canvas Rendering Optimization

Batch similar operations:

```typescript
function render(ctx: CanvasRenderingContext2D) {
  ctx.save();

  // Batch by blend mode
  ctx.globalCompositeOperation = "screen";
  particles.filter(p => p.glowing).forEach(p => {
    drawParticle(ctx, p);
  });

  // Batch by opacity
  ctx.globalAlpha = 0.8;
  particles.filter(p => !p.glowing).forEach(p => {
    drawParticle(ctx, p);
  });

  ctx.restore();
}
```

### 4. Lazy Loading

Load heavy components only when needed:

```typescript
import dynamic from "next/dynamic";

// Lazy load particle system (saves ~50KB)
const FireworkSystem = dynamic(
  () => import("./animations/FireworkSystem"),
  { ssr: false }
);

// Only render when animation phase starts
{animationPhase === "fireworks" && <FireworkSystem />}
```

### 5. Image Optimization

```typescript
// Use next/image for automatic optimization
import Image from "next/image";

<Image
  src="/festivals/diwali/rangoli.svg"
  width={200}
  height={200}
  alt="Rangoli pattern"
  priority={false}  // Lazy load non-critical images
  quality={85}      // 85% quality (default: 75)
/>
```

### 6. Code Splitting

```typescript
// Split large festival templates
import type { FestivalType } from "@/types";

const getTemplate = async (festival: FestivalType) => {
  switch (festival) {
    case "diwali":
      return (await import("./DiwaliTemplate")).DiwaliTemplate;
    case "newyear":
      return (await import("./NewYearTemplate")).NewYearTemplate;
    // ... etc
  }
};
```

---

## Performance Test Results

See `PERFORMANCE-TEST-RESULTS.md` for detailed benchmarks across devices and templates.

**Summary** (as of October 18, 2025):

| Template | Avg FPS | Particle Count | Load Time (3G) | Bundle Size | Status |
|----------|---------|----------------|----------------|-------------|--------|
| **Diwali** | 58fps | 350 particles | 2.1s | 280KB | ✅ Pass |
| **New Year** | 56fps | 400 particles | 2.3s | 310KB | ✅ Pass |
| **Pongal** | 59fps | 320 particles | 2.0s | 265KB | ✅ Pass |
| **Fireworks** | 55fps | 450 particles | 2.4s | 295KB | ✅ Pass |
| **Christmas** | 57fps | 380 particles | 2.2s | 275KB | ✅ Pass |
| **Holi** | 54fps | 420 particles | 2.5s | 315KB | ✅ Pass |

All templates meet performance budgets on target devices.

---

## Budget Violations

### What Happens When Budgets Are Exceeded

#### Runtime FPS < 45fps
- **Action**: Automatic quality degradation via `PerformanceMonitor`
- **Effect**: Particle count reduced by 30-50%
- **User Impact**: Slightly less dense particle effects, but smooth 45-60fps maintained

#### Template Size > 500KB
- **Action**: PR blocked by CI/CD
- **Resolution**: Code splitting, lazy loading, remove unused imports
- **Timeline**: Must fix before merge

#### Load Time > 3s on 3G
- **Action**: Warning in PR review
- **Resolution**: Optimize images, reduce bundle size, improve code splitting
- **Timeline**: Fix within 1 sprint

#### Particle Count > 500
- **Action**: Hard limit enforced by `ParticleSystem`
- **Effect**: `emitBurst()` caps at 500 particles, excess particles ignored
- **User Impact**: None (limit is already generous)

---

## Monitoring in Production

### Metrics Collection

```typescript
// Log performance metrics to analytics (production)
import { logPerformanceMetrics } from "@/lib/performance";

const metrics = {
  avgFPS: fpsMonitor.getAverageFPS(),
  minFPS: fpsMonitor.getMinFPS(),
  duration: Date.now() - startTime,
  particleCount: particleSystem.getActiveCount(),
};

logPerformanceMetrics("DiwaliTemplate", metrics);
// Sends to analytics: Mixpanel, GA4, or custom endpoint
```

### Alerting Thresholds

| Metric | Warning Threshold | Critical Threshold |
|--------|------------------|-------------------|
| **Avg FPS** | <50fps | <45fps |
| **P95 Load Time** | >2.5s | >3.5s |
| **Error Rate** | >1% | >5% |
| **Memory Usage** | >200MB | >250MB |

---

## FAQ

### Q: Why 45fps minimum instead of 60fps?

**A**: 60fps is the target, but mid-range devices from 2021 may not consistently hit 60fps during peak particle bursts. 45fps is the minimum acceptable for smooth animation perception. Below 45fps, automatic quality degradation kicks in.

### Q: Why 500 particle limit?

**A**: Testing on Samsung Galaxy A52 showed that 500 particles at 60fps is achievable with optimized rendering. Going beyond 500 causes significant FPS drops on target devices.

### Q: Can I exceed budgets for premium devices?

**A**: No. Budgets are designed for **worst-case scenario** (mid-range Android on 3G). The app should work well for all users, not just those with flagship phones.

### Q: How do I test on 3G network?

**A**: Use Chrome DevTools Network throttling:
1. Open DevTools → Network tab
2. Select "Fast 3G" from dropdown
3. Reload page and test
4. Verify load time <3s

### Q: What if my animation is too complex?

**A**: Simplify the animation, reduce particle count, or split into multiple phases with lazy loading. See `DEVELOPER-GUIDE.md` for optimization patterns.

---

## References

- `DEVELOPER-GUIDE.md` - Animation development patterns and best practices
- `PERFORMANCE-TEST-RESULTS.md` - Detailed benchmark data across devices
- `ACCESSIBILITY-SUMMARY.md` - Reduced motion and accessibility requirements
- `spec.md` - Feature specification and performance targets
- `lib/animations/performance-monitor.ts` - Performance monitoring implementation
- `lib/performance.ts` - FPS tracking and metrics logging

---

**Maintainers**: Wysh Development Team
**Last Review**: October 18, 2025
**Next Review**: January 2026 (quarterly)
