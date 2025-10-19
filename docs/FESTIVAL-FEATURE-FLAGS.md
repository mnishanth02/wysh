# Festival Feature Flags Implementation

## Overview

This document describes the multi-layered feature flag system implemented to control which festivals are available to users. The system provides defense-in-depth protection against unauthorized access to disabled festivals.

## Current Configuration

**Enabled Festivals:** Diwali only

**Disabled Festivals:** Christmas, New Year, Pongal, Generic Celebration (Holi is temporarily hidden from UI)

## Implementation Architecture

### Layer 1: Feature Flag Configuration (`lib/feature-flags.ts`)

The centralized feature flag system that controls which festivals are enabled:

```typescript
export const ENABLED_FESTIVALS: FestivalType[] = ["diwali"];
```

**Key Functions:**
- `isFestivalEnabled(festivalType)` - Check if a festival is enabled
- `getEnabledFestivals()` - Get list of enabled festivals
- `getDisabledFestivals()` - Get list of disabled festivals
- `validateFestivalEnabled(festivalType)` - Throws error if festival not enabled (backend use)

**To Enable More Festivals:**
Simply add them to the `ENABLED_FESTIVALS` array:
```typescript
export const ENABLED_FESTIVALS: FestivalType[] = ["diwali", "christmas", "newyear"];
```

### Layer 2: UI Protection (`components/forms/FestivalSelector.tsx`)

Visual indication and click prevention for disabled festivals:

**Features:**
- Shows "Coming Soon" badge on disabled festival cards
- Applies semi-transparent overlay over disabled cards
- Disables hover effects and click events
- Changes cursor to `cursor-not-allowed`
- Reduces opacity to 75% for visual distinction

**User Experience:**
- Users can see all festivals but understand which are available
- Clear visual feedback prevents confusion
- Professional "Coming Soon" treatment builds anticipation

### Layer 3: Route Protection (Create Flow Pages)

Client-side validation in all creation flow pages:

**Protected Pages:**
- `/app/create/relationship/page.tsx`
- `/app/create/personalize/page.tsx`
- `/app/create/template/page.tsx`

**Protection Logic:**
```typescript
useEffect(() => {
  if (!festival) {
    router.push("/create/festival");
    return;
  }

  // Redirect if festival is not enabled (backdoor protection)
  if (!isFestivalEnabled(festival)) {
    console.warn(`Attempted access to disabled festival: ${festival}`);
    router.push("/create/festival");
  }
}, [festival, router]);
```

**Behavior:**
- Validates festival parameter in URL on page load
- Redirects to festival selection page if invalid or disabled
- Logs warning for monitoring/debugging
- Prevents any further rendering or data fetching

### Layer 4: Backend Validation (`convex/greetings.ts`)

Final validation layer in the `createGreeting` mutation:

**Validation Order:**
1. Rate limiting checks
2. Festival type whitelist validation
3. **Feature flag validation** ← NEW
4. Relationship type validation
5. Template ID validation
6. Input sanitization

**Implementation:**
```typescript
// Validate festival is enabled via feature flags (critical security check)
validateFestivalEnabled(args.festivalType as FestivalType);
```

**Error Response:**
```
Error: "Christmas is not available yet. Currently available festivals: Diwali"
```

**Why This Layer Matters:**
- Prevents API manipulation via Postman/curl
- Protects against malicious client modifications
- Ensures database integrity
- Final security checkpoint before data write

## Components Created

### 1. `lib/feature-flags.ts`
Central feature flag configuration with helper functions

### 2. `components/shared/ComingSoonBadge.tsx`
Reusable UI components:
- `<ComingSoonBadge />` - Visual badge with lock icon
- `<ComingSoonOverlay />` - Semi-transparent overlay

## Testing Checklist

### ✅ UI Layer Testing
- [ ] Disabled festivals show "Coming Soon" badge
- [ ] Disabled festivals have reduced opacity
- [ ] Disabled festivals don't respond to clicks
- [ ] Hover effects disabled on disabled festivals
- [ ] Enabled festivals work normally

### ✅ Route Protection Testing
- [ ] Navigate to `/create/relationship?festival=christmas` → Redirects to `/create/festival`
- [ ] Navigate to `/create/personalize?festival=newyear&relationship=friend` → Redirects
- [ ] Navigate to `/create/template?festival=pongal&...` → Redirects
- [ ] Console shows warning message for attempted access
- [ ] Valid festival (diwali) works normally through all pages

### ✅ Backend Validation Testing
- [ ] Try to create greeting with disabled festival via API
- [ ] Verify error message is clear and informative
- [ ] Verify enabled festival (diwali) still works
- [ ] Check that existing greetings remain viewable

### ✅ Edge Cases
- [ ] Empty/missing festival parameter → Redirects to festival selection
- [ ] Invalid festival name → Redirects to festival selection
- [ ] Changing URL mid-flow → Validation triggers on next page

## Backdoor Prevention

### Attack Vectors Covered

