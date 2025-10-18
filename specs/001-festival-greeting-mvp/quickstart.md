# Developer Quickstart: Wysh Festival Greeting Platform

**Created**: 2025-10-17
**Phase**: Phase 1 Design
**Audience**: Solo developer setting up local development environment

## Prerequisites

- Node.js 20+ (LTS recommended)
- **Bun 1.1+** (preferred package manager)
- Git
- Vercel account (for deployment; optional for local dev)
- Convex account (free tier available)

### Installing Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

## Initial Setup (5 minutes)

### 1. Clone Repository

```bash
git clone <repository-url>
cd wisher
git checkout 001-festival-greeting-mvp
```

### 2. Install Dependencies

```bash
bun install
```

**Note**: Project uses Bun for faster dependency management and script execution.

### 3. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

**Fill in `.env.local`**:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get `NEXT_PUBLIC_CONVEX_URL` from Convex dashboard:
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Create new project or select existing
3. Copy deployment URL from project settings
4. Update `.env.local`

### 4. Start Development Server

```bash
bun run dev
```

Server runs on `http://localhost:3001` (Next.js with Turbopack) with Convex dev backend running locally.

**Available Commands**:

```bash
bun run dev          # Start dev server (localhost:3001)
bun run build        # Production build with type checking
bun run lint         # Run Biome linter
bun run format       # Format code with Biome
bun run start        # Start production server
```

---

## Project Structure Navigation

```
app/
├── (main)/page.tsx              ← Landing page (start here)
├── create/                      ← Creation flow
│   ├── festival/page.tsx        ← Festival selection
│   ├── relationship/page.tsx    ← Relationship context
│   ├── personalize/page.tsx     ← Name/message input
│   ├── template/page.tsx        ← Template selection
│   └── success/page.tsx         ← Share CTA
└── g/[id]/page.tsx              ← Greeting viewer

components/
├── greetings/                   ← Festival templates (add new here)
│   ├── DiwaliTemplate.tsx
│   ├── HoliTemplate.tsx
│   └── ...
├── forms/                       ← Form UI components
└── ui/                          ← Shadcn components

convex/
├── schema.ts                    ← Database schema (READ FIRST)
├── greetings.ts                 ← Greeting mutations/queries
└── festivals.ts                 ← Festival queries

lib/
├── context-engine.ts            ← Relationship context mapping
├── constants.ts                 ← Festival and relationship configs
└── utils.ts                     ← Shared utilities

types/
└── index.ts                     ← TypeScript definitions
```

---

## Key Files to Understand

### 1. `convex/schema.ts` (Database Schema)

Defines two tables:
- `greetings`: User-created greetings
- `festivals`: Festival reference data

**Read this first** to understand data structure.

### 2. `lib/context-engine.ts` (Relationship Logic)

Maps relationship types to visual parameters:

```typescript
relationshipContextMap = {
  parents: { colorIntensity: 'traditional', animationIntensity: 'moderate', ... },
  boss: { colorIntensity: 'muted', animationIntensity: 'subtle', ... },
  friend: { colorIntensity: 'vibrant', animationIntensity: 'playful', ... },
  ...
}
```

Used by templates to customize animations and colors without code duplication.

### 3. `components/greetings/DiwaliTemplate.tsx` (Example Template)

Reference implementation of a festival template:

```typescript
export function DiwaliTemplate({
  recipientName,
  message,
  relationshipContext
}: TemplateProps) {
  // Use GSAP to animate diyas lighting up
  // Apply colors from relationshipContext
  // Render personalized message
}
```

Copy this pattern to add new festival templates.

### 4. `app/create/personalize/page.tsx` (Creation Form)

React Hook Form + zod validation example:

```typescript
const form = useForm({
  resolver: zodResolver(greetingSchema),
  defaultValues: { recipientName: '', senderName: '', ... }
});
```

### 5. `app/g/[id]/page.tsx` (Greeting Viewer)

Queries greeting by ID, triggers animation, tracks views:

```typescript
const greeting = useQuery(api.greetings.getGreetingByShareableId, { shareableId: params.id });
useEffect(() => {
  incrementView({ greetingId: greeting._id }); // Fire-and-forget
}, [greeting?._id]);
```

---

## Common Workflows

### Adding a New Festival

1. **Add festival data** to `lib/constants.ts`:

```typescript
{
  festivalId: 'newFestival',
  displayName: 'New Festival',
  colorPalette: ['#COLOR1', '#COLOR2', ...],
  symbols: ['symbol1', 'symbol2', ...],
}
```

2. **Create template component** `components/greetings/NewFestivalTemplate.tsx`:

```typescript
export function NewFestivalTemplate({ recipientName, message, relationshipContext }: TemplateProps) {
  // Implement animation + styling
}
```

3. **Register in template selector** (`app/create/template/page.tsx`):

```typescript
const templates = {
  diwali: [DiwaliTemplate, ...],
  newFestival: [NewFestivalTemplate, ...],
}
```

4. **Add assets** to `public/festivals/newFestival/`:
   - icons, images, SVGs

5. **Test on mobile device** (required before merging)

---

