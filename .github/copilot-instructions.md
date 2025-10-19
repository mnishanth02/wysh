# Wysh AI Coding Instructions

## Project Overview
Wysh is a mobile-first web application for creating and sharing personalized, animated festival greetings via WhatsApp. Built with Next.js 15+ App Router, Convex backend, and relationship-aware context engine that adapts visuals/tone based on recipient relationships (family, friends, professional, romantic).

**Branch**: `001-festival-greeting-mvp` | **Target**: 60fps animations on mid-range Android, <3s load on 3G

## Core Architecture

### Database & Backend (Convex)
- **Schema**: Two tables defined in `convex/schema.ts`:
  - `greetings`: Festival greetings with 8-char `shareableId` (nanoid), view counts, personalization data
  - `festivals`: Reference data with color palettes, symbols, animation styles
- **Mutations/Queries**: `convex/greetings.ts` and `convex/festivals.ts`
  - `createGreeting`: Generates unique `shareableId` with retry logic (max 5 attempts)
  - `getGreetingByShareableId`: Primary read path for viewing greetings
  - `incrementViewCount`: Atomic counter increment
- **No authentication**: All greetings public via shareable URLs (`/g/[id]`)

### Context Engine (`lib/context-engine.ts`)
**Critical**: Maps relationship type → visual adjustments. All new templates MUST use:
```typescript
getRelationshipContext(relationshipType) // Returns colorIntensity, animationSpeed, messageTone
adjustColorPalette(festivalType, relationshipType) // Returns modified hex colors
adjustAnimationDuration(baseMs, relationshipType) // Returns scaled duration
```
**Example**: "boss" → muted colors, formal tone, faster animations; "parents" → warm colors, respectful pacing

### Festival Data (`lib/constants.ts`)
Centralized festival configs with:
- `colorPalette`: 3-6 hex colors (ordered by prominence)
- `symbols`: Visual elements (e.g., `["diya", "rangoli"]`)
- `animationStyle`: "sequential" | "burst" | "cascade" | "generic"

**Adding festivals**: Update `FESTIVALS` object, add to `FestivalType` in `types/index.ts`

## Project Structure Patterns

### Routing (Next.js App Router)
```
app/
├── page.tsx                    # Landing page with sample greetings
├── create/                     # Creation flow (multi-step)
│   ├── festival/page.tsx       # Step 1: Festival selection
│   ├── relationship/page.tsx   # Step 2: Relationship context
│   ├── personalize/page.tsx    # Step 3: Names + message input
│   ├── template/page.tsx       # Step 4: Template preview/selection
│   └── success/page.tsx        # Step 5: Share link + WhatsApp CTA
└── g/[id]/page.tsx             # Greeting viewer (auto-plays animation)
```

### Component Organization
```
components/
├── greetings/                  # Festival-specific templates
│   ├── DiwaliTemplate.tsx      # GSAP timeline animations
│   ├── HoliTemplate.tsx        # Burst/color splash effects
│   └── GreetingRenderer.tsx    # Routes to correct template
├── forms/                      # Form components with React Hook Form + zod
│   ├── FestivalSelector.tsx    # Visual grid with festival cards
│   ├── RelationshipSelector.tsx # Categorized relationship picker
│   └── PersonalizationForm.tsx # Name/message inputs
├── shared/                     # Reusable UI components
│   ├── ReplayButton.tsx        # Appears after animation completes
│   └── ShareButton.tsx         # WhatsApp pre-filled message
└── ui/                         # shadcn/ui components (DO NOT modify directly)
```

## Development Workflows

### Daily Commands
```bash
bun run dev           # Start dev server on :3001 with Turbopack
bun run build         # Production build (validates types + lints)
bun run lint          # Biome check (NO ESLint/Prettier)
bun run format        # Biome format --write
```

### Adding New Festival Template
1. Add festival to `lib/constants.ts` `FESTIVALS` object
2. Update `FestivalType` in `types/index.ts`
3. Create `components/greetings/[Festival]Template.tsx` implementing:
   - Props: `recipientName`, `senderName`, `message`, `relationshipContext`, `onAnimationComplete`
   - Use `createContextualTimeline(relationshipType)` for GSAP animations
   - Call `onAnimationComplete()` when animation finishes
4. Register in `GreetingRenderer.tsx` switch statement
5. Seed festival data: Update `convex/seed.ts`, run seeding function

### Mobile-First Performance Rules
**Enforced**: Page weight <2MB, 60fps animations on mid-range Android
- Use `next/image` with WebP/AVIF formats (configured in `next.config.ts`)
- Test animations with real device (NOT DevTools emulation)
- GSAP timelines: Enable `force3D: true` for hardware acceleration
- Avoid layout shifts: Reserve space for dynamic content
- Compress images to max 128KB per asset