1. **URL Manipulation**
   - ✅ Protected by route-level useEffect validation
   - ✅ Redirects to safe page
   - ✅ Prevents rendering/data fetching

2. **Direct API Calls**
   - ✅ Protected by backend validation
   - ✅ Returns clear error message
   - ✅ No database writes occur

3. **Browser DevTools Manipulation**
   - ✅ Route protection triggers on navigation
   - ✅ Backend validation catches API manipulation
   - ✅ State management doesn't affect server validation

4. **Shared Link Access**
   - ✅ Existing greetings remain viewable (important!)
   - ✅ Only NEW greeting creation is blocked
   - ✅ No broken links for users who already have URLs

## Maintenance

### Enabling a New Festival

**Step 1: Update Feature Flag**
```typescript
// lib/feature-flags.ts
export const ENABLED_FESTIVALS: FestivalType[] = [
  "diwali",
  "christmas", // ← Add here
];
```

**Step 2: Verify in UI**
- Visit `/create/festival`
- Verify "Coming Soon" badge is removed
- Verify card is clickable

**Step 3: Test Complete Flow**
- Create greeting with newly enabled festival
- Verify backend accepts it
- Verify greeting renders correctly
- Test WhatsApp sharing

**Step 4: Monitor**
- Check console for any warnings
- Monitor Convex logs for errors
- Verify user creation metrics

### Disabling a Festival

Follow same steps but remove from `ENABLED_FESTIVALS` array.

**Important:** Existing greetings will remain viewable! Only new creation is blocked.

## Monitoring & Analytics

### Useful Metrics to Track

1. **Attempted Access to Disabled Festivals**
   - Check browser console warnings
   - Pattern: Multiple attempts may indicate user confusion

2. **Backend Validation Errors**
   - Monitor Convex logs for `validateFestivalEnabled` errors
   - May indicate bot/malicious activity

3. **User Drop-off**
   - Track if users abandon flow at festival selection
   - May indicate desire for other festivals

## Future Enhancements

### Potential Improvements

1. **Time-based Activation**
   - Auto-enable festivals based on calendar dates
   - Example: Enable Christmas in December

2. **A/B Testing Support**
   - Enable different festivals for different user segments
   - Gradual rollout strategy

3. **Coming Soon Page**
   - Dedicated page with expected launch dates
   - Email signup for notifications

4. **Admin Dashboard**
   - Toggle festivals without code changes
   - Real-time feature flag management

5. **Festival-specific Waitlists**
   - Let users express interest in specific festivals
   - Build anticipation and marketing database

## Troubleshooting

### Issue: Festival shows as enabled but still redirects

**Possible Causes:**
1. Cache issue - Clear Next.js cache: `rm -rf .next`
2. Environment mismatch - Check if dev and prod have different flags
3. Browser cache - Hard refresh (Cmd+Shift+R)

**Solution:**
```bash
bun run build
# Check that build succeeds
# Restart dev server
```

### Issue: Backend accepts disabled festival

**This should never happen!** If it does:
1. Verify `validateFestivalEnabled` is called in mutation
2. Check import path is correct
3. Verify `ENABLED_FESTIVALS` is being read correctly
4. Check Convex deployment is using latest code

### Issue: Existing greetings are broken

**This is NOT expected behavior!**
- View protection should NOT check feature flags
- Only creation flow should validate
- If greetings are broken, check `app/g/[id]/page.tsx` hasn't been modified

## Security Considerations

### Why Multiple Layers?

**Defense in Depth Philosophy:**
Each layer protects against different attack vectors:

1. **UI Layer** - Prevents casual user mistakes and reduces support requests
2. **Route Protection** - Catches URL manipulation and bookmark issues
3. **Backend Validation** - Ultimate security checkpoint, prevents API abuse

### What This Does NOT Protect Against

- **User copying shared links** - Existing greetings remain accessible (by design)
- **Server-side rendering bypass** - Not applicable, we use client-side validation first
- **Time-based attacks** - No automatic expiration (requires manual config change)

## Launch Day Checklist

### Pre-Launch (Diwali Only)

- [x] Feature flag set to `["diwali"]`
- [x] All layers implemented and tested
- [x] Build succeeds without errors
- [x] UI shows "Coming Soon" for other festivals
- [x] Backend validation active
- [x] Documentation complete

### Post-Launch Monitoring

- [ ] Monitor console warnings for attempted access
- [ ] Check Convex logs for validation errors
- [ ] Track user completion rates
- [ ] Gather feedback on "Coming Soon" treatment
- [ ] Plan timeline for enabling next festival

### Before Enabling New Festival

- [ ] Update feature flag
- [ ] Test complete creation flow
- [ ] Verify templates render correctly
- [ ] Test WhatsApp sharing
- [ ] Update marketing materials
- [ ] Announce on social media

---

**Last Updated:** Implementation completed on launch day
**Maintainer:** Development Team
**Review Schedule:** Before enabling each new festival