### Modifying Relationship Context

1. Edit `lib/context-engine.ts`:

```typescript
relationshipContextMap = {
  parents: {
    colorIntensity: 'traditional',
    animationIntensity: 'moderate',
    messageTone: 'respectful',
    decorativeElements: 'traditional'
  },
  // ...
}
```

2. Templates automatically pick up new context via props:

```typescript
<div style={{ color: getColor(relationshipContext.colorIntensity) }}>
  {/* rendered with appropriate colors */}
</div>
```

3. No need to modify individual templates (single source of truth)

---

### Testing Animations

1. **Run locally**: `bun run dev`

2. **Test on mobile device** (non-negotiable per constitution):
   - Get local IP: `ipconfig getifaddr en0` (Mac)
   - Open `http://<LOCAL_IP>:3001` on phone (note: port 3001, not 3000)
   - Test animation smoothness
   - Verify FPS stays above 45fps during animation
   - Check Lighthouse performance score

3. **Profile with Chrome DevTools**:
   - Open DevTools → Performance tab
   - Record greeting view
   - Check for jank (frame rate dips below 60fps)
   - Monitor particle count (should not exceed 500)
   - Check memory usage for leaks

4. **Test with reduced motion**:
   - Enable "Reduce motion" in OS settings (macOS: System Preferences → Accessibility → Display → Reduce motion)
   - Verify static greeting displays correctly with simple fade-in
   - Ensure no complex animations play

5. **Performance Validation**:
   ```bash
   # Build production bundle
   bun run build

   # Run Lighthouse audit
   lighthouse http://localhost:3001/g/[test-greeting-id] --view

   # Target metrics:
   # - First Contentful Paint: <1.8s
   # - Time to Interactive: <3.5s
   # - Total Blocking Time: <300ms
   # - FPS during animation: 45-60fps
   ```

6. **Accessibility Testing**:
   - Test keyboard navigation (Tab, Enter, Space)
   - Run axe DevTools extension
   - Verify color contrast meets WCAG AA (4.5:1)
   - Test screen reader compatibility (VoiceOver on macOS/iOS)

---

### Creating a Greeting (Manual Testing)

1. Navigate to `http://localhost:3000`
2. Click "Create Your Festival Greeting"
3. Select festival → Select relationship → Enter names → Select template
4. View success screen with shareable link
5. Copy link and test on mobile device
6. View greeting page with animation playback

---

## Convex Setup & Management

### Local Development

Convex runs locally during `npm run dev`:

```bash
npm run dev
# Convex dev backend starts automatically
# Access Convex dashboard at http://localhost:8000
```

### Deployment

Deploy to production:

```bash
npm run deploy
```

This deploys:
- Next.js app to Vercel
- Convex functions to Convex Cloud

### Convex Dashboard

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. View deployed functions, queries, mutations
3. Check database contents
4. Monitor errors and logs

---

## Debugging

### Common Issues

| Issue | Solution |
|-------|----------|
| `NEXT_PUBLIC_CONVEX_URL` not set | Update `.env.local` and restart server |
| Animation not playing | Check browser DevTools console for errors; verify GSAP loaded |
| View page 404 | Check `shareableId` in URL; verify greeting exists in DB |
| Form submission fails | Check zod validation errors in browser console |
| Convex mutations timeout | Check database connection; verify Convex dev running |

### Logging

Enable debug logging:

```typescript
// In component
console.log('Greeting:', greeting);
console.log('Context:', relationshipContext);

// In Convex function
console.log('Creating greeting:', args);
```

View logs in terminal during `npm run dev`.

---

## Performance & Mobile Testing

### Checklist Before Pushing

- [ ] Greeting creation completes in <60 seconds
- [ ] Greeting view page loads in <3 seconds on 3G (use DevTools throttling)
- [ ] Animation maintains 45-60fps on mid-range Android device (real device, not emulator)
- [ ] Template size ≤500KB (code + assets)
- [ ] Particle count ≤500 during peak animation
- [ ] Page weight <2MB (check Network tab in DevTools)
- [ ] WhatsApp share link displays rich preview (test with actual WhatsApp)
- [ ] Replay button works without performance regression
- [ ] Works on 320px (small phone) to 768px (tablet) widths
- [ ] Responsive design works without horizontal scroll
- [ ] Reduced motion fallback implemented (simple fade-in)
- [ ] All interactive elements have ARIA labels
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Biome linting passes: `bun run lint`
- [ ] Build succeeds: `bun run build`

### Performance Profiling

```bash
# Build production bundle
bun run build

# Check bundle size (each template should be <500KB)
du -sh .next/static/chunks/*

# Analyze bundle composition
bun run analyze
# Opens bundle analyzer in browser
```

### Performance Budgets

**MUST meet these targets on mid-range Android devices**:

| Metric | Target | Maximum | Degraded |
|--------|--------|---------|----------|
| **FPS** | 60fps | 55fps | 45fps (auto quality reduction) |
| **Particle Count** | 300 | 500 | 150 (mobile fallback) |
| **Template Size** | 200KB | 500KB | - |
| **Load Time (3G)** | <2s | <3s | - |
| **Animation Duration** | 8-10s | 12s | - |

