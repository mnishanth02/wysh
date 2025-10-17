# Mobile Animation Performance Testing Guide

This guide covers manual testing procedures for tasks T123-T127 of Phase 5 (User Story 3).

## Prerequisites

- Physical mobile device (Android mid-range: Snapdragon 600-series or equivalent)
- iPhone (any model from iPhone 8 onwards)
- Chrome DevTools
- USB cable for device debugging
- Development server running locally or deployed to preview environment

## T123: Test Touch Interactions on Actual Mobile Device

### Setup
1. Enable USB debugging on Android device:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"

2. For iOS (iPhone):
   - Settings → Safari → Advanced → Enable "Web Inspector"
   - Connect to Mac with USB cable
   - Safari → Develop → [Your iPhone] → [Page URL]

### Test Checklist

#### Festival Selection Page (`/create/festival`)
- [ ] All festival cards respond to touch within 100ms
- [ ] Active state (scale-95) triggers on touch
- [ ] No accidental multi-select when scrolling
- [ ] Cards have visible pressed state
- [ ] Hover state doesn't interfere with touch (test on iPad if available)
- [ ] Minimum touch target is 44x44px (use browser inspector)

#### Relationship Selection Page (`/create/relationship`)
- [ ] All relationship cards respond instantly to touch
- [ ] 2-column grid on mobile prevents accidental taps
- [ ] Active state provides tactile feedback
- [ ] Category icons are clear and not too small
- [ ] Back button is easily accessible (44px minimum)

#### Personalization Form (`/create/personalize`)
- [ ] Input fields focus properly when tapped
- [ ] Virtual keyboard doesn't obscure active input
- [ ] Form scrolls to keep focused input visible
- [ ] Character counters update in real-time
- [ ] Continue button is accessible above keyboard
- [ ] No zoom-in when focusing inputs (font-size ≥16px)

#### Template Selection (`/create/template`)
- [ ] Template cards respond to touch
- [ ] Preview images are clear and properly sized
- [ ] "Select Template" button is easily tappable
- [ ] Context indicator is readable on mobile

#### Greeting View (`/g/[id]`)
- [ ] Replay button is positioned correctly (bottom-right)
- [ ] Replay button doesn't interfere with content
- [ ] "Create Your Own" CTA is accessible (bottom-center)
- [ ] Both buttons have proper touch targets (48px+)
- [ ] WhatsApp share button works correctly

### Touch Interaction Quality Criteria

✅ **Pass Criteria:**
- All interactive elements respond within 100ms
- No ghost clicks or double-tap issues
- Active states are visually clear
- Touch targets meet 44x44px minimum
- No horizontal scroll on any page (320px viewport)
- Virtual keyboard handling is smooth

❌ **Fail Scenarios:**
- Elements don't respond to touch
- Accidental taps due to small targets
- Horizontal scroll appears
- Keyboard obscures form inputs
- Active states not visible
- Delayed response (>200ms)

---

## T124: Test Diwali Template on Mid-Range Android

### Target Devices
- **Ideal**: Snapdragon 665, 675, 720G, 730G
- **Equivalent**: MediaTek Helio G90T, G95
- **Alternative**: Any 3-4 year old Android device

### Test Procedure

1. **Open Greeting View** on device:
   ```
   https://your-app.vercel.app/g/[test-greeting-id]
   ```

2. **Visual Quality Check:**
   - [ ] All diyas render correctly
   - [ ] Flames flicker smoothly
   - [ ] Sparkles appear at correct positions
   - [ ] Text is crisp and readable
   - [ ] Colors match design (no washed out gradients)
   - [ ] No visual glitches or tearing

3. **Animation Smoothness:**
   - [ ] Diya lighting sequence is smooth
   - [ ] No visible frame drops during fade-ins
   - [ ] Flame flicker animation is consistent
   - [ ] Sparkle animations are fluid
   - [ ] Text fade-in is smooth
   - [ ] No stuttering or jank

4. **Performance Indicators:**
   - [ ] Animation completes in 6-8 seconds
   - [ ] Device doesn't heat up significantly
   - [ ] Battery drain is acceptable (<5% for viewing)
   - [ ] No browser warnings or crashes
   - [ ] Replay works without degradation

5. **Stress Test:**
   - [ ] Replay animation 5 times consecutively
   - [ ] Switch to other apps and return
   - [ ] Test with low battery mode enabled
   - [ ] Test with multiple tabs open

### Performance Benchmarks

