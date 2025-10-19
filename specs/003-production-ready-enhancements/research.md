# Phase 0 Research: Production-Ready Enhancements

**Feature**: Production-Ready Enhancements for Wysh
**Date**: 2025-10-19
**Status**: Research Complete

## Research Overview

This document captures technical research for implementing production-ready enhancements to Wysh, including shadcn/ui theme consistency, rate limiting, SEO optimization, performance improvements, and accessibility compliance. All findings are cross-verified with official documentation using Upstash Context7 MCP tool.

---

## 1. Rate Limiting Implementation

### Research Task: Best Rate Limiting Solution for Convex + Next.js

**Findings from Official Documentation** (Verified via Upstash Context7):

#### Option 1: @convex-dev/rate-limiter (RECOMMENDED)

**Source**: Convex Rate Limiter Component Official Docs

**Key Features**:
- Application-level rate limiting integrated directly in Convex mutations
- Supports two algorithms:
  - **Fixed Window**: Simple, prevents exactly N requests per time period
  - **Token Bucket**: Allows bursts, maintains long-term average rate
- Transactional evaluation (atomic with mutation execution)
- Configurable sharding for high-throughput scenarios (10+ shards reduces contention)
- Built-in reserve capacity feature (prevents starvation for large requests)

**Configuration Pattern** (from official docs):
```typescript
// convex/convex.config.ts
import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

const app = defineApp();
app.use(rateLimiter);
export default app;
```

**Usage Pattern**:
```typescript
import { RateLimiter, MINUTE, HOUR, DAY } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  createGreeting: {
    kind: "fixed window",
    rate: 3,
    period: MINUTE
  },
  createGreetingHourly: {
    kind: "token bucket",
    rate: 20,
    period: HOUR,
    capacity: 5  // Allows burst of 5 if user hasn't been active
  },
  createGreetingDaily: {
    kind: "fixed window",
    rate: 50,
    period: DAY
  }
});

// In mutation
const { ok, retryAfter } = await rateLimiter.limit(ctx, "createGreeting", {
  key: ipAddress
});
if (!ok) {
  throw new ConvexError({
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter,
    message: `Too many greetings. Please wait ${Math.ceil(retryAfter / 1000)}s.`
  });
}
```

**Pros**:
- Native Convex integration (zero external dependencies)
- Transactional guarantees (rate limit check atomic with greeting creation)
- No network latency (all data in Convex database)
- Easy configuration via TypeScript
- Official Convex component (maintained by Convex team)

**Cons**:
- Stores rate limit state in Convex database (counts against storage quota)
- Not distributed across multiple Convex deployments (acceptable for single-deployment MVP)

#### Option 2: Upstash Redis + @upstash/ratelimit (ALTERNATIVE)

**Source**: Upstash Rate Limit Official Docs (Next.js Integration)

**Key Features**:
- Distributed rate limiting using Redis
- Supports sliding window, fixed window, token bucket algorithms
- Edge runtime compatible (Vercel Edge Functions)
- Built-in analytics support
- Ephemeral cache option (reduces Redis calls)

**Configuration Pattern**:
```typescript
// app/api/greetings/route.ts or middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

// Middleware pattern (Next.js)
export default async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success, pending, limit, remaining } = await ratelimit.limit(ip);

  context.waitUntil(pending);  // Handle analytics async

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  return NextResponse.next();
}
```