**Test devices**: Samsung Galaxy A52, Motorola Moto G Power, Google Pixel 4a

---

## Code Style & Linting

**Project uses Biome** (NOT ESLint/Prettier) for linting and formatting.

### Run Linter

```bash
bun run lint
```

**Fix linting errors automatically**:

```bash
bun run format
```

**Lint specific files**:

```bash
bunx biome check components/greetings/
bunx biome format --write lib/animations/
```

**Important**: Do NOT install ESLint or Prettier. Project uses Biome exclusively to avoid config conflicts.

### Naming Conventions

- **Components**: PascalCase (`DiwaliTemplate.tsx`)
- **Functions**: camelCase (`generateContextualMessage()`)
- **Constants**: UPPER_SNAKE_CASE (`DIWALI_COLORS`)
- **Files**: kebab-case (`greeting-viewer.tsx`) or PascalCase for components

### Component Limits

Per constitution: Components MUST not exceed 200 lines. Refactor if needed:

```typescript
// Bad: DiwaliTemplate.tsx (250 lines)

// Good: Split into smaller components
DiwaliTemplate.tsx (50 lines) → renders
├── DiwaliAnimation.tsx (60 lines) → GSAP animation
├── DiwaliLayout.tsx (50 lines) → DOM structure
└── DiwaliColors.tsx (40 lines) → Color application
```

---

## Testing

### Unit Tests

```bash
bun run test
```

Write tests in `tests/unit/`.

### E2E Tests

```bash
bun run test:e2e
```

Write tests with Playwright in `tests/e2e/`.

### Manual Device Testing (Required)

**CRITICAL**: Test on real mid-range Android device (not emulator):

```bash
# Start dev server
bun run dev

# Get local IP address
ipconfig getifaddr en0  # macOS
ip addr show           # Linux

# On phone: navigate to http://<LOCAL_IP>:3001
# Test creation flow and greeting viewer

# Profile FPS during animation:
# 1. Open Chrome on Android
# 2. Navigate to chrome://inspect
# 3. Connect to your local server
# 4. Record Performance trace
# 5. Verify FPS stays above 45fps during animation
```

**Test Devices** (mid-range Android):
- Samsung Galaxy A52 (Snapdragon 720G)
- Motorola Moto G Power (Snapdragon 662)
- Google Pixel 4a (Snapdragon 730G)

**Performance Checklist**:
- [ ] Animation maintains 45-60fps on real device
- [ ] Particle system does not exceed 500 particles
- [ ] Template loads in <3s on 3G throttle
- [ ] No memory leaks during replay
- [ ] Reduced motion fallback works correctly

---

## Deployment

### Preview Deployment

Push to feature branch → Vercel creates preview URL automatically.

### Production Deployment

```bash
# Ensure all checks pass before deploying
bun run lint    # Biome linting
bun run build   # Production build
bun run test    # Run tests

# Deploy to production
git push origin 001-festival-greeting-mvp
# → Vercel builds and deploys
# → Convex syncs functions
```

Monitor deployment in Vercel dashboard.

**Post-Deployment Checklist**:
- [ ] Greeting creation works on production
- [ ] Shareable links work correctly
- [ ] WhatsApp sharing displays rich preview
- [ ] Animations play smoothly on mobile devices
- [ ] View counts increment correctly
- [ ] No console errors in browser DevTools

---

## Resources

### External Documentation
- [Next.js 15 Docs](https://nextjs.org/docs) - App Router patterns, routing, API
- [React 19 Docs](https://react.dev) - Hooks, components, best practices
- [Convex Docs](https://docs.convex.dev) - Mutations, queries, schema
- [Tailwind CSS v4](https://tailwindcss.com/docs) - Utility classes, responsive design
- [GSAP Docs](https://gsap.com/docs) - Animation timeline, easing, plugins
- [Biome Docs](https://biomejs.dev) - Linting, formatting rules

### Project Documentation
- `specs/001-festival-greeting-mvp/spec.md` - Feature specification and user stories
- `specs/001-festival-greeting-mvp/plan.md` - Implementation roadmap
- `specs/001-festival-greeting-mvp/data-model.md` - Database schema design
- `specs/002-enhance-festival-animations/DEVELOPER-GUIDE.md` - **Comprehensive animation guide**
- `specs/002-enhance-festival-animations/spec.md` - Animation features specification
- `specs/002-enhance-festival-animations/ACCESSIBILITY-SUMMARY.md` - Accessibility implementation
- `specs/002-enhance-festival-animations/PERFORMANCE-TEST-RESULTS.md` - Performance benchmarks
- `.github/copilot-instructions.md` - Coding conventions and architecture patterns

---

## Getting Help

1. Check browser console for errors
2. Review implementation plan: `specs/001-festival-greeting-mvp/plan.md`
3. Check data model: `specs/001-festival-greeting-mvp/data-model.md`
4. Review API contracts: `specs/001-festival-greeting-mvp/contracts/api-contracts.md`
5. Ask in project documentation or create GitHub issue

---

**Happy building!** 🎉