| Metric | Target | Acceptable | Fail |
|--------|--------|------------|------|
| FPS Average | 60 | 45-60 | <45 |
| Jank % | <5% | 5-10% | >10% |
| Animation Time | 6-8s | 5-9s | >10s |
| Initial Load | <3s | 3-5s | >5s |
| Memory Usage | <100MB | 100-150MB | >150MB |

---

## T125: Profile Animation FPS in Chrome DevTools

### Setup Remote Debugging

#### Android:
1. Connect device via USB
2. Chrome → `chrome://inspect` → Enable port forwarding
3. Open your app on mobile device
4. Click "Inspect" in Chrome DevTools

#### Desktop Testing:
1. Open Chrome DevTools (F12)
2. Enable Device Toolbar (Ctrl+Shift+M)
3. Select device (iPhone SE, Pixel 5, etc.)
4. Throttle CPU: 4x slowdown for mid-range simulation

### Performance Profiling Steps

1. **Open Performance Tab** in DevTools

2. **Start Recording:**
   - Click Record button (●)
   - Navigate to `/g/[test-greeting-id]`
   - Let animation complete fully
   - Stop recording

3. **Analyze FPS:**
   - Look for FPS chart at top of timeline
   - Green bars = 60fps
   - Yellow bars = 30-60fps
   - Red bars = <30fps (jank!)

4. **Check Frame Timing:**
   - Hover over frames to see individual frame times
   - Target: <16.67ms per frame (60fps)
   - Warning: >33.33ms per frame (30fps)

5. **Identify Performance Issues:**
   - Look for "Long Tasks" (>50ms)
   - Check for "Forced Reflow" warnings
   - Identify expensive JavaScript execution
   - Look for "Composite" operations

### DevTools Console Metrics

Our performance monitoring automatically logs metrics in development:

```javascript
// Open Console tab to see:
🎭 Animation Performance: DiwaliTemplate
⏱️  Total Time: 6542ms
📊 Average FPS: 58
⚡ Frame Times: min=14.2ms, max=19.8ms, avg=16.1ms
⚠️  Jank: 12 frames (3.2%)
✅ Smooth: Yes
```

### Screenshots to Capture

1. FPS chart showing full animation
2. Bottom-Up call tree showing expensive functions
3. Main thread timeline with long tasks highlighted
4. Memory usage over time

---

## T126: Optimize Animations if Jank Detected

### Jank Detection Criteria

**Jank is detected when:**
- Average FPS < 55
- Jank percentage > 5%
- Individual frames > 20ms
- Visible stuttering to human eye

### Optimization Checklist

If jank is detected, apply these optimizations in order:

#### Level 1: Quick Wins
- [ ] Reduce sparkle count from 12 to 6
- [ ] Disable shadows on mobile (already implemented)
- [ ] Reduce blur effects
- [ ] Simplify gradient backgrounds

#### Level 2: Animation Tweaks
- [ ] Reduce diya count from 5 to 3
- [ ] Increase stagger delay to reduce concurrent tweens
- [ ] Use `will-change: transform` on animated elements
- [ ] Replace `filter` animations with `opacity`

#### Level 3: Aggressive Optimization
- [ ] Disable flame flicker on low-end devices
- [ ] Use static diya images instead of CSS shapes
- [ ] Reduce animation duration (8s → 5s)
- [ ] Remove sparkle animations entirely

#### Level 4: Progressive Enhancement (T127)
- [ ] Detect device performance tier
- [ ] Apply tier-specific settings:
  - High: Full animation (current)
  - Medium: Reduced particles, no shadows
  - Low: Minimal animation, fast duration

### Code Changes Example

```typescript
// In DiwaliTemplate.tsx
const devicePerf = detectDevicePerformance();
const sparkleCount = devicePerf === 'high' ? 12 : devicePerf === 'medium' ? 6 : 0;

// Adjust diya count
const diyaCount = devicePerf === 'low' ? 3 : 5;
```

---

## T127: Progressive Enhancement Implementation

### Device Performance Tiers

Our `lib/performance.ts` automatically detects device tiers:

```typescript
import { detectDevicePerformance, getAnimationSettings } from '@/lib/performance';

const tier = detectDevicePerformance(); // 'high' | 'medium' | 'low'
const settings = getAnimationSettings(tier);
```

### Tier Definitions

#### High Performance
- **Devices**: iPhone 12+, Snapdragon 855+, 8GB+ RAM
- **Settings**:
  - 60 FPS target
  - All visual effects enabled
  - Full particle count (50)
  - Shadow and blur effects
  - Complex animations