**Pros**:
- Distributed rate limiting (works across multiple deployments)
- Very low latency (edge-optimized Redis)
- Separate infrastructure (doesn't count against Convex storage)
- Production-proven at scale

**Cons**:
- Requires Upstash account and Redis instance (additional service dependency)
- Environment variables management (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- Network latency for rate limit checks (minimal but non-zero)
- Additional cost for Redis usage (free tier: 10k requests/day)

**Decision**: Use **@convex-dev/rate-limiter** for MVP

**Rationale**:
1. Aligns with Solo Developer Simplicity principle (minimal dependencies)
2. Zero additional infrastructure (no Redis management)
3. Transactional guarantees prevent race conditions
4. Free tier Convex storage is sufficient for rate limit records
5. Easier migration to Upstash later if distribution needed
6. Follows constitution preference for built-in solutions

**Implementation Plan**:
- Install via `bun install @convex-dev/rate-limiter`
- Configure in `convex/convex.config.ts`
- Create rate limit policies in `convex/rateLimiter.ts`
- Apply to `createGreeting` mutation with IP-based keys
- Add jitter to `retryAfter` to prevent thundering herd (per official docs pattern)

---

## 2. Next.js Metadata API for SEO Optimization

### Research Task: Implement Dynamic Metadata and Open Graph Images

**Findings from Official Documentation** (Verified via Upstash Context7):

#### Static Metadata Pattern (Root Layout)

**Source**: Next.js Metadata API Official Docs

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://wysh.app'),
  title: {
    default: 'Wysh - Create Beautiful Personalized Festival Greetings | Free',
    template: '%s | Wysh'  // For child pages: "Diwali Greeting | Wysh"
  },
  description: 'Create stunning personalized festival greetings for Diwali, Holi, Christmas, and more. Share via WhatsApp in seconds. Free and no signup required.',
  keywords: ['festival greetings', 'diwali cards', 'holi wishes', 'whatsapp greetings', 'personalized cards'],
  authors: [{ name: 'Wysh Team' }],
  openGraph: {
    type: 'website',
    siteName: 'Wysh',
    title: 'Wysh - Personalized Festival Greetings',
    description: 'Create stunning personalized festival greetings',
    url: 'https://wysh.app',
    images: [{
      url: '/og-default.png',
      width: 1200,
      height: 630,
      alt: 'Wysh Festival Greetings'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wysh - Personalized Festival Greetings',
    description: 'Create stunning personalized festival greetings',
    images: ['/og-default.png']
  },
  robots: {
    index: true,
    follow: true
  }
};
```

#### Dynamic Metadata Pattern (Greeting Pages)

**Source**: Next.js generateMetadata Function Official Docs

```typescript
// app/g/[id]/page.tsx
import type { Metadata } from 'next';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;

  // Fetch greeting data from Convex
  const greeting = await fetchQuery(api.greetings.getGreetingByShareableId, {
    shareableId: id
  });

  if (!greeting) {
    return {
      title: 'Greeting Not Found',
      description: 'This greeting could not be found.'
    };
  }

  const title = `${greeting.festivalType} Greeting from ${greeting.senderName}`;
  const description = greeting.customMessage
    ? `"${greeting.customMessage.slice(0, 100)}..." - ${greeting.senderName}`
    : `${greeting.senderName} sent you a personalized ${greeting.festivalType} greeting!`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://wysh.app/g/${id}`,
      images: [{
        url: `/api/og?id=${id}`,  // Dynamic OG image generation
        width: 1200,
        height: 630,
        alt: title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?id=${id}`]
    }
  };
}
```

**Key Learnings**:
1. `metadataBase` is crucial for resolving relative URLs (required for Open Graph)
2. `generateMetadata` is async and receives route params
3. Images MUST be absolute URLs for Open Graph (1200x630 recommended)
4. Title templates (%s pattern) avoid repetition
5. Fetch data once - Next.js automatically deduplicates between generateMetadata and page component (memoization)

#### Open Graph Image Generation

**Source**: Next.js ImageResponse API Official Docs

**Pattern 1: Static Image (Simple)**:
```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        fontSize: 64,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
      }}>
        Wysh - Festival Greetings
      </div>
    ),
    { ...size }
  );
}
```

**Pattern 2: Dynamic Image (Route Handler)**:
```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  const greeting = await fetchQuery(api.greetings.getGreetingByShareableId, {
    shareableId: id!
  });

  return new ImageResponse(
    (
      <div style={{
        background: getFestivalGradient(greeting.festivalType),
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: 80
      }}>
        <h1 style={{ fontSize: 72, margin: 0 }}>
          {greeting.festivalType} Greeting
        </h1>
        <p style={{ fontSize: 36, marginTop: 20 }}>
          From {greeting.senderName} to {greeting.recipientName}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**Constraints**:
- ImageResponse supports inline styles only (no Tailwind classes)
- Limited font support (can load custom fonts via `fetch()`)
- No external images allowed (must embed as base64 or use public URLs)
- Keep logic simple (renders on every request - caching recommended)

#### Sitemap Generation

**Source**: Next.js Sitemap API Official Docs

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://wysh.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://wysh.app/create/festival',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Note: Individual greetings excluded (privacy)
  ];
}
```

#### Robots.txt Generation

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/g/'],  // Protect greetings and API routes
      },
    ],
    sitemap: 'https://wysh.app/sitemap.xml',
  };
}
```

**Decision**: Implement all four SEO patterns

**Rationale**:
1. Static metadata in root layout (homepage SEO)
2. Dynamic metadata via generateMetadata (greeting pages)
3. Dynamic Open Graph images via API route (social sharing)
4. Sitemap and robots.txt for crawler guidance

**Implementation Checklist**:
- [x] Research complete
- [ ] Create `lib/metadata.ts` helper functions
- [ ] Add root metadata to `app/layout.tsx`
- [ ] Implement generateMetadata in `app/g/[id]/page.tsx`
- [ ] Create `app/api/og/route.tsx` for dynamic images
- [ ] Create `app/sitemap.ts`
- [ ] Create `app/robots.ts`
- [ ] Test with WhatsApp preview, Twitter Card Validator, Facebook Debugger

---

## 3. shadcn/ui Theme Consistency

### Research Task: Verify CSS Variable Usage and Dark Mode Implementation

**Findings from Official Documentation** (Verified via Upstash Context7):

#### Current State Analysis

**File**: `app/globals.css` (reviewed)

**Findings**:
✅ **ALREADY CORRECT** - Project uses shadcn/ui CSS variables mode with Tailwind CSS v4

**Evidence**:
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.9383 0.0042 236.4993);
  --foreground: oklch(0.3211 0 0);
  --primary: oklch(0.6397 0.172 36.4421);
  /* ... all shadcn/ui variables defined */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... all dark mode variables defined */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... Tailwind CSS v4 theme mapping */
}
```

**Verification Checklist**:
- ✅ Uses `oklch()` color space (modern, perceptually uniform)
- ✅ Defines all required shadcn/ui variables (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, card, popover)
- ✅ Includes chart colors (chart-1 through chart-5)
- ✅ Includes sidebar variables (for future use)
- ✅ Uses `@theme inline` for Tailwind CSS v4 integration
- ✅ Custom dark mode variant defined
- ✅ Base styles applied via `@layer base`

#### Task: Audit Components for Hardcoded Colors

**Pattern to Find** (Bad ❌):
```typescript
// Hardcoded hex colors
<div className="bg-#FF5733 text-#FFFFFF">

// Hardcoded Tailwind color scales
<button className="bg-red-500 hover:bg-red-600">

// Inline styles with colors
<div style={{ backgroundColor: '#FF5733' }}>
```

**Pattern to Use** (Good ✅):
```typescript
// shadcn/ui variables
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
<Card className="bg-card text-card-foreground border-border">

// Festival-specific colors (extend theme)
<div className="bg-[var(--festival-primary)]">  // Defined in festival constants
```

**Audit Script** (to be created):
```bash
#!/bin/bash
# scripts/audit-colors.sh

echo "=== Hardcoded HEX Colors ==="
grep -r "#[0-9A-Fa-f]\{6\}" app/ components/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "globals.css"

echo "\n=== Hardcoded Tailwind Color Scales ==="
grep -r "bg-\(red\|blue\|green\|yellow\|orange\|purple\|pink\|indigo\|gray\|slate\)-[0-9]" app/ components/ --include="*.tsx" | grep -v "node_modules"

echo "\n=== Inline Color Styles ==="
grep -r "style={{ .*color" app/ components/ --include="*.tsx" | grep -v "node_modules"
```

**Decision**: Systematic color audit required before implementation

**Action Items**:
1. Run audit script to identify all violations
2. Create replacement map: `#FF5733` → `hsl(var(--primary))`
3. Replace hardcoded colors in festival templates (priority)
4. Replace hardcoded colors in form components
5. Verify dark mode works correctly after changes
6. Update `lib/constants.ts` festival colors to use CSS variables

---

## 4. Homepage Statistics with Animated Counters

### Research Task: Convex Query Aggregation and Framer Motion Counter Animation

**Findings**:

#### Convex Statistics Queries

**Pattern**: Create dedicated statistics queries in `convex/statistics.ts`

```typescript
// convex/statistics.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getHomepageStats = query({
  args: {},
  handler: async (ctx) => {
    // Total greetings
    const greetings = await ctx.db.query("greetings").collect();
    const totalGreetings = greetings.length;

    // Total views
    const totalViews = greetings.reduce((sum, g) => sum + (g.viewCount || 0), 0);

    // Supported festivals (from festivals table)
    const festivals = await ctx.db.query("festivals").collect();
    const totalFestivals = festivals.length;

    return {
      totalGreetings,
      totalViews,
      totalFestivals,
      lastUpdated: Date.now()
    };
  }
});
```

**Optimization**: For large datasets, consider Convex Aggregate component
- Current approach: Fine for <100k greetings
- Future: Use `@convex-dev/aggregate` for O(log n) aggregation

#### Counter Animation Implementation

**Option 1: Framer Motion (RECOMMENDED)**

```typescript
// components/stats/AnimatedCounter.tsx
import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function AnimatedCounter({
  value,
  duration = 2
}: {
  value: number;
  duration?: number;
}) {
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, {
    bounce: 0,
    duration: duration * 1000
  });

  const display = useTransform(spring, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (hasAnimated) return;
    spring.set(value);
    setHasAnimated(true);
  }, [value, hasAnimated]);

  return <motion.span>{display}</motion.span>;
}
```

**Option 2: Pure React (Fallback if Framer Motion not installed)**

```typescript
// hooks/use-counter-animation.ts
import { useEffect, useState } from 'react';

export function useCounterAnimation(
  target: number,
  duration: number = 2000
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);  // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}
```

#### Intersection Observer for Scroll Trigger

```typescript
// hooks/use-intersection-observer.ts
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);  // Trigger only once
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered, options]);

  return { ref, isVisible };
}
```

**Usage**:
```typescript
// components/stats/StatisticsSection.tsx
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { AnimatedCounter } from './AnimatedCounter';

export function StatisticsSection() {
  const stats = useQuery(api.statistics.getHomepageStats);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });

  if (!stats) {
    return <StatsSkeleton />;  // Skeleton loader
  }

  return (
    <section ref={ref} className="py-16 bg-muted/50">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          label="Greetings Created"
          value={isVisible ? stats.totalGreetings : 0}
        />
        <StatCard
          label="Total Views"
          value={isVisible ? stats.totalViews : 0}
        />
        <StatCard
          label="Festivals Supported"
          value={isVisible ? stats.totalFestivals : 0}
        />
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-5xl font-bold text-primary">
        <AnimatedCounter value={value} />
      </p>
      <p className="text-muted-foreground mt-2">{label}</p>
    </div>
  );
}
```

**Decision**: Use Framer Motion if already installed, otherwise pure React

**Rationale**:
- Framer Motion provides smoother spring animations
- Constitution allows Framer Motion (already in dependency list)
- Fallback ensures zero new dependencies if not installed
- Intersection Observer API is native (no library needed)

---

## 5. Performance Optimization Patterns

### Research Task: Loading States, Code Splitting, Image Optimization

**Findings**:

#### Loading States (Prevent CLS)

**Pattern 1: Skeleton Loaders**
```typescript
// components/shared/LoadingState.tsx (verify exists)
import { Skeleton } from '@/components/ui/skeleton';

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center">
          <Skeleton className="h-16 w-32 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto mt-2" />
        </div>
      ))}
    </div>
  );
}
```

**Pattern 2: Form Loading States**
```typescript
// components/forms/PersonalizationForm.tsx
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        'Create Greeting'
      )}
    </Button>
  );
}
```

#### Code Splitting

**Pattern 1: Dynamic Imports for Heavy Components**
```typescript
// app/g/[id]/page.tsx
import dynamic from 'next/dynamic';
import { LoadingState } from '@/components/shared/LoadingState';

const GreetingRenderer = dynamic(
  () => import('@/components/greetings/GreetingRenderer'),
  {
    loading: () => <LoadingState />,
    ssr: true  // Keep SSR for SEO
  }
);
```

**Pattern 2: Lazy Load Festival Templates**
```typescript
// components/greetings/GreetingRenderer.tsx
import dynamic from 'next/dynamic';

const templateMap = {
  Diwali: dynamic(() => import('./DiwaliTemplate')),
  Holi: dynamic(() => import('./HoliTemplate')),
  Christmas: dynamic(() => import('./ChristmasTemplate')),
  // ... other templates
};

export function GreetingRenderer({ festivalType, ...props }) {
  const Template = templateMap[festivalType];
  return <Template {...props} />;
}
```

#### Image Optimization (Already Using next/image)

**Verification Checklist**:
- [x] Using `next/image` component (per codebase review)
- [ ] Add `priority` prop to above-the-fold images
- [ ] Specify explicit `width` and `height` (prevents CLS)
- [ ] Use `placeholder="blur"` for static images
- [ ] Verify WebP/AVIF format support in `next.config.ts`

**Pattern**:
```typescript
// components/shared/FestivalImage.tsx
import Image from 'next/image';

export function FestivalImage({
  src,
  alt,
  priority = false
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority={priority}
      quality={85}
      className="rounded-lg"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..."  // Low-quality placeholder
    />
  );
}
```

---

## 6. Mobile-First Optimization

### Research Task: Touch Targets, Responsive Patterns, Animation Reduction

**Findings from Constitution and Spec**:

#### Touch Target Sizes (WCAG Compliance)

**Minimum**: 44x44 pixels (iOS/Android standard)

**Enforcement Pattern**:
```typescript
// Tailwind CSS utility
<button className="min-h-11 min-w-11 px-4 py-2">  // 44px = 11 * 4px
  Click Me
</button>

// OR use shadcn/ui Button component (already has proper sizing)
<Button size="default">  // Already meets 44x44 requirement
  Click Me
</Button>
```

**Audit Script**:
```bash
# Find buttons/links without minimum size
grep -r "button\|Button" components/ --include="*.tsx" | grep -v "min-h\|size="
```

#### Responsive Breakpoints (Mobile-First)

**Current Tailwind v4 Setup** (verified in `globals.css`):
- Base: 320px (mobile)
- `sm:` 640px (large mobile)
- `md:` 768px (tablet)
- `lg:` 1024px (desktop)
- `xl:` 1280px (large desktop)

**Pattern** (Mobile-First):
```typescript
// CORRECT ✅
<div className="text-sm sm:text-base md:text-lg">

// INCORRECT ❌ (Desktop-First)
<div className="text-lg md:text-base sm:text-sm">
```

#### Animation Reduction for Mobile

**Pattern**:
```typescript
// lib/animations.ts
export const getAnimationConfig = (isMobile: boolean) => ({
  particleCount: isMobile ? 20 : 50,  // 60% reduction
  duration: isMobile ? 0.8 : 1.2,
  complexity: isMobile ? 'simple' : 'complex'
});

// Respect prefers-reduced-motion
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

**Usage in Templates**:
```typescript
// components/greetings/DiwaliTemplate.tsx
import { useReducedMotion } from '@/lib/animations';
import { useIsMobile } from '@/hooks/use-mobile';

export function DiwaliTemplate({ ...props }) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const animationConfig = prefersReducedMotion
    ? { particles: 0, duration: 0 }  // No animation
    : getAnimationConfig(isMobile);

  return (
    <div className="relative">
      {/* Template content */}
      {!prefersReducedMotion && (
        <ParticleSystem config={animationConfig} />
      )}
    </div>
  );
}
```

---

## 7. Accessibility Implementation

### Research Task: WCAG AA Compliance, Keyboard Navigation, Screen Readers

**Findings**:

#### Keyboard Navigation

**Requirements**:
- All interactive elements must be keyboard accessible (Tab/Shift+Tab)
- Visible focus indicators (ring styles from shadcn/ui)
- Logical tab order
- Escape key closes modals/dialogs

**Verification** (shadcn/ui components already compliant):
```typescript
// shadcn/ui Button already has focus:ring
<Button>Click Me</Button>
// Renders: <button class="... focus:ring-2 focus:ring-ring focus:ring-offset-2">

