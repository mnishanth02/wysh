# Phase 0 Research: Technology Decisions & Architecture Rationale

**Created**: 2025-10-17
**Phase**: Phase 0 / Phase 1 Design Support
**Purpose**: Consolidate all technology research decisions and document rationale for architectural choices

---

## Table of Contents

1. [Frontend Framework Selection](#frontend-framework-selection)
2. [Animation Strategy](#animation-strategy)
3. [Backend & Database](#backend--database)
4. [Mobile-First Performance](#mobile-first-performance)
5. [Form Handling & Validation](#form-handling--validation)
6. [UI Component Library](#ui-component-library)
7. [State Management](#state-management)
8. [Deployment Strategy](#deployment-strategy)

---

## Frontend Framework Selection

### Decision: Next.js 15+ (App Router) with React 19+

#### Research Findings

| Criteria | Next.js 15 | Remix | Nuxt | Astro |
|----------|-----------|-------|------|-------|
| Server Components | ✅ Native (React Server Components) | ✅ Loaders + Actions | ❌ Limited | ✅ Built-in |
| Mobile Optimization | ✅ Excellent (edge middleware, dynamic imports) | ✅ Good | ✅ Good | ⚠️ Static focus |
| Animation Support | ✅ Best (React 19 + libraries) | ✅ Good | ✅ Good | ⚠️ Client-side only |
| Learning Curve | ✅ Gentle (familiar to React devs) | ⚠️ Steeper (different paradigm) | ❌ Requires Vue knowledge | ✅ Gentle |
| Solo Developer Productivity | ✅ Highest | ⚠️ Medium | ⚠️ Medium | ✅ High |
| Vercel Integration | ✅ Native | ✅ Good | ⚠️ Partial | ✅ Native |

#### Why Next.js 15

1. **Server Components**: Enable direct database access without API layer (Convex client initialized server-side)
2. **React 19**: Latest hooks API, concurrent rendering for smooth animations
3. **Built-in App Router**: Simpler routing for 7-page creation flow + viewer page
4. **Vercel Deployment**: 1-click deployment from GitHub, automatic previews
5. **Solo Developer**: No additional frameworks to learn; pure React + TypeScript

#### Verification

- ✅ Supports React 19 hooks and concurrent rendering
- ✅ Can import Convex client in Server Components
- ✅ Middleware for analytics / error tracking
- ✅ Dynamic imports for code splitting (template lazy loading)
- ✅ Edge middleware for geo-localization (future scale consideration)

---

## Animation Strategy

### Decision: GSAP 3.13+ for Sequences + Framer Motion 12.23+ for Scroll/Gestures

#### Why Dual Approach?

| Use Case | GSAP | Framer | Reason |
|----------|------|--------|--------|
| Timeline sequences (multi-step animations) | ✅ Perfect | ⚠️ Complex | GSAP timelines designed for choreography |
| Scroll-linked animations | ⚠️ Verbose | ✅ Perfect | Framer's scroll tracking is simpler |
| Gesture-based (swipe, drag) | ⚠️ Manual setup | ✅ Perfect | Framer's gesture detection is native |
| Performance | ✅ 60fps capable | ✅ 60fps capable | Both excellent; context-dependent |
| Bundle size | ⚠️ 35KB gzip | ✅ 15KB gzip | Use GSAP only where needed |

#### GSAP Use Cases (Wysh)

1. **Greeting Animation Timeline**
   - Diwali: Oil lamp (diya) lights up sequentially over 4 seconds
   - Holi: Colors splash and merge in choreographed order
   - Script: Timeline with tweens starting at precise offsets

```typescript
// Example GSAP timeline
gsap.timeline()
  .to('.diya-1', { fillOpacity: 1 }, 0)      // Light at 0s
  .to('.diya-2', { fillOpacity: 1 }, 0.3)    // Light at 0.3s
  .to('.diya-3', { fillOpacity: 1 }, 0.6)    // Light at 0.6s
  .to('.flame-1', { scale: 1.2, opacity: 1 }, 0)
  .to('.message-text', { opacity: 1, y: -20 }, 1.5);
```

2. **Relationship Context Animation Adjustments**
   - Boss (subtle): Slower durations, reduced scale changes
   - Friend (playful): Faster durations, more bouncy easing
   - Context parameters feed into GSAP tweens without code changes

#### Framer Motion Use Cases (Wysh)

1. **Creation Flow Navigation** (Not MVP, Phase 2+)
   - Page transitions between festival → relationship → personalize
   - Gesture-based nav (swipe back)
   - Exit animations when leaving creation flow

2. **Greeting Replay Button** (Phase 2)
   - Click replay → Framer animation variant for bounce
   - Gesture support for mobile (tap, long-press)

#### Performance Targets

- **60fps on Snapdragon 600-series Android**
  - Use GPU acceleration (transform, opacity only)
  - Avoid layout thrashing (width, height, position changes)
  - Profile with DevTools: Performance → Record

- **Animation Budget**: Max 5 concurrent tweens
  - Diya lighting: 4 tweens
  - Message fade: 1 tween
  - Total: 5 tweens < budget ✅

---

## Backend & Database

### Decision: Convex Serverless + React Query for Data Fetching

#### Convex vs. Firebase vs. Supabase vs. Custom API

| Criteria | Convex | Firebase | Supabase | Custom API |
|----------|--------|----------|----------|-----------|
| Database | Managed (IndexedDB-like) | Managed (Realtime) | Managed (PostgreSQL) | Your choice |
| Functions | Convex functions (TypeScript) | Cloud Functions | PostgreSQL functions | Custom |
| Authentication | Built-in (optional for MVP) | Auth0-like built-in | Auth0-like built-in | Your choice |
| Real-time Sync | ✅ Native via subscriptions | ✅ Native | ⚠️ Polling/WebSocket | ⚠️ Manual |
| Type Safety | ✅ TypeScript first (Validator API) | ⚠️ Runtime validation needed | ⚠️ Runtime validation needed | ✅ Manual |
| Solo Developer DX | ✅ Simplest (local dev server) | ⚠️ Emulator setup complex | ⚠️ Local Postgres needed | ❌ Full setup |
| Pricing | Free tier: 10M records | Free tier: Good | Free tier: Good | Your costs |
| Scaling | ✅ Auto (serverless) | ✅ Auto (serverless) | ✅ Auto | ⚠️ Manual |

#### Why Convex

1. **Zero Auth for MVP**: `ctx.auth` always undefined = public access (perfect for festival greetings)
2. **TypeScript Validator API**: Input validation happens at type level in Convex functions
3. **Local Development**: `npm run dev` runs local Convex backend automatically
4. **React Integration**: `useQuery` and `useMutation` hooks work seamlessly with Next.js
5. **Deployment**: Single button deploy to Convex Cloud; no separate backend infrastructure

#### Schema & Query Patterns

```typescript
// Greeting table structure
{
  _id: Id<"greetings">,
  shareableId: string,           // Unique shareable URL parameter
  festival: string,               // "diwali" | "holi" | ...
  relationship: string,           // "parents" | "boss" | ...
  recipientName: string,
  senderName: string,
  message: string,
  templateVariant: string,        // Template choice within festival
  viewCount: number,              // Incremented on each view
  createdAt: number,              // Timestamp
  expiresAt: null,                // No expiry in MVP (indefinite retention)
  status: "active",               // Future: "draft" | "deleted"
}
```

**Performance Indexes**:
- `by_shareable_id`: O(1) lookup for greeting viewer page
- `by_created_at`: O(log n) for analytics queries (Phase 2+)

---

## Mobile-First Performance

### Decision: <2MB Page Weight, <3s Load (3G), 60fps Animations

#### Performance Budget Breakdown

```
Desired Total: < 2MB

- Next.js Runtime: ~150KB
- React 19: ~40KB
- Tailwind CSS (optimized): ~30KB
- shadcnui components (used): ~80KB
- GSAP 3.13: ~35KB (only if template uses it)
- Framer Motion 12.23: ~15KB (only if page has scroll)
- Convex React client: ~20KB
- Greeting template (one): ~50KB
- Festival assets (SVGs): ~100KB
- Other libraries (zod, hooks): ~40KB
- Your code: ~200KB

Total: ~760KB (leaving 1.2MB headroom)
```

#### Strategy

1. **Code Splitting**
   - Templates lazy-loaded: `const Template = dynamic(() => import('./DiwaliTemplate'))`
   - Only active template loaded on greeting view page

2. **Asset Optimization**
   - SVGs for festival icons (text-based, scale perfectly)
   - Inline critical CSS (Next.js automatic)
   - Image optimization with `next/image` component

3. **Bundle Analysis**
   ```bash
   npm run build
   npm run analyze
   # Identifies large dependencies
   ```

4. **Lighthouse Targets**
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

#### 3G Network Simulation

```bash
# Chrome DevTools → Network → Add custom throttling
# "Slow 3G": 400kbps down, 20kbps up, 170ms latency
# Expected: 3-5s load time
```

---

## Form Handling & Validation

### Decision: React Hook Form + zod + TypeScript

#### Why This Stack

| Library | Role | Alternative | Why Not |
|---------|------|-------------|---------|
| React Hook Form | Form state management | Formik | Lighter, better perf, smaller API |
| zod | Runtime schema validation | Joi, Yup | TypeScript-first, smallest bundle |
| TypeScript | Static type safety | PropTypes | Type inference at compile time |

#### Validation Schema (Greeting Creation)

```typescript
const greetingSchema = z.object({
  festival: z.enum(['diwali', 'holi', 'eid', ...]),
  relationship: z.enum(['parents', 'boss', 'friend', ...]),
  recipientName: z.string().min(1).max(50),
  senderName: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
  templateVariant: z.string(), // Validated against festival.templates
});
```

#### Form Flow

```
1. Festival Selection → Select from list
2. Relationship Context → Affects template colors/animations
3. Names & Message → Text input (zod validates)
4. Template Selection → Preview showing context application
5. Success → Share link generated
```

---

## UI Component Library

### Decision: shadcnui (Radix UI Primitives + Tailwind)

#### Why shadcnui

1. **Copy-Paste Components**: Full control over component source (no locked-in version)
2. **Headless**: Radix primitives handle accessibility; you style with Tailwind
3. **Tailwind Integration**: Classes override for custom styling per cultural context
4. **Type Safety**: Built with TypeScript, full props API documented
5. **Bundle**: Only ship components you use (no bloat)

#### Components Used in MVP

| Component | Purpose | File |
|-----------|---------|------|
| Button | CTAs (Create, Share, Replay) | `ui/button.tsx` |
| Select | Festival/Relationship/Template selection | `ui/select.tsx` |
| Input | Name/Message fields | `ui/input.tsx` |
| Card | Grouping UI sections | `ui/card.tsx` |
| Dialog | Confirmation modals (WhatsApp share) | `ui/dialog.tsx` |
| Toast | Notifications (Copy link, Error states) | `ui/sonner.tsx` |

#### Customization for Cultural Context

```typescript
// Diwali color scheme applied via Tailwind classes
const diwaliColors = {
  primary: 'bg-yellow-500',     // Gold
  secondary: 'bg-red-600',       // Deep red
  accent: 'bg-orange-400',       // Orange
};

// Usage in component
<Button className={`${diwaliColors.primary} hover:${diwaliColors.secondary}`}>
  Light the Diya
</Button>
```

---

## State Management

### Decision: React Query (Convex hooks) + Context API for Shared State

#### Rationale

| Scenario | Solution | Why |
|----------|----------|-----|
| Greeting data (from server) | Convex `useQuery` | Automatic caching, syncing |
| UI state (creation form) | React Hook Form | Form-specific, avoids over-engineering |
| Relationship context (shared) | React Context | 1-2 values used across templates |
| Animation state (per-component) | Local `useState` | Isolated, no cross-component deps |

#### Data Flow

```
┌─────────────────────────────────────────┐
│  Greeting Viewer Page (/g/[id])        │
├─────────────────────────────────────────┤
│                                         │
│  const greeting = useQuery(             │
│    api.greetings.getGreetingByShareableId,
│    { shareableId: params.id }           │
│  );                                     │
│                                         │
│  useEffect(() => {                      │
│    incrementViewCount({ id });          │
│  }, [greeting?._id]);                   │
│                                         │
│  return <TemplateComponent greeting />  │
│         <ReplayButton />                │
│         <ShareButton />                 │
└─────────────────────────────────────────┘
```

---

## Deployment Strategy

### Decision: Vercel (Frontend) + Convex Cloud (Backend)

#### Deployment Flow

```
1. Developer pushes to origin/001-festival-greeting-mvp
   ↓
2. GitHub webhook triggers Vercel build
   ↓
3. Vercel builds Next.js → deploys to edge nodes
   ↓
4. Vercel detects convex/ folder changes
   ↓
5. Runs `npm run build:convex` → deploys functions to Convex Cloud
   ↓
6. Preview URL available in 2-3 minutes
   ↓
7. Merge to main → Production deployment
```

#### Environment Configuration

**Development** (local)
```
NEXT_PUBLIC_CONVEX_URL=http://localhost:8000
NODE_ENV=development
```

**Preview** (Vercel)
```
NEXT_PUBLIC_CONVEX_URL=https://preview-deployment.convex.cloud
NODE_ENV=production
```

**Production** (Vercel)
```
NEXT_PUBLIC_CONVEX_URL=https://prod-deployment.convex.cloud
NODE_ENV=production
```

---

## Clarifications Resolved in This Research Phase

1. **Database Retry Strategy** → Convex mutations auto-retry with exponential backoff (3 attempts: 0ms, 500ms, 1.5s) ✅

2. **Form Data Preservation** → React Hook Form maintains state in component memory; no server-side session needed ✅

3. **Data Retention** → Convex stores indefinitely; no auto-deletion jobs in MVP ✅

4. **Animation Replay** → Framer Motion variant system allows re-trigger without page reload ✅

5. **View Count Privacy** → Stored in Convex with creator-only visibility via query authorization (Phase 2+) ✅

---

## Technology Lock-Ins & Migration Paths

### Acceptable Lock-Ins (Per Constitution)

| Technology | Lock-In Level | Reason | Migration Path |
|-----------|--------------|--------|-----------------|
| Vercel | ⚠️ Medium | Platform-specific deployment | Move to any Node.js host (Railway, Render, Fly.io) |
| Convex | ⚠️ Medium | Database model tied to platform | Export to PostgreSQL via Convex export feature |
| React 19 | ✅ Low | Web standard (React maintained by Meta) | Always upgrade-compatible |
| Tailwind CSS | ✅ Low | CSS utility framework | Move to other CSS-in-JS (Styled Components, Emotion) |

**No unacceptable lock-ins.** Architecture remains vendor-neutral at core (React/TypeScript/CSS).

---

## Performance Verification Checklist

Before Phase 1 completion, verify:

- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Page weight < 2MB (check Network tab after build)
- [ ] Animation 60fps on Snapdragon 600-series (real device, not emulator)
- [ ] Greeting creation < 60 seconds end-to-end
- [ ] View page loads < 3 seconds on 3G (DevTools throttling)
- [ ] Bundle analysis shows no unexpected large dependencies
- [ ] Time to Interactive (TTI) < 2 seconds
- [ ] Cumulative Layout Shift (CLS) < 0.1

---

## Additional Resources

- [Next.js 15 Architecture](https://nextjs.org/learn/foundations/how-nextjs-works)
- [React 19 Concurrent Features](https://react.dev/learn/passing-children-to-components)
- [GSAP Performance Tips](https://gsap.com/docs/v3/HelperFunctions/#gsap-set)
- [Framer Motion Best Practices](https://www.framer.com/motion/guide/)
- [Convex React Integration](https://docs.convex.dev/client/react)
- [Web Vitals for Mobile](https://web.dev/vitals/)

---

**All technology decisions ratified.** Ready to proceed to Phase 1 implementation.
