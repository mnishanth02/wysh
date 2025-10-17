/**
 * Performance Monitoring Utilities
 * Tools for testing and optimizing animation performance on mobile devices
 * Tasks: T124-T127 - Animation Performance on Mobile
 */

/**
 * FPS Monitor for Animation Performance Testing
 * Usage: Call startFPSMonitor() before animation, stopFPSMonitor() after
 *
 * @example
 * const monitor = startFPSMonitor();
 * // Run animation
 * const stats = monitor.stop();
 * console.log(`Average FPS: ${stats.averageFPS}`);
 */
export function startFPSMonitor() {
  let frameCount = 0;
  const startTime = performance.now();
  let lastFrameTime = startTime;
  let animationId: number;
  const frameTimes: number[] = [];

  const measureFrame = () => {
    const currentTime = performance.now();
    const frameDuration = currentTime - lastFrameTime;

    frameCount++;
    frameTimes.push(frameDuration);
    lastFrameTime = currentTime;

    animationId = requestAnimationFrame(measureFrame);
  };

  animationId = requestAnimationFrame(measureFrame);

  return {
    stop: () => {
      cancelAnimationFrame(animationId);
      const totalTime = performance.now() - startTime;
      const averageFPS = Math.round((frameCount / totalTime) * 1000);

      // Calculate frame time statistics
      const minFrameTime = Math.min(...frameTimes);
      const maxFrameTime = Math.max(...frameTimes);
      const avgFrameTime =
        frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;

      // Detect jank (frames > 16.67ms = below 60fps)
      const jankFrames = frameTimes.filter((time) => time > 16.67).length;
      const jankPercentage = (jankFrames / frameCount) * 100;

      return {
        totalFrames: frameCount,
        totalTime: Math.round(totalTime),
        averageFPS,
        minFrameTime: Math.round(minFrameTime * 100) / 100,
        maxFrameTime: Math.round(maxFrameTime * 100) / 100,
        avgFrameTime: Math.round(avgFrameTime * 100) / 100,
        jankFrames,
        jankPercentage: Math.round(jankPercentage * 100) / 100,
        isSmooth: averageFPS >= 55, // Allow 5fps margin
        hasJank: jankPercentage > 5, // More than 5% jank is problematic
      };
    },
  };
}

/**
 * Detect device performance capabilities
 * Returns 'high', 'medium', or 'low' based on device benchmarks
 *
 * T127: Progressive enhancement based on device capability
 */
export function detectDevicePerformance(): "high" | "medium" | "low" {
  // Check for reduced motion preference
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "low";
  }

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;

  // Check device memory (if available)
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;

  // Check connection speed
  const connection = (navigator as { connection?: { effectiveType?: string } })
    .connection;
  const effectiveType = connection?.effectiveType || "4g";

  // Composite score
  let score = 0;

  // CPU cores scoring
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 1;

  // Memory scoring
  if (memory >= 8) score += 3;
  else if (memory >= 4) score += 2;
  else score += 1;

  // Network scoring
  if (effectiveType === "4g") score += 2;
  else if (effectiveType === "3g") score += 1;

  // Determine performance tier
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

/**
 * Get recommended animation settings based on device performance
 * T127: Progressive enhancement implementation
 */
export function getAnimationSettings(
  forcePerformance?: "high" | "medium" | "low",
) {
  const performance = forcePerformance || detectDevicePerformance();

  switch (performance) {
    case "high":
      return {
        fps: 60,
        quality: "high" as const,
        enableParticles: true,
        enableShadows: true,
        enableBlur: true,
        particleCount: 50,
        animationDuration: 1,
        ease: "power2.out",
      };

    case "medium":
      return {
        fps: 45,
        quality: "medium" as const,
        enableParticles: true,
        enableShadows: false,
        enableBlur: false,
        particleCount: 25,
        animationDuration: 0.8,
        ease: "power1.out",
      };

    case "low":
      return {
        fps: 30,
        quality: "low" as const,
        enableParticles: false,
        enableShadows: false,
        enableBlur: false,
        particleCount: 0,
        animationDuration: 0.5,
        ease: "linear",
      };
  }
}