#### Medium Performance
- **Devices**: iPhone 8-11, Snapdragon 665-845, 4-8GB RAM
- **Settings**:
  - 45 FPS target
  - Reduced particles (25)
  - No shadows or blur
  - Simplified animations
  - Faster duration

#### Low Performance
- **Devices**: iPhone 6-7, Snapdragon <665, <4GB RAM, or Slow 3G
- **Settings**:
  - 30 FPS target (acceptable degradation)
  - No particles
  - No decorative effects
  - Essential animations only
  - Fast duration (0.5x)

### Testing Progressive Enhancement

1. **Test on High-End Device (iPhone 14, Pixel 7):**
   - [ ] Full animation quality
   - [ ] All effects visible
   - [ ] 60 FPS maintained

2. **Test on Mid-Range Device (iPhone SE, Pixel 5a):**
   - [ ] Reduced particle count
   - [ ] Shadows disabled
   - [ ] 45+ FPS maintained

3. **Test on Low-End Device (iPhone 6s, old Android):**
   - [ ] Minimal particles
   - [ ] Fast animations
   - [ ] 30+ FPS (graceful degradation)

4. **Test Reduced Motion:**
   - System Settings → Accessibility → Reduce Motion → ON
   - [ ] Animations are simplified or static
   - [ ] Content still readable
   - [ ] User preference respected

### Force Performance Tier (Testing)

```javascript
// In browser console:
localStorage.setItem('wysh_force_performance', 'low');
location.reload();
```

Options: `'high'`, `'medium'`, `'low'`

---

## Automated Performance Testing

### Save Test Results

Our performance monitoring saves results to localStorage:

```javascript
import { getPerformanceTests } from '@/lib/performance';

// View all test results
const tests = getPerformanceTests();
console.table(tests);
```

### Export Results

```javascript
// Copy to clipboard for reporting
const tests = getPerformanceTests();
copy(JSON.stringify(tests, null, 2));
```

### Share Results

When reporting performance issues, include:
1. Device model and OS version
2. Browser and version
3. Network conditions
4. FPS metrics from console
5. Screenshots of Performance tab
6. Steps to reproduce

---

## Success Criteria Summary

### T123: Touch Interactions ✅
- All touch targets ≥44x44px
- Response time <100ms
- No accidental taps
- Proper active states
- Virtual keyboard handled correctly

### T124: Android Performance ✅
- Diwali template runs smoothly on Snapdragon 665+
- Average FPS ≥45
- Jank percentage <10%
- No visible stuttering
- Replay works consistently

### T125: FPS Profiling ✅
- Performance metrics logged in DevTools
- FPS chart captured and analyzed
- Expensive operations identified
- Frame timing documented

### T126: Animation Optimization ✅
- Jank reduced to <5% if detected
- Optimizations applied without visual degradation
- Performance improvements measured
- Device-specific fixes implemented

### T127: Progressive Enhancement ✅
- Three performance tiers implemented
- Automatic device detection working
- Reduced motion preference respected
- 30fps acceptable on low-end devices
- No functionality lost at any tier

---

## Reporting Template

### Performance Test Report

**Date:** YYYY-MM-DD
**Tester:** [Your Name]
**Device:** [Model, OS, Browser]
**Task:** T123-T127

#### Test Results

| Test | Status | Notes |
|------|--------|-------|
| T123 Touch Interactions | ✅/❌ | |
| T124 Android Performance | ✅/❌ | |
| T125 FPS Profiling | ✅/❌ | |
| T126 Optimization | ✅/❌ | |
| T127 Progressive Enhancement | ✅/❌ | |

#### Metrics

- Average FPS: ___
- Jank Percentage: ___%
- Initial Load Time: ___ms
- Animation Duration: ___s
- Memory Usage: ___MB

#### Issues Found

1. [Description]
   - Severity: High/Medium/Low
   - Steps to reproduce
   - Expected vs Actual behavior

#### Recommendations

- [Optimization suggestions]
- [Device-specific fixes needed]
- [Code changes required]

---

## Additional Resources

- **Chrome DevTools Performance**: https://developer.chrome.com/docs/devtools/performance/
- **Web Vitals**: https://web.dev/vitals/
- **GSAP Performance**: https://gsap.com/docs/v3/GSAP/gsap.ticker/
- **Mobile Testing**: https://developer.chrome.com/docs/devtools/remote-debugging/