### Creating Convex Functions
**Pattern** (see `convex/greetings.ts`):
```typescript
export const myFunction = mutation({ // or query
  args: {
    fieldName: v.string(), // Use convex/values validators
  },
  handler: async (ctx, args) => {
    // Database access via ctx.db
    const result = await ctx.db.query("tableName").collect();
    return result;
  },
});
```

**Import in client**:
```typescript
import { api } from "@/convex/_generated/api";
const result = useMutation(api.greetings.myFunction); // or useQuery
```

## Code Conventions

### Styling (Tailwind CSS v4 + shadcn/ui)
- **Mobile-first**: `text-sm sm:text-base md:text-lg` (320px → 768px)
- **Touch targets**: Minimum 44×44px for buttons (`touch-target-lg` utility)
- **Colors**: Use festival palette from context engine (NOT hardcoded hex)
- **Animations**: Prefer GSAP for timeline sequences, Framer Motion for scroll/gestures

### TypeScript Patterns
- **Strict mode**: All files must pass `tsc --noEmit`
- **Import aliases**: Use `@/` for root imports (configured in `tsconfig.json`)
- **Type imports**: `import type { X } from "..."` for type-only imports
- **Convex types**: Import from `convex/_generated/dataModel` (e.g., `Id<"greetings">`)

### Form Validation (React Hook Form + zod)
**Pattern** (see `components/forms/PersonalizationForm.tsx`):
```typescript
const schema = z.object({
  recipientName: z.string().min(1).max(50),
  senderName: z.string().min(1).max(50),
  customMessage: z.string().max(150).optional(),
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});
```

### Linting (Biome, NOT ESLint)
- **Config**: `biome.json` (includes Next.js and React rules)
- **Auto-fix**: `biome format --write` and organize imports
- **NO Prettier/ESLint**: Project uses Biome exclusively

## Critical Implementation Details

### Shareable ID Generation (`lib/id-generator.ts`)
Uses `nanoid` (8 chars, URL-safe). **Collision handling**: Retry up to 5 times in `createGreeting` mutation.

### Animation Lifecycle
1. `GreetingRenderer` initializes with `animationComplete = false`
2. Template (e.g., `DiwaliTemplate`) plays GSAP timeline
3. Template calls `onAnimationComplete()` when done
4. `ReplayButton` appears, resetting via `replayKey` increment

### WhatsApp Sharing (`lib/whatsapp.ts`)
Pre-filled message format:
```
Check out this festival greeting I made for you! 🎉
https://wysh.zealer.in/g/[shareableId]
```
Opens WhatsApp with `whatsapp://send?text=...` (mobile) or `https://wa.me/?text=...` (desktop)

### View Count Tracking
- Incremented via `incrementViewCount` mutation (atomic operation)
- **Privacy**: Only creator can see counts (MVP: not exposed in UI)
- Prevents double-count: Use client-side flag (session storage)

## Testing & Validation

### Pre-Merge Checklist
- [ ] Build succeeds: `bun run build`
- [ ] Biome passes: `bun run lint`
- [ ] Test on real mobile device (320px, 768px viewports)
- [ ] Animation maintains 60fps (use browser DevTools Performance tab)
- [ ] Page weight <2MB (Network tab)
- [ ] WhatsApp share opens correctly with pre-filled message

### Edge Cases to Handle
- Invalid `shareableId` in URL → Show 404 with "Create Your Own" CTA
- Database failure → Auto-retry 3× with exponential backoff (implemented in mutations)
- Network timeout → Show error toast with retry button
- Empty form submission → zod validation prevents (display error messages)

## Documentation References

**Primary docs** (read before making changes):
1. `specs/001-festival-greeting-mvp/plan.md` — Implementation roadmap, constitution checks
2. `specs/001-festival-greeting-mvp/data-model.md` — Schema design, validation rules
3. `specs/001-festival-greeting-mvp/spec.md` — User stories, acceptance criteria
4. `specs/001-festival-greeting-mvp/quickstart.md` — Developer setup, key files guide

**Convex docs**: https://docs.convex.dev (for mutations, queries, schema)
**Next.js 15**: https://nextjs.org/docs (App Router patterns)

## Common Pitfalls

1. **DO NOT modify `components/ui/*` directly** — These are shadcn/ui components (regenerate via CLI)
2. **DO NOT hardcode festival colors** — Always use `adjustColorPalette()` from context engine
3. **DO NOT skip mobile device testing** — Emulators miss performance issues
4. **DO NOT use ESLint/Prettier** — Project uses Biome (config conflicts break CI)
5. **DO NOT store PII** — Only user-provided names/messages (no emails, phones)

## MVP Constraints (Do Not Implement)

- ❌ User authentication (all greetings public by design)
- ❌ User dashboards (no "My Greetings" list)
- ❌ Photo uploads (text-only personalization)
- ❌ Email sharing (WhatsApp only)
- ❌ Analytics dashboard (post-MVP)
- ❌ Greeting deletion (indefinite retention)
