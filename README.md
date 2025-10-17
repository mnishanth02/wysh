# Wysh - Festival Greeting Platform

Create and share personalized, animated festival greetings via WhatsApp. Built with Next.js 15, Convex backend, and relationship-aware context engine.

**Branch**: `001-festival-greeting-mvp` | **Status**: Phase 9 - Polish & Production Ready

## Features

- 🎨 **Animated Festival Templates** - Diwali, Holi, Christmas, New Year, Pongal, and generic celebrations
- 💝 **Relationship-Aware Context** - Adapts tone, colors, and animations based on recipient relationship
- 🔗 **One-Click WhatsApp Sharing** - Pre-filled messages with rich link previews
- 📱 **Mobile-First Design** - 60fps animations on mid-range Android devices
- 🌐 **No Auth Required** - Public greetings via shareable URLs
- 🖼️ **Dynamic OG Images** - Beautiful preview cards for WhatsApp/social sharing

## Tech Stack

- **Frontend**: Next.js 15.5 (App Router, Turbopack), React 19, TypeScript
- **Backend**: Convex (real-time database, serverless functions)
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Animation**: GSAP (timeline animations), Framer Motion (scroll/gestures)
- **Forms**: React Hook Form + Zod validation
- **Linting**: Biome (replaces ESLint + Prettier)

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Bun** package manager (or npm/yarn)
- **Convex account** (free tier available at [convex.dev](https://convex.dev))
- **Git** for version control

## Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wisher
git checkout 001-festival-greeting-mvp
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Convex deployment URL:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

**Get your Convex URL**:
1. Visit [Convex Dashboard](https://dashboard.convex.dev)
2. Create a new project or select existing one
3. Copy the deployment URL from project settings
4. Paste into `.env.local`

### 4. Start Convex Backend

```bash
bun convex dev
```

This will:
- Initialize Convex backend (creates dev deployment if needed)
- Watch for schema changes in `convex/` directory
- Display deployment URL (copy this to `.env.local` if not done yet)

### 5. Start Development Server

In a **new terminal**:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) to see the app.

## Development Commands

```bash
bun run dev          # Start Next.js dev server (Turbopack)
bun run build        # Production build with type checking
bun run start        # Start production server
bun run lint         # Run Biome linter
bun run format       # Format code with Biome

bun convex dev       # Start Convex backend in dev mode
bun convex deploy    # Deploy Convex functions to production
```

## Project Structure

```
app/
├── page.tsx                    # Landing page with sample greetings
├── create/                     # Multi-step greeting creation flow
│   ├── festival/page.tsx       # Step 1: Festival selection
│   ├── relationship/page.tsx   # Step 2: Relationship context
│   ├── personalize/page.tsx    # Step 3: Names + message input
│   ├── template/page.tsx       # Step 4: Template preview/selection
│   └── success/page.tsx        # Step 5: Share link + WhatsApp CTA
├── g/[id]/page.tsx             # Greeting viewer (auto-plays animation)
├── error.tsx                   # Global error boundary
└── not-found.tsx               # Custom 404 page

components/
├── greetings/                  # Festival-specific animated templates
│   ├── DiwaliTemplate.tsx      # Diwali animations (diya, rangoli)
│   ├── HoliTemplate.tsx        # Holi color burst effects
│   └── GreetingRenderer.tsx    # Routes to correct template
├── forms/                      # Form components with validation
│   ├── FestivalSelector.tsx    # Visual festival picker
│   ├── RelationshipSelector.tsx # Relationship context picker
│   └── PersonalizationForm.tsx # Name/message input form
└── shared/                     # Reusable components
    ├── ShareButton.tsx         # WhatsApp + Copy Link sharing
    ├── ReplayButton.tsx        # Animation replay control
    ├── ErrorState.tsx          # Error display component
    └── LoadingState.tsx        # Loading spinner component

convex/
├── schema.ts                   # Database schema (greetings, festivals)
├── greetings.ts                # Greeting mutations/queries
├── festivals.ts                # Festival data queries
└── seed.ts                     # Database seeding script

lib/
├── context-engine.ts           # Relationship → visual context mapping
├── constants.ts                # Festival configs, color palettes, emojis
├── animations.ts               # GSAP animation utilities
├── sanitize.ts                 # Input sanitization (XSS prevention)
├── whatsapp.ts                 # WhatsApp deep linking + message formatting
├── id-generator.ts             # Shareable ID generation (nanoid)
└── utils.ts                    # Shared utilities (cn, etc.)

types/
└── index.ts                    # TypeScript type definitions
```

## Key Concepts

### Relationship Context Engine

The `context-engine.ts` maps recipient relationships to visual adjustments:

- **Family** (parents, siblings): Warm colors, respectful pacing
- **Friends**: Vibrant colors, playful animations
- **Professional** (boss, colleague): Muted colors, formal tone
- **Romantic** (partner, spouse): Romantic colors, elegant animations

**Usage**:
```typescript
import { getRelationshipContext, adjustColorPalette } from '@/lib/context-engine';

const context = getRelationshipContext('parents');
// { colorIntensity: 1.2, animationSpeed: 1.0, messageTone: 'warm' }

const colors = adjustColorPalette('diwali', 'parents');
// Returns adjusted hex colors based on relationship
```

### Festival Configuration

All festival data centralized in `lib/constants.ts`:

```typescript
export const FESTIVALS = {
  diwali: {
    name: "Diwali",
    colorPalette: ["#FF6B35", "#F7931E", "#FDC830", "#F37335", "#DD4B39"],
    symbols: ["diya", "rangoli", "fireworks"],
    animationStyle: "sequential",
  },
  // ... more festivals
};
```

### Creating New Festival Templates

1. Add festival to `FESTIVALS` in `lib/constants.ts`
2. Update `FestivalType` in `types/index.ts`
3. Create `components/greetings/[Festival]Template.tsx`:
   ```typescript
   export function MyFestivalTemplate({
     recipientName,
     senderName,
     message,
     relationshipContext,
     onAnimationComplete
   }: GreetingTemplateProps) {
     // Use GSAP for animations
     // Call onAnimationComplete() when done
   }
   ```
4. Register in `GreetingRenderer.tsx`
5. Seed database: Update `convex/seed.ts`

## Security Features (Phase 9)

- ✅ **Input Sanitization**: DOMPurify on client-side (`lib/sanitize.ts`)
- ✅ **Server-Side Validation**: HTML tag detection in Convex mutations
- ✅ **Whitelist Validation**: Festival types, relationships, template IDs
- ✅ **Length Limits**: Names (50 chars), messages (150 chars)
- ✅ **Error Boundaries**: Global React error boundary (`app/error.tsx`)
- ✅ **Graceful Error Handling**: User-friendly error messages in mutations

## Production Deployment

### Environment Variables (Vercel)

Add these in Vercel dashboard (Settings → Environment Variables):

```env
# Production
NEXT_PUBLIC_CONVEX_URL=https://your-production.convex.cloud
NEXT_PUBLIC_BASE_URL=https://wysh.app
CONVEX_DEPLOY_KEY=your-deploy-key-here  # From Convex dashboard
```

### Deployment Steps

1. **Deploy Convex Functions**:
   ```bash
   bun convex deploy --prod
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel deploy --prod
   ```

3. **Verify**:
   - Test greeting creation flow
   - Verify WhatsApp sharing with OG preview
   - Check animations on mobile device (real device, not emulator)

## Performance Targets

- ✅ **Page Weight**: <2MB per page
- ✅ **First Load JS**: ~203kB (gzipped)
- ✅ **Animation**: 60fps on mid-range Android
- ✅ **Load Time**: <3s on 3G networks
- ✅ **OG Images**: Generated on-demand (Edge runtime)

## Documentation

- **Spec**: [`specs/001-festival-greeting-mvp/spec.md`](./specs/001-festival-greeting-mvp/spec.md) - User stories, acceptance criteria
- **Implementation Plan**: [`specs/001-festival-greeting-mvp/plan.md`](./specs/001-festival-greeting-mvp/plan.md) - Phase-by-phase roadmap
- **Data Model**: [`specs/001-festival-greeting-mvp/data-model.md`](./specs/001-festival-greeting-mvp/data-model.md) - Database schema
- **Developer Guide**: [`specs/001-festival-greeting-mvp/quickstart.md`](./specs/001-festival-greeting-mvp/quickstart.md) - Detailed setup
- **Coding Instructions**: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) - Project conventions

## Contributing

This is a solo developer project for MVP phase. Contributions will be accepted post-MVP.

**Code Style**:
- Use Biome for linting/formatting (NOT ESLint/Prettier)
- Follow mobile-first design patterns
- All new templates MUST use context engine
- Minimum 44×44px touch targets
- Test on real mobile devices before PR

## Troubleshooting

### Convex Connection Issues

```bash
# Clear Convex cache
rm -rf .convex/
bun convex dev
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next/
bun run build
```

### Type Errors

```bash
# Regenerate Convex types
bun convex dev  # Let it sync, then restart dev server
```

## License

Proprietary - All Rights Reserved (MVP Phase)

## Support

For issues or questions:
1. Check [Implementation Plan](./specs/001-festival-greeting-mvp/plan.md) for current status
2. Review [Developer Quickstart](./specs/001-festival-greeting-mvp/quickstart.md)
3. Contact: [Your contact info here]

---

**Built with ❤️ using Next.js, Convex, and GSAP**