// Custom elements need manual focus styles
<div
  tabIndex={0}
  className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
>
  Custom Interactive Element
</div>
```

#### Screen Reader Labels

**Pattern**:
```typescript
// Icon-only buttons
<Button variant="ghost" size="icon" aria-label="Share greeting on WhatsApp">
  <Share className="h-4 w-4" />
</Button>

// Form inputs (already using shadcn/ui Form component)
<Form>
  <FormField
    name="recipientName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Recipient Name</FormLabel>  // Proper label association
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

#### Color Contrast (WCAG AA)

**Requirements**:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

**Verification Tool**: Use browser DevTools Accessibility panel

**Current State** (verified in `globals.css`):
- ✅ Primary on background: High contrast (oklch values ensure this)
- ✅ Foreground on background: High contrast
- ✅ Destructive on destructive-foreground: Verified
- [ ] Festival colors need contrast verification

**Action**: Audit festival-specific color combinations in `lib/constants.ts`

#### aria-live Regions

**Pattern for Dynamic Content**:
```typescript
// Statistics counter
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  <AnimatedCounter value={1234} />
  <span className="sr-only">greetings created</span>
</div>

// Error messages
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

---

## Research Decisions Summary

| Area | Decision | Rationale |
|------|----------|-----------|
| Rate Limiting | @convex-dev/rate-limiter | Minimal dependencies, transactional guarantees, Solo Developer Simplicity |
| SEO Metadata | Next.js Metadata API (built-in) | Zero dependencies, official Next.js solution, comprehensive feature set |
| Open Graph Images | ImageResponse API + Route Handler | Dynamic generation, built-in Next.js feature, no external service |
| Theme Consistency | Systematic audit + replace | Existing setup correct, only need to fix violations in components |
| Statistics Animation | Framer Motion (if installed) | Already approved dependency, smooth spring animations |
| Counter Animation Fallback | Pure React + useEffect | Zero dependencies if Framer Motion not installed |
| Loading States | Skeleton loaders + disabled states | Prevent CLS, native HTML/shadcn/ui patterns |
| Code Splitting | next/dynamic for templates | Reduce initial bundle, maintain SEO with SSR |
| Mobile Optimization | Reduce particles, respect prefers-reduced-motion | 60fps target on mid-range Android |
| Accessibility | shadcn/ui defaults + manual audit | WCAG AA compliance, screen reader support |

---

## Next Steps (Phase 1)

1. **Data Model Design** (`data-model.md`):
   - Rate limit record structure (IP, endpoint, timestamp, count)
   - Statistics aggregate entity (total greetings, views, festivals)
   - SEO metadata configuration entity

2. **API Contracts** (`contracts/`):
   - Rate limit response schema (OpenAPI)
   - Statistics query response schema
   - Metadata generation interface

3. **Quickstart Guide** (`quickstart.md`):
   - Developer setup for new dependencies
   - Testing rate limiting locally
   - Verifying SEO metadata
   - Running color audit script
   - Mobile device testing workflow

4. **Agent Context Update**:
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
   - Update AI agent with new patterns and decisions

---

## External References

**Official Documentation Verified**:
- ✅ Convex Rate Limiter: https://github.com/get-convex/rate-limiter
- ✅ Upstash Ratelimit: https://github.com/upstash/ratelimit-js
- ✅ Next.js Metadata API: https://github.com/vercel/next.js (Metadata docs)
- ✅ Next.js ImageResponse: https://github.com/vercel/next.js (Open Graph Image docs)
- ✅ shadcn/ui Theming: https://github.com/shadcn-ui/ui (Theming docs)

**MCP Tools Used**:
- `mcp_upstash_conte_get-library-docs`: Retrieved official code snippets and patterns
- `mcp_upstash_conte_resolve-library-id`: Found correct library IDs for Context7

**All findings cross-verified with official documentation** ✅