/**
 * Log performance metrics to console (Development only)
 * T125: Profile animation FPS in Chrome DevTools
 */
export function logPerformanceMetrics(
  componentName: string,
  metrics: ReturnType<ReturnType<typeof startFPSMonitor>["stop"]>,
) {
  if (process.env.NODE_ENV !== "development") return;

  console.group(`🎭 Animation Performance: ${componentName}`);
  console.log(`⏱️  Total Time: ${metrics.totalTime}ms`);
  console.log(`📊 Average FPS: ${metrics.averageFPS}`);
  console.log(
    `⚡ Frame Times: min=${metrics.minFrameTime}ms, max=${metrics.maxFrameTime}ms, avg=${metrics.avgFrameTime}ms`,
  );
  console.log(
    `⚠️  Jank: ${metrics.jankFrames} frames (${metrics.jankPercentage}%)`,
  );
  console.log(`✅ Smooth: ${metrics.isSmooth ? "Yes" : "No"}`);

  if (metrics.hasJank) {
    console.warn(
      "⚠️  Significant jank detected! Consider optimizing animations.",
    );
  }

  console.groupEnd();
}

/**
 * React Hook for monitoring component animation performance
 *
 * @example
 * const { startMonitoring, stopMonitoring } = useAnimationPerformance('DiwaliTemplate');
 *
 * useEffect(() => {
 *   startMonitoring();
 *   // Animation code
 *   return () => stopMonitoring();
 * }, []);
 */
export function useAnimationPerformance(componentName: string) {
  if (typeof window === "undefined") {
    return {
      startMonitoring: () => {},
      stopMonitoring: () => {},
    };
  }

  let monitor: ReturnType<typeof startFPSMonitor> | null = null;

  return {
    startMonitoring: () => {
      monitor = startFPSMonitor();
    },
    stopMonitoring: () => {
      if (monitor) {
        const metrics = monitor.stop();
        logPerformanceMetrics(componentName, metrics);
        monitor = null;
      }
    },
  };
}

/**
 * Optimize GSAP timeline based on device performance
 * T126: Optimize animations if jank detected
 */
export function optimizeGSAPTimeline(
  timeline: gsap.core.Timeline,
  performance?: "high" | "medium" | "low",
) {
  const perf = performance || detectDevicePerformance();

  if (perf === "low") {
    // Reduce animation complexity for low-end devices
    timeline.timeScale(1.5); // Speed up animations

    // Disable heavy effects
    timeline.getChildren().forEach((tween) => {
      const tweenVars = (tween as { vars?: Record<string, unknown> }).vars;
      if (tweenVars) {
        // Remove shadow and filter effects
        delete tweenVars.boxShadow;
        delete tweenVars.filter;
        delete tweenVars.backdropFilter;
      }
    });
  } else if (perf === "medium") {
    // Moderate optimization
    timeline.timeScale(1.2); // Slightly speed up
  }

  return timeline;
}

/**
 * Check if device should use reduced motion
 * Respects user's accessibility preferences
 */
export function shouldUseReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Performance test results type
 */
export interface PerformanceTestResult {
  componentName: string;
  devicePerformance: "high" | "medium" | "low";
  metrics: ReturnType<ReturnType<typeof startFPSMonitor>["stop"]>;
  timestamp: string;
  userAgent: string;
}

/**
 * Save performance test results to localStorage
 * Useful for collecting data from real devices
 * T124: Test Diwali template on mid-range Android
 */
export function savePerformanceTest(result: PerformanceTestResult) {
  if (typeof window === "undefined") return;

  try {
    const existingResults = localStorage.getItem("wysh_performance_tests");
    const results = existingResults ? JSON.parse(existingResults) : [];

    results.push(result);

    // Keep only last 50 tests
    if (results.length > 50) {
      results.shift();
    }

    localStorage.setItem("wysh_performance_tests", JSON.stringify(results));
  } catch (error) {
    console.error("Failed to save performance test:", error);
  }
}

/**
 * Get all saved performance test results
 */
export function getPerformanceTests(): PerformanceTestResult[] {
  if (typeof window === "undefined") return [];

  try {
    const results = localStorage.getItem("wysh_performance_tests");
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error("Failed to load performance tests:", error);
    return [];
  }
}
